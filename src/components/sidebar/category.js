import './category.css';

export function DisabledCategory({name, colour}) {
    return (
        <div className="main- category" style={{background: '#' + colour}}>
            <span className="category-name">{name}</span>
        </div>
    )
}

export function IdleCategory({name, colour, play, countdown}) {
    return (
        <div className="main- category" style={{background: '#' + colour}}>
            <span className="category-name">{name}</span>
            <img className="play" src={require("./play.png")} 
                title="Play"
                alt="start an event in this category"
                onClick={() => play(name)} 
            /> 
            <img className="countdown" src={require("./timer.png")} 
                title="Countdown Timer"
                alt="start a countdown timer for an activity in this category"
                onClick={() => countdown(name)} 
            />
        </div>
    )
}

export function ActiveCategory({name, colour, width, stop, time, showBar}) {
    return (
        <div className="main- category"
            style={{background: '#' + colour, border: "3px dashed black"}}
        >
            <span className="category-name">{name}</span>
            {showBar
                ? <div id="reverse-progress-bar"
                    style={{width: width + '%'}}></div>
                : ""
            }
            <img className="stop" src={require("./stop.png")} 
                alt="end the current event"
                onClick={stop} 
            />
            <span className={`time ${showBar && width >= 90 ? "warning" : ""}`}>
                {time[0]} : {(time[1] < 10 ? "0" : "") + time[1]}
            </span>
        </div>
    )
}