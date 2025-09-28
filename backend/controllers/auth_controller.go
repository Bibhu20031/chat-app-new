package controllers

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/Bibhu20031/chat-app-new/db"
	"github.com/Bibhu20031/chat-app-new/models"
	"github.com/Bibhu20031/chat-app-new/utils"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func SignUp(c *fiber.Ctx) error {
	type Request struct {
		FullName string `json:"fullName"`
		UserName string `json:"UserName"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	var body Request
	if err := c.BodyParser(&body); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Invalid request"})
	}

	if body.FullName == "" || body.Email == "" || body.Password == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "All fields are required"})
	}

	if len(body.Password) < 6 {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Password must be at least 6 characters"})
	}

	var existingUser models.User //only to check if the user exists.. doesnt do anything to the database
	result := db.DB.Where("email = ?", body.Email).First(&existingUser)

	if result.Error == nil {
		// Found a user with either same email or username
		if existingUser.Email == body.Email {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Email already exists"})
		}
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Username already taken"})
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(body.Password), 10)

	user := models.User{
		FullName:   body.FullName,
		UserName:   utils.GenerateUniqueUsername(body.FullName),
		Email:      body.Email,
		Password:   string(hashedPassword),
		ProfilePic: utils.GenerateRandomAvatar(body.Email),
	}

	if err := db.DB.Create(&user).Error; err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Could not create user"})
	}

	utils.GenerateToken(c, user.ID)

	return c.Status(http.StatusCreated).JSON(user)
}

func Login(c *fiber.Ctx) error {
	type Request struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	var body Request
	if err := c.BodyParser(&body); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Invalid request"})
	}

	var user models.User
	if err := db.DB.Where("email = ?", body.Email).First(&user).Error; err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Invalid credentials"})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Invalid credentials"})
	}

	utils.GenerateToken(c, user.ID)

	return c.Status(http.StatusOK).JSON(user)
}

func Logout(c *fiber.Ctx) error {
	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		HTTPOnly: true,
	})

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "Logged out successfully"})
}

func CheckAuth(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(models.User)
	if !ok {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"message": "Not authorized"})
	}
	return c.JSON(user)
}

func UpdateProfile(c *fiber.Ctx) error {
	type Request struct {
		ProfilePic string `json:"profilePic"` // base64 or image URL
	}

	var body Request
	if err := c.BodyParser(&body); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Invalid request"})
	}

	if strings.TrimSpace(body.ProfilePic) == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Profile pic is required"})
	}

	user, ok := c.Locals("user").(models.User)
	if !ok {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"message": "Not authorized"})
	}

	// Initialize Cloudinary
	cld, err := cloudinary.NewFromURL(os.Getenv("CLOUDINARY_URL"))
	if err != nil {
		log.Println("Cloudinary config error:", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Cloudinary config failed"})
	}

	// Upload the image
	uploadResp, err := cld.Upload.Upload(context.Background(), body.ProfilePic, uploader.UploadParams{
		Folder: "chat-app/profiles", // optional: categorize uploads
	})
	if err != nil {
		log.Println("Cloudinary upload error:", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Image upload failed"})
	}

	// Save image URL to DB
	if err := db.DB.Model(&user).Update("profile_pic", uploadResp.SecureURL).Error; err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Update failed"})
	}

	return c.Status(http.StatusOK).JSON(user)
}

func SearchUsers(c *fiber.Ctx) error {
	query := c.Query("query")
	// log.Println("SearchUsers called with query:", query)

	if query == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "query parameter is required",
		})
	}

	var users []models.User
	err := db.DB.Where("user_name ILIKE ? OR full_name ILIKE ?", "%"+query+"%", "%"+query+"%").Find(&users).Error
	if err != nil {
		log.Println("DB error:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// log.Println("Found users:", len(users))
	return c.JSON(users)
}
