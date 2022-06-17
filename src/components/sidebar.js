import './sidebar.css'
import Calendar from 'react-calendar';

function SideBar(props) {
    const showWindow = () => {
        props.setWindowVisibility(true);
        console.log("it works")
    }
    return (
        <div class="sidebar">
            <Calendar />
            <div class="categories">
                <div class="eating">Eating</div>
                <div class="uni">University</div>
                <div class="commute">Commute</div>
                <div class="leisure">Leisure</div>
                <div class="exercise">Exercise</div>
                <div class="chores">Chores</div>
                <div class="social">Social</div>
            </div>
            <button id="new" onClick={showWindow}>Create New Activity</button>
            <button id="analytics">Analytics</button>
        </div>
    );
}

export default SideBar;