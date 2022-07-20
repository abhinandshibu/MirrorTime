import './category-group.css';
import { DisabledCategory, IdleCategory, ActiveCategory } from './category';

export function DisabledGroup({name, colour}) {
    return (
        <div className="category-group">
            <DisabledCategory name={name} colour={colour} />
            <NewSubcategory />
        </div>
    );
}

export function IdleGroup({name, colour, play, countdown}) {
    return (
        <div className="category-group">
            <IdleCategory name={name} colour={colour} play={play} countdown={countdown} />
            <NewSubcategory />
        </div>
    );
}

export function ActiveGroup({name, colour, width, stop, time, showBar}) {
    return (
        <div className="category-group">
            {/* {current.category === name
                ? <ActiveCategory name={name} colour={colour} width={width}
                    stop={stop} time={time} showBar={showBar} />
                : <DisabledCategory name={name} colour={colour} />
            } */}
            <ActiveCategory name={name} colour={colour} width={width}
                stop={stop} time={time} showBar={showBar} />
            <NewSubcategory />
        </div>
    );
}

function NewSubcategory() {
    return (
        <div className="new-subcategory subcategory-container">
            <div className="elbow-connector"></div>
            <div className="plus">+</div>
        </div>
    );
}