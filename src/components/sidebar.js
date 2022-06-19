import './sidebar.css'
import Calendar from 'react-calendar';

function SideBar({setWindowVisibility, categories}) {
    const showWindow = () => {
        setWindowVisibility(true);
    }

    return (
        <div className="sidebar">
            <Calendar />
            <div className="categories">
                {Array.from(categories).map(([name, colour]) => (
                    <div key={name} 
                    style={{background: '#' + colour}}>
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