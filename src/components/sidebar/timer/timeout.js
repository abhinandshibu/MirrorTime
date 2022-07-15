import './timeout.css';
import { Modal } from 'react-bootstrap';
import React from 'react';

function Timeout({visibility, setVisibility}) {
    return (
        <Modal show={visibility} onHide={() => setVisibility(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Time's up!</Modal.Title>
            </Modal.Header>
        </Modal>
    )
}

export default Timeout;