import './timeout.css';
import { ColourTheme } from '../../../../App';
import { Current } from '../../home';

import { useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';

function Timeout({visibility, setVisibility, stopAndSave}) {

    const theme = useContext(ColourTheme);
    const [current, writeCurrent] = useContext(Current);

    const finish = () => {
        setVisibility(false);
        stopAndSave();
    }

    const cont = () => {
        setVisibility(false);
        writeCurrent({isRunning: true, isIncreasing: true, 
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
                    onClick={finish} id="timeout-finish"
                >Finish</Button>
            </div>
        </Modal>
    )
}

export default Timeout;