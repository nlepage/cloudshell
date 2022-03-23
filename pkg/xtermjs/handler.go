package xtermjs

import (
	"net/http"

	"github.com/gorilla/mux"
)

func Handler(opts HandlerOpts) (http.Handler, error) {
	router := mux.NewRouter()

	router.HandleFunc("/attach", websocketHandler(opts))

	siteHandler, err := siteHandler()
	if err != nil {
		return nil, err
	}

	router.PathPrefix("").Handler(siteHandler)

	return router, nil
}
