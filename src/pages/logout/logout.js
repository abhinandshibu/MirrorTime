import { EmailAuthProvider } from "firebase/auth";
import { auth } from "../../App"
import './logout.css';

function Logout(props) {
    
    return (
         <div id="logout">
            <p>you have logged out</p>
        </div>
    )
}

export default Logout