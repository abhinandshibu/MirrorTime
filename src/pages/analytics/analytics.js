import './analytics.css'
import React from 'react';
import Select from 'react-select'
import { useState } from 'react';
import BarChart from './bar-chart/bar-chart';
import PieChart from './pie-chart/pie-chart';
import DatePicker from 'react-datepicker';
import { toYmd, db } from '../../App';

const analyticOptions = [
    { value: 'bar-chart', label: 'Bar Chart' },
    { value: 'pie-chart', label: 'Pie Chart' },
]

function Analytics(props) {
    const [analytic, setAnalytic] = useState("pie-chart");

    // ORGANISING DATA FOR GRAPH JS
    const categoriesMap = props.categories
    const propPlanEvents = props.planEvents
    const propLifeEvents = props.lifeEvents
    
    const categories = Array.from(props.categories.keys())
    const categoriesColors = Array.from(props.categories.values()).map(color => '#' + color)
    
    const planEvents = Array.from(propPlanEvents.values())
    const planData = new Map()
    categories.forEach(category => planData.set(category, 0))
    planEvents.forEach(obj => {
        planData.set(obj.category, ((planData.get(obj.category)) + parseInt(obj.end) - parseInt(obj.start)) / 3600);
    })
    const objPlanData = Object.fromEntries(planData)

    const lifeEvents = Array.from(propLifeEvents.values())
    const lifeData = new Map()
    categories.forEach(category => lifeData.set(category, 0))
    lifeEvents.forEach(obj => {
        lifeData.set(obj.category, ((lifeData.get(obj.category)) + parseInt(obj.end) - parseInt(obj.start)) / 3600);
    })
    const objLifeData = Object.fromEntries(lifeData)
    // END OF ORGANISING DATA FOR GRAPH JS

    // ORGANISING DATA FOR DATE PICKER
    const date = props.date
    const setDate = props.setDate
    // END OF ORGANISING DATA FOR DATE PICKER

    let analyticComponent = <></>

    if (analytic === "bar-chart") {
        analyticComponent = <BarChart categories={categories} planData={planData} lifeData={lifeData}/>
    } else if (analytic === "pie-chart") {
        analyticComponent = <PieChart categories={categories} categoriesColors={categoriesColors} planData={planData} lifeData={lifeData}/>
    } else {
        analyticComponent = <></>
    }


    return (
        <div id="analytics-page">
            <div id="analytics-select">
                <DatePicker 
                    selected={new Date(date.year, date.month, date.date)} 
                    onChange={d => setDate(toYmd(d))}
                    inline fixedHeight
                />
                <>
                    <h5>How would you like your data presented?</h5>
                    <Select options={analyticOptions} onChange={(option) => setAnalytic(option.value)}/>
                </>
                <>  
                    <h5>Pick your timeline: (day/week/month)</h5>
                    {/* <Select options={options} onChange={(option) => setAnalytic(option.value)}/> */}
                </>
            </div>
            {analyticComponent}
        </div>
    )
}

export default Analytics;