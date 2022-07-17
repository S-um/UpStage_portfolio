package kubernetes_istio

import (
	"context"
	"fmt"
	"github.com/s-um/UpStage_portfolio/jupyter_controller/cmd/router/gin"
	appsv1 "k8s.io/api/apps/v1"
	apiv1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
	k "k8s.io/client-go/kubernetes"
	"sigs.k8s.io/controller-runtime/pkg/client/config"
)

// TODO const => variable value from config or request
const (
	StaticCapacity = 10
)

type Controller struct {
	cs        k.Interface
	namespace string
	// TODO 해당 부분을 Static 하게 하나의 Status 만 관리하는 것이 아닌 유동적으로 관리할 수 있도록 업데이트 필요
	status *Status
}

func NewController(namespace string) (*Controller, error) {
	conf, err := config.GetConfig()
	if err != nil {
		return nil, err
	}
	cs, err := k.NewForConfig(conf)
	if err != nil {
		return nil, err
	}
	controller := &Controller{
		cs:        cs,
		namespace: namespace,
	}
	// TODO gin.StaticNotebookName 부분 꼭 수정할 것!!!!!
	controller.status = NewStatus(controller, gin.StaticNotebookName)
	controller.status.Get()
	return controller, nil
}

func (c *Controller) Create(name string, gpuLimit, cpuLimit, memoryLimit int) error {
	ctx := context.Background()
	createOptions := metav1.CreateOptions{}

	_, errDeploymentCreate := c.cs.AppsV1().Deployments(c.namespace).
		Create(ctx, genDeployment(name, gpuLimit, cpuLimit, memoryLimit), createOptions)
	_, errServiceCreate := c.cs.CoreV1().Services(c.namespace).
		Create(ctx, genService(name), createOptions)
	_, errPvcCreate := c.cs.CoreV1().PersistentVolumeClaims(c.namespace).
		Create(ctx, genPvc(name, StaticCapacity), createOptions)

	// TODO 이미 있을 경우 일단 무시하고 넘어가는데 업데이트로 변경할 지 고민해볼 것
	if isErrorAndNotExpected(errDeploymentCreate, errors.IsAlreadyExists) {
		return errDeploymentCreate
	}
	if isErrorAndNotExpected(errServiceCreate, errors.IsAlreadyExists) {
		return errServiceCreate
	}
	if isErrorAndNotExpected(errPvcCreate, errors.IsAlreadyExists) {
		return errPvcCreate
	}

	return nil
}

func (c *Controller) Stop(name string) error {
	ctx := context.Background()
	deleteOptions := metav1.DeleteOptions{}

	errDeploymentDelete := c.cs.AppsV1().Deployments(c.namespace).
		Delete(ctx, name, deleteOptions)
	errServiceDelete := c.cs.CoreV1().Services(c.namespace).
		Delete(ctx, name, deleteOptions)

	if isErrorAndNotExpected(errDeploymentDelete, errors.IsNotFound) {
		return errDeploymentDelete
	}
	if isErrorAndNotExpected(errServiceDelete, errors.IsNotFound) {
		return errServiceDelete
	}

	return nil
}

func (c *Controller) Delete(name string) error {
	ctx := context.Background()
	deleteOptions := metav1.DeleteOptions{}

	errDeploymentDelete := c.cs.AppsV1().Deployments(c.namespace).
		Delete(ctx, name, deleteOptions)
	errServiceDelete := c.cs.CoreV1().Services(c.namespace).
		Delete(ctx, name, deleteOptions)
	errPvcDelete := c.cs.CoreV1().PersistentVolumeClaims(c.namespace).
		Delete(ctx, name, deleteOptions)

	if isErrorAndNotExpected(errDeploymentDelete, errors.IsNotFound) {
		return errDeploymentDelete
	}
	if isErrorAndNotExpected(errServiceDelete, errors.IsNotFound) {
		return errServiceDelete
	}
	if isErrorAndNotExpected(errPvcDelete, errors.IsNotFound) {
		return errPvcDelete
	}

	return nil
}

func (c *Controller) GetStatus(name string) string {
	// TODO 하나의 Status 가 아닌 다중 Status 관리 시 name 사용 필요
	return c.status.Get()
}

func genDeployment(name string, gpuLimit, cpuLimit, memoryLimit int) *appsv1.Deployment {
	gpuLimitString := fmt.Sprintf("%d", gpuLimit)
	cpuLimitString := fmt.Sprintf("%d", cpuLimit)
	memoryLimitString := fmt.Sprintf("%dGi", memoryLimit)
	return &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name: name,
			Labels: map[string]string{
				"project":   "upstage-portfolio",
				"system":    "jupyter",
				"component": name,
			},
		},
		Spec: appsv1.DeploymentSpec{
			Replicas: int32Ptr(1),
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"project":   "upstage-portfolio",
					"system":    "jupyter",
					"component": name,
				},
			},
			Template: apiv1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{
						"project":   "upstage-portfolio",
						"system":    "jupyter",
						"component": name,
					},
				},
				Spec: apiv1.PodSpec{
					Containers: []apiv1.Container{
						{
							Name:    "jupyter",
							Image:   "jupyter/datascience-notebook",
							Command: []string{"jupyter", "notebook", "--NotebookApp.base_url=/notebook/" + name, "--NotebookApp.token=''", "--NotebookApp.password=''"},
							Ports:   []apiv1.ContainerPort{{Name: "web", ContainerPort: 8888}},
							VolumeMounts: []apiv1.VolumeMount{
								{
									MountPath: "/home/jovyan",
									Name:      "workspace",
								},
							},
							Resources: apiv1.ResourceRequirements{
								Requests: apiv1.ResourceList{
									"cpu":            resource.MustParse(cpuLimitString),
									"memory":         resource.MustParse(memoryLimitString),
									"nvidia.com/gpu": resource.MustParse(gpuLimitString),
								},
								Limits: apiv1.ResourceList{
									"cpu":            resource.MustParse(cpuLimitString),
									"memory":         resource.MustParse(memoryLimitString),
									"nvidia.com/gpu": resource.MustParse(gpuLimitString),
								},
							},
						},
					},
					Volumes: []apiv1.Volume{
						{
							Name: "workspace",
							VolumeSource: apiv1.VolumeSource{
								PersistentVolumeClaim: &apiv1.PersistentVolumeClaimVolumeSource{
									ClaimName: name,
									ReadOnly:  false,
								},
							},
						},
					},
				},
			},
		},
	}
}

func genService(name string) *apiv1.Service {
	return &apiv1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name: name,
			Labels: map[string]string{
				"project":   "upstage-portfolio",
				"system":    "jupyter",
				"component": name,
			},
		},
		Spec: apiv1.ServiceSpec{
			Selector: map[string]string{
				"project":   "upstage-portfolio",
				"system":    "jupyter",
				"component": name,
			},
			Ports: []apiv1.ServicePort{
				{
					Name:       "web",
					Protocol:   apiv1.ProtocolTCP,
					TargetPort: intstr.FromInt(8888),
					Port:       8888,
				},
			},
		},
	}
}

func genPvc(name string, capacity uint8) *apiv1.PersistentVolumeClaim {
	return &apiv1.PersistentVolumeClaim{
		ObjectMeta: metav1.ObjectMeta{
			Name: name,
			Labels: map[string]string{
				"project":   "upstage-portfolio",
				"system":    "jupyter",
				"component": name,
			},
		},
		Spec: apiv1.PersistentVolumeClaimSpec{
			AccessModes: []apiv1.PersistentVolumeAccessMode{
				apiv1.ReadWriteMany,
			},
			Resources: apiv1.ResourceRequirements{
				Requests: apiv1.ResourceList{
					apiv1.ResourceStorage: resource.MustParse(fmt.Sprintf("%dGi", capacity)),
				},
			},
		},
	}
}

func isErrorAndNotExpected(err error, isExpectedError func(error) bool) bool {
	return err != nil && !isExpectedError(err)
}

func int32Ptr(num int) *int32 {
	a := int32(num)
	return &a
}
