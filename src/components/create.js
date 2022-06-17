import './create.css';
import { Modal } from 'react-bootstrap';
import { ColourContext } from '../App';
import { useState, useContext } from 'react';


function Create({
        windowVisibility, setWindowVisibility, categories, setCategories,
        eventList, setEventList, event, setEvent
}) {
    const closeWindow = () => {
        setWindowVisibility(false);
    }

    const addEvent = () => {
        if (event.name !== "" && +event.end > +event.start) {
            setEventList([...eventList, event]);
            setEvent({name: "", category: "", start: 0, end: 0});
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

            <div class="form">
                <div class="my-row">
                    <label>Name: </label>
                    <input type="text" id="name" value={event.name}
                        onChange={(e) => setEvent({...event, name: e.target.value}) } 
                    />
                </div>

                <div class="my-row">
                    <label>Category: </label>
                    <select id="category"
                        onChange={(e) => setEvent({...event, category: e.target.value})}
                    >
                        {categories.map((cat) => (
                            <option value={cat[0]}>{cat[0]}</option>
                        ))}
                    </select>
                </div>

                <div class="my-row">
                    <label>Start: </label>
                    <input type="number" id="start" value={event.start} min="0" max="23"
                        onChange={(e) => setEvent({...event, start: e.target.value}) } 
                    />
                </div>

                <div class="my-row">
                    <label>End: </label>
                    <input type="number" id="end" value={event.end} min={+event.start + 1} max="24"
                        onChange={(e) => setEvent({...event,end: e.target.value}) } 
                    />
                </div>
                
                <button onClick={addEvent} id="add-event">Add Event</button>

                <hr />

                <label class="new-category-label">Create New Category</label>

                <div class="my-row colours">
                    <label>Colour: </label>
                    {colours.map((col, index) => (
                        <div class={`colour ${activeIndex===index ? "selected" : ""}`} 
                            style={{background: '#' + col}}
                            onClick={() => selectColour(index)}>
                        </div>
                    ))}
                </div>
                
                <div class="my-row">
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