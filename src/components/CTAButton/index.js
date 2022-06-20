import React from 'react'
import { APP_COLORS } from '../../constants/colors'
import './styles.css'

export default function CTAButton(props) {
    const { 
        label, 
        color, 
        size, 
        style, 
        handleClick, 
        disabled 
    } = props

    const buttonStyle = {
        ...style,
        width: size || '50%',
        padding: '3vw',
        backgroundColor: color || APP_COLORS.BLUE,
        opacity: disabled ? 0.25 : 1
    }

    return (
        <div className='cta-btn-container'>
            <button onClick={handleClick} style={buttonStyle} className='cta-btn' disabled={disabled || false}>
                {label || 'Siguiente'}
            </button>
        </div>
    )
}
