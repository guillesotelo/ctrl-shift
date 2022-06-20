import React, { useState } from 'react'
import MenuIcon from '../../assets/menu-icon.svg'
import UserGroup from '../../assets/user-group.svg'
import Menu from '../Menu'
import { useHistory } from "react-router-dom";
import './styles.css'

export default function Header() {
  const [menuClass, setMenuClass] = useState('menu-hidden')
  const history = useHistory()
  const { name } = localStorage.getItem('ledger') ? JSON.parse(localStorage.getItem('ledger')) : {}

  const toggleMenu = () => {
    menuClass === 'menu-hidden' ? setMenuClass('menu-toggled') : setMenuClass('menu-hidden')
  }

  return (
    <>
      <div className='header-container'>
        <div onClick={() => history.push('/ledger')}>
           <img style={{ transform: 'scale(1.2)' }} className='svg-menu' src={UserGroup} alt="User Group" />
        </div>

        <div onClick={name ? () => history.push('/home') : () => {}}>
          <h4 className='user-group-title'>{name || ''}</h4>
        </div>  

        <div className='header-menu' onClick={() => toggleMenu()}>
          <img className='svg-menu' src={MenuIcon} alt="Menu" />
        </div>
      </div>
      <Menu menuClass={menuClass} setMenuClass={setMenuClass}/>
    </>
  )
}
