import React from 'react'
import { useHistory } from 'react-router-dom'
import CTAButton from '../components/CTAButton'

export default function Menu(props) {
    const history = useHistory()

    const onClose = () => {
        history.push('/')
    }

  return (
    <div className='menu-container'>
        <div className='menu-items'>

        </div>
        <div className='menu-close-btn'>
            <CTAButton
            label='Cerrar'
            color='#363636'
            handleClick={onClose}
            />
        </div>
    </div>
  )
}
