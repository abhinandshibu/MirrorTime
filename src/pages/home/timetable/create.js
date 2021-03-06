import { Modal } from 'react-bootstrap';
import { ColourTheme } from '../../../App';
import "../../../style/modal.css"

import { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';

function Create({
    visibility, setVisibility, categories, type, addEvent
}) {

    const theme = useContext(ColourTheme);

    const initialEvent = {name: "", category: "", startHour: -1, startMin: -10000,
        endHour: -1, endMin: -10000}
    const [event, setEvent] = useState(initialEvent);

    const create = () => {
        const name = event.name;
        const category = event.category;
        const start = 3600 * event.startHour + 60 * event.startMin;
        const end = 3600 * event.endHour + 60 * event.endMin;

        if (name !== "" && category !== "" && start >= 0 && end >= 0 && start < end) 
        {
            const newEvent = {name: name, category: category, start: start, end: end, hasDescription: false};
            if (type==="plan")
                newEvent.copied = false;
            
            setVisibility(false);
            setEvent(initialEvent);

            addEvent(newEvent, type);
        }
    }

    return (
        <Modal 
            show={visibility} onHide={() => setVisibility(false)}
            contentClassName={"modal-" + theme}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {type === "plan"
                        ? "Schedule an Event"
                        : "Log an Activity"
                    }
                </Modal.Title>
            </Modal.Header>

            <div className="modal-body">
                <div className="modal-row">
                    <label>Name: </label>
                    <input type="text" id="name" value={event.name}
                        onChange={(e) => setEvent({...event, name: e.target.value}) } 
                    />
                </div>

                <div className="modal-row">
                    <label>Category: </label>
                    <select id="category"
                        onChange={(e) => setEvent({...event, category: e.target.value})}
                    >
                        <option value="" key="default">Choose a category:</option>

                        {Array.from(categories.keys()).map((cat) => (
                            <option value={cat} key={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="modal-row">
                    <label>Start: </label>
                    <select id="start-hour"
                        onChange={(e) => setEvent({...event, startHour: +e.target.value})}
                    >
                        <option value={-1} key="default">Hour</option>
                        {[...Array(24).keys()].map(i => (
                            <option value={i} key={i}>{i}</option>
                        ))}
                    </select>
                    <span> : </span>
                    <select id="start-min"
                        onChange={(e) => setEvent({...event, startMin: +e.target.value})}
                    >
                        <option value={-10000} key="default">Min</option>
                        {[...Array(12).keys()].map(i => (
                            <option value={i*5} key={i*5}>{i<2 ? '0' + i*5 : i*5}</option>
                        ))}
                    </select>
                </div>

                <div className="modal-row">
                    <label>End: </label>
                    <select id="end-hour"
                        onChange={(e) => {setEvent({...event, endHour: +e.target.value})}}
                    >
                        <option value={-1} key="default">Hour</option>
                        {[...Array(25 - +event.startHour).keys()].map(i => (
                            <option value={event.startHour + i} key={i}>{event.startHour + i}</option>
                        ))}
                    </select>
                    <span> : </span>
                    <select id="end-hour"
                        onChange={(e) => {setEvent({...event, endMin: +e.target.value})}}
                    >
                        <option value={-10000} key="default">Min</option>
                        {event.endHour===24 
                            ? <option value={0}>00</option> 
                            : [...Array(12).keys()].map(i => (
                                <option value={i*5} key={i*5}>{i<2 ? '0' + i*5 : i*5}</option>
                            ))
                        }
                    </select>
                </div>
                
                <Button variant={theme === "light" ? "outline-dark" : "outline-light"} 
                    onClick={create} className="modal-submit"
                >
                    Add Event
                </Button>

            </div>
        </Modal>
    );
}

export default Create;