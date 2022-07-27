import './new-category.css';
import { Modal } from 'react-bootstrap';
import { doc, setDoc } from "firebase/firestore";
import { db, ColourTheme } from '../../App';
import { useState, useContext } from 'react';
import { Button } from 'react-bootstrap';

function NewCategory ({visibility, setVisibility, setCategories}) {

    const theme = useContext(ColourTheme);

    const [categoryName, setCategoryName] = useState("");
    const colours = ["f4d1d1", "fc9f9f", "e27d60", "e8c07c", "bee09d", "41b3a3", "9ed9d8", "8282b9", "c38d9e"];
    const [categoryColour, setCategoryColour] = useState(colours[0]);

    const addNewCategory = async () => {
        if (categoryName !== "") {
            setVisibility(false);

            const newEntry = {colour: categoryColour, subs: new Map(), expanded: true};

            setCategories(map => new Map(map.set(categoryName, newEntry)));
            setDoc(doc(db, `categories/${categoryName}`), newEntry);

            setCategoryName("");
            setCategoryColour(colours[0]);
        }
    }

    return (
        <div id="new-category-window">
            <Modal 
                show={visibility} 
                onHide={() => setVisibility(false)}
                contentClassName={"modal-" + theme}
            >
                <Modal.Header closeButton>
                    <Modal.Title>New Category</Modal.Title>
                </Modal.Header>
                
                <div className="modal-body">
                    <div className="modal-row colours">
                        <label>Colour: </label>
                        {colours.map(col => (
                            <div className={`colour ${categoryColour === col ? "selected-colour" : ""}`} 
                                style={{background: '#' + col}}
                                onClick={() => setCategoryColour(col)}
                                key={col}>
                            </div>
                        ))}
                    </div>
                    
                    <div className="modal-row">
                        <label>Name: </label>
                        <input type="text" value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value) } 
                        />
                    </div>
                    
                    <Button 
                        variant={theme === "light" ? "outline-dark" : "outline-light"}
                        onClick={addNewCategory} className="modal-submit"
                    >  
                        Add Category
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

export default NewCategory;