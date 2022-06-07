import React, { useState } from 'react'
import './styles.css'

export default function MovementsTable(props) {

    const { 
        tableData,
        tableTitle,
        setIsEdit,
        setCheck,
        check
    } = props
    const headers = ['Fecha', 'Autor', 'Detalle', 'Categoria', 'Tipo', 'Monto']
    const rowData = tableData && tableData.length ? tableData : []

    const handleCheck = e => {
        const { value, checked } = e.target

        if(checked) {
            setCheck(value)
            setIsEdit(true)
        } else {
            setIsEdit(false)
            setCheck(-1)
        }
    }

    return (
        <div className='table-container'>
            <h4 className='table-title'>{tableTitle || ''}</h4>
            <div className='table-headers'>
                {
                    headers.map((header,i) => <h4 key={i} className='table-header'>{header}</h4>)
                }
            </div>
            {
                rowData.length ?
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
                    <input className='table-checkbox' checked={check == i} style={{ position: 'absolute', right: 0}} type="checkbox" value={i} onChange={handleCheck}></input>
                </div>)
                :
                <div className='table-row' style={{ backgroundColor: '#E5E5E5', height: '2.5vw', justifyContent: 'center' }}>
                    No hay movimientos para mostrar.
                </div>
            }
        </div>
    )
}
