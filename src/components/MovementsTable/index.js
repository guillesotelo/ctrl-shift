import React, { useState } from 'react'
import './styles.css'

export default function MovementsTable(props) {
    const [maxItems, setMaxItems] = useState(10)
    const {
        tableData,
        tableTitle,
        setIsEdit,
        isEdit,
        setCheck,
        check
    } = props
    const headers = ['Fecha', 'Autor', 'Detalle', 'Categoria', 'Tipo', 'Monto']
    const rowData = tableData && tableData.length ? tableData : []

    const handleCheck = key => {
        if(isEdit) {
            if(key !== check) setCheck(key)
            else {
                setCheck(-1)
                setIsEdit(!isEdit)
            }
        }
        else {
            setCheck(key)
            setIsEdit(!isEdit)
        }
    }

    return (
        <div className='table-container'>
            <h4 className='table-title'>{tableTitle || ''}</h4>
            <div className='table-headers'>
                {
                    headers.map((header, i) => <h4 key={i} className='table-header'>{header}</h4>)
                }
            </div>
            {
                rowData.length ?
                    <>
                        {rowData.map((row, i) => i < maxItems &&
                            <div
                                key={i}
                                className='table-row'
                                onClick={() => handleCheck(i)}
                                style={{ backgroundColor: check === i ? '#CCA43B' : i % 2 === 0 ? '#eaeaea' : 'white' }}>
                                <h4 className='table-row-item'>{new Date(row.date).toLocaleDateString()}</h4>
                                <h4 className='table-row-item'>{row.author || 'n/a'}</h4>
                                <h4 className='table-row-item detail'>{row.detail || 'n/a'}</h4>
                                <h4 className='table-row-item'>{row.category || 'n/a'}</h4>
                                <h4 className='table-row-item'>{row.pay_type || 'n/a'}</h4>
                                <h4 className='table-row-item'>${row.amount || 'n/a'}</h4>
                            </div>
                        )}
                        {maxItems < rowData.length &&
                            <button className='table-lazy-btn' onClick={() => setMaxItems(maxItems + 10)}>▼</button>
                        }
                    </>
                    :
                    <div className='table-row' style={{ backgroundColor: '#E5E5E5', height: '2.5vw', justifyContent: 'center' }}>
                        No hay movimientos para mostrar.
                    </div>
            }
        </div>
    )
}
