import React from 'react'
import MenuIcon from '../../assets/menu-icon.svg'
import { useHistory } from "react-router-dom";
import './styles.css'

export default function Header() {

    const history = useHistory()

  return (
    <div className='header-container'>
        <div>

        </div>

        <div>

        </div>

        <div className='header-menu' onClick={() => history.push('/menu')}>
            <img className='svg-menu' src={MenuIcon} alt="Menu" />
        </div>
    </div>
  )
}
