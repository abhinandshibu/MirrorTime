import './timetable.css';
import { db, months } from '../../App';
import { doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";

function Timetable({
    setPlanWindowShow, setLifeWindowShow, planEvents, setPlanEvents, 
    lifeEvents, setLifeEvents, count, setCount, categories, date
}) {
    
    const renderTimeSlots = () => {
        const array = [];
        for (let i=0; i<96; i++) {
            let colour = (i%8 > 3) ? "white" : "#f0ffff";
            array.push(
                <div className={`time-slot ${i}`} key={`t${i}`}
                    style={{gridArea: `${3*i+1} / 1 / ${3*i+4} / 2`, background: colour}}>
                    <span>{i%4===0 ? (i<40 ? `0${i/4} : 00` : `${i/4} : 00`) : ""}</span>
                </div>,
                <div className={`life-slot ${i}`} key={`l${i}`}
                    style={{gridArea: `${3*i+1} / 2 / ${3*i+4} / 3`, background: colour}}>
                </div>,
                <div className={`plan-slot ${i}`} key={`p${i}`}
                    style={{gridArea: `${3*i+1} / 3 / ${3*i+4} / 4`, background: colour}}>
                </div>
            );
        }
        return array;
    }

    const renderEvents = () => {
        const array = [];
        for (const [index, event] of planEvents.entries()) {
            array.push(
                <div className="event" key={index}
                    style={{gridArea: `${event.start/300 + 1} / 3 / ${event.end/300 + 1} / 4`, 
                            background: '#' + categories.get(event.category)}}
                >
                    <img className="delete" src={require("./delete.png")} alt="delete event"
                        onClick={() => deletePlanEvent(index)} 
                    />
                    {event.name}
                    <button className={`copy ${event.copied ? "hidden" : ""}`} 
                        onClick={() => copyToLife(index, event)}
                    >
                        Copy to Life
                    </button>
                </div>
            );
        }
        for (const [index, event] of lifeEvents.entries()) {
            array.push(
                <div className="event" key={index}
                    style={{gridArea: `${event.start/300 + 1} / 2 / ${event.end/300 + 1} / 3`, 
                            background: '#' + categories.get(event.category)}}
                >
                    <img className="delete" src={require("./delete.png")} alt="delete event"
                        onClick={() => deleteLifeEvent(index, event)} 
                    />
                    {event.name}
                </div>
            );
        }
        return array;
    }

    const deletePlanEvent = async (index) => {
        setPlanEvents(map => {
            map.delete(index);
            return new Map(map);
        });
        await deleteDoc(doc(db, "plan", index.toString()));
    }

    const deleteLifeEvent = async (index, event) => {
        setLifeEvents(map => {
            map.delete(index);
            return new Map(map);
        });
        await deleteDoc(doc(db, "life", index.toString()));

        if (event.hasOwnProperty("parent")) {
            const id = event.parent;
            const parentEvent = planEvents.get(id);
            setPlanEvents( map => new Map(map.set(id, {...parentEvent, copied: false})) );
            await updateDoc(doc(db, "plan", id.toString()), {copied: false});
        }
    }

    const copyToLife = async (index, event) => {
        event.copied = true;

        const lifeEvent = {name: event.name, category: event.category, date: date,
            start: event.start, end: event.end, parent: index};
        setLifeEvents(map => new Map(map.set(count, lifeEvent)));
        setCount(count+1);

        // write to database
        await updateDoc(doc(db, "plan", index.toString()), {copied: true});
        await setDoc(doc(db, `life/${count}`), lifeEvent);
        await setDoc(doc(db, 'info/count'), {count: count+1});
    }

    return (
        <div className="timetable">
            <div className="today">{date.date} {months[date.month]} {date.year}</div>
            <div className="timetable-heading">
                <div></div>
                <div>
                    Your Life
                    <img className="add" src={require("./plus.png")} alt="log a real event"
                        onClick={() => setLifeWindowShow(true)} 
                    />
                </div>
                <div>
                    Your Plan
                    <img className="add" src={require("./plus.png")} alt="plan an event"
                        onClick={() => setPlanWindowShow(true)} 
                    />
                </div>
            </div>
            <div className="timetable-body">
                {renderTimeSlots()}
                
                {renderEvents()}
            </div>
        </div>
    )
}

export default Timetable;