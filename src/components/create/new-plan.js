import './new-plan.css';
import { Modal } from 'react-bootstrap';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../App';
import { useState } from 'react';
import React from 'react';

function NewPlan({
        planWindowShow, setPlanWindowShow, categories,
        setPlanEvents, count, setCount
}) {

    const [event, setEvent] = useState({name: "", category: "", start: 0, end: 0, copied: false});

    const addEvent = () => {
        if (event.name !== "" && event.category !== "" && +event.end > +event.start) {
            setPlanEvents(map => new Map( map.set(count, event) ));
            setEvent({name: "", category: "", start: 0, end: 0});
            setCount(count+1);
            // write to database
            let ref = doc(db, `plan/${count}`);
            const write = async () => {
                setDoc(ref, event);
                setDoc(doc(db, 'info/count'), {count: count+1});
            }
            write().catch(console.error);
            
        }
    }

    return (
        <Modal show={planWindowShow} onHide={() => setPlanWindowShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Add a new event to your plan...</Modal.Title>
            </Modal.Header>

            <div className="form">
                <div className="my-row">
                    <label>Name: </label>
                    <input type="text" id="name" value={event.name}
                        onChange={(e) => setEvent({...event, name: e.target.value}) } 
                    />
                </div>

                <div className="my-row">
                    <label>Category: </label>
                    <select id="category"
                        onChange={(e) => setEvent({...event, category: e.target.value})}
                    >
                        <option value="" key="default">Choose a cateogry:</option>

                        {Array.from(categories.keys()).map((cat) => (
                            <option value={cat} key={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="my-row">
                    <label>Start: </label>
                    <input type="number" id="start" value={event.start} min="0" max="23"
                        onChange={(e) => setEvent({...event, start: e.target.value}) } 
                    />
                </div>

                <div className="my-row">
                    <label>End: </label>
                    <input type="number" id="end" value={event.end} min={+event.start + 1} max="24"
                        onChange={(e) => setEvent({...event,end: e.target.value}) } 
                    />
                </div>
                
                <button onClick={addEvent} id="add-event">Add Event</button>

            </div>
        </Modal>
    );
}

export default NewPlan;