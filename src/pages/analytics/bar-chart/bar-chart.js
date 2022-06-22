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
    const options = {
        responsive: true,
        plugins: {
            legend: {
            position: 'top',
            },
            title: {
            display: true,
            text: 'How you planned your life, and how you spend it.',
            },
        },
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

    return <Bar options={options} data={data} />
}

export default BarChart;