import './sidebar.css'
import Calendar from 'react-calendar';
import { ColourContext } from '../../App';
import { useContext } from 'react';
import React from 'react';
import { useHistory } from 'react-router-dom';

function SideBar({setPlanWindowShow, setCategoryWindowShow, categories}) {
    let history = useHistory();
    
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
            <button id="analytics" onClick={()=>history.push('/analytics')}>Analytics</button>
        </div>
    );
}

export default SideBar;