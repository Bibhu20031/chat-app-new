package utils

import (
	"fmt"
	"math/rand"
	"time"
)

func GenerateRandomAvatar(email string) string {
	rand.Seed(time.Now().UnixNano())
	styles := []string{"adventurer", "bottts", "avataaars", "micah", "thumbs"}
	style := styles[rand.Intn(len(styles))]
	return fmt.Sprintf("https://api.dicebear.com/7.x/%s/svg?seed=%s", style, email)
}
