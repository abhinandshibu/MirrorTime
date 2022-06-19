import './sidebar.css'
import Calendar from 'react-calendar';
import { ColourContext } from '../../App';
import { useContext } from 'react';
import React from 'react';

function SideBar({setWindowVisibility, categories}) {
    const showWindow = () => {
        setWindowVisibility(true);
    }

    const colours = useContext(ColourContext);

    return (
        <div className="sidebar">
            <Calendar />
            <div className="categories">
                {React.Children.toArray(categories.map((cat) => (
                    <div className={cat[0]}
                    style={{background: '#' + colours[cat[1]]}}>
                        {cat[0]}
                    </div>
                )))}
            </div>
            <button id="new" onClick={showWindow}>Create New Activity</button>
            <button id="analytics">Analytics</button>
        </div>
    );
}

export default SideBar;