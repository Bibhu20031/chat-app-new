package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model // adds ID, CreatedAt, UpdatedAt, DeletedAt

	Email      string `gorm:"uniqueIndex;not null"`
	FullName   string `gorm:"not null"`
	UserName   string `gorm:"not null;uniqueIndex"`
	Password   string `gorm:"not null"`
	ProfilePic string `gorm:"default:''"`
}

//UserName:   utils.GenerateUniqueUsername(body.FullName)
