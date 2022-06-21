import './sidebar.css'
import Calendar from 'react-calendar';

function SideBar({setPlanWindowShow, setCategoryWindowShow, categories}) {

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
            <button id="analytics">Analytics</button>
        </div>
    );
}

export default SideBar;