import './sidebar.css'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState, useContext } from 'react';
import { doc, setDoc } from "firebase/firestore";
import { toYmd, getTimeNow, db, ColourTheme, getToday } from '../../App';
import Timeout from './timer/timeout';
import SelectTime from './timer/select-time';
import NewCategory from './new-category';
import { Button } from 'react-bootstrap';

function SideBar({
    categories, setCategories, date, setDate, 
    current, setCurrent, addCurrentEvent
}) {
    const theme = useContext(ColourTheme);

    const [categoryWindow, setCategoryWindow] = useState(false);
    const [timeoutWindow, setTimeoutWindow] = useState(false);
    const [selectTimeWindow, setSelectTimeWindow] = useState(false);

    // Tracks current minute and second. Used in both stopwatch and countdown timer.
    const [time, setTime] = useState([0, 0]);

    // States used only for countdown timer
    const [intervalId, setIntervalId] = useState();
    const [progBarWidth, setProgBarWidth] = useState(0); // Increases from 0% to 100%

    // Called every time a new event is started, or the page loads with an existing running event
    useEffect(() => {
        if (current.isRunning) {
            if (current.isIncreasing) {
            // Stopwatch
                const elapsedSecs = getTimeNow() - current.start;
                setTime([Math.floor(elapsedSecs / 60), elapsedSecs % 60]);

                // Increment time every second
                const id = setInterval(() => {
                    setTime(([min, sec]) => sec < 59 ? [min, sec + 1] : [min + 1, 0]);
                }, 1000);
                return () => clearInterval(id);
            } 
            else {
            // Timer
                const timeLeft = current.end - getTimeNow();
                if (timeLeft < 0) {
                    setTimeoutWindow(true);
                    stop();
                }
                else {
                    setTime([Math.floor(timeLeft / 60), timeLeft % 60]);
                    setProgBarWidth(100 - timeLeft * current.growthRate);

                    // Decrement time every second
                    const id = (setInterval(() => {
                        setTime(([min, sec]) => sec > 0 ? [min, sec - 1] : [min - 1, 59]);
                    }, 1000));
                    setIntervalId(id);
                    return () => clearInterval(id);
                }
            }
        }
    }, [current]);

    // For countdown timer only: Checks if time's up, or else it moves the progress bar
    useEffect(() => {
        if (current.isRunning && !current.isIncreasing) {
            if (time[0]===0 && time[1]===0) {
                setTimeoutWindow(true);
                stop();
            } else {
                setProgBarWidth(width => width + current.growthRate);
            }
        } 
    }, [time])

    const play = (category) => {
        startEvent({isRunning: true, isIncreasing: true, category: category, start: getTimeNow()});
    }

    const countdown = (category) => {
        setCurrent({isRunning: false, category: category});
        setSelectTimeWindow(true);
    }

    const startEvent = async (curr) => {
        setDate(getToday());
        setCurrent(curr);
        await setDoc(doc(db, 'info/current'), curr);
    }

    const stop = async () => {
        const event = {category: current.category, start: current.start, 
            end: getTimeNow(), date: getToday(), hasDescription: false};
        event.name = current.hasOwnProperty('name') ? current.name : `${current.category} activity`;
        
        if (!current.isIncreasing)
            clearInterval(intervalId);

        setCurrent({isRunning: false});
        await setDoc(doc(db, 'info/current'), {isRunning: false});
        
        addCurrentEvent(event);
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
                <Button id="new-category" 
                    variant={theme === "light" ? "outline-dark" : "outline-light"}
                    onClick={() => setCategoryWindow(true)}
                >
                    New Category
                </Button>
                <div className="category-list">
                    {Array.from(categories).map(([name, colour]) => (
                        <div key={name} className="category"
                            style={{background: '#' + colour, 
                                border: current.isRunning && current.category===name ? "3px dashed black" : "none"}}
                        >
                            <span className="category-name">{name}</span>
                            {current.isRunning
                                ? (current.category===name
                                    ? <>
                                        {current.isIncreasing 
                                            ? ""
                                            : <div id="reverse-progress-bar"
                                                style={{width: progBarWidth + '%'}}></div>
                                        }
                                        <img className="stop" src={require("./stop.png")} 
                                            alt="end the current event"
                                            onClick={stop} 
                                        />
                                        <span className="time">
                                            {time[0]} : {(time[1] < 10 ? "0" : "") + time[1]}
                                        </span>
                                    </>
                                    : ""
                                )
                                : <>
                                    <img className="play" src={require("./play.png")} 
                                        title="Play"
                                        alt="start an event in this category"
                                        onClick={() => play(name)} 
                                    /> 
                                    <img className="countdown" src={require("./timer.png")} 
                                        title="Countdown Timer"
                                        alt="start a countdown timer for an activity in this category"
                                        onClick={() => countdown(name)} 
                                    />
                                </>
                            }
                        </div>
                    ))}
                </div>
            </div>

            <NewCategory
                visibility={categoryWindow} setVisibility={setCategoryWindow}
                setCategories={setCategories}
            />

            <SelectTime
                visibility={selectTimeWindow} setVisibility={setSelectTimeWindow}
                current={current} startEvent={startEvent}
            />

            <Timeout
                visibility={timeoutWindow} setVisibility={setTimeoutWindow}
            />
        </div>
    );
}

export default SideBar;