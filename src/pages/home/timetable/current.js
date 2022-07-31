import './current.css';
import { Current } from '../home';
import { timeToHeight } from './timetable';

import { useContext } from 'react';
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';

export function MovingCurrent({timeNow, colour}) {

    const [current, writeCurrent] = useContext(Current);
    
    const nearestSlot = Math.round(current.start / 300);
    const error = current.start - nearestSlot * 300;
    const duration = timeNow - current.start;

    const editName = ({name, value, previousValue}) => {
        writeCurrent({...current, name: value});
    }

    return (
        <div id="current"
            style={{gridRowStart: nearestSlot + 1,
                top: timeToHeight(error),
                height: Math.max(timeToHeight(duration), 0),
                background: '#' + colour
            }}
        >
            <div className="event-highlighter"></div>
            {duration >= 600
                ? <div className="edit-text-container">
                    <EditText inputClassName="current-name" placeholder="Event name"
                    onSave={editName} />
                </div>
                : ""
            }
        </div>
    )
}

export function StaticCurrent({colour}) {

    const [current, _] = useContext(Current);

    return (
        <div id="current"
            style={{gridRow: `${Math.round(current.start/300) + 1} / ${Math.round(current.end/300) + 1}`,
                background: '#' + colour}}
        >
            <div className="event-highlighter"></div>
        </div>
    )    
}