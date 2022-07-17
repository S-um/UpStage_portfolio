DIR_PATH=$1
COMPONENT_NAME=$(basename ${DIR_PATH})

if [ "$DIR_PATH" == "" -o "$DIR_PATH" == "./config" ]; then
	exit 1
fi

ARGUMENT="--dry-run=client -o yaml"

for FILE_NAME in "$DIR_PATH"/*
do
	ARGUMENT="${ARGUMENT} --from-file=${FILE_NAME}"
done

CONFIGMAP_PATH=./yaml/${COMPONENT_NAME}-config-cm.yaml
kubectl create cm ${COMPONENT_NAME}-config ${ARGUMENT} > ${CONFIGMAP_PATH}
