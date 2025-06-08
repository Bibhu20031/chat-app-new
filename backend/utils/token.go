package utils

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(c *fiber.Ctx, userID uint) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days
	})

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "error"
	}

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Failed to generate token"})
		return
	}

	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    tokenString,
		Expires:  time.Now().Add(time.Hour * 24 * 7),
		HTTPOnly: true,
	})
}
