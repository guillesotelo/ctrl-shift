import React, { useEffect, useState } from 'react'
import { APP_COLORS } from '../../constants/colors'
import './styles.css'

export default function DropdownBTN(props) {
    const { options, label, updateData, set, name } = props

    const handleChange = (newValue) => {
        const { value } = newValue.target
        updateData(name, value)
      }

    return (
        <div className='dropdown-btn-container'>
            <h4 style={{ color: APP_COLORS.GRAY }} className='dropdown-label'>{label || ''}</h4>
            <select id={label} className='dropdown-btn' onChange={handleChange}>
                {options.map((op, i) => 
                    <option key={i} className='dropdown-option' value={op}>{op}</option> 
                )}
            </select>
        </div>
    )
}
