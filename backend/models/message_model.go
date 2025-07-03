package models

import (
	"gorm.io/gorm"
)

type Message struct {
	gorm.Model

	SenderID   uint   `gorm:"not null"`
	ReceiverID uint   `gorm:"not null"`
	Text       string `gorm:"type:text"`
	Image      string `gorm:"type:text"`
}
