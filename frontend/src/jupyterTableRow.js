import ActionButton from "./jupyterActionButton";
import styled from './portfolio.module.css';
import { Button, Spinner, Dropdown, ButtonGroup } from "react-bootstrap";
import { useEffect, useState } from "react";

function openNotebook(url) {
    window.open(url);
}

function JupyterTableRow({ name, notebook_id }) {
    const [status, setStatus] = useState("Unknown");
    const isRunning = (status === "Running");
    const isOnChanging = !(status !== "Running" && status.endsWith("ing"));
    const [url, setUrl] = useState("/");
    const apiPrefix = "/api";

    const updateUrl = async () => {
        const resp = await fetch(apiPrefix + "/notebook/" + notebook_id + "/url");
        const json = await resp.json();
        setUrl(json.url);
    };
    const updateStatus = async () => {
        const resp = await fetch(apiPrefix + "/notebook/" + notebook_id + "/status");
        const json = await resp.json();
        if (json.status === "Running") {
            updateUrl();
        }
        setStatus(json.status);
    };
    // const getState = () => { };
    // const getUrl = () => { };
    useEffect(() => {
        updateStatus();
    }, [])

    return <tr>
        <td colSpan={3}>{name}</td>
        <td style={{ "textAlign": "center" }}><Button className={styled.btn} disabled={!isRunning} onClick={() => { openNotebook(url) }}>Connect</Button></td>
        <td style={{ "textAlign": "center" }}><Dropdown as={ButtonGroup} className={styled.btn} style={{ "padding": "0" }}>
            <ActionButton status={status} notebook_id={notebook_id}></ActionButton>
        </Dropdown>
        </td>
        <td style={{ "textAlign": "center" }}>{status}{isOnChanging ? null : <Spinner animation="border" size="sm" />}</td>
    </tr>
}

export default JupyterTableRow;