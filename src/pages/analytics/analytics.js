import './analytics.css'
import React, { useEffect } from 'react';
import Select from 'react-select'
import { useState } from 'react';
import BarChart from './bar-chart/bar-chart';
import PieChart from './pie-chart/pie-chart';
import DatePicker from 'react-datepicker';
import { toYmd, db } from '../../App';
import { collection, getDocs, query, where } from "firebase/firestore";

const analyticOptions = [
    { value: 'bar-chart', label: 'Bar Chart' },
    { value: 'pie-chart', label: 'Pie Chart' },
]

const timelineOptions = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
]

function Analytics(props) {

    // ORGANISING DATA FOR DATE PICKER
    const date = props.date
    const setDate = props.setDate
    // END OF ORGANISING DATA FOR DATE PICKER

    // ORGANISING DATA FOR GRAPH JS
    const [analytic, setAnalytic] = useState("pie-chart");
    const [analyticTimeline, setAnalyticTimeline] = useState("day");

    const [totalPlanEvents, setTotalPlanEvents] = useState(new Map());
    const [totalLifeEvents, setTotalLifeEvents] = useState(new Map());

    const categories = Array.from(props.categories.keys())
    const categoriesColors = Array.from(props.categories.values()).map(color => '#' + color)

    useEffect(() => {

        async function getEventsInDate(date) {
            let temp = new Map();
            const planSnapshot = await getDocs(query(collection(db, 'plan'), where("date", "==", date)));
            planSnapshot.forEach((e) => {
                temp.set(e.id, e.data());
            })
            const propPlanEvents = new Map(temp)

            temp.clear();
            const lifeSnapshot = await getDocs(query(collection(db, 'life'), where("date", "==", date)));
            lifeSnapshot.forEach((e) => {
                temp.set(e.id, e.data());
            })
            const propLifeEvents = new Map(temp)
                         
            setTotalPlanEvents(propPlanEvents)
            setTotalLifeEvents(propLifeEvents)
        }

        async function getEventsInWeek(date) {
            let temp = new Map();
            const planSnapshot = await getDocs(query(collection(db, 'plan'), where("date.date", ">=", date.date - 7), where("date.month", "==", date.month), where("date.year", "==", date.year)));
            planSnapshot.forEach((e) => {
                temp.set(e.id, e.data());
            })
            const propPlanEvents = new Map(temp)

            temp.clear();
            const lifeSnapshot = await getDocs(query(collection(db, 'life'), where("date.date", ">=", date.date - 7), where("date.month", "==", date.month), where("date.year", "==", date.year)));
            lifeSnapshot.forEach((e) => {
                temp.set(e.id, e.data());
            })
            const propLifeEvents = new Map(temp)
                         
            setTotalPlanEvents(propPlanEvents)
            setTotalLifeEvents(propLifeEvents)
        }

        async function getEventsInMonth(date) {
            const month = date.month
            const year = date.year

            let temp = new Map();
            const planSnapshot = await getDocs(query(collection(db, 'plan'), where("date.month", "==", month), where("date.year", "==", year)));
            planSnapshot.forEach((e) => {
                temp.set(e.id, e.data());
            })
            const propPlanEvents = new Map(temp)

            temp.clear();
            const lifeSnapshot = await getDocs(query(collection(db, 'life'), where("date.month", "==", month), where("date.month", "==", month)));
            lifeSnapshot.forEach((e) => {
                temp.set(e.id, e.data());
            })
            const propLifeEvents = new Map(temp)
                         
            setTotalPlanEvents(propPlanEvents)
            setTotalLifeEvents(propLifeEvents)
        }
        
        if (analyticTimeline === "day") {
            getEventsInDate(date)
        } else if (analyticTimeline === "week") {
            getEventsInWeek(date)
        } else if (analyticTimeline === "month") {
            getEventsInMonth(date)
        } else {
            console.log("INVALID ANALYTIC TIMELINE")
        }
    }, [date, analyticTimeline])

    function formatForGraphJS(propPlanEvents, propLifeEvents) {
        const planEvents = Array.from(propPlanEvents.values())
        console.log(planEvents)
        const planData = new Map()
        categories.forEach(category => planData.set(category, 0))
        planEvents.forEach(obj => {
            planData.set(obj.category, planData.get(obj.category) + ((parseInt(obj.end) - parseInt(obj.start)) / 3600));
        })

        const lifeEvents = Array.from(propLifeEvents.values())
        const lifeData = new Map()
        categories.forEach(category => lifeData.set(category, 0))
        lifeEvents.forEach(obj => {
            lifeData.set(obj.category, lifeData.get(obj.category) + ((parseInt(obj.end) - parseInt(obj.start)) / 3600));
        })

        console.log(planData)

        return [planData, lifeData]
    }

    const data = formatForGraphJS(totalPlanEvents, totalLifeEvents)
    const planData = data[0]
    const lifeData = data[1]
    // END OF ORGANISING DATA FOR GRAPH JS

    let analyticComponent = <></>

    if (analytic === "bar-chart") {
        analyticComponent = <BarChart id="analytics-component" categories={categories} planData={planData} lifeData={lifeData}/>
    } else if (analytic === "pie-chart") {
        analyticComponent = <PieChart id="analytics-component" categories={categories} categoriesColors={categoriesColors} planData={planData} lifeData={lifeData}/>
    } else {
        analyticComponent = <></>
    }

    return (
        <div id="analytics-page">
            <div id="analytics-select">
                <div id="analytics-date-picker">
                    <DatePicker 
                        selected={new Date(date.year, date.month, date.date)} 
                        onChange={d => setDate(toYmd(d))}
                        inline fixedHeight
                        />
                </div>
                <div id="analytics-view-picker">
                    <>
                        <h5>How would you like your data presented?</h5>
                        <Select 
                            options={analyticOptions} 
                            onChange={(option) => setAnalytic(option.value)}
                            defaultValue={{ value: 'pie-chart', label: 'Pie Chart' }}/>
                    </>
                    <>  
                        <p></p>
                        <h5>Pick your timeline: (day/week/month)</h5>
                        <Select 
                            options={timelineOptions} 
                            onChange={(option) => setAnalyticTimeline(option.value)}
                            defaultValue={{ value: 'day', label: 'Day' }}/>
                    </>
                </div>
            </div>
            {analyticComponent}
        </div>
    )
}

export default Analytics;