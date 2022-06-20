import React from 'react'
import { Bar } from 'react-chartjs-2'
import './styles.css'

export default function BarChart(props) {

    const {
        title,
        chartData
    } = props

    const options = {
        plugins: {
            legend: {
                display: false
            }
        }
    }

    return (
        <div className='barchart-container'>
            <h4 className='table-title'>{title || ''}</h4>
            <Bar data={chartData} options={options}/>
        </div>
    )
}
