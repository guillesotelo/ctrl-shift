import React from 'react'
import './styles.css'

export default function SwitchBTN(props) {

    const {
        onChangeSw,
        sw,
        label
    } = props

    return (
        <div className='switch-container'>
            <h4 className='switch-label'>{label || ''}</h4>
            <div className='switch-box' onClick={() => onChangeSw()}>
                <div className={sw ? 'switch-off' : 'switch-on'} style={{ backgroundColor: sw ? '' : '#535353' }}>{sw ? '' : 'OFF'}</div>
                <div className={sw ? 'switch-on' : 'switch-off'}>{sw ? 'ON' : ''}</div>
            </div>
        </div>
    )
}
