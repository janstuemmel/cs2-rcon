package main

import (
	"embed"
	"errors"
	"log"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gorcon/rcon"
)

type Exec struct {
	Cmd string `json:"cmd"`
}

//go:embed dist/*
var embedDirStatic embed.FS

func exec(cmd string) (string, error) {
	rcon, err := rcon.Dial(os.Getenv("HOST")+":"+os.Getenv("PORT"), os.Getenv("RCON_PASS"))

	if err != nil {
		return "", errors.New("connection to server failed")
	}

	defer rcon.Close()

	response, err := rcon.Execute(cmd)

	return response, err
}

func main() {
	app := fiber.New()
	api := app.Group("/api")

	app.Use("/", filesystem.New(filesystem.Config{
		Root:       http.FS(embedDirStatic),
		PathPrefix: "dist",
		Browse:     true,
	}))

	api.Post("/exec", func(c *fiber.Ctx) error {
		body := new(Exec)

		if err := c.BodyParser(body); err != nil {
			return err
		}

		if body.Cmd == "" {
			return c.SendString("")
		}

		response, err := exec(body.Cmd)

		if err != nil {
			return err
		}

		return c.SendString(response)
	})

	log.Fatal(app.Listen(":3000"))
}
