import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import CTAButton from '../CTAButton'
import { VERSION } from '../../constants/app'
import './styles.css'

export default function Menu(props) {
  const { menuClass, setMenuClass } = props
  const history = useHistory()
  const { name } = localStorage.getItem('ledger') && 
  localStorage.getItem('ledger') !== null ? JSON.parse(localStorage.getItem('ledger')) : {}

  const handleLogOut = () => {
    setMenuClass('menu-hidden')
    localStorage.removeItem('user')
    localStorage.removeItem('ledger')
    history.push('/')
  }

  const handleAccount = () => {
    history.push('/account')
    setMenuClass('menu-hidden')
  }

  return (
    <div className={`menu-container ${menuClass}`}>
      <div className='menu-items'>
        <CTAButton
          label='Mi cuenta'
          color='#263d42'
          handleClick={handleAccount}
          size='100%'
          style={{ color: '#CCA43B', fontSize: '5vw' }}
          className='cta-menu'
        />
        {
          name &&
          <>
            <CTAButton
              label='Movimientos'
              color='#263d42'
              handleClick={() => {
                setMenuClass('menu-hidden')
                history.push('/home')
              }}
              size='100%'
              style={{ color: '#CCA43B', fontSize: '5vw', marginTop: '2vw' }}
            />
            <CTAButton
              label='Ajustes'
              color='#263d42'
              handleClick={() => {
                setMenuClass('menu-hidden')
                history.push('/settings')
              }}
              size='100%'
              style={{ color: '#CCA43B', fontSize: '5vw', marginTop: '2vw' }}
              className='cta-menu'
            />
            <CTAButton
              label='Notas'
              color='#263d42'
              handleClick={() => {
                setMenuClass('menu-hidden')
                history.push('/notes')
              }}
              size='100%'
              style={{ color: '#CCA43B', fontSize: '5vw', marginTop: '2vw' }}
              className='cta-menu'
            />
            <CTAButton
              label='Tareas'
              color='#263d42'
              handleClick={() => {
                setMenuClass('menu-hidden')
                history.push('/tasks')
              }}
              size='100%'
              style={{ color: '#CCA43B', fontSize: '5vw', marginTop: '2vw' }}
              className='cta-menu'
            />
          </>
        }
        <CTAButton
          label='Cerrar sesion'
          color='#263d42'
          handleClick={handleLogOut}
          size='100%'
          style={{ color: '#CCA43B', fontSize: '5vw', marginTop: '2vw' }}
          className='cta-menu'
        />
      </div>
      <h4 className='app-version'>{VERSION}</h4>
    </div>
  )
}
