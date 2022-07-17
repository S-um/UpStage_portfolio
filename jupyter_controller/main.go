package main

import (
	"github.com/s-um/UpStage_portfolio/jupyter_controller/cmd/router"
	"github.com/s-um/UpStage_portfolio/jupyter_controller/cmd/router/gin"
	"github.com/s-um/UpStage_portfolio/jupyter_controller/pkg/jupyter_controller"
	"github.com/s-um/UpStage_portfolio/jupyter_controller/pkg/jupyter_controller/kubernetes_istio"
)

// TODO const => variable value from config
const (
	StaticNamespace       = "myoon"
	StaticDomainName      = "upstage.ga"
	StaticBaseUrl         = "/api"
	StaticNotebookBaseUrl = ""
	StaticPort            = ":8080"
)

func main() {
	var jupyterController jupyter_controller.Interface
	var r router.Interface
	var err error

	jupyterController, err = kubernetes_istio.NewController(StaticNamespace)
	if err != nil {
		panic(err)
	}
	r = gin.NewRouter(jupyterController, StaticDomainName, StaticBaseUrl, StaticNotebookBaseUrl, StaticPort)
	if err = r.Run(); err != nil {
		panic(err)
	}
}
