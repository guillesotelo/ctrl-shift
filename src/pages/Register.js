import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from "react-redux";
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import Logo from '../assets/logo.png'
import { createUser, logIn } from '../store/reducers/user'
import { APP_COLORS } from '../constants/colors'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    const [data, setData] = useState({})
    const dispatch = useDispatch()
    const history = useHistory()

    const updateData = (key, newData) => {
        setData({ ...data, [key]: newData })
    }

    const onRegister = async () => {
        try {
            if (!checkData()) return toast.error('Revisa los datos')
            if (data.password.length < 4) return toast.error('La contraseña debe tener al menos 4 caracteres')

            const newUser = await dispatch(createUser(data)).then(data => data.payload)
            if (newUser) {
                const login = await dispatch(logIn(data)).then(data => data.payload)
                if (login) {
                    localStorage.setItem('user', JSON.stringify(login))
                    toast.info(`Bienvenid@, ${login.username}!`)
                    setTimeout(() => history.push('/ledger'), 2000)
                }

            } else return toast.error('Error en el registro')
        } catch (err) { console.error(err) }
    }

    const checkData = () => {
        if (!data.password2 || !data.password || data.password2 !== data.password) return false
        if (!data.email.includes('@') || !data.email.includes('.')) return false
        return true
    }

    return (
        <div className='login-container'>
            <ToastContainer autoClose={2000} />
            <div className='logo-register-container'>
                <img className='logo-img-register' src={Logo} alt="Ctrol Shiflt" />
            </div>
            <div className='login-section'>
                <h4 className='hi-login'>Primera vez por aquí?</h4>
                <InputField
                    label=''
                    updateData={updateData}
                    placeholder='Tu nombre'
                    name='username'
                    type='text'
                    style={{ fontWeight: 'normal', fontSize: '4vw' }}
                    autoComplete='new-password'
                />
                <InputField
                    label=''
                    updateData={updateData}
                    placeholder='Email'
                    name='email'
                    type='email'
                    style={{ fontWeight: 'normal', fontSize: '4vw' }}
                    autoComplete='new-password'
                />
                <InputField
                    label=''
                    updateData={updateData}
                    placeholder='Contraseña'
                    name='password'
                    type='password'
                    style={{ fontWeight: 'normal', fontSize: '4vw' }}
                    autoComplete='new-password'
                />
                <InputField
                    label=''
                    updateData={updateData}
                    placeholder='Reingresa la contraseña'
                    name='password2'
                    type='password'
                    style={{ fontWeight: 'normal', fontSize: '4vw' }}
                    autoComplete='new-password'
                />
                <CTAButton
                    label='Registrarme'
                    handleClick={onRegister}
                    size='100%'
                    color={APP_COLORS.SPACE}
                    style={{ marginTop: '6vw', fontSize: '4vw' }}
                    className='cta-register'
                />
                <CTAButton
                    label='Volver'
                    handleClick={() => history.goBack()}
                    size='100%'
                    color={APP_COLORS.GRAY}
                    style={{ marginTop: '10vw', fontSize: '4vw' }}
                />
            </div>
        </div>
    )
}
