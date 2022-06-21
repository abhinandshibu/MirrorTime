import './new-life.css';
import { Modal } from 'react-bootstrap';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../App';
import { useState } from 'react';
import React from 'react';

function NewLife({
        lifeWindowShow, setLifeWindowShow, categories,
        setLifeEvents, count, setCount
}) {

    const [event, setEvent] = useState({name: "", category: "", start: 0, end: 0});

    const addEvent = () => {
        if (event.name !== "" && event.category !== "" && +event.end > +event.start) {
            setLifeEvents(map => new Map( map.set(count, event) ));
            setEvent({name: "", category: "", start: 0, end: 0});
            setCount(count+1);
            // write to database
            let ref = doc(db, `life/${count}`);
            const write = async () => {
                setDoc(ref, event);
                setDoc(doc(db, 'info/count'), {count: count+1});
            }
            write().catch(console.error);
            
        }
    }

    return (
        <Modal show={lifeWindowShow} onHide={() => setLifeWindowShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Log an activity you did...</Modal.Title>
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
                    <select id="start"
                        onChange={(e) => setEvent({...event, start: e.target.value})}
                    >
                        <option value={0} key={0}>0</option>
                        {[...Array(23).keys()].map(i => (
                            <option value={i+1} key={i+1}>{i+1}</option>
                        ))}
                    </select>
                </div>

                <div className="my-row">
                    <label>End: </label>
                    <select id="end"
                        onChange={(e) => setEvent({...event, end: e.target.value})}
                    >
                        <option value={+event.start + 1} key={0}>{+event.start + 1}</option>
                        {[...Array(23 - event.start).keys()].map(i => (
                            <option value={+event.start + i + 2} key={i}>{+event.start + i + 2}</option>
                        ))}
                    </select>
                </div>
                
                <button onClick={addEvent} id="add-event">Add Event</button>

            </div>
        </Modal>
    );
}

export default NewLife;