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
    const [info, setInfo] = useState({index: 0, isPlan: true, start: 0, end: 3600, name: "", category: "", colour: "ffffff"});

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

    const handle = async (action, type, index) => {
        switch (action) {
            case "delete":
                type==="plan" ? deletePlanEvent(index) : deleteLifeEvent(index);
                break;
            case "open":
                openEvent(index, type==="plan");
                break;
            case "copy":
                copyToLife(index);
        }
    }

    const deletePlanEvent = async (index) => {
        setPlanEvents(map => {
            map.delete(index);
            return new Map(map);
        });
        await deleteDoc(doc(db, "plan", index.toString()));
    }

    const deleteLifeEvent = async (index) => {
        const event = lifeEvents.get(index);

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

    const openEvent = (index, isPlanEvent) => {
        const event = isPlanEvent ? planEvents.get(index) : lifeEvents.get(index);
        setInfo({index: index, isPlan: isPlanEvent, start: event.start, end: event.end, 
            name: event.name, category: event.category, colour: categories.get(event.category),
            description: event.description});
        setInfoWindow(true);
    }

    const copyToLife = async (index) => {
        const event = planEvents.get(index);
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
                infoWindow={infoWindow} setInfoWindow={setInfoWindow}
                events={info.isPlan ? planEvents : lifeEvents} 
                setEvents={info.isPlan ? setPlanEvents : setLifeEvents}
                info={info}
            />

            <Create 
                visibility={newEventWindow} setVisibility={setNewEventWindow}
                categories={categories}
                setEvents={newEventType==="plan" ? setPlanEvents : setLifeEvents}
                count={count} setCount={setCount}
                date={date}
                type={newEventType}
            />
        </div>
    )
}

export default Timetable;