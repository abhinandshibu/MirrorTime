import './create.css';
import { Modal } from 'react-bootstrap';


function Create(props) {
    const closeWindow = () => {
        props.setVis(false);
    }
   

    return (
    //    <div class="window" style={{visibility: vis}}>
    //         <div class="header">
    //             <span>Add Activity</span>
    //             <CloseButton id="close" onClick={closeWindow} />
    //         </div>
    //    </div> 
        <Modal show={props.vis} onHide={closeWindow}>
            <Modal.Header closeButton>
                <Modal.Title>Add Activity</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
            </Modal.Body>
        </Modal>
    );
}

export default Create;