import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import './styles.css'

export default function PieChart(props) {

    const {
        title,
        chartData
    } = props

    return (
        <div className='piechart-container'>
            <h4 className='table-title'>{title || ''}</h4>
            <Doughnut data={chartData}/>
        </div>
    )
}