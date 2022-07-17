import './timeout.css';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useContext } from 'react';
import { ColourTheme } from '../../../App';

function Timeout({visibility, setVisibility, current, stop, startEvent}) {

    const theme = useContext(ColourTheme);

    const finish = () => {
        setVisibility(false);
        stop();
    }

    const cont = () => {
        setVisibility(false);
        startEvent({isRunning: true, isIncreasing: true, 
            name: current.name, category: current.category, start: current.start});
    }

    return (
        <Modal show={visibility} onHide={() => setVisibility(false)}
            contentClassName={"modal-" + theme}
        >
            <Modal.Header>
                <Modal.Title>Time's up!</Modal.Title>
            </Modal.Header>
            <div id="timeout-options">
                <Button
                    variant="light"
                    onClick={cont} id="timeout-continue"
                >Continue</Button>
                <Button
                    variant="light"
                    onClick={finish} className="modal-submit"
                >Finish</Button>
            </div>
        </Modal>
    )
}

export default Timeout;