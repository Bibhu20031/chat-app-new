package routes

import (
	"github.com/Bibhu20031/chat-app-new/controllers"
	"github.com/Bibhu20031/chat-app-new/middleware"
	"github.com/gofiber/fiber/v2"
)

func RegisterUserRoutes(app fiber.Router) {
	app.Get("/", controllers.GetUsers)
	app.Get("/search", middleware.ProtectRoute, controllers.SearchUsers)

}
