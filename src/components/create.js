import './create.css';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';


function Create({
        windowVisibility, setWindowVisibility, categories, setCategories,
        eventList, setEventList, event, setEvent
}) {
    const closeWindow = () => {
        setWindowVisibility(false);
    }

    const addEvent = () => {
        setEventList([...eventList, event]);
        setEvent({name: "", category: "", start: 0, end: 0});
        console.log(`name: ${event.name}, category: ${event.category}, start: ${event.start}, end: ${event.end}`);
    }

    const [newCategory, setNewCategory] = useState("");

    return (
        <Modal show={windowVisibility} onHide={closeWindow}>
            <Modal.Header closeButton>
                <Modal.Title>Add Activity</Modal.Title>
            </Modal.Header>

            <div class="form">
                <div class="field">
                    <label>Name: </label>
                    <input type="text" id="name" value={event.name}
                        onChange={(e) => setEvent({...event, name: e.target.value}) } 
                    />
                </div>

                <div class="field">
                    <label>Category: </label>
                    <select id="category">
                        {categories.map((name) => (
                            <option value={name}>{name}</option>
                        ))}
                    </select>
                </div>

                <div class="field">
                    <label>Start: </label>
                    <input type="number" id="start" value={event.start} min="0" max="23"
                        onChange={(e) => setEvent({...event, start: e.target.value}) } 
                    />
                </div>

                <div class="field">
                    <label>End: </label>
                    <input type="number" id="end" value={event.end} min={event.start + 1} max="24"
                        onChange={(e) => setEvent({...event,end: e.target.value}) } 
                    />
                </div>
                
                <button onClick={addEvent} id="add-event">Add Event</button>
                
                <div class="field">
                    <input type="text" id="new-category"
                        onChange={(e) => setNewCategory(e.target.value) } 
                    />
                    <button onClick={(e) => setCategories([...categories, newCategory])}>Add New Category</button>
                </div>
            </div>
        </Modal>
    );
}

export default Create;