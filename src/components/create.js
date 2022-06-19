import './create.css';
import { Modal } from 'react-bootstrap';
import { getFirestore, doc, collection, setDoc, deleteDoc, getDoc, getDocs } from "firebase/firestore";
import { ColourContext, EventConverter, db } from '../App';
import { useState, useContext } from 'react';
import React from 'react';

function Create({
        windowVisibility, setWindowVisibility, categories, setCategories,
        planEvents, setPlanEvents, event, setEvent, count, setCount
}) {
    const closeWindow = () => {
        setWindowVisibility(false);
    }

    const addEvent = () => {
        if (event.name !== "" && +event.end > +event.start) {
            setPlanEvents([...planEvents, {...event, index: count}]);
            setEvent({name: "", category: "", start: 0, end: 0});
            console.log(`name: ${event.name} category: ${event.category} start: ${event.start} end: ${event.end} `);
            setCount(count+1);
            // write to database
            let ref = doc(db, `plan/${count}`).withConverter(EventConverter);
            const write = async () => {
                setDoc(ref, {...event, index: count});
                setDoc(doc(db, 'info/count'), {count: count+1});
            }
            write().catch(console.error);
            
        }
    }

    const addNewCategory = () => {
        if (newCategory[0] !== "") {
            setCategories([...categories, newCategory]);
            setNewCategory(["", 0]);
        }
    }

    const selectColour = (index) => {
        setNewCategory([newCategory[0], index]);
        setActiveIndex(index);
    }

    const [newCategory, setNewCategory] = useState(["", 0]);
    const [activeIndex, setActiveIndex] = useState(0);

    const colours = useContext(ColourContext);

    return (
        <Modal show={windowVisibility} onHide={closeWindow}>
            <Modal.Header closeButton>
                <Modal.Title>Create New Activity</Modal.Title>
            </Modal.Header>

            <div className="form">
                <div className="my-row" key="name">
                    <label>Name: </label>
                    <input type="text" id="name" value={event.name}
                        onChange={(e) => setEvent({...event, name: e.target.value}) } 
                    />
                </div>

                <div className="my-row" key="category">
                    <label>Category: </label>
                    <select id="category"
                        onChange={(e) => setEvent({...event, category: e.target.value})}
                    >
                        {React.Children.toArray(categories.map((cat) => (
                            <option value={cat[0]}>{cat[0]}</option>
                        )))}
                    </select>
                </div>

                <div className="my-row" key="start">
                    <label>Start: </label>
                    <input type="number" id="start" value={event.start} min="0" max="23"
                        onChange={(e) => setEvent({...event, start: e.target.value}) } 
                    />
                </div>

                <div className="my-row" key="end">
                    <label>End: </label>
                    <input type="number" id="end" value={event.end} min={+event.start + 1} max="24"
                        onChange={(e) => setEvent({...event,end: e.target.value}) } 
                    />
                </div>
                
                <button onClick={addEvent} id="add-event">Add Event</button>

                <hr />

                <label className="new-category-label">Create New Category</label>

                <div className="my-row colours" key="colors">
                    <label>Colour: </label>
                    {React.Children.toArray(colours.map((col, index) => (
                        <div className={`colour ${activeIndex===index ? "selected" : ""}`} 
                            style={{background: '#' + col}}
                            onClick={() => selectColour(index)}>
                        </div>
                    )))}
                </div>
                
                <div className="my-row" key="new_name">
                    <label>Name: </label>
                    <input type="text" value={newCategory[0]}
                        onChange={(e) => setNewCategory([e.target.value, newCategory[1]]) } 
                    />
                </div>
                
                <button onClick={addNewCategory}>Add Category</button>
                
            </div>
        </Modal>
    );
}

export default Create;