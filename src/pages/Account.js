import React from 'react'
import { useHistory } from 'react-router-dom'
import AccountIcon from '../assets/account-icon.svg'

export default function () {

    const user = JSON.parse(localStorage.getItem('user'))
    const ledger = JSON.parse(localStorage.getItem('ledger'))
    const history = useHistory()

  return (
    <div className='account-container'>
        <img style={{ transform: 'scale(1.2)' }} className='svg-account' src={AccountIcon} alt="User Group" />
        <div style={{ borderLeft: '1px solid lightgray', height: '20vw'}}></div>
        <div className='info-section'>
            <h3><b>Nombre: </b>{user.username}</h3>
            <h3><b>Email: </b>{user.email}</h3>
            {ledger ? <h3><b>Libro Conectado: </b>{ledger.name}</h3>
                : 
                <button onClick={() => history.push('/ledger')} className='login-register-link'>Crear / Conectar Libro</button>
            }
        </div>
    </div>
  )
}
