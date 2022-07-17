package kubernetes_istio

import (
	"context"
	apiv1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// TODO 해당 Status 부분 안전한지 다시 한 번 확인 필요

type Status struct {
	checkStatus func() (haveToCheckAgain bool)
	statusText  string
	name        string
	controller  *Controller
}

const (
	Running  = "Running"
	Creating = "Creating"
	Deleted  = "Deleted"
	Stopped  = "Stopped"
	Deleting = "Deleting"
	Stopping = "Stopping"
	Error    = "Error"
)

func NewStatus(c *Controller, name string) *Status {
	s := &Status{
		statusText: Deleted,
		name:       name,
		controller: c,
	}
	s.checkStatus = s.statusDeleted
	return s
}

func (s *Status) Get() string {
	for haveToCheckAgain := s.checkStatus(); haveToCheckAgain; haveToCheckAgain = s.checkStatus() {
	}
	return s.statusText
}

// PVC X, Deployment X, Pod X, 이전 상태 : Stopped
func (s *Status) statusDeleted() (haveToCheckAgain bool) {
	s.statusText = Deleted

	_, err := s.controller.cs.CoreV1().PersistentVolumeClaims(s.controller.namespace).Get(context.Background(), s.name, metav1.GetOptions{})
	if err != nil {
		if errors.IsNotFound(err) {
			return false
		}
		s.statusText = Error
		return false
	}

	s.checkStatus = s.statusCreating
	return true
}

// PVC O, Deployment X, Pod X, 이전 상태 : Stopping, Creating
func (s *Status) statusStopped() (haveToCheckAgain bool) {
	s.statusText = Stopped

	exist, err := s.isPvcExist()
	if err != nil {
		s.statusText = Error
		return false
	}
	if !exist {
		s.checkStatus = s.statusDeleting
		return true
	}
	exist, err = s.isDeploymentExist()
	if err != nil {
		s.statusText = Error
		return false
	}
	if exist {
		s.checkStatus = s.statusCreating
		return true
	}
	return false
}

// PVC O, Deployment O, Pod O, 이전 상태 : Creating
func (s *Status) statusRunning() (haveToCheckAgain bool) {
	s.statusText = Running

	running, err := s.isPodRunning()
	if err != nil {
		s.statusText = Error
		return false
	}
	if !running {
		s.checkStatus = s.statusStopping
		return true
	}
	return false
}

// PVC 0, Deployment 0, Pod X, 이전 상태 : Stopped, Deleted
func (s *Status) statusCreating() (haveToCheckAgain bool) {
	s.statusText = Creating

	running, err := s.isPodRunning()
	if err != nil {
		s.statusText = Error
		return false
	}
	if !running {
		exist, err := s.isDeploymentExist()
		if err != nil {
			s.statusText = Error
			return false
		}
		if !exist {
			s.checkStatus = s.statusStopped
			return true
		}
		return false
	}
	s.checkStatus = s.statusRunning
	return true
}

// PVC O, Deployment X, Pod X, 이전 상태 : Stopped
func (s *Status) statusDeleting() (haveToCheckAgain bool) {
	s.statusText = Deleting

	s.checkStatus = s.statusDeleted
	return true
}

// PVC 0, Deployment 0, Pod X, 이전 상태 : Running
func (s *Status) statusStopping() (haveToCheckAgain bool) {
	s.statusText = Stopping

	exist, err := s.isDeploymentExist()
	if err != nil {
		s.statusText = Error
		return false
	}
	if !exist {
		s.checkStatus = s.statusStopped
		return true
	}
	running, err := s.isPodRunning()
	if err != nil {
		s.statusText = Error
		return false
	}
	if running {
		s.checkStatus = s.statusRunning
		return true
	}
	return false
}

func (s *Status) isPvcExist() (bool, error) {
	_, err := s.controller.cs.CoreV1().PersistentVolumeClaims(s.controller.namespace).Get(context.Background(), s.name, metav1.GetOptions{})
	if err != nil {
		if errors.IsNotFound(err) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func (s *Status) isDeploymentExist() (bool, error) {
	_, err := s.controller.cs.AppsV1().Deployments(s.controller.namespace).Get(context.Background(), s.name, metav1.GetOptions{})
	if err != nil {
		if errors.IsNotFound(err) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func (s *Status) isPodRunning() (bool, error) {
	labels := "project=upstage-portfolio,system=jupyter,component=" + s.name

	// TODO 해당 방식으로 동작 시 해당 Deployment 가 관리하지 않는 Pod 도 필터링에 걸릴 수 있음. 상태 가져오는 것에 대해 더 생각해볼 것
	pods, err := s.controller.cs.CoreV1().Pods(s.controller.namespace).List(context.Background(), metav1.ListOptions{LabelSelector: labels})
	if err != nil {
		return false, err
	}
	if len(pods.Items) <= 0 {
		return false, nil
	}
	// TODO 동일한 조건으로 여러 개의 Pod 가 동작하고 있을 시 일단 첫 번째로 가져와진 Pod 로 반환하는데 조금 더 서칭해볼 것
	if pods.Items[0].Status.Phase != apiv1.PodRunning {
		return false, nil
	}
	return true, nil
}
