import './timetable.css';
import { ColourTheme, db } from '../../App';
import Info from './info';
import NewPlan from './create/new-plan';
import NewLife from './create/new-life';
import { doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { React, useEffect, useState, useRef, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';

function Timetable({
    planEvents, setPlanEvents, lifeEvents, setLifeEvents, 
    count, setCount, categories, date, current, setCurrent
}) {

    const theme = useContext(ColourTheme);

    const [infoWindow, setInfoWindow] = useState(false);
    const [planWindow, setPlanWindow] = useState(false);
    const [lifeWindow, setLifeWindow] = useState(false);

    const [info, setInfo] = useState({index: 0, isPlan: true, start: 0, end: 3600, name: "", category: "", colour: "ffffff"});
    const [lines, setLines] = useState(true);
    const timetableHeight = 288 * 8 + 287 * 1;
    const [barProgress, setBarProgress] = useState((new Date().getHours()/24 + new Date().getMinutes()/1440) * timetableHeight);
    const bar = useRef(null);

    useEffect(() => {
        bar.current.scrollIntoView({behavior: "smooth", block: "center"});

        const updateTime = setInterval(() => {
            const date = new Date();
            setBarProgress((date.getHours()/24 + date.getMinutes()/1440) * timetableHeight);
        }, 60000);
        return () => clearInterval(updateTime);
    }, []);
    
    const renderTimeSlots = () => {
        const array = [];
        for (let i=0; i<96; i++) {
            let colour = (i%8 > 3) ? "var(--light-slot)" : "var(--dark-slot)";
            let colour2 = (i%8 > 3) ? "var(--light-slot-2)" : "var(--dark-slot-2)";
            array.push(
                <div className={`time-slot ${i}`} key={`t${i}`}
                    style={{gridArea: `${3*i+1} / 1 / ${3*i+4} / 2`, background: colour}}>
                    <span>{i%4===0 ? (i<40 ? `0${i/4} : 00` : `${i/4} : 00`) : ""}</span>
                </div>,
                <div className={`life-slot ${i}`} key={`l${i}`}
                    style={{gridArea: `${3*i+1} / 2 / ${3*i+4} / 3`, background: colour2}}>
                </div>,
                <div className={`plan-slot ${i}`} key={`p${i}`}
                    style={{gridArea: `${3*i+1} / 3 / ${3*i+4} / 4`, background: colour}}>
                </div>
            );
        }
        return array;
    }

    const renderEvents = () => {
        const timeNow = barProgress / timetableHeight * 86400;
        const array = [];

        // Render events in Your Plan
        for (const [index, event] of planEvents.entries()) {
            
            let active = false;
            if (event.start <= timeNow && event.end >= timeNow) {
                active = true;
            }
            const colour = categories.get(event.category);

            array.push(
                <div className="event" key={index}
                    style={{gridArea: `${Math.round(event.start/300) + 1} / 3 / ${Math.round(event.end/300) + 1} / 4`, 
                            background: active ? `repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255, 255, 255, 0.3) 3px, rgba(255, 255, 255, 0.3) 6px), #${colour}` 
                                : '#' + colour,
                            border: active ? `2px solid black` : "none"}}
                    onClick={() => expandEvent(index, true)}
                >
                    <img className="delete" src={require("./assets/delete.png")} alt="delete event"
                        onClick={(e) => {e.stopPropagation(); deletePlanEvent(index)}} 
                    />
                    {/* <img className="info" src={require("./assets/info.png")} alt="expand event information"
                        onClick={() => expandEvent(index, true)} 
                    /> */}
                    {event.copied ? 
                        <img className="copied" src={require("./assets/ticked.png")} alt="event copied to life"/>
                        : 
                        <img className="copy" src={require("./assets/unticked.png")} alt="delete event"
                        onClick={(e) => {e.stopPropagation(); copyToLife(index, event)}} 
                        />
                    }
                    {event.name}
                    {/* <EditText 
                        name={index.toString()} defaultValue={event.name} 
                        inputClassName="title" onSave={editName}
                    /> */}
                </div>
            );
        }

        // Render events in Your Life
        for (const [index, event] of lifeEvents.entries()) {
            let active = false;
            if (event.start <= timeNow && event.end >= timeNow) {
                active = true;
            }
            const colour = categories.get(event.category);

            array.push(
                <div className="event" key={index}
                    style={{gridArea: `${Math.round(event.start/300) + 1} / 2 / ${Math.round(event.end/300) + 1} / 3`, 
                            background: active ? `repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255, 255, 255, 0.3) 3px, rgba(255, 255, 255, 0.3) 6px), #${colour}` 
                                : '#' + colour,
                            border: active ? `2px solid black` : "none"}}
                    onClick={() => expandEvent(index, false)}
                >
                    <img className="delete" src={require("./assets/delete.png")} alt="delete event"
                        onClick={(e) => {e.stopPropagation(); deleteLifeEvent(index, event)}} 
                    />
                    {/* <img className="info" src={require("./assets/info.png")} alt="expand event information"
                        onClick={() => expandEvent(index, false)} 
                    /> */}
                    {/* <EditText 
                        name={index.toString()} defaultValue={event.name} 
                        inputClassName="title" onSave={editName}
                    /> */}
                    {event.name}
                </div>
            );
        }
        return array;
    }

    const renderCurrentEvent = () => {
        const nearestSlot = Math.round(current.start / 300);
        const error = current.start - nearestSlot * 300;
        const height = Math.max(0, barProgress - current.start / 86400 * timetableHeight)
        return (
            <div id="current"
                style={{gridRowStart: nearestSlot + 1,
                    top: error / 86400 * timetableHeight,
                    height: height,
                    background: `repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255, 255, 255, 0.3) 3px, rgba(255, 255, 255, 0.3) 6px), #${categories.get(current.category)}`
                }}
            >
                {
                    height >= 16 ?
                    <EditText onSave={editName} inputClassName="current-name" placeholder="Event name"/>
                    : ""
                }
            </div>
        )
    }

    const editName = async ({name, value, previousValue}) => {
        setCurrent({...current, name: value});
        await updateDoc(doc(db, "info", "current"), {name: value});
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
        if (current.isRunning && !current.isIncreasing && index === current.index) {
            setCurrent({isRunning: false});
        }

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

    const expandEvent = (index, isPlanEvent) => {
        const event = isPlanEvent ? planEvents.get(index) : lifeEvents.get(index);
        setInfo({index: index, isPlan: isPlanEvent, start: event.start, end: event.end, 
            name: event.name, category: event.category, colour: categories.get(event.category),
            description: event.description});
        setInfoWindow(true);
    }

    // const editName = async ({name, value, previousValue}) => {
    //     if (planEvents.has(+name)) {
    //         const event = planEvents.get(+name);
    //         setPlanEvents(map => new Map( map.set(+name, {...event, name: value}) ));
    //         await updateDoc(doc(db, "plan", name), {name: value});
    //     } else {
    //         const event = lifeEvents.get(+name);
    //         setLifeEvents(map => new Map( map.set(+name, {...event, name: value}) ));
    //         await updateDoc(doc(db, "life", name), {name: value});
    //     }
    // }

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
            <div className="timetable-heading">
                <div id="button-toggle-lines">
                    <Button 
                        variant={theme === "light" ? "outline-dark" : "outline-light"} 
                        id="toggle-lines"
                        onClick={() => setLines(!lines)}
                    >
                        Toggle lines
                    </Button>
                </div>
                <div>
                    Your Life
                    <img className="add" src={require("./assets/plus.png")} alt="log a real event"
                        onClick={() => setLifeWindow(true)} 
                    />
                </div>
                <div>
                    Your Plan
                    <img className="add" src={require("./assets/plus.png")} alt="plan an event"
                        onClick={() => setPlanWindow(true)} 
                    />
                </div>
            </div>
            <div className="timetable-body">
                {renderTimeSlots()}
                
                {renderEvents()}

                {current.isRunning && current.isIncreasing ? renderCurrentEvent() : ""}

                {lines ? renderLines() : ""}

                <div id="now" ref={bar} style={{top: barProgress + 'px'}}></div>
            </div>

            <Info 
                infoWindow={infoWindow} setInfoWindow={setInfoWindow}
                events={info.isPlan ? planEvents : lifeEvents} 
                setEvents={info.isPlan ? setPlanEvents : setLifeEvents}
                info={info}
            />

            <NewPlan 
                planWindow={planWindow} setPlanWindow={setPlanWindow}
                categories={categories}
                setPlanEvents={setPlanEvents}
                count={count} setCount={setCount}
                date={date}
            />

            <NewLife 
                lifeWindow={lifeWindow} setLifeWindow={setLifeWindow}
                categories={categories}
                setLifeEvents={setLifeEvents}
                count={count} setCount={setCount}
                date={date}
            />
        </div>
    )
}

export default Timetable;