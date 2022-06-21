import React from 'react'
import { PolarArea } from 'react-chartjs-2'
import './styles.css'

export default function PolarChart(props) {

    const {
        title,
        chartData
    } = props

    const pieWidth = window.innerWidth - 180

    return (
        <div className='polarchart-container'>
            <h4 className='table-title'>{title || ''}</h4>
            <PolarArea width={pieWidth} height={pieWidth} data={chartData}/>
        </div>
    )
}