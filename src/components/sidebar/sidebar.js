import './sidebar.css'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState, useContext } from 'react';
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useHistory } from 'react-router-dom';
import { toYmd, db, ColourTheme } from '../../App';
import Timeout from './timer/timeout';
import SelectTime from './timer/select-time';
import NewCategory from './new-category';
import { Button } from 'react-bootstrap';

function SideBar({
    lifeEvents, setLifeEvents, count, setCount, categories, setCategories, date, setDate, 
    current, setCurrent
}) {
    const theme = useContext(ColourTheme);

    const [time, setTime] = useState([0, 0]); // used for both stopwatch and timer
    const [categoryWindow, setCategoryWindow] = useState(false);
    const [timeoutWindow, setTimeoutWindow] = useState(false);
    const [selectTimeWindow, setSelectTimeWindow] = useState(false);
    const [activeCategory, setActiveCategory] = useState("");
    const [intervalId, setIntervalId] = useState();

    useEffect(() => {
        if (current.isRunning) {
            if (current.isIncreasing) {
                const id = setInterval(() => {
                    setTime(([min, sec]) => sec < 59 ? [min, sec + 1] : [min + 1, 0]);
                }, 1000);
                return () => clearInterval(id);
            } 
            else {
                const id = (setInterval(() => {
                    setTime(([min, sec]) => sec > 0 ? [min, sec - 1] : [min - 1, 59]);
                }, 1000));
                setIntervalId(id);
                return () => clearInterval(id);
            }
        }
    }, [current]);

    useEffect(() => {
        if (current.isRunning && !current.isIncreasing && time[0]===0 && time[1]===0) {
            clearInterval(intervalId);
            setTimeoutWindow(true);
            setCurrent({isRunning: false});
        }
    }, [time])

    const play = (category) => {
        const date = new Date();
        const timeNow = date.getHours() * 3600 + date.getMinutes() * 60;
        setActiveCategory(category);
        setTime([0, 0]);
        setCurrent({category: category, start: timeNow, isRunning: true, isIncreasing: true});
    }

    const stop = async () => {
        const date = new Date();
        const timeNow = date.getHours() * 3600 + date.getMinutes() * 60;
        if (current.isIncreasing) {
            // Play button: event stopped, record event
            const newEvent = {name: `${activeCategory} activity`, category: activeCategory,
                date: toYmd(date), start: current.start, end: timeNow};
            setLifeEvents(map => new Map( map.set(count, newEvent) ));
            setCount(count + 1);
    
            await setDoc(doc(db, `life/${count}`), newEvent);
            await setDoc(doc(db, 'info/count'), {count: count+1});
        } else {
            // Countdown timer: user ended early, update event's end time
            const updatedEvent = {...lifeEvents.get(current.index), end: timeNow};
            setLifeEvents(map => new Map( map.set(current.index, updatedEvent) ));
            await updateDoc(doc(db, `life/${current.index}`), {end: timeNow});
        }
        setCurrent({isRunning: false});
    }

    const countdown = (category) => {
        setActiveCategory(category);
        setSelectTimeWindow(true);
    }
    
    return (
        <div className="sidebar">
            <div id="datepicker">
                <DatePicker 
                    selected={new Date(date.year, date.month, date.date)} 
                    onChange={d => setDate(toYmd(d))}
                    inline fixedHeight
                />
            </div>

            <div className="categories">
                <Button 
                    variant={theme === "light" ? "outline-dark" : "outline-light"}
                    id="new-category" 
                    onClick={() => setCategoryWindow(true)}
                >
                    New Category
                </Button>
                <div className="category-list">
                    {Array.from(categories).map(([name, colour]) => (
                        <div key={name} className="category"
                            style={{background: '#' + colour, 
                                border: current.isRunning && activeCategory===name ? "3px dashed black" : "none"}}
                        >
                            <span className="category-name">{name}</span>
                            {current.isRunning ? 
                                <>
                                    <img className="stop" src={require("./stop.png")} 
                                        alt="end the current event"
                                        style={{visibility: activeCategory===name ? "visible" : "hidden"}}
                                        onClick={stop} 
                                    />
                                    <span className="time"
                                        style={{visibility: activeCategory===name ? "visible" : "hidden"}}
                                    >
                                        {time[0]} : {(time[1] < 10 ? "0" : "") + time[1]}
                                    </span>
                                </>
                                :
                                <>
                                    <img className="play" src={require("./play.png")} 
                                        title="Play"
                                        alt="start an event in this category"
                                        onClick={() => play(name)} 
                                    /> 
                                    <img className="countdown" src={require("./timer.png")} 
                                        title="Countdown Timer"
                                        alt="start a countdown timer for an activity in this category"
                                        style={{visibility: current.isRunning ? "hidden" : "visible"}}
                                        onClick={() => countdown(name)} 
                                    />
                                </>
                            }
                        </div>
                    ))}
                </div>
            </div>

            <NewCategory
                categoryWindow={categoryWindow} setCategoryWindow={setCategoryWindow}
                setCategories={setCategories}
            />

            <SelectTime
                selectTimeWindow={selectTimeWindow} setSelectTimeWindow={setSelectTimeWindow}
                setCurrent={setCurrent} setTime={setTime}
                setLifeEvents={setLifeEvents}
                category={activeCategory}
                count={count} setCount={setCount}
                
            />

            <Timeout
                timeoutWindow={timeoutWindow} setTimeoutWindow={setTimeoutWindow}
            />
        </div>
    );
}

export default SideBar;