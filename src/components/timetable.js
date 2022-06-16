import './timetable.css';

function Timetable() {
    const renderTimeSlots = () => {
        const array = [];
        for (let i=0; i<24; i++) {
            array.push(
                <div class={`time-slot ${i}`}>
                    <span>{i<10 ? `0${i}` : i} : 00</span>
                </div>
            )
        }
        return array;
    }

    const renderPlanSlots = () => {
        const array = [];
        for (let i=0; i<24; i++) {
            array.push(
                <div class={`plan-slot ${i}`} id={i}>plan slot {i}</div>
            )
        }
        return array;
    }

    const renderLifeSlots = () => {
        const array = [];
        for (let i=0; i<24; i++) {
            array.push(
                <div class={`life-slot ${i}`} id={i}>life slot {i}</div>
            )
        }
        return array;
    }

    return (
        <div class="timetable">
            <div class="timetable-heading">
                <div></div>
                <div>Your Life</div>
                <div>Your Plan</div>
            </div>
            <div class="timetable-body">
                {renderTimeSlots()}
                
                {renderLifeSlots()}
                
                {renderPlanSlots()}
            </div>
        </div>
    )
}

export default Timetable;