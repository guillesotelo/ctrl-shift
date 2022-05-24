import React, { useEffect, useState } from 'react'
import './styles.css'

export default function MovementsTable(props) {

    const { 
        tableData,
        tableTitle
    } = props
    const headers = ['Fecha', 'Autor', 'Detalle', 'Categoria', 'Tipo', 'Monto']
    const rowData = tableData && tableData.length ? [...tableData].reverse() : []

    return (
        <div className='table-container'>
            <h4 className='table-title'>{tableTitle || ''}</h4>
            <div className='table-headers'>
                {
                    headers.map((header,i) => <h4 key={i} className='table-header'>{header}</h4>)
                }
            </div>
            {
                rowData.map((row,i) =>  
                <div 
                key={i} 
                className='table-row' 
                style={{ backgroundColor: i%2 === 0 ? '#E5E5E5' : 'white'}}>
                    <h4 className='table-row-item'>{new Date(row.date).toLocaleDateString()}</h4>
                    <h4 className='table-row-item'>{row.author || 'n/a'}</h4>
                    <h4 className='table-row-item'>{row.detail || 'n/a'}</h4>
                    <h4 className='table-row-item'>{row.category || 'n/a'}</h4>
                    <h4 className='table-row-item'>{row.pay_type || 'n/a'}</h4>
                    <h4 className='table-row-item'>${row.amount || 'n/a'}</h4>
                </div>)
            }
        </div>
    )
}
