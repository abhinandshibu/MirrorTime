import './sidebar.css'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toYmd } from '../../App';

function SideBar({
    setCategoryWindowShow, categories, date, setDate, current, setCurrent, 
    isActive, setIsActive
}) {
    let history = useHistory();

    const [time, setTime] = useState([0, 0]); // used for both stopwatch and timer

    useEffect(() => {
        if (isActive) {
            const id = setInterval(() => {
                setTime(([min, sec]) => sec < 59 ? [min, sec + 1] : [min + 1, 0]);
            }, 1000);
            return () => clearInterval(id);
        }
    }, [isActive])

    const play = (category) => {
        setIsActive(true);
        setCurrent(category);
    }

    const stop = (category) => {
        setIsActive(false);
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
                                border: isActive && current===name ? "3px dashed black" : "none"}}
                        >
                            <span>{name}</span>
                            <div className="box1">
                                <img className="play" src={require("./play.png")} 
                                    alt="start an event in this category"
                                    style={{visibility: isActive ? "hidden" : "visible"}}
                                    onClick={() => play(name)} 
                                />
                                <img className="stop" src={require("./stop.png")} 
                                    alt="end the current event"
                                    style={{visibility: isActive && current===name ? "visible" : "hidden"}}
                                    onClick={() => stop(name)} 
                                />
                            </div>
                            <div className="box2">
                                <img className="timer" src={require("./timer.png")} 
                                    alt="start a countdown timer for an activity in this category"
                                    style={{visibility: isActive ? "hidden" : "visible"}}
                                    onClick={() => countdown(name)} 
                                />
                                <span className="time"
                                    style={{visibility: isActive && current===name ? "visible" : "hidden"}}
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