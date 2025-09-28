package routes

import (
	"github.com/Bibhu20031/chat-app-new/controllers"
	"github.com/Bibhu20031/chat-app-new/middleware"
	"github.com/gofiber/fiber/v2"
)

func RegisterAuthRoutes(router fiber.Router) {
	router.Post("/signup", controllers.SignUp)
	router.Post("/login", controllers.Login)
	router.Post("/logout", controllers.Logout)
	router.Put("/update-profile", middleware.ProtectRoute, controllers.UpdateProfile)
	router.Get("/check", middleware.ProtectRoute, controllers.CheckAuth)

}
