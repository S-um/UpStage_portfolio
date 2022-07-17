package gin

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"path/filepath"
)

// TODO const => variable value from config
const (
	StaticNotebookName = "upstage-notebook"
	StaticGpuLimit     = 1
	StaticCpuLimit     = 4
	StaticMemoryLimit  = 8
)

func (r *Router) CreateJupyterNotebook(c *gin.Context) {
	err := r.jupyterController.Create(StaticNotebookName, StaticGpuLimit, StaticCpuLimit, StaticMemoryLimit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{"error on creating jupyter notebook"})
		return
	}
	c.JSON(http.StatusOK, CreateJupyterNotebookResponse{true})
}

func (r *Router) StopJupyterNotebook(c *gin.Context) {
	err := r.jupyterController.Stop(StaticNotebookName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{"error on stopping jupyter notebook"})
		return
	}
	c.JSON(http.StatusOK, StopJupyterNotebookResponse{IsStop: true})
}

func (r *Router) DeleteJupyterNotebook(c *gin.Context) {
	err := r.jupyterController.Delete(StaticNotebookName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{"error on deleting jupyter notebook"})
		return
	}
	c.JSON(http.StatusOK, DeleteJupyterNotebookResponse{true})
}

func (r *Router) GetJupyterNotebookStatus(c *gin.Context) {
	status := r.jupyterController.GetStatus(StaticNotebookName)
	c.JSON(http.StatusOK, GetJupyterNotebookStatusResponse{status})
}

func (r *Router) GetJupyterNotebookConnectUrl(c *gin.Context) {
	notebookName := StaticNotebookName
	status := r.jupyterController.GetStatus(notebookName)

	if status != "Running" {
		c.JSON(http.StatusNotFound, ErrorResponse{"notebook not found"})
		return
	}

	c.JSON(http.StatusOK, GetJupyterNotebookUrlResponse{Url: fmt.Sprintf("https://%s%s/", r.domainName, filepath.Join("/", r.notebookBaseUrlPath, "/notebook", notebookName))})
}
