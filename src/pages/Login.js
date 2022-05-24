import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from "react-redux";
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { logIn } from '../store/reducers/user'
import { APP_COLORS } from '../constants/colors'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [data, setData] = useState({})
    const dispatch = useDispatch()
    const history = useHistory()

    const updateData = (key, newData) => {
        setData({ ...data, [key]: newData })
    }

    const onLogin = async () => {
        try {
            const login = await dispatch(logIn(data)).then(data => data.payload)
            if (login) {
                localStorage.setItem('user', JSON.stringify(login))
                toast.success('Bienvenid@!')
                history.push('/home')
            } else toast.error('Credenciales incorrectas')
        } catch (_) { toast.error('Credenciales incorrectas') }
    }

    const goToRegister = e => {
        e.preventDefault()
        history.push('/register')
    }

    return (
        <div className='login-container'>
            <ToastContainer autoClose={2000} />
            <div className='logo-container'>
                <h1 className='text-ctrl'>Ctrl</h1>
                <h2 className='text-shift'>Shift↑</h2>
            </div>
            <div className='login-section'>
                <h4 className='hi-login'>Hola!<br />Ingresa tus credenciales para comenzar</h4>
                <InputField
                    label=''
                    updateData={updateData}
                    placeholder='Tu email'
                    name='email'
                    type='email'
                    style={{ fontWeight: 'normal' }}
                />
                <InputField
                    label=''
                    updateData={updateData}
                    placeholder='Tu contraseña'
                    name='password'
                    type='password'
                    style={{ fontWeight: 'normal' }}
                    autoComplete='false'
                />
                <CTAButton
                    label='Entrar'
                    handleClick={onLogin}
                    size='100%'
                    color={APP_COLORS.BLUE}
                    style={{ margin: '10vw' }}
                />
                <h4 className='login-register-text'>No tenes cuenta? <button onClick={goToRegister} className='login-register-link'>Registrate</button></h4>
            </div>
        </div>
    )
}
