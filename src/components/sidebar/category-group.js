import './category-group.css';
import { DisabledCategory, IdleCategory, StopwatchCategory, TimerCategory } from './category';
import { db } from '../../App';
import { Current } from '../../pages/home/home';
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import { useContext, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';

export function CategoryGroup({name, colour, subs, stopAndSave, setCategories}) {
    const [current, _] = useContext(Current);
    const status = current.isRunning
        ? current.category[0] === name
            ? current.isIncreasing
                ? current.category[1] === undefined ? "stopwatch-main" : "stopwatch-sub"
                : current.category[1] === undefined ? "timer-main" : "timer-sub"
            : "disabled"
        : "idle";

    const renderCategory = (name, colour, type) => {
        switch (status) {
            case `stopwatch-${type}`:
                return type==="main" || current.category[1]===name
                    ? <StopwatchCategory name={name} colour={colour} type={type} stopAndSave={stopAndSave} />
                    : <DisabledCategory name={name} colour={colour} type={type} key={name} />;

            case `timer-${type}`:
                return type==="main" || current.category[1]===name
                    ? <TimerCategory name={name} colour={colour} type={type} stopAndSave={stopAndSave} />
                    : <DisabledCategory name={name} colour={colour} type={type} key={name} />;

            case "idle":
                return <IdleCategory name={name} colour={colour} type={type} key={name} />;

            default:
                return <DisabledCategory name={name} colour={colour} type={type} key={name} />;
        }
    }
    
    return (
        <div className="category-group">
            {renderCategory(name, colour, "main")}
            {Array.from(subs).map(([name, colour]) => 
                <div className="subcategory-container" key={name}>
                    <div className="t-connector"></div>
                    {renderCategory(name, colour, "sub")}
                </div>
            )}
            <NewSubcategory parentName={name} colour={colour} subs={subs} setCategories={setCategories} />
        </div>
    );
}

function NewSubcategory({parentName, colour, subs, setCategories}) {
    const [subName, setSubName] = useState("");

    const addSubcategory = async () => {
        if (subName === "" || subName in Array.from(subs.keys()))
            return;
        console.log("got here"); console.log("new name:", subName);
        // for now, give it the same colour as parent
        setCategories(old => {
            const newSubs = new Map( subs.set(subName, colour) );
            return new Map( old.set(parentName, {colour: colour, subs: newSubs}) );
        });
        updateDoc(doc(db, `categories/${parentName}`), {[`subs.${subName}`]: colour});
        setSubName("");
    }

    return (
        <div className="subcategory-container">
            <div className="elbow-connector" key="elbow"></div>
            <div className="edittext-container" key="edittext">
                <EditText inputClassName="subcategory-edit-text"
                    placeholder="New subcategory" value={subName}
                    onBlur={addSubcategory} onChange={(e) => setSubName(e.target.value)} />
            </div>
        </div>
    );
}