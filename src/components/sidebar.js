import './sidebar.css'
import Calendar from 'react-calendar';
import { ColourContext } from '../App';
import { useContext } from 'react';

function SideBar({setWindowVisibility, categories}) {
    const showWindow = () => {
        setWindowVisibility(true);
    }

    const colours = useContext(ColourContext);

    return (
        <div className="sidebar">
            <Calendar />
            <div className="categories">
                {Array.from(categories).map(([name, colour]) => (
                    <div key={name} 
                    style={{background: '#' + colours[colour]}}>
                        {name}
                    </div>
                ))}
            </div>
            <button id="new" onClick={showWindow}>Create New Activity</button>
            <button id="analytics">Analytics</button>
        </div>
    );
}

export default SideBar;