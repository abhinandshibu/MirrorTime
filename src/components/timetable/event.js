import './event.css'

function Event({index, event, type, colour, isActive, handle}) {

    return (
        <div key={index}
            className={`${type} event`}
            style={{gridRow: `${Math.round(event.start/300) + 1} / ${Math.round(event.end/300) + 1}`,
                    background: '#' + colour,
                    border: isActive ? "2px solid red" : "none"}}
            onClick={() => handle("open", type, index)}
        >
            {isActive ? <div className="event-highlighter"></div> : ""}

            <img className="delete" src={require("./assets/delete.png")} 
                alt="delete event" key="delete"
                onClick={(e) => {e.stopPropagation(); handle("delete", type, index)}} 
            /> 

            {type === "plan"
                ? event.copied 
                    ? <img className="copied" src={require("./assets/ticked.png")} 
                        alt="event copied to life" key="copied"/>
                    : <img className="copy" src={require("./assets/unticked.png")} 
                        alt="delete event" key="copy"
                        onClick={(e) => {e.stopPropagation(); handle("copy", type, index)}} />
                : ""
            }
            
            <span>{event.name}</span>
        </div>
    )
}

export default Event;