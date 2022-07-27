import './category-group.css';
import { Category, IdleCategory, StopwatchCategory, TimerCategory } from './category';
import { db } from '../../App';
import { Current } from '../../pages/home/home';
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import { useContext, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';

export function CategoryGroup({group, subs, colour, isExpanded, stopAndSave, setCategories}) {
    const [current, _] = useContext(Current);
    const [expanded, setExpanded] = useState(isExpanded);
    const status = current.isRunning
        ? current.category[0] === group
            ? current.isIncreasing
                ? current.category[1] === null ? "stopwatch-main" : "stopwatch-sub"
                : current.category[1] === null ? "timer-main" : "timer-sub"
            : "disabled"
        : "idle";

    const renderMain = () => {
        const info = {group: group, name: null, colour: colour, level: "main", toggle: toggle};
        switch (status) {
            case "stopwatch-main":
                return <StopwatchCategory info={info} stopAndSave={stopAndSave} />;
            case "timer-main":
                return <TimerCategory info={info} stopAndSave={stopAndSave} />;
            case "idle":
                return <IdleCategory info={info} key={group} />;
            default:
                return <Category info={info} key={group} />;
        }
    }

    const renderSubs = (name, colour) => {
        const info = {group: group, name: name, colour: colour, level: "sub"};
        switch (status) {
            case "stopwatch-sub":
                return current.category[1]===name
                    ? <StopwatchCategory info={info} stopAndSave={stopAndSave} />
                    : <Category info={info} key={name} />;

            case "timer-sub":
                return current.category[1]===name
                    ? <TimerCategory info={info} stopAndSave={stopAndSave} />
                    : <Category info={info} key={name} />;

            case "idle":
                return <IdleCategory info={info} key={name} />;

            default:
                return <Category info={info} key={name} />;
        }
    }

    const toggle = () => {
        setExpanded(!expanded);
        updateDoc(doc(db, `categories/${group}`), {expanded: !expanded});
    }
    
    return (
        <div className="category-group">
            {renderMain()}
            {expanded 
                ? Array.from(subs).map(([name, colour]) => (
                    <div className="subcategory-container" key={name}>
                        <div className="t-connector"></div>
                        {renderSubs(name, colour)}
                    </div>
                ))
                : ""
            }
            {expanded
                ? <NewSubcategory group={group} subs={subs} colour={colour} 
                    setCategories={setCategories} />
                : ""
            }
        </div>
    );
}

function NewSubcategory({group, subs, colour, setCategories}) {
    const [name, setName] = useState("");

    const addSubcategory = async () => {
        if (name === "" || subs.has(name))
            return;

        // for now, give it the same colour as parent
        setCategories(old => {
            const newSubs = new Map( subs.set(name, colour) );
            return new Map( old.set(group, {colour: colour, subs: newSubs}) );
        });
        updateDoc(doc(db, `categories/${group}`), {[`subs.${name}`]: colour});
        setName("");
    }

    return (
        <div className="subcategory-container">
            <div className="elbow-connector" key="elbow"></div>
            <div className="edittext-container" key="edittext">
                <EditText inputClassName="subcategory-edit-text"
                    placeholder="New subcategory" value={name}
                    onBlur={addSubcategory} onChange={(e) => setName(e.target.value)} />
            </div>
        </div>
    );
}