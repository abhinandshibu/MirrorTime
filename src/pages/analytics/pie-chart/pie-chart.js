import React, { useContext } from 'react';
import './pie-chart.css'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ColourTheme } from '../../../App';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart(props) {
    const theme = useContext(ColourTheme);
    const textColour = theme === "light" ? "gray" : "white";

    const planOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: textColour
                }
            },
            title: {
                display: true,
                text: 'Your Plan',
                color: textColour
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
                labels: {
                    color: textColour
                }
            },
            title: {
                display: true,
                text: 'Your Life',
                color: textColour
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