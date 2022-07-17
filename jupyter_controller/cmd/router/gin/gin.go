package gin

import (
	"github.com/gin-gonic/gin"
	"github.com/s-um/UpStage_portfolio/jupyter_controller/pkg/jupyter_controller"
	"net/http"
	"path/filepath"
)

type Router struct {
	ginRouter           *gin.Engine
	jupyterController   jupyter_controller.Interface
	port                string
	baseUrlPath         string
	notebookBaseUrlPath string
	domainName          string
}

func NewRouter(jupyterController jupyter_controller.Interface, domainName, baseUrlPath, notebookBaseUrlPath, port string) *Router {
	r := &Router{
		ginRouter:           gin.Default(),
		jupyterController:   jupyterController,
		port:                port,
		baseUrlPath:         baseUrlPath,
		notebookBaseUrlPath: notebookBaseUrlPath,
		domainName:          domainName,
	}

	r.setRoute(baseUrlPath)
	return r
}

func (r *Router) setRoute(baseUrl string) {
	r.ginRouter.Use(CORSMiddleware())

	r.ginRouter.POST(filepath.Join(baseUrl, "/notebook"), r.CreateJupyterNotebook)
	r.ginRouter.DELETE(filepath.Join(baseUrl, "/notebook"), r.DeleteJupyterNotebook)
	r.ginRouter.DELETE(filepath.Join(baseUrl, "/notebook/:notebookId/container"), r.StopJupyterNotebook)
	r.ginRouter.GET(filepath.Join(baseUrl, "/notebook/:notebookId/status"), r.GetJupyterNotebookStatus)
	r.ginRouter.GET(filepath.Join(baseUrl, "/notebook/:notebookId/url"), r.GetJupyterNotebookConnectUrl)
}

func (r *Router) Run() error {
	return r.ginRouter.Run(r.port)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Headers", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Origin", "https://upstage.ga")
		c.Header("Access-Control-Allow-Methods", "*")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}
