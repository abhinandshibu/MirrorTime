import './timetable.css';
import { db, months } from '../../App';
import Edit from './edit';
import { doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';

function Timetable({
    setPlanWindowShow, setLifeWindowShow, planEvents, setPlanEvents, 
    lifeEvents, setLifeEvents, count, setCount, categories, date, currentEvent, isRunning
}) {

    const [editWindowShow, setEditWindowShow] = useState(false);
    const [isPlan, setIsPlan] = useState(true);
    const [index, setIndex] = useState(0);
    const [times, setTimes] = useState([0, 3600]);
    const [lines, setLines] = useState(true);
    const [barProgress, setBarProgress] = useState(0);
    const timetableHeight = 288 * 8 + 287 * 0.5;

    useEffect(() => {
        const date = new Date();
        setBarProgress((date.getHours()/24 + date.getMinutes()/1440) * timetableHeight);

        const updateTime = setInterval(() => {
            const date = new Date();
            setBarProgress((date.getHours()/24 + date.getMinutes()/1440) * timetableHeight);
        }, 60000);
        return () => clearInterval(updateTime);
    }, []);

    useEffect(() => {
        if (!isRunning) {

        }
    }, [isRunning])
    
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
                    style={{gridArea: `${Math.round(event.start/300) + 1} / 3 / ${Math.round(event.end/300) + 1} / 4`, 
                            background: '#' + categories.get(event.category)}}
                >
                    <img className="delete" src={require("./delete.png")} alt="delete event"
                        onClick={() => deletePlanEvent(index)} 
                    />
                    <img className="edit" src={require("./edit.png")} alt="edit event"
                        onClick={() => editEvent(index, true)} 
                    />
                    {event.name}
                    {event.copied ? "" : 
                        <button className="copy" onClick={() => copyToLife(index, event)}>
                            Copy to Life
                        </button>
                    }
                </div>
            );
        }
        for (const [index, event] of lifeEvents.entries()) {
            array.push(
                <div className="event" key={index}
                    style={{gridArea: `${Math.round(event.start/300) + 1} / 2 / ${Math.round(event.end/300) + 1} / 3`, 
                            background: '#' + categories.get(event.category)}}
                >
                    <img className="delete" src={require("./delete.png")} alt="delete event"
                        onClick={() => deleteLifeEvent(index, event)} 
                    />
                    <img className="edit" src={require("./edit.png")} alt="edit event"
                        onClick={() => editEvent(index, false)} 
                    />
                    {event.name}
                </div>
            );
        }
        return array;
    }

    const renderCurrentEvent = () => {
        const nearestSlot = Math.round(currentEvent.start / 300);
        const error = currentEvent.start - nearestSlot * 300;
        return <div id="current"
            style={{gridRowStart: nearestSlot + 1,
                top: error / 86400 * timetableHeight,
                height: barProgress - currentEvent.start / 86400 * timetableHeight,
                background: '#' + categories.get(currentEvent.category)}}
        ></div>
    }

    const renderLines = () => {
        const array = [];
        for (let i=0; i<24; i++) {
            array.push(
                <div className="hour-line" key={i}
                    style={{gridArea: `${i*12 + 1} / 1 / ${i*12 + 2} / 4`}}
                ></div>
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

    const editEvent = (index, isPlanEvent) => {
        setIndex(index);
        setIsPlan(isPlanEvent);
        const event = isPlanEvent ? planEvents.get(index) : lifeEvents.get(index);
        setTimes([event.start, event.end]); console.log(event.start, event.end);
        setEditWindowShow(true);
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
            <button id="toggle-lines" onClick={() => setLines(!lines)}>Toggle lines</button>
            <div id="today">{date.date} {months[date.month]} {date.year}</div>
            <div className="timetable-heading">
                <div> </div>
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

                {isRunning ? renderCurrentEvent() : ""}

                {lines ? renderLines() : ""}

                <div id="now" style={{top: barProgress + 'px'}}></div>
            </div>

            <Edit 
                editWindowShow={editWindowShow} setEditWindowShow={setEditWindowShow}
                events={isPlan ? planEvents : lifeEvents} 
                setEvents={isPlan ? setPlanEvents : setLifeEvents}
                isPlan={isPlan}
                index={index} times={times}
            />
        </div>
    )
}

export default Timetable;