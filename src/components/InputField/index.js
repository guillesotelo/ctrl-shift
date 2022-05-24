import React from 'react'
import { APP_COLORS } from '../../constants/colors'
import './styles.css'

export default function InputField(props) {
    const { 
        name, 
        type, 
        label, 
        placeholder,
        size, 
        style, 
        updateData,
        autoComplete
    } = props

    const handleChange = (newValue) => {
        const { valueAsNumber, value } = newValue.target
        if(type === 'number') {
            updateData(name, valueAsNumber)
        }
        else {
            updateData(name, value)
        }
      }

    return (
        <div className='inputfield-container'>
            <h4 style={{ color: APP_COLORS.GRAY }} className='inputfield-label'>{label || ''}</h4>
            <input
                className='inputfield-field'
                autoComplete={autoComplete || 'true'}
                onChange={handleChange} 
                placeholder={placeholder || ''}
                type={type || 'text'}
                style={style || null}
                />
        </div>
    )
}
