import { React } from "react";
import { Dropdown } from "react-bootstrap";

function ActionButton({ status, notebook_id }) {
    const apiPrefix = "/api"


    const CreateRequest = () => {
        fetch(apiPrefix + "/notebook", {
            method: 'POST',
            body: JSON.stringify({}),
        })
            .then((resp) => resp.json())
            .then(() => { window.location.reload() });
    };
    const DeleteRequest = () => {
        fetch(apiPrefix + "/notebook", {
            method: 'DELETE',
            body: JSON.stringify({}),
        })
            .then((resp) => resp.json())
            .then(() => { window.location.reload() });
    };
    const StopRequest = () => {
        fetch(apiPrefix + "/notebook/" + notebook_id + "/container", {
            method: 'DELETE',
            body: JSON.stringify({}),
        })
            .then((resp) => resp.json())
            .then(() => { window.location.reload() });
    };

    const Create = { func: CreateRequest, value: "Create" };
    const Delete = { func: DeleteRequest, value: "Delete" };
    const Stop = { func: StopRequest, value: "Stop" };

    var Actions = [];

    switch (status) {
        case 'Running':
            Actions = [Stop, Delete];
            break;
        case 'Stopped':
            Actions = [Create, Delete];
            break;
        case 'Deleted':
            Actions = [Create];
            break;
        default:
    }

    const actionButton = <Dropdown>
        <Dropdown.Toggle variant="" id="dropdown-basic">
            Select
        </Dropdown.Toggle>

        <Dropdown.Menu>
            {
                Actions.map((e, index) => <Dropdown.Item key={index} onClick={e.func} value={e.value}>{e.value}</Dropdown.Item>)
            }
        </Dropdown.Menu>
    </Dropdown>

    return actionButton;
}

export default ActionButton;
