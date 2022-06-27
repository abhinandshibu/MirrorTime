import './timeout.css';
import { Modal } from 'react-bootstrap';
import React from 'react';

function Timeout({timeoutWindow, setTimeoutWindow}) {
    return (
        <Modal show={timeoutWindow} onHide={() => setTimeoutWindow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Time's up!</Modal.Title>
            </Modal.Header>
        </Modal>
    )
}

export default Timeout;