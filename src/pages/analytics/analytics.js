import './analytics.css'
import React from 'react';
import Select from 'react-select'
import { useState } from 'react';
import BarChart from './bar-chart/bar-chart';
import PieChart from './pie-chart/pie-chart';

const options = [
    { value: 'bar-chart', label: 'Bar Chart' },
    { value: 'pie-chart', label: 'Pie Chart' },
]

function Analytics() {
    const [analytic, setAnalytic] = useState("");

    let analyticComponent = <></>

    if (analytic === "bar-chart") {
        console.log(analytic)
        analyticComponent = <BarChart />
    } else if (analytic === "pie-chart") {
        console.log(analytic)
        analyticComponent = <PieChart />
    } else {
        console.log(analytic)
        analyticComponent = <></>
    }
   
    return (
        <div id="analytics">
            <Select options={options} onChange={(option) => setAnalytic(option.value)} placeholder="Please select an analytic to view."/>
            {analyticComponent}
        </div>
    )
}

export default Analytics;