import React from 'react';
import './pie-chart.css'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart(props) {
    const planOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Your Plan',
            },
            tooltip: {
                callbacks: {
                    label: (item) => 
                        `${item.label}: ${item.formattedValue} hours`,
                },
            },
        },
    };
    
    const planPieData = {
        labels: props.categories,
        datasets: [
            {
                data: Array.from(props.planData.values()),
                backgroundColor: props.categoriesColors
            }
        ]
    }

    const lifeOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Your Life',
            },
            tooltip: {
                callbacks: {
                    label: (item) => 
                        `${item.label}: ${item.formattedValue} hours`,
                }, 
            },
        },
        
    };
    
    const lifePieData = {
        labels: props.categories,
        datasets: [
            {
                data: Array.from(props.lifeData.values()),
                backgroundColor: props.categoriesColors
            }
        ]
    }

    return (
        <>
            <div id="plan-pie"><Pie data={planPieData} options={planOptions} /></div>
            <div id="life-pie"><Pie data={lifePieData} options={lifeOptions} /></div>
        </>
    )
}

export default PieChart;