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

    const [startDate, setStartDate] = useState(structuredClone(date));
    const [endDate, setEndDate] = useState(structuredClone(date));
    const [totalPlanEvents, setTotalPlanEvents] = useState(new Map());
    const [totalLifeEvents, setTotalLifeEvents] = useState(new Map());

    const categories = Array.from(props.categories.keys())
    const categoriesColors = Array.from(props.categories.values()).map(color => '#' + color)

    // When the timeline for the analytic changes
    useEffect(() => {
        if (analyticTimeline === "day") {
            setStartDate(date)
            setEndDate(date)
        } else if (analyticTimeline === "week") {
            console.log("hello world")
        } else if (analyticTimeline === "month") {
            const startDate = structuredClone(date)
            startDate.date = 1
            setStartDate(startDate)
            const endDate = structuredClone(date)
            endDate.date = 31
            setEndDate(endDate)
        } else {
            console.log("INVALID ANALYTIC TIMELINE")
        }
    }, [date, analyticTimeline])

    // When the startDate and the endDate for the analytic period changes
    useEffect(() => {
        // Date should be a object consisting of 
        // a `year`, `month` and `date` which are integers. 
        async function getEventsForDay(date) {
            let temp = new Map();
            const planSnapshot = await getDocs(query(collection(db, 'plan'), where("date", "==", date)));
            planSnapshot.forEach((e) => {
                temp.set(e.id, e.data());
            })
            const planEvents = new Map(temp)

            temp.clear();
            const lifeSnapshot = await getDocs(query(collection(db, 'life'), where("date", "==", date)));
            lifeSnapshot.forEach((e) => {
                temp.set(e.id, e.data());
            })
            const lifeEvents = new Map(temp)
            
            return [planEvents, lifeEvents]
        }

        /* Note, that startDate and endDate should be a object consisting of 
        a `year`, `month` and `date` which are integers. 
        Use helper function `toYmd` defined in `App.js` to convert a javascript
        date to this format. */
        async function getEventsInBetween(startDate, endDate) {
            let propPlanEvents = new Map();
            let propLifeEvents = new Map();

            for (let yearCount=startDate.year; yearCount<=endDate.year; yearCount++) {
                const firstMonth = yearCount === startDate.year ? startDate.month : 1
                const finalMonth = yearCount === endDate.year ? endDate.month : 12
            
                for (let monthCount=firstMonth; monthCount<=finalMonth; monthCount++) {
                    const firstDay = (yearCount === startDate.year && monthCount === startDate.month) ? startDate.date : 1
                    const finalDay = (yearCount === endDate.year && monthCount === endDate.month) ? endDate.date : 31

                    for (let dayCount=firstDay; dayCount<=finalDay; dayCount++) {
                        const tempDate = toYmd(new Date(yearCount, monthCount, dayCount))
                        
                        console.log(tempDate)
                        const propEvents = await getEventsForDay(tempDate)
                        console.log(propEvents)
                        propPlanEvents = new Map([...propPlanEvents, ...propEvents[0]])
                        propLifeEvents = new Map([...propLifeEvents, ...propEvents[1]])
                    }
                }
            }
        
            setTotalPlanEvents(propPlanEvents)
            setTotalLifeEvents(propLifeEvents)
        }

        getEventsInBetween(startDate, endDate).catch()
    }, [startDate, endDate])

    function formatForGraphJS(propPlanEvents, propLifeEvents) {
        const planEvents = Array.from(propPlanEvents.values())
        const planData = new Map()
        categories.forEach(category => planData.set(category, 0))
        planEvents.forEach(obj => {
            planData.set(obj.category, ((planData.get(obj.category)) + parseInt(obj.end) - parseInt(obj.start)) / 3600);
        })

        const lifeEvents = Array.from(propLifeEvents.values())
        const lifeData = new Map()
        categories.forEach(category => lifeData.set(category, 0))
        lifeEvents.forEach(obj => {
            lifeData.set(obj.category, ((lifeData.get(obj.category)) + parseInt(obj.end) - parseInt(obj.start)) / 3600);
        })

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
                        <Select options={analyticOptions} onChange={(option) => setAnalytic(option.value)}/>
                    </>
                    <>  
                        <p></p>
                        <h5>Pick your timeline: (day/week/month)</h5>
                        <Select options={timelineOptions} onChange={(option) => setAnalyticTimeline(option.value)}/>
                    </>
                </div>
            </div>
            {analyticComponent}
        </div>
    )
}

export default Analytics;