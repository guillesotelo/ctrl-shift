import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getLedger } from '../../store/reducers/ledger';
import Logo from '../../assets/logo.png'
import './styles.css'

export default function SplashScreen() {

    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem('user'))
        const localLedger = JSON.parse(localStorage.getItem('ledger'))
        
        if (!localUser || !localUser.email) history.push('/login')
        if (!localLedger || !localLedger.email) history.push('/ledger')

        getUpdatedLedger(localLedger.id)
    }, [])

    const getUpdatedLedger = async ledgerId => {
        const updatedLedger = await dispatch(getLedger(ledgerId)).then(data => data.payload)
        if(updatedLedger) setTimeout(() => history.push('/home'), 2000)
      }

    return (
        <div className='slpash-container'>
            <div className='logo-login-container'>
                <img className='logo-img' src={Logo} alt="Control Shift" />
            </div>
        </div>
    )
}
