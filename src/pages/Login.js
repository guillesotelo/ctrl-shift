import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from "react-redux";
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import Logo from '../assets/logo.png'
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
                toast.info(`Bienvenid@, ${login.username}!`)
                setTimeout(() => history.push('/ledger'), 2000)
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
            <div className='logo-login-container'>
                <img className='logo-img' src={Logo} alt="Ctrol Shiflt" />
            </div>
            <div className='login-section'>
                <h4 className='hi-login'>Hola!<br />Ingresa tus credenciales para comenzar</h4>
                <InputField
                    label=''
                    updateData={updateData}
                    placeholder='Tu email'
                    name='email'
                    type='email'
                    style={{ fontWeight: 'normal', fontSize: '4vw' }}
                />
                <InputField
                    label=''
                    updateData={updateData}
                    placeholder='Tu contraseña'
                    name='password'
                    type='password'
                    style={{ fontWeight: 'normal', fontSize: '4vw' }}
                    autoComplete='false'
                />
                <CTAButton
                    label='Entrar'
                    handleClick={onLogin}
                    size='100%'
                    color={APP_COLORS.BLUE}
                    style={{ margin: '10vw', fontSize: '4vw' }}
                    className='cta-login'
                />
                <h4 className='login-register-text'>No tienes cuenta? <button onClick={goToRegister} className='login-register-link'>Registrate</button></h4>
            </div>
        </div>
    )
}
