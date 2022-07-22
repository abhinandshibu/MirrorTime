import './category.css';
import Timeout from './timer/timeout';
import SelectTime from './timer/select-time';
import { db, getTimeNow } from '../../App';
import { Current } from '../../pages/home/home';
import { useContext, useState, useEffect } from 'react';


export function DisabledCategory({name, colour}) {
    return (
        <div className="main- category" style={{background: '#' + colour}}>
            <span className="category-name">{name}</span>
        </div>
    )
}


export function IdleCategory({name, colour}) {
    const [_, writeCurrent] = useContext(Current);
    const [selectTimeWindow, setSelectTimeWindow] = useState(false);

    return (
        <div className="idle-category">
            <div className="main- category" style={{background: '#' + colour}}>
                <span className="category-name">{name}</span>

                <img className="play" src={require("./play.png")} 
                    title="Stopwatch" alt="Stopwatch"
                    onClick={() => 
                        writeCurrent({isRunning: true, isIncreasing: true, category: name, start: getTimeNow()})
                    } 
                /> 

                <img className="countdown" src={require("./timer.png")} 
                    title="Countdown Timer" alt="Countdown Timer"
                    onClick={() => setSelectTimeWindow(true)} 
                />
            </div>
            <SelectTime
                visibility={selectTimeWindow} setVisibility={setSelectTimeWindow}
                category={name}
            />
        </div>
    )
}


export function StopwatchCategory({name, colour, stopAndSave}) {
    const [current, _] = useContext(Current);

    const [time, setTime] = useState([0, 0]);

    useEffect(() => {
        const elapsedSecs = getTimeNow() - current.start;
        setTime([Math.floor(elapsedSecs / 60), elapsedSecs % 60]);

        // Increment time every second
        const id = setInterval(() => {
            setTime(([min, sec]) => sec < 59 ? [min, sec + 1] : [min + 1, 0]);
        }, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="main- category active-"
            style={{background: '#' + colour}}
        >
            <span className="category-name">{name}</span>

            <img className="stop" src={require("./stop.png")} 
                alt="end the current event" onClick={stopAndSave} 
            />

            <span className="time">
                {time[0]} : {(time[1] < 10 ? "0" : "") + time[1]}
            </span>
        </div>
    )
}


export function TimerCategory({name, colour, stopAndSave}) {
    const [current, _] = useContext(Current);
    const [timeoutWindow, setTimeoutWindow] = useState(false);

    const [time, setTime] = useState([1,0]);
    const [intervalId, setIntervalId] = useState();
    const [progBarWidth, setProgBarWidth] = useState(0); // Increases from 0% to 100%

    useEffect(() => {
        const timeLeft = current.end - getTimeNow();
        if (timeLeft < 0) {
            setTimeoutWindow(true);
        }
        else {
            setTime([Math.floor(timeLeft / 60), timeLeft % 60]);
            setProgBarWidth(100 - (timeLeft+2) * current.growthRate);

            // Decrement time every second
            const id = (setInterval(() => {
                setTime(([min, sec]) => sec > 0 ? [min, sec - 1] : [min - 1, 59]);
            }, 1000));
            setIntervalId(id);
            return () => clearInterval(id);
        }
    }, []);

    useEffect(() => {
        if (time[0]===0 && time[1]===0) {
            clearInterval(intervalId);
            setTimeoutWindow(true);
        }
        setProgBarWidth(width => width + current.growthRate);
    }, [time]);

    return (
        <div className="timer-category">
            <div className="main- category active-"
                style={{background: '#' + colour}}
            >
                <span className="category-name">{name}</span>

                <div id="reverse-progress-bar" style={{width: progBarWidth + '%'}}></div>

                <img className="stop" src={require("./stop.png")} 
                    title="Stop" alt="Stop"
                    onClick={stopAndSave} 
                />

                <span className={`time ${progBarWidth >= 90 ? "warning" : ""}`}>
                    {time[0]} : {(time[1] < 10 ? "0" : "") + time[1]}
                </span>
            </div>
            <Timeout
                visibility={timeoutWindow} setVisibility={setTimeoutWindow}
                stopAndSave={stopAndSave}
            />
        </div>
    )
}