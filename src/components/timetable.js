import './timetable.css';
import { ColourContext } from '../App';
import { useContext, useState } from 'react';
import React from 'react';

function Timetable({planEvents, categories}) {
    const colours = useContext(ColourContext);

    const [lifeEvents, setLifeEvents] = useState([]);

    const renderTimeSlots = () => {
        const array = [];
        for (let i=0; i<24; i++) {
            array.push(
                <div className={`time-slot ${i}`} key={`time-slot ${i}`}
                    style={{gridArea: `${i+1} / 1 / ${i+2} / 2`}}>
                    <span>{i<10 ? `0${i}` : i} : 00</span>
                </div>,
                <div className={`life-slot ${i}`} key={`life-slot ${i}`}
                    style={{gridArea: `${i+1} / 2 / ${i+2} / 3`}}>
                </div>,
                <div className={`plan-slot ${i}`} key={`plan-slot ${i}`}
                    style={{gridArea: `${i+1} / 3 / ${i+2} / 4`}}>
                </div>
            );
        }
        return array;
    }

    const getColour = (name) => {
        const nameAndColour = categories.filter(cat => cat[0] === name)[0];
        return colours[nameAndColour[1]];
    }

    return (
        <div className="timetable">
            <div className="timetable-heading">
                <div></div>
                <div>Your Life</div>
                <div>Your Plan</div>
            </div>
            <div className="timetable-body">
                {renderTimeSlots()}
                
                {React.Children.toArray(planEvents.map((event) => (
                    <div className="activity" 
                        style={{gridArea: `${+event.start+1} / 3 / ${+event.end+1} / 4`, 
                                background: '#' + getColour(event.category)}}
                    >
                        {event.name}
                        <button onClick={() => setLifeEvents([...lifeEvents, event])}>
                            Copy to Life
                        </button>
                    </div>
                )))}

                {React.Children.toArray(lifeEvents.map((event) => (
                    <div className="activity" 
                        style={{gridArea: `${+event.start+1} / 2 / ${+event.end+1} / 3`, 
                                background: '#' + getColour(event.category)}}
                    >
                        {event.name}
                    </div>
                )))}
            </div>
        </div>
    )
}

export default Timetable;