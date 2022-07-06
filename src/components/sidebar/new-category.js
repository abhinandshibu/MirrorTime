import './new-category.css';
import { Modal } from 'react-bootstrap';
import { doc, setDoc } from "firebase/firestore";
import { db, ColourTheme } from '../../App';
import { useState, useContext } from 'react';
import { Button } from 'react-bootstrap';

function NewCategory ({categoryWindow, setCategoryWindow, setCategories}) {

    const theme = useContext(ColourTheme);

    const [categoryName, setCategoryName] = useState("");
    const colours = ["f4d1d1", "fc9f9f", "e27d60", "e8c07c", "bee09d", "41b3a3", "9ed9d8", "8282b9", "c38d9e"];
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

            setCategoryWindow(false);
        }
    }

    return (
        <div id="new-category-window">
            <Modal 
                show={categoryWindow} 
                onHide={() => setCategoryWindow(false)}
                contentClassName={"modal-" + theme}
            >
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
                    
                    <Button 
                        variant={theme === "light" ? "outline-dark" : "outline-light"}
                        onClick={addNewCategory}
                    >  
                        Add Category
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

export default NewCategory;