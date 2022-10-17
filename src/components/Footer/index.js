import React from 'react'
import { useSelector } from 'react-redux'
import './styles.css'
import Logo from '../../assets/logo.png'

export default function Footer() {
    const hasMovs = useSelector(state => state.movement && state.movement.data && state.movement.data.length)

    return (
        <div className='footer-container' style={{ position: !hasMovs ? 'absolute' : '' }}>
            <img className='logo-footer' src={Logo} alt="Ctrol Shiflt" />
            <div className='footer-text'>
                <p>
                    CtrlShift © 2022
                </p>
            </div>
        </div>
    )
}
