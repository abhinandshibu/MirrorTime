import './category-group.css';
import { DisabledCategory, IdleCategory, StopwatchCategory, TimerCategory } from './category';
import { db } from '../../App';
import { Current } from '../../pages/home/home';
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import { useState, useContext } from 'react';
import { doc, updateDoc } from 'firebase/firestore';

export function CategoryGroup({name, colour, stopAndSave, categories}) {
    const [current, _] = useContext(Current);
    
    return (
        <div className="category-group">
            {current.isRunning
                ? current.category === name
                    ? current.isIncreasing
                        ? <StopwatchCategory name={name} colour={colour} stopAndSave={stopAndSave} />
                        : <TimerCategory name={name} colour={colour} stopAndSave={stopAndSave} />
                    : <DisabledCategory name={name} colour={colour} />
                : <IdleCategory name={name} colour={colour} />
            }
            <NewSubcategory parentName={name} colour={colour} categories={categories} />
        </div>
    );
}

function NewSubcategory({parentName, colour, categories}) {
    const [editing, setEditing] = useState(false);

    const addSubcategory = async ({name, value, previousValue}) => {
        if (value !== "") {
            console.log("fired!");
            // // for now, give it the same colour as parent
            // categories.get(parentName).subs.set(value, colour);
            // updateDoc(doc(db, `categories/${parentName}`), {[`subs.${value}`]: colour});
        }
        setEditing(false);
    }

    return (
        <div className="new-subcategory subcategory-container">
            <div className="elbow-connector"></div>
            {editing
                ? <EditText onSave={addSubcategory} />
                : <div className="plus" onClick={() => setEditing(true)}>+</div>
            }
        </div>
    );
}