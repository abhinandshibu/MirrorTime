import './sidebar.css'
import Calendar from 'react-calendar';
import { ColourContext } from '../../App';
import { useContext } from 'react';
import React from 'react';
import { useHistory } from 'react-router-dom';

function SideBar({setWindowVisibility, categories}) {
    const showWindow = () => {
        setWindowVisibility(true);
    }

    let history = useHistory();
    
    const colours = useContext(ColourContext);

    return (
        <div className="sidebar">
            <Calendar />
            <div className="categories">
                <button id="new-category" onClick={() => setCategoryWindowShow(true)}>New Category</button>
                <div className="category-list">
                    {Array.from(categories).map(([name, colour]) => (
                        <div key={name} className="category"
                        style={{background: '#' + colour}}>
                            {name}
                        </div>
                    ))}
                </div>
            </div>
            <button id="new" onClick={showWindow}>Create New Activity</button>
            <button id="analytics" onClick={()=>history.push('/analytics')}>Analytics</button>
        </div>
    );
}

export default SideBar;