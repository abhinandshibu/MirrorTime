import './bar-chart.css'
import { useContext } from 'react';
import { ColourTheme } from '../../../App';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function BarChart(props) {
    const theme = useContext(ColourTheme);
    const textColour = theme === "light" ? "gray" : "white";
    const gridColour = theme === "light" ? "#d3d3d3" : "#444";

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: textColour,
                    fontColor: textColour 
                }
            },
            title: {
                display: true,
                text: 'How you planned your life, and how you spend it.',
                color: textColour
            },
            tooltip: {
                callbacks: {
                    label: (item) =>
                        `${item.dataset.label}: ${item.formattedValue} hours`,
                },
            },
        },
        scales: {
            x: {
                grid: {
                    color: gridColour
                },
                ticks: {
                    color: textColour
                }
            },
            y: {
                grid: {
                    color: gridColour
                },
                ticks: {
                    color: textColour
                }
            }
        }
    };
        
    const datasets = [
        {
            label: 'Your Plan',
            data: Array.from(props.planData.values()),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Your Life',
            data: Array.from(props.lifeData.values()),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ]

    const data = {
        labels: props.categories,
        datasets: datasets,
    }

    return <div id="bar-chart"><Bar options={options} data={data} /></div>
}

export default BarChart;