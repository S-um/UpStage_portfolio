import { Button, Table, Row } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { BsInfoCircle } from "react-icons/bs";
import JupyterTableRow from "./jupyterTableRow";
import styled from './portfolio.module.css';


function JupyterContent({ name, notebook_id }) {
    const [content, setContent] = useState(<></>);
    const apiPrefix = "/api";

    useEffect(() => {
        const getJupyterInfo = async () => {
            const resp = await fetch(apiPrefix + "/notebook/" + notebook_id + "/status", {
                redirect: "follow",
            });
            switch (resp.status) {
                case 200: // StatusOK
                    // const target = useRef(null);
                    setContent(
                        <>
                            <Table style={{ "color": "white", "verticalAlign": "middle" }}>
                                <thead>
                                    <tr>
                                        <th colSpan={3}><div style={{ "width": "30vw" }}>Name</div></th>
                                        <th style={{ "textAlign": "center" }}>Connect</th>
                                        <th style={{ "textAlign": "center" }}>Action</th>
                                        <th style={{ "textAlign": "center" }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <JupyterTableRow name={name} notebook_id={notebook_id}></JupyterTableRow>
                                </tbody>
                            </Table>
                            <span><BsInfoCircle /><br /></span>
                            <span>Connect<br /></span>
                            <p style={{ "fontSize": 12 }}>
                                <span>Status 가 Running 시 클릭하면 Jupyter Notebook 접속<br /></span>
                            </p>
                            <span>Action<br /></span>
                            <p style={{ "fontSize": 12 }}>
                                <span>Create : Jupyter Notebook 컨테이너 생성<br /></span>
                                <span>Stop : workspace 내에 있는 데이터는 보존한 채로 Jupyter Notebook 컨테이너 삭제<br /></span>
                                <span>Delete : workspace 내에 있는 데이터를 포함하여 Jupyter Notebook 컨테이너 삭제<br /></span>
                            </p>

                            <p></p>
                            <span>Status<br /></span>
                            <p style={{ "fontSize": 12 }}>
                                <span>변화된 상태를 확인하기 위해서는 새로고침이 필요합니다.<br /></span>
                                <span>버그로 인해 현재 삭제 혹은 정지 중이더라도 Status는 Running 으로 나타나며 1 여분 후 Deleted 혹은 Stopped 로 상태가 변경될 것입니다.</span>
                            </p>
                        </>
                    );
                    break;
                case 401: // StatusUnauthorization
                    setContent(<p>Jupyter Notebook 을 관리하기 위해서는 로그인이 필요합니다.<br /><br /><Button className={styled.btn} onClick={() => { window.location.href = "https://login.upstage.ga/login" }}>Login</Button></p>)
                    break;
                case 403: // StatusForbidden
                    setContent(<p>Jupyter Notebook 을 관리할 권한이 없습니다.<br />Upstage 관계자시라면 yoonms0101@gmail.com 으로 연락 부탁드립니다.</p>);
                    break;
                default:
                    setContent(<Row>Unknown Error Occured</Row>);
                    break;
            }
        }
        getJupyterInfo();
    }, []);

    return content;
}

export default JupyterContent;
