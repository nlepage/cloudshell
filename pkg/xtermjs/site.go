package xtermjs

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
)

//go:embed site
var siteFS embed.FS

func siteHandler() (http.Handler, error) {
	siteDirFS, err := fs.Sub(siteFS, "site")
	if err != nil {
		return nil, fmt.Errorf("error reading site/ directory: %w", err)
	}

	return http.FileServer(http.FS(siteDirFS)), nil
}
