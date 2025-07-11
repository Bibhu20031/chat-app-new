package utils

import (
	"log"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
)

var CLD *cloudinary.Cloudinary

func InitCloudinary() {
	cld, err := cloudinary.NewFromParams(
		os.Getenv("CLOUDINARY_CLOUD_NAME"),
		os.Getenv("CLOUDINARY_API_KEY"),
		os.Getenv("CLOUDINARY_API_SECRET"),
	)
	if err != nil {
		log.Fatalf("Cloudinary config error: %v", err)
	}

	CLD = cld
}
