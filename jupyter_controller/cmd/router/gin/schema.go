package gin

type ErrorResponse struct {
	Message string `json:"message"`
}

type CreateJupyterNotebookRequest struct {
}
type CreateJupyterNotebookResponse struct {
	IsCreate bool `json:"is_create"`
}

type StopJupyterNotebookRequest struct {
}
type StopJupyterNotebookResponse struct {
	IsStop bool `json:"is_stop"`
}

type DeleteJupyterNotebookRequest struct {
}
type DeleteJupyterNotebookResponse struct {
	IsDelete bool `json:"is_delete"`
}

type GetJupyterNotebookStatusResponse struct {
	Status string `json:"status"`
}

type GetJupyterNotebookUrlResponse struct {
	Url string `json:"url"`
}
