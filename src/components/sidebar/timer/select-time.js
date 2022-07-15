import './select-time.css';
import { Modal } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { ColourTheme, getTimeNow } from '../../../App';
import { Button } from 'react-bootstrap';

function SelectTime({
    visibility, setVisibility, current, startEvent
}) {

    const theme = useContext(ColourTheme);
    
    const presets = [[60, "1 min"], [180, "3 min"], [300, "5 min"], [600, "10 min"], [900, "15 min"], 
        [1800, "30 min"], [2700, "45 min"], [3600, "1 hr"], [7200, "2 hr"]];

    const [presetTime, setPresetTime] = useState(60);
    const [usingPreset, setUsingPreset] = useState(true);
    const [hour, setHour] = useState(-1);
    const [minute, setMinute] = useState(-1);
    const [second, setSecond] = useState(-1);
    const [name, setName] = useState("");

    useEffect(() => {
        if (visibility) {
            setPresetTime(60);
            setUsingPreset(true);
            setHour(-1);
            setMinute(-1);
            setSecond(-1);
            setName("");
        }
    }, [setVisibility]);

    const submit = async () => {
        setVisibility(false);

        const timeNow = getTimeNow();
        let end;
        if (usingPreset) {
            end = timeNow + presetTime;
        } else {
            if (hour < 0 || minute < 0 || second < 0)
                return;
            end = timeNow + hour * 3600 + minute * 60 + second;
        }
        const newCurrent = {...current, isRunning: true, isIncreasing: false, name: name,
            start: timeNow, end: end, growthRate: 100 / (end - timeNow)};
        
        startEvent(newCurrent);
    }

    return (
        <Modal 
            show={visibility} 
            onHide={() => setVisibility(false)}
            contentClassName={"modal-" + theme}
        >
            <Modal.Header closeButton>
                <Modal.Title>Countdown Timer</Modal.Title>
            </Modal.Header>

        <div className="form">
            <label>Activity name: </label>
            <input type="text" id="name" value={name}
                onChange={(e) => setName(e.target.value)} 
            />
            <div className="my-heading">Select duration:</div>
            <div className="presets">
                {presets.map(([seconds, label]) => (
                    <div key={seconds}
                        style={{background: '#' + (presetTime === seconds && usingPreset ? "8282b9" : "9ed9d9")}}
                        onClick={() => {setPresetTime(seconds); setUsingPreset(true);}}
                    >{label}</div>
                ))}
            </div>
            <div className="my-heading">Custom duration:</div>
            <div className="custom">
                <select key="hour"
                    onChange={(e) => {setHour(+e.target.value); setUsingPreset(false);}}
                >
                    <option value={-1} key="default">Hour</option>
                    {[...Array(24).keys()].map(i => (
                        <option value={i} key={i}>{i}</option>
                    ))}
                </select>
                <span> : </span>
                <select key="minute"
                    onChange={(e) => {setMinute(+e.target.value); setUsingPreset(false);}}
                >
                    <option value={-1} key="default">Minute</option>
                    {[...Array(60).keys()].map(i => (
                        <option value={i} key={i}>{i<10 ? '0' + i : i}</option>
                    ))}
                </select>
                <span> : </span>
                <select key="second"
                    onChange={(e) => {setSecond(+e.target.value); setUsingPreset(false);}}
                >
                    <option value={-1} key="default">Second</option>
                    {[...Array(60).keys()].map(i => (
                        <option value={i} key={i}>{i<10 ? '0' + i : i}</option>
                    ))}
                </select>
            </div>
            <Button 
                variant={theme === "light" ? "outline-dark" : "outline-light"} 
                onClick={submit} id="start-timer"
            >
                Start
            </Button>
        </div>
        </Modal>
    )
}

export default SelectTime;