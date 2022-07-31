import './category-group.css';
import { db } from '../../../App';
import { Current } from '../home';
import { Category, IdleCategory, StopwatchCategory, TimerCategory } from './category';

import { doc, updateDoc } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';

export function CategoryGroup({mainID, mainCategory, stopAndSave, setCategories}) {
    const [current, _] = useContext(Current);
    const [expanded, setExpanded] = useState(true);
    const status = current.isRunning
        ? current.category[0] === mainID
            ? current.isIncreasing
                ? current.category[1] === 0 ? "stopwatch-main" : "stopwatch-sub"
                : current.category[1] === 0 ? "timer-main" : "timer-sub"
            : "disabled"
        : "idle";

    const renderMain = () => {
        const info = {name: mainCategory.name, colour: mainCategory.colour, level: "main"};
        switch (status) {
            case "stopwatch-main":
                return <StopwatchCategory info={info} stopAndSave={stopAndSave} />;
            case "timer-main":
                return <TimerCategory info={info} stopAndSave={stopAndSave} />;
            case "idle":
                return <IdleCategory info={info} id={[mainID, 0]} />;
            default:
                return <Category info={info} />;
        }
    }

    const renderSubs = (subID, subcategory) => {
        const info = {name: subcategory.name, colour: subcategory.colour, level: "sub"};
        switch (status) {
            case "stopwatch-sub":
                return current.category[1]===subID
                    ? <StopwatchCategory info={info} stopAndSave={stopAndSave} />
                    : <Category info={info} />;

            case "timer-sub":
                return current.category[1]===subID
                    ? <TimerCategory info={info} stopAndSave={stopAndSave} />
                    : <Category info={info} />;

            case "idle":
                return <IdleCategory info={info} id={[mainID, subID]} />;

            default:
                return <Category info={info} />;
        }
    }
    
    return (
        <div className="category-group">
            {renderMain()}
            {expanded
                ? <img className="toggle-category" src={require("./assets/show-less.png")}
                    title="Collapse category" alt="Collapse category"
                    onClick={() => setExpanded(false)} />
                : <img className="toggle-category" src={require("./assets/show-more.png")}
                    title="Expand category" alt="Expand category"
                    onClick={() => setExpanded(true)} />
            }
            {expanded 
                ? Array.from(mainCategory.subs).map(([subID, subcategory]) => (
                    <div className="subcategory-container" key={subID}>
                        <div className="t-connector"></div>
                        {renderSubs(subID, subcategory)}
                    </div>
                ))
                : ""
            }
            {expanded
                ? <NewSubcategory mainID={mainID} mainCategory={mainCategory} 
                    setCategories={setCategories} />
                : ""
            }
        </div>
    );
}

function NewSubcategory({mainID, mainCategory, setCategories}) {
    const [name, setName] = useState("");

    const addSubcategory = async () => {
        if (name === "")
            return;

        const {colour, subs, count} = mainCategory;
        // for now, give it the same colour as parent
        const newSub = {name: name, colour: colour}
        const updatedSubs = new Map( subs.set(count, newSub) );
        const updatedMain = {...mainCategory, count: count+1, subs: updatedSubs};
        setCategories(old => new Map( old.set(mainID, updatedMain) ));

        updateDoc(doc(db, `categories/${mainID}`), {[`subs.${count}`]: newSub, count: count+1});
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