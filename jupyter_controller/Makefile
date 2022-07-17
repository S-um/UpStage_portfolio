IMAGE_NAME=myoon/jupyter-controller
VERSION=0.0.5

IMG=${IMAGE_NAME}:${VERSION}

build:
	docker buildx build --platform linux/amd64 . -t ${IMG}

push:
	docker push ${IMG}
