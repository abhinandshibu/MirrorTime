import './sidebar.css'
import Calendar from 'react-calendar';

function SideBar({setWindowVisibility, categories}) {
    const showWindow = () => {
        setWindowVisibility(true);
        console.log("it works")
    }
    return (
        <div class="sidebar">
            <Calendar />
            <div class="categories">
                {categories.map((name) => (
                    <div class={name}>{name}</div>
                ))}
            </div>
            <button id="new" onClick={showWindow}>Create New Activity</button>
            <button id="analytics">Analytics</button>
        </div>
    );
}

export default SideBar;