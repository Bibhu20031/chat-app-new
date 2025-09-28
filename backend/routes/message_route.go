package routes

import (
	"github.com/Bibhu20031/chat-app-new/controllers"
	"github.com/Bibhu20031/chat-app-new/middleware"
	"github.com/gofiber/fiber/v2"
)

func RegisterMessageRoutes(app fiber.Router) {
	app.Get("/users", middleware.ProtectRoute, controllers.GetUsers)

	app.Get("/:id", middleware.ProtectRoute, controllers.GetMessages)

	app.Post("/send/:id", middleware.ProtectRoute, controllers.SendMessage)

}
