import './sidebar.css'
import { Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState, useContext } from 'react';
import { doc, setDoc } from "firebase/firestore";
import { toYmd, getTimeNow, db, ColourTheme, getToday } from '../../App';
import Timeout from './timer/timeout';
import SelectTime from './timer/select-time';
import NewCategory from './new-category';
import { DisabledCategory, IdleCategory, ActiveCategory } from './category';

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
                clearInterval(intervalId);
                setTimeoutWindow(true);
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
                    {current.isRunning
                        ? Array.from(categories).map(([name, colour]) => (
                            current.category===name
                                ? <ActiveCategory name={name} colour={colour} width={progBarWidth} 
                                    stop={stop} time={time} showBar={!current.isIncreasing} key={name}/>
                                : <DisabledCategory name={name} colour={colour} key={name}/>
                        ))
                        : Array.from(categories).map(([name, colour]) => (
                            <IdleCategory name={name} colour={colour} 
                                play={play} countdown={countdown} key={name}/>
                        ))
                    }
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
                current={current} stop={stop} startEvent={startEvent}
            />
        </div>
    );
}

export default SideBar;