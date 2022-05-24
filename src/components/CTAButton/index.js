import React from 'react'
import { APP_COLORS } from '../../constants/colors'
import './styles.css'

export default function CTAButton(props) {
    const { label, color, size, style, handleClick } = props

    const buttonStyle = {
        ...style,
        width: size || '50%',
        padding: '3vw',
        backgroundColor: color || APP_COLORS.BLUE,
    }

    return (
        <div className='cta-btn-container'>
            <button onClick={handleClick} style={buttonStyle} className='cta-btn'>
                {label || 'Siguiente'}
            </button>
        </div>
    )
}
