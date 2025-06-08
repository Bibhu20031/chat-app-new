package middleware

import (
	"os"

	"github.com/Bibhu20031/chat-app-new/db"
	"github.com/Bibhu20031/chat-app-new/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func ProtectRoute(c *fiber.Ctx) error {
	token := c.Cookies("jwt")

	if token == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Unauthorized - No Token Provided",
		})
	}

	// Parse and verify the token
	claims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	// log.Println(os.Getenv("JWT_SECRET"))  gets printed
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Unauthorized - Invalid Token",
		})
	}
	// Get userId from token claims
	userId, ok := claims["user_id"].(float64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Unauthorized - Invalid Token Payload",
		})
	}
	// Find user by ID
	var user models.User
	if err := db.DB.First(&user, "id = ?", userId).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "User not found",
		})
	}

	// Store the user in the request context
	c.Locals("user", user)

	return c.Next()
}
