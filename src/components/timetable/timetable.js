import './timetable.css';
import { ColourTheme, db } from '../../App';
import Event from './event';
import Info from './info';
import Create from './create';
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
    // Info has the form {index, event, type, colour}
    const [info, setInfo] = useState({colour: "fff", event: {category: ""}});

    const [newEventWindow, setNewEventWindow] = useState(false);
    const [newEventType, setNewEventType] = useState("plan");
    
    const [lines, setLines] = useState(true);

    const TIMETABLE_HEIGHT = 288 * 8 + 287 * 1;
    // All times given in terms of the number of seconds that have passed since 00:00 that day
    const SECS_PER_DAY = 60 * 60 * 24; 
    const timeToHeight = (time) => time / SECS_PER_DAY * TIMETABLE_HEIGHT;
    const [timeNow, setTimeNow] = useState(new Date().getHours() * 3600 + new Date().getMinutes() * 60);
    const bar = useRef(null);

    useEffect(() => {
        bar.current.scrollIntoView({behavior: "smooth", block: "center"});

        // Update time and move bar downwards every minute
        const updateTime = setInterval(() => {
            const date = new Date();
            setTimeNow(date.getHours() * 3600 + date.getMinutes() * 60);
        }, 60000);
        return () => clearInterval(updateTime);
    }, []);
    
    const renderTimeSlots = () => {
        const array = [];
        for (let i=0; i<96; i++) {
            const band = (i%8 > 3) ? 'light' : 'dark'
            const rowStart = 3 * i + 1;
            const rowEnd = 3 * i + 4;
            array.push(
                <div className={`time-slot-${band}`} key={`t${i}`}
                    style={{gridArea: `${rowStart} / 1 / ${rowEnd} / 2`}}>
                    <span>{i%4===0 ? (i<40 ? `0${i/4} : 00` : `${i/4} : 00`) : ""}</span>
                </div>,
                <div className={`life-slot-${band}`} key={`l${i}`}
                    style={{gridArea: `${rowStart} / 2 / ${rowEnd} / 3`}}>
                </div>,
                <div className={`plan-slot-${band}`} key={`p${i}`}
                    style={{gridArea: `${rowStart} / 3 / ${rowEnd} / 4`}}>
                </div>
            );
        }
        return array;
    }

    const renderCurrentEvent = () => {
        const nearestSlot = Math.round(current.start / 300);
        const error = current.start - nearestSlot * 300;
        const duration = timeNow - current.start;
        return (
            <div id="current"
                style={{gridRowStart: nearestSlot + 1,
                    top: timeToHeight(error),
                    height: Math.max(timeToHeight(duration), 0),
                    background: '#' + categories.get(current.category)
                }}
            >
                <div className="event-highlighter"></div>
                {duration >= 10
                    ? <EditText onSave={editName} inputClassName="current-name" placeholder="Event name"/>
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

    // Function passed to Event component
    const handle = async (action, type, index) => {
        switch (action) {
            case "delete":
                if (type==="life" && lifeEvents.get(index).hasOwnProperty("parent")) {
                    updateEvent(lifeEvents.get(index).parent, {copied: false}, "plan");
                }
                deleteEvent(index, type);
                break;
            case "open":
                const event = type==="plan" ? planEvents.get(index) : lifeEvents.get(index);
                const colour = categories.get(event.category);
                setInfo({index: index, event: event, type: type, colour: colour});
                setInfoWindow(true);
                break;
            case "copy":
                const copy = Object.assign({}, planEvents.get(index));
                const {copied, ...lifeEvent} = {...copy, parent: index};
                addEvent(lifeEvent, "life");
                updateEvent(index, {copied: true}, "plan");
                break;
            default:
                console.log("this shouldn't happen");
        }
    }

    // Functions to edit event maps and database
    const addEvent = async (event, type) => {
        event.date = date;

        const setEvents = type==="plan" ? setPlanEvents : setLifeEvents;
        setEvents(map => new Map(map.set(count, event)));
        await setDoc(doc(db, type, count.toString()), event);

        setCount(count => count+1);
        await updateDoc(doc(db, "info/count"), {count: count+1});
    }

    const updateEvent = async (index, properties, type) => {
        const events = type==="plan" ? planEvents : lifeEvents;
        Object.assign(events.get(index), properties);
        await updateDoc(doc(db, type, index.toString()), properties);
    }

    const deleteEvent = async (index, type) => {
        const setEvents = type==="plan" ? setPlanEvents : setLifeEvents;
        setEvents(map => {
            map.delete(index);
            return new Map(map);
        });
        await deleteDoc(doc(db, type, index.toString()));
    }

    return (
        <div className="timetable">
            <div className="timetable-heading">
                <Button 
                    variant={theme === "light" ? "outline-dark" : "outline-light"} 
                    id="toggle-lines"
                    onClick={() => setLines(!lines)}
                >
                    Toggle lines
                </Button>
                <div>
                    Your Life
                    <img className="add" src={require("./assets/plus.png")} alt="log a real event"
                        onClick={() => {setNewEventType("life"); setNewEventWindow(true);}} 
                    />
                </div>
                <div>
                    Your Plan
                    <img className="add" src={require("./assets/plus.png")} alt="plan an event"
                        onClick={() => {setNewEventType("plan"); setNewEventWindow(true);}} 
                    />
                </div>
            </div>
            <div className="timetable-body">
                {renderTimeSlots()}
                
                {Array.from(lifeEvents).map(([index, event]) => (
                    <Event index={index} event={event} type="life"
                        colour={categories.get(event.category)}
                        isActive={event.start <= timeNow && event.end >= timeNow}
                        handle={handle}
                    />
                ))}

                {Array.from(planEvents).map(([index, event]) => (
                    <Event index={index} event={event} type="plan"
                        colour={categories.get(event.category)}
                        isActive={event.start <= timeNow && event.end >= timeNow}
                        handle={handle}
                    />
                ))}

                {current.isRunning && current.isIncreasing ? renderCurrentEvent() : ""}

                {lines ? renderLines() : ""}

                <div id="now" ref={bar} style={{top: timeToHeight(timeNow) + 'px'}}></div>
            </div>

            <Info 
                visibility={infoWindow} setVisibility={setInfoWindow}
                info={info} 
                updateEvent={updateEvent}
            />

            <Create 
                visibility={newEventWindow} setVisibility={setNewEventWindow}
                categories={categories}
                type={newEventType}
                addEvent={addEvent}
            />
        </div>
    )
}

export default Timetable;