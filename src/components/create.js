import './create.css';
import { Modal } from 'react-bootstrap';
import { doc, setDoc } from "firebase/firestore";
import { ColourContext, db } from '../App';
import { EventConverter } from '../pages/home';
import { useState, useContext } from 'react';


function Create({
        windowVisibility, setWindowVisibility, categories, setCategories,
        setPlanEvents, count, setCount
}) {
    const closeWindow = () => {
        setWindowVisibility(false);
    }

    const addEvent = () => {
        if (event.name !== "" && event.category !== "" && +event.end > +event.start) {
            setPlanEvents(map => new Map(map.set(count, event)));
            setEvent({name: "", category: "", start: 0, end: 0});
            setCount(count+1);
            // write to database
            let ref = doc(db, `plan/${count}`).withConverter(EventConverter);
            const write = async () => {
                setDoc(ref, event);
                setDoc(doc(db, 'info/count'), {count: count+1});
            }
            write().catch(console.error);
            
        }
    }

    const addNewCategory = () => {
        if (categoryName !== "") {
            setCategories(map => new Map(map.set(categoryName, categoryColour)));
            // write to database
            let ref = doc(db, `categories/${categoryName}`);
            const write = async () => {
                setDoc(ref, {colour: categoryColour});
            }
            write().catch(console.error);
            setCategoryName("");
            setCategoryColour(colours[0]);
        }
    }

    const colours = useContext(ColourContext);
    const [event, setEvent] = useState({name: "", category: "", start: 0, end: 0});
    const [categoryName, setCategoryName] = useState("");
    const [categoryColour, setCategoryColour] = useState(colours[0]);


    return (
        <Modal show={windowVisibility} onHide={closeWindow}>
            <Modal.Header closeButton>
                <Modal.Title>Create New Activity</Modal.Title>
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

                <hr />

                <label className="new-category-label">Create New Category</label>

                <div className="my-row colours">
                    <label>Colour: </label>
                    {colours.map(col => (
                        <div className={`colour ${categoryColour === col ? "selected" : ""}`} 
                            style={{background: '#' + col}}
                            onClick={() => setCategoryColour(col)}
                            key={col}>
                        </div>
                    ))}
                </div>
                
                <div className="my-row">
                    <label>Name: </label>
                    <input type="text" value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value) } 
                    />
                </div>
                
                <button onClick={addNewCategory}>Add Category</button>
                
            </div>
        </Modal>
    );
}

export default Create;