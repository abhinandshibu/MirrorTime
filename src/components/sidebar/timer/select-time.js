import './select-time.css';
import { Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toYmd, db } from '../../../App';
import { doc, setDoc } from "firebase/firestore";

function SelectTime({
    selectTimeWindow, setSelectTimeWindow, setCurrent, setTime, 
    setLifeEvents, category, count, setCount
}) {

    const presets = [[60, "1 min"], [180, "3 min"], [300, "5 min"], [600, "10 min"], [900, "15 min"], 
        [1800, "30 min"], [2700, "45 min"], [3600, "1 hr"], [7200, "2 hr"]];

    const [presetTime, setPresetTime] = useState(60);
    const [usingPreset, setUsingPreset] = useState(true);
    const [hour, setHour] = useState(-1);
    const [minute, setMinute] = useState(-1);
    const [second, setSecond] = useState(-1);
    const [name, setName] = useState("");

    useEffect(() => {
        setPresetTime(60);
        setUsingPreset(true);
        setHour(-1);
        setMinute(-1);
        setSecond(-1);
        setName("");
    }, [setSelectTimeWindow]);

    const submit = async () => {
        const date = new Date();
        const timeNow = date.getHours() * 3600 + date.getMinutes() * 60;
        let min, sec, end;
        if (usingPreset) {
            min = presetTime / 60;
            sec = 0;
            end = timeNow + presetTime;
        } else {
            if (hour < 0 || minute < 0 || second < 0) {
                return;
            }
            min = hour * 60 + minute;
            sec = second;
            end = timeNow + hour * 3600 + min * 60 + second;
        }
        const newEvent = {name: name, category: category, date: toYmd(date), start: timeNow, end: end};
        setLifeEvents(map => new Map( map.set(count, newEvent) ));
        setCount(count + 1);
        await setDoc(doc(db, `life/${count}`), newEvent);
        await setDoc(doc(db, 'info/count'), {count: count+1});

        setCurrent({index: count, isRunning: true, isIncreasing: false});
        setTime([min, sec]); console.log(newEvent, min, sec);

        setSelectTimeWindow(false);
    }

    return (
        <Modal show={selectTimeWindow} onHide={() => setSelectTimeWindow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Select a duration...</Modal.Title>
            </Modal.Header>

        <div className="form">
            <div className="my-row">
                <label>Name: </label>
                <input type="text" id="name" value={name}
                    onChange={(e) => setName(e.target.value)} 
                />
            </div>
            <div className="presets">
                {presets.map(([seconds, label]) => (
                    <div key={seconds}
                        style={{border: presetTime == seconds && usingPreset ? "2px solid black" : "none"}}
                        onClick={() => {setPresetTime(seconds); setUsingPreset(true);}}
                    >{label}</div>
                ))}
            </div>
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
            <button onClick={submit}>Start</button>
        </div>
        </Modal>
    )
}

export default SelectTime;