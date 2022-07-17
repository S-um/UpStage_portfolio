import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styled from './portfolio.module.css';

function MoreInfo({ title, body }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="" className={styled.btn} onClick={handleShow}>
                See More
            </Button>

            <Modal show={show} centered onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ "color": "#AE8CF5" }}>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{body}</Modal.Body>
            </Modal>
        </>
    );
}

export default MoreInfo;
