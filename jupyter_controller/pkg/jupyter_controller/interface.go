package jupyter_controller

type Interface interface {
	Create(name string, gpuLimit, cpuLimit, memoryLimit int) error
	Stop(name string) error
	Delete(name string) error
	GetStatus(name string) string
}
