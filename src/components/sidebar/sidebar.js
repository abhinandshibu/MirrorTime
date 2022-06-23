import './sidebar.css'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import React from 'react';
import { useHistory } from 'react-router-dom';
import { toYmd } from '../../App';

function SideBar({setCategoryWindowShow, categories, date, setDate }) {
    let history = useHistory();

    const play = (category) => {

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
                            style={{background: '#' + colour}}
                        >
                            <span>{name}</span>
                            <img className="play" src={require("./play.png")} 
                                alt="start an event in this category"
                                onClick={() => play(name)} 
                            />
                            <img className="timer" src={require("./timer.png")} 
                                alt="start a countdown timer for an activity in this category"
                                onClick={() => countdown(name)} 
                            />
                        </div>
                    ))}
                </div>
            </div>
            <button id="analytics-button" onClick={()=>history.push('/analytics')}>Analytics</button>
        </div>
    );
}

export default SideBar;