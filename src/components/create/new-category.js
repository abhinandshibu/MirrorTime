import './new-category.css';
import { Modal } from 'react-bootstrap';
import { doc, setDoc } from "firebase/firestore";
import { ColourContext, db } from '../../App';
import { useState, useContext } from 'react';
import React from 'react';

function NewCategory ({categoryWindowShow, setCategoryWindowShow, setCategories}) {

    const colours = useContext(ColourContext);
    const [categoryName, setCategoryName] = useState("");
    const [categoryColour, setCategoryColour] = useState(colours[0]);

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

    return (
        <Modal show={categoryWindowShow} onHide={() => setCategoryWindowShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>New Category</Modal.Title>
            </Modal.Header>
            
            <div className="form">
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

export default NewCategory;