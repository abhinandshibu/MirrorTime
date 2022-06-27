import './info.css';
import { db } from '../../App';
import { Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { doc, updateDoc } from "firebase/firestore";

function Info({infoWindow, setInfoWindow, events, setEvents, info}) {

    const [startHour, setStartHour] = useState();
    const [startMin, setStartMin] = useState();
    const [endHour, setEndHour] = useState();
    const [endMin, setEndMin] = useState();

    useEffect(() => {
        setStartHour(Math.floor(info.start / 3600));
        setStartMin(Math.floor(info.start % 3600 / 60));
        setEndHour(Math.floor(info.end / 3600));
        setEndMin(Math.floor(info.end % 3600 / 60));
    }, [info])

    const save = async () => {
        const start = 3600 * startHour + 60 * startMin;
        const end = 3600 * endHour + 60 * endMin;
        const updatedEvent = {...events.get(info.index), start: start, end: end};
        if (start < end) {
            setEvents(map => new Map (map.set( info.index, updatedEvent ) ));

            const ref = doc(db, info.isPlan ? "plan" : "life", info.index.toString())
            await updateDoc(ref, {start: start, end: end});
    
            setInfoWindow(false);
        }
    }

    const startEarlier = () => {
        if (startHour === 0 && startMin === 0) return;
        if (startMin === 0) {
            setStartHour(startHour - 1);
            setStartMin(55);
        } else {
            setStartMin(startMin - 5);
        }
    }

    const startLater = () => {
        if (startHour === 23 && startMin === 55) return;
        if (startMin === 55) {
            setStartHour(startHour + 1);
            setStartMin(0);
        } else {
            setStartMin(startMin + 5);
        }
    }

    const endEarlier = () => {
        if (endHour === 0 && endMin === 5) return;
        if (endMin === 0) {
            setEndHour(endHour - 1);
            setEndMin(55);
        } else {
            setEndMin(endMin - 5);
        }
    }

    const endLater = () => {
        if (endHour === 24) return;
        if (endMin === 55) {
            setEndHour(endHour + 1);
            setEndMin(0);
        } else {
            setEndMin(endMin + 5);
        }
    }

    const print = (number) => (number < 10 ? '0' : '') + number;

    return (
        <Modal show={infoWindow} onHide={() => setInfoWindow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Edit event time...</Modal.Title>
            </Modal.Header>

            <div className="edit-form">
                <span>{print(startHour)} : {print(startMin)}</span>
                <span>to</span>
                <span>{print(endHour)} : {print(endMin)}</span>
                
                <div className="buttons">
                    <span onClick={startEarlier}>&#9664;</span>
                    <span onClick={startLater}>&#9654;</span>
                </div>
                <span></span>
                <div className="buttons">
                    <span onClick={endEarlier}>&#9664;</span>
                    <span onClick={endLater}>&#9654;</span>
                </div>

                <button onClick={save} id="save">Save</button>
            </div>
            
        </Modal>
    )
}

export default Info;