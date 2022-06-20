import './timetable.css';
import { db } from '../../App';
import { EventConverter } from '../../pages/home/home';
import { doc, setDoc } from "firebase/firestore";

function Timetable({planEvents, lifeEvents, setLifeEvents, count, setCount, categories}) {
    const renderTimeSlots = () => {
        const array = [];
        for (let i=0; i<24; i++) {
            array.push(
                <div className={`time-slot ${i}`} key={`t${i}`}
                    style={{gridArea: `${i+1} / 1 / ${i+2} / 2`}}>
                    <span>{i<10 ? `0${i}` : i} : 00</span>
                </div>,
                <div className={`life-slot ${i}`} key={`l${i}`}
                    style={{gridArea: `${i+1} / 2 / ${i+2} / 3`}}>
                </div>,
                <div className={`plan-slot ${i}`} key={`p${i}`}
                    style={{gridArea: `${i+1} / 3 / ${i+2} / 4`}}>
                </div>
            );
        }
        return array;
    }

    const renderEvents = () => {
        const array = [];
        for (const [index, event] of planEvents.entries()) {
            array.push(
                <div className="activity" key={index}
                    style={{gridArea: `${+event.start+1} / 3 / ${+event.end+1} / 4`, 
                            background: '#' + categories.get(event.category)}}
                >
                    {event.name}
                    <button onClick={() => copyToLife(event)}>
                        Copy to Life
                    </button>
                </div>
            );
        }
        for (const [index, event] of lifeEvents.entries()) {
            array.push(
                <div className="activity" key={index}
                    style={{gridArea: `${+event.start+1} / 2 / ${+event.end+1} / 3`, 
                            background: '#' + categories.get(event.category)}}
                >
                    {event.name}
                </div>
            );
        }
        return array;
    }

    const copyToLife = (event) => {
        setLifeEvents(map => new Map(map.set(count, event)));
        setCount(count+1);

        // write to database
        let ref = doc(db, `life/${count}`).withConverter(EventConverter);
        const write = async () => {
            setDoc(ref, event);
            setDoc(doc(db, 'info/count'), {count: count+1});
        }
        write().catch(console.error);
    }

    return (
        <div className="timetable">
            <div className="timetable-heading">
                <div></div>
                <div>Your Life</div>
                <div>Your Plan</div>
            </div>
            <div className="timetable-body">
                {renderTimeSlots()}
                
                {renderEvents()}
            </div>
        </div>
    )
}

export default Timetable;