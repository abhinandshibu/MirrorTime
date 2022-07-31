import './edit-categories.css';
import { db, ColourTheme } from '../../../App';

import { doc, setDoc } from "firebase/firestore";
import { useState, useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';

function EditCategories({visibility, setVisibility, categories, setCategories}) {

    const theme = useContext(ColourTheme);
    const [selected, setSelected] = useState()

    const editGroupName = async ({name, value, previousValue}) => {

    }

    const makeChanges = async () => {

    }

    return (
        <Modal 
            show={visibility} 
            onHide={() => setVisibility(false)}
            contentClassName={"modal-" + theme}
        >
            <Modal.Header closeButton>
                <Modal.Title>Edit category list</Modal.Title>
            </Modal.Header>
            
            <div className="modal-body">
                <div className="ec-category-list">
                    {Array.from(categories).map(([group, value]) => (
                        <>
                            <div className="ec-maincategory"
                                style={{background: `#${value.colour}`}}
                            >
                                <EditText inputClassName="subcategory-edit-text"
                                    name={group} value={group} onSave={editGroupName} />
                            </div>
                            
                            <Subcategories group={group} subs={value.subs} 
                                categories={categories} setCategories={setCategories}
                                setSelected={setSelected} />
                        </>
                    ))}
                </div>

            </div>
        </Modal>
    );
}

export default EditCategories;

function Subcategories({group, subs, categories, setCategories, setSelected}) {
    const editName = async ({name, value, previousValue}) => {
        // setCategories(old => )
    }

    return (
        Array.from(subs).map(([name, colour]) => (
            <div className="ec-subcategory"
                style={{background: `#${colour}`}}
            >
                <EditText inputClassName="subcategory-edit-text"
                    name={name} value={name} onSave={editName} />
            </div>
        ))
    )
}