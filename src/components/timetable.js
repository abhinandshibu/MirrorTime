import './timetable.css';

function Timetable({eventList, event}) {
    const renderTimeSlots = () => {
        const array = [];
        for (let i=0; i<24; i++) {
            array.push(
                <div class={`time-slot ${i}`}
                    style={{gridArea: `${i+1} / 1 / ${i+2} / 2`}}>
                    <span>{i<10 ? `0${i}` : i} : 00</span>
                </div>,
                <div class={`life-slot ${i}`}
                    style={{gridArea: `${i+1} / 2 / ${i+2} / 3`}}>
                </div>,
                <div class={`plan-slot ${i}`}
                    style={{gridArea: `${i+1} / 3 / ${i+2} / 4`}}>
                </div>
            );
        }
        return array;
    }

    const renderPlanEvents = () => {
        const array = [];
        eventList.map((event) => (
            array.push
        ))
        for (let i=0; i<24; i++) {
            array.push(<div class="activity"></div>)
        }
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
                
                {eventList.map((event) => (
                    <div class="activity" 
                        style={{gridArea: `${+event.start+1} / 3 / ${+event.end+1} / 4`}}>
                        {event.name}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Timetable;