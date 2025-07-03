package utils

import (
	"strconv"
)

func StringToUint(s string) uint {
	id, _ := strconv.ParseUint(s, 10, 64)
	return uint(id)
}
