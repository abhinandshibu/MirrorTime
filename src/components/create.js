import './create.css';
import { Modal } from 'react-bootstrap';


function Create({vis, setVis, eventList, setEventList, event, setEvent}) {
    const closeWindow = () => {
        setVis(false);
    }

    const addEvent = () => {
        setEventList([...eventList, event]);
        setEvent({name: "", category: "", start: 0, end: 0});
        console.log(`name: ${event.name}, category: ${event.category}, start: ${event.start}, end: ${event.end}`);
    }
   

    return (
        <Modal show={vis} onHide={closeWindow}>
            <Modal.Header closeButton>
                <Modal.Title>Add Activity</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label>Name: </label>
                <input type="text" id="name" value={event.name}
                    onChange={(e) => { setEvent({...event, name: e.target.value}) }} 
                />

                <label>Category: </label>
                <input type="text" id="category" value={event.category}
                    onChange={(e) => { setEvent({...event, category: e.target.value}) }} 
                />

                <label>Start: </label>
                <input type="number" id="start" value={event.start} min="0" max="23"
                    onChange={(e) => { setEvent({...event, start: e.target.value}) }} 
                />

                <label>End: </label>
                <input type="number" id="end" value={event.end} min={event.start + 1} max="24"
                    onChange={(e) => { setEvent({...event,end: e.target.value}) }} 
                />

                <button onClick={addEvent}>Add Event</button>
                
            </Modal.Body>
        </Modal>
    );
}

export default Create;