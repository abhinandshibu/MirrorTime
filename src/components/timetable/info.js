import './info.css';
import { ColourTheme } from '../../App';
import { Modal } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { EditTextarea, EditText } from 'react-edit-text';
import { Button } from 'react-bootstrap';
import 'react-edit-text/dist/index.css';

function Info({visibility, setVisibility, info, categories, getColour, updateEvent}) {

    const theme = useContext(ColourTheme);

    const [startHour, setStartHour] = useState();
    const [startMin, setStartMin] = useState();
    const [endHour, setEndHour] = useState();
    const [endMin, setEndMin] = useState();
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState([0, 0]);

    useEffect(() => {
        if (visibility) {
            const start = info.event.start;
            const end = info.event.end;
            setStartHour(Math.floor(start / 3600));
            setStartMin(Math.floor(start % 3600 / 60));
            setEndHour(Math.floor(end / 3600));
            setEndMin(Math.floor(end % 3600 / 60));

            setDescription(info.event.hasDescription ? info.event.description : "");
            setName(info.event.name);
            setCategory(info.event.category);
        }
    }, [visibility])

    const save = async () => {
        const start = 3600 * startHour + 60 * startMin;
        const end = 3600 * endHour + 60 * endMin;
        console.log(name, description, start, end);
        if (name !== "" && start < end) {
            setVisibility(false);
            
            const properties = {name: name, start: start, end: end};
            if (description !== "") {
                properties.hasDescription = true;
                properties.description = description;
            } else {
                properties.hasDescription = false;
            }
            updateEvent(info.index, properties, info.type);
        }
    }

    const earlier = (step, isStart) => {
        const [hour, setHour, min, setMin] = isStart ? 
            [startHour, setStartHour, startMin, setStartMin] : 
            [endHour, setEndHour, endMin, setEndMin];

        if (hour === 0 && min < step) return;
        if (min < step) {
            setHour(hour - 1);
            setMin(60 + min - step);
        } else {
            setMin(min - step);
        }
    }

    const later = (step, isStart) => {
        const [hour, setHour, min, setMin] = isStart ? 
            [startHour, setStartHour, startMin, setStartMin] : 
            [endHour, setEndHour, endMin, setEndMin];

        if (hour > 23) return;
        if (hour === 23 && min >= 60 - step) return;
        if (min >= 60 - step) {
            setHour(hour + 1);
            setMin(min + step - 60);
        } else {
            setMin(min + step);
        }
    }

    const printNum = (number) => (number < 10 ? '0' : '') + number;

    const printCategory = () => {
        const group = categories.get(category[0]);
        return group === undefined
            ? ""
            : category[1] === 0
                ? group.name
                : `${group.name} (${group.subs.get(category[1]).name})`;
    }

    return (
        <Modal 
            show={visibility} 
            onHide={() => setVisibility(false)}
            contentClassName={"modal-" + theme}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <EditText 
                        name="title" value={name} showEditButton
                        onChange={(e) => setName(e.target.value)}
                    />
                </Modal.Title>
            </Modal.Header>

            <div className="modal-body">
                <div>
                    <label>Category: </label>
                    <span className="info-category" 
                        style={{background: '#' + getColour(category)}}
                    >{printCategory()}</span>
                </div>
                
                <label>Time: </label>
                <div className="info-time">
                    <span style={{gridArea: "start"}}>{printNum(startHour)} : {printNum(startMin)}</span>
                    <span style={{gridArea: "to"}}>to</span>
                    <span style={{gridArea: "end"}}>{printNum(endHour)} : {printNum(endMin)}</span>
                    
                    <div style={{gridArea: "start-earlier"}} className="buttons">
                        <span onClick={() => earlier(1, true)}>&lt;</span>
                        <span onClick={() => earlier(5, true)}>&#9664;</span>
                    </div>
                    <div style={{gridArea: "start-later"}} className="buttons">
                        <span onClick={() => later(5, true)}>&#9654;</span>
                        <span onClick={() => later(1, true)}>&gt;</span>
                    </div>

                    <div style={{gridArea: "end-earlier"}} className="buttons">
                        <span onClick={() => earlier(1, false)}>&lt;</span>
                        <span onClick={() => earlier(5, false)}>&#9664;</span>
                    </div>
                    <div style={{gridArea: "end-later"}} className="buttons">
                        <span onClick={() => later(5, false)}>&#9654;</span>
                        <span onClick={() => later(1, false)}>&gt;</span>
                    </div>
                </div>

                <label>Description: </label>
                <EditTextarea 
                    name="description" value={description} 
                    className="info-description" inputClassName="info-description"
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description to your event."
                />

                <Button 
                    variant={theme === "light" ? "outline-dark" : "outline-light"} 
                    onClick={save} className="modal-submit"
                >
                    Save
                </Button>
            </div>
        </Modal>
    )
}

export default Info;