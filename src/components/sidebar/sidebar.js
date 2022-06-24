import './sidebar.css'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toYmd } from '../../App';

function SideBar({
    setCategoryWindowShow, categories, date, setDate, currentEvent, setCurrentEvent, 
    isRunning, setIsRunning
}) {
    let history = useHistory();

    const [time, setTime] = useState([0, 0]); // used for both stopwatch and timer

    useEffect(() => {
        if (isRunning) {
            const id = setInterval(() => {
                setTime(([min, sec]) => sec < 59 ? [min, sec + 1] : [min + 1, 0]);
            }, 1000);
            return () => clearInterval(id);
        }
    }, [isRunning])

    const play = (category) => {
        const date = new Date();
        const time = date.getHours() * 3600 + date.getMinutes() * 60;
        setIsRunning(true);
        setCurrentEvent({category: category, start: time});
    }

    const stop = (category) => {
        setIsRunning(false);
        setTime([0, 0]);
    }

    const countdown = (category) => {
        
    }
    
    return (
        <div className="sidebar">
            <DatePicker 
                selected={new Date(date.year, date.month, date.date)} 
                onChange={d => setDate(toYmd(d))}
                inline fixedHeight
            />

            <div className="categories">
                <button id="new-category" onClick={() => setCategoryWindowShow(true)}>New Category</button>
                <div className="category-list">
                    {Array.from(categories).map(([name, colour]) => (
                        <div key={name} className="category"
                            style={{background: '#' + colour, 
                                border: isRunning && currentEvent.category===name ? "3px dashed black" : "none"}}
                        >
                            <span>{name}</span>
                            <div className="box1">
                                <img className="play" src={require("./play.png")} 
                                    alt="start an event in this category"
                                    style={{visibility: isRunning ? "hidden" : "visible"}}
                                    onClick={() => play(name)} 
                                />
                                <img className="stop" src={require("./stop.png")} 
                                    alt="end the current event"
                                    style={{visibility: isRunning && currentEvent.category===name ? "visible" : "hidden"}}
                                    onClick={() => stop(name)} 
                                />
                            </div>
                            <div className="box2">
                                <img className="timer" src={require("./timer.png")} 
                                    alt="start a countdown timer for an activity in this category"
                                    style={{visibility: isRunning ? "hidden" : "visible"}}
                                    onClick={() => countdown(name)} 
                                />
                                <span className="time"
                                    style={{visibility: isRunning && currentEvent.category===name ? "visible" : "hidden"}}
                                >
                                    {time[0]} : {(time[1] < 10 ? "0" : "") + time[1]}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button id="analytics-button" onClick={()=>history.push('/analytics')}>Analytics</button>
        </div>
    );
}

export default SideBar;