import './info.css';
import { db } from '../../App';
import { Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { EditTextarea, EditText } from 'react-edit-text';
import { Button } from 'react-bootstrap';
import 'react-edit-text/dist/index.css';

function Info({infoWindow, setInfoWindow, events, setEvents, info}) {

    const [startHour, setStartHour] = useState();
    const [startMin, setStartMin] = useState();
    const [endHour, setEndHour] = useState();
    const [endMin, setEndMin] = useState();
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        setStartHour(Math.floor(info.start / 3600));
        setStartMin(Math.floor(info.start % 3600 / 60));
        setEndHour(Math.floor(info.end / 3600));
        setEndMin(Math.floor(info.end % 3600 / 60)); console.log(info.description);
        setDescription(info.description !== undefined ? info.description : "");
        setName(info.name);
    }, [info])

    const save = async () => {
        const start = 3600 * startHour + 60 * startMin;
        const end = 3600 * endHour + 60 * endMin;
        const updatedEvent = {...events.get(info.index), 
            start: start, end: end, description: description, name: name};
        if (start < end) {
            setEvents(map => new Map (map.set( info.index, updatedEvent ) ));

            const ref = doc(db, info.isPlan ? "plan" : "life", info.index.toString())
            await updateDoc(ref, {start: start, end: end, description: description, name: name});
    
            setInfoWindow(false);
        }
    }

    const earlier = (step, isStart) => {
        const [hour, setHour, min, setMin] = isStart ? 
            [startHour, setStartHour, startMin, setStartMin] : 
            [endHour, setEndHour, endMin, setEndMin];

        if (hour === 0 && min < step) return;
        if (min < step) {
            setHour(hour - 1);
            setMin(60 + min - step);
        } else {
            setMin(min - step);
        }
    }

    const later = (step, isStart) => {
        const [hour, setHour, min, setMin] = isStart ? 
            [startHour, setStartHour, startMin, setStartMin] : 
            [endHour, setEndHour, endMin, setEndMin];

        if (hour > 23) return;
        if (hour === 23 && min >= 60 - step) return;
        if (min >= 60 - step) {
            setHour(hour + 1);
            setMin(min + step - 60);
        } else {
            setMin(min + step);
        }
    }

    const print = (number) => (number < 10 ? '0' : '') + number;

    return (
        <Modal show={infoWindow} onHide={() => setInfoWindow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <EditText 
                        name="title" value={name} showEditButton
                        onChange={(e) => setName(e.target.value)}
                    />
                </Modal.Title>
            </Modal.Header>

            <div className="info-body">
                <div>
                    <label>Category: </label>
                    <span className="info-category" 
                        style={{background: '#' + info.colour}}
                    >{info.category}</span>
                </div>
                
                <label>Time: </label>
                <div className="info-time">
                    <span style={{gridArea: "start"}}>{print(startHour)} : {print(startMin)}</span>
                    <span style={{gridArea: "to"}}>to</span>
                    <span style={{gridArea: "end"}}>{print(endHour)} : {print(endMin)}</span>
                    
                    <div style={{gridArea: "start-earlier"}} className="buttons">
                        <span onClick={() => earlier(1, true)}>&lt;</span>
                        <span onClick={() => earlier(5, true)}>&#9664;</span>
                    </div>
                    <div style={{gridArea: "start-later"}} className="buttons">
                        <span onClick={() => later(5, true)}>&#9654;</span>
                        <span onClick={() => later(1, true)}>&gt;</span>
                    </div>

                    <div style={{gridArea: "end-earlier"}} className="buttons">
                        <span onClick={() => earlier(1, false)}>&lt;</span>
                        <span onClick={() => earlier(5, false)}>&#9664;</span>
                    </div>
                    <div style={{gridArea: "end-later"}} className="buttons">
                        <span onClick={() => later(5, false)}>&#9654;</span>
                        <span onClick={() => later(1, false)}>&gt;</span>
                    </div>
                </div>

                <label>Description: </label>
                <EditTextarea 
                    name="description" value={description} 
                    className="info-description" inputClassName="info-description"
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description to your event."
                />

                <Button variant="outline-dark" onClick={save} id="save">Save</Button>
            </div>
        </Modal>
    )
}

export default Info;