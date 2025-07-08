package main

import (
	"log"
	"os"

	"github.com/Bibhu20031/chat-app-new/db"
	"github.com/Bibhu20031/chat-app-new/models"
	"github.com/Bibhu20031/chat-app-new/routes"
	"github.com/Bibhu20031/chat-app-new/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	utils.InitCloudinary()
	db.ConnectToDB()

	if os.Getenv("APP_ENV") == "development" {
		db.DB.AutoMigrate(&models.User{})
	}

	app := fiber.New()
	app.Get("/", func(c *fiber.Ctx) error {
		err := c.SendString("And the API is UP")
		return err
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowCredentials: true,
	}))

	auth := app.Group("/api/auth")
	routes.RegisterAuthRoutes(auth)

	messages := app.Group("/api/message")
	routes.RegisterMessageRoutes(messages)
	app.Listen(":3000")
}
