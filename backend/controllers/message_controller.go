package controllers

import (
	"context"
	"log"

	"github.com/Bibhu20031/chat-app-new/db"
	"github.com/Bibhu20031/chat-app-new/models"
	"github.com/Bibhu20031/chat-app-new/utils"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gofiber/fiber/v2"
)

func GetUsers(c *fiber.Ctx) error {
	loggedInUserID := c.Locals("userId")
	var users []models.User

	err := db.DB.Raw(
		`SELECT DISTINCT u.*
		FROM users u
		JOIN messages m ON
		(u.id = m.sender_id AND m.receiver_id = ?)
		OR (u.id = m.receiver_id AND m.sender_id = ?)
		WHERE u.id!=?`, loggedInUserID, loggedInUserID, loggedInUserID).Scan(&users).Error

	if err != nil {
		log.Println("Error fetching users:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return c.JSON(users)
}

func GetMessages(c *fiber.Ctx) error {
	senderID := c.Locals("userId")
	receiverID := c.Params("id")

	var messages []models.Message
	err := db.DB.Where(`
		(sender_id = ? AND receiver_id = ?) OR 
		(sender_id = ? AND receiver_id = ?)`,
		senderID, receiverID, receiverID, senderID).
		Order("created_at ASC").
		Find(&messages).Error

	if err != nil {
		log.Println("Error fetching messages:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	return c.JSON(messages)
}

func SendMessage(c *fiber.Ctx) error {
	senderID := c.Locals("userId")
	receiverID := c.Params("id")

	type Request struct {
		Text  string `json:"text"`
		Image string `json:"image"`
	}

	var body Request
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	var imageUrl string
	if body.Image != "" {
		cld, _ := cloudinary.NewFromParams("CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET")
		uploadResp, err := cld.Upload.Upload(context.Background(), body.Image, uploader.UploadParams{
			Folder: "chat-app/profiles",
		})
		if err != nil {
			log.Println("Cloudinary upload error:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Image upload failed",
			})
		}
		imageUrl = uploadResp.SecureURL
	}
	message := models.Message{
		SenderID:   senderID.(uint),                // we get this from fiber context. hence in original uint form
		ReceiverID: utils.StringToUint(receiverID), //we receive the receiverid in the params in string form(as in url)
		Text:       body.Text,
		Image:      imageUrl,
	}

	if err := db.DB.Create(&message).Error; err != nil {
		log.Println("Failed to save message:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to save message",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(message)
}
