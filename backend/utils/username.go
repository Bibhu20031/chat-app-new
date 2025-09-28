package utils

import (
	"math/rand"
	"strconv"
	"strings"
	"time"
)

func GenerateUniqueUsername(fullName string) string {

	base := strings.ToLower(strings.TrimSpace(fullName))

	base = strings.ReplaceAll(base, " ", "-")
	clean := ""
	for _, ch := range base {
		if (ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') || ch == '-' {
			clean += string(ch)
		}
	}

	if clean == "" {
		clean = "user"
	}

	src := rand.NewSource(time.Now().UnixNano())
	r := rand.New(src)
	suffix := r.Intn(9000) + 1000

	return clean + "-" + strconv.Itoa(suffix)
}
