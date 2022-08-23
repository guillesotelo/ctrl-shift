import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from "react-redux";
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import Logo from '../assets/logo.png'
import { logIn, googleAuth, createUser } from '../store/reducers/user'
import { APP_COLORS } from '../constants/colors'
import { ToastContainer, toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [data, setData] = useState({})
    const dispatch = useDispatch()
    const history = useHistory()

    const updateData = (key, newData) => {
        setData({ ...data, [key]: newData })
    }
    
    const onLogin = async googleData => {
        try {
            let login = {}
            if (googleData && googleData.credential) {
                const userData = await dispatch(googleAuth(googleData)).then(data => data.payload)
                const gData = {
                    isGoogleUser: true,
                    email: userData.email,
                    username: userData.name,
                    picture: userData.picture
                }
                login = await dispatch(logIn(gData)).then(data => data.payload)

                if(!login.username) {
                    const newUser = await dispatch(createUser(gData)).then(data => data.payload)
                    if (newUser) login = await dispatch(logIn(gData)).then(data => data.payload)        
                }
            } else login = await dispatch(logIn(data)).then(data => data.payload)
            if (login.username) {
                const hasLedger = login.defaultLedger
                toast.info(`Bienvenid@, ${login.username}!`)
                setTimeout(() => history.push(`${hasLedger ? '/home' : '/ledger'}`), 2000)
            } else toast.error('Credenciales incorrectas')
        } catch (_) { toast.error('Error al iniciar sesión') }
    }

    const handleFailure = () => toast.error('Error al iniciar sesión')

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
                />
                <CTAButton
                    label='Entrar'
                    handleClick={onLogin}
                    size='100%'
                    color={APP_COLORS.SPACE}
                    style={{ margin: '10vw', fontSize: '4vw' }}
                    className='cta-login'
                />
                {/* <GoogleLogin
                    onSuccess={googleData => onLogin(googleData)}
                    onError={handleFailure}
                    useOneTap
                    // auto_select
                    size='large'
                    text='continue_with'
                    shape='circle'
                /> */}
                <h4 className='login-register-text'>No tienes cuenta en Google? <button onClick={goToRegister} className='login-register-link'>Regístrate</button></h4>
            </div>
        </div>
    )
}
