import { useState } from 'react';
import ReactFlow, {
    Background,
} from 'react-flow-renderer';

const edgeStyle = {
    stroke: "white",
    strokeWidth: 2,
}

const nodeStyle = {
    color: 'white',
    backgroundColor: 'rgba( 255, 255, 255, 0 )',
    borderColor: '#D0C0F7',
    borderWidth: 2,
    width: "fit-content",
    height: "fit-content"
}

const annoStyle = {
    color: 'white',
    backgroundColor: 'rgba( 255, 255, 255, 0 )',
    borderColor: '#5182FF',
    borderWidth: 2,
    width: "fit-content",
    height: "fit-content"
}

const initialNodes = [
    {
        id: 'A',
        type: 'group',
        position: { x: 0, y: 0 },
        style: {
            backgroundColor: 'rgba( 255, 255, 255, 0 )',
            borderColor: '#5182FF',
            borderWidth: 2,
            width: 800,
            height: 300,
        },
    },
    {
        id: 'Kubernetes',
        type: 'output',
        data: { label: 'Kubernetes Cluster' },
        style: annoStyle,
        position: { x: 0, y: 0 },
        parentNode: 'A',
        extent: 'parent',
    },
    {
        id: 'Ory',
        data: { label: 'Ory (인증/인가)' },
        sourcePosition: 'bottom',
        targetPosition: 'right',
        style: nodeStyle,
        position: { x: 270, y: 30 },
        parentNode: 'A',
        extent: 'parent',
    },
    {
        id: 'Controller',
        data: { label: 'Jupyter Controller(with Golang)' },
        sourcePosition: 'left',
        targetPosition: 'left',
        style: nodeStyle,
        position: { x: 570, y: 130 },
        parentNode: 'A',
        extent: 'parent',
    },
    {
        id: 'K8S',
        data: { label: 'Kubernetes API Server' },
        sourcePosition: 'left',
        targetPosition: 'right',
        style: nodeStyle,
        position: { x: 290, y: 230 },
        parentNode: 'A',
        extent: 'parent',
    },
    {
        id: 'Jupyter',
        type: 'output',
        style: nodeStyle,
        data: { label: 'Jupyter Notebook Container' },
        targetPosition: 'right',
        position: { x: 30, y: 180 },
        parentNode: 'A',
        extent: 'parent',
    },
    {
        id: 'User',
        type: 'input',
        sourcePosition: 'left',
        style: nodeStyle,
        position: { x: 820, y: 30 },
        data: { label: 'User (React)' },
    },
];

const initialEdges = [
    { id: 'User-Ory', source: 'User', target: 'Ory', label: "request", animated: true, style: edgeStyle },
    { id: 'Ory-Controller', source: 'Ory', target: 'Controller', label: "request after auth check", animated: true, style: edgeStyle },
    { id: 'Controller-K8S', source: 'Controller', target: 'K8S', label: "request about Container", animated: true, style: edgeStyle },
    { id: 'K8S-Jupyter', source: 'K8S', target: 'Jupyter', label: "Life Manage", animated: true, style: edgeStyle },
    { id: 'Ory-Jupyter', source: 'Ory', target: 'Jupyter', label: "request after auth check", animated: true, style: edgeStyle },
];


function Flow() {
    const [nodes] = useState(initialNodes);
    const [edges] = useState(initialEdges);

    /*
    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    */

    return (
        <ReactFlow
            style={{ "border": "5px double white" }}
            nodes={nodes}
            edges={edges}
            /*
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            */
            fitView
            attributionPosition="top-right"
        >
            <Background />
        </ReactFlow>
    );
}

export default Flow;
