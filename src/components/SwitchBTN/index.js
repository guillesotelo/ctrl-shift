import React from 'react'
import './styles.css'

export default function SwitchBTN(props) {

    const {
        onChangeSw,
        sw,
        label,
        style
    } = props

    return (
        <div className='switch-container' style={style}>
            <h4 className='switch-label'>{label || ''}</h4>
            <div className='switch-box' onClick={() => onChangeSw()}>
                <div className={sw ? 'switch-off' : 'switch-on'} style={{ backgroundColor: sw ? '' : '#535353' }}>{sw ? '' : 'NO'}</div>
                <div className={sw ? 'switch-on' : 'switch-off'}>{sw ? 'SI' : ''}</div>
            </div>
        </div>
    )
}
