IMAGE_NAME=myoon/upstage-front
VERSION=t0.0.8

IMG=${IMAGE_NAME}:${VERSION}

build:
	docker buildx build --platform linux/amd64 . -t ${IMG}

build-local:
	docker build . -t ${IMG}

push:
	docker push ${IMG}

run:
	docker run --rm -it -p 3000:3000 ${IMG}

test:
	make build-local run

update:
	make build push
	kubectl apply -f deploy/kubernetes/deployment.yaml -n myoon
