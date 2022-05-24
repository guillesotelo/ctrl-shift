import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from "react-redux";
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
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
            if (!data.password2 || !data.password || data.password2 !== data.password) {
                return toast.error('Chequea los datos')
            }
            const newUser = await dispatch(createUser(data)).then(data => data.payload)
            if (newUser) {
                const login = await dispatch(logIn(data)).then(d => d.payload)
                if (login) {
                    toast.success('Bienvenid@!')
                    localStorage.setItem('user', login)
                    history.push('/home')
                }

            } else return toast.error('Error en el registro')
        } catch (err) { console.error(err) }
    }

    return (
        <div className='login-container'>
            <ToastContainer autoClose={2000} />
            <div className='logo-container'>
                <h1 className='text-ctrl'>Ctrl</h1>
                <h2 className='text-shift'>Shift↑</h2>
            </div>
            <div className='login-section'>
                <h4 className='hi-login'>Nuevo por aqui?</h4>
                <InputField
                    label=''
                    updateData={updateData}
                    placeholder='Tu nombre'
                    name='username'
                    type='text'
                    style={{ fontWeight: 'normal' }}
                    autoComplete='false'
                />
                <InputField
                    label=''
                    updateData={updateData}
                    placeholder='Email'
                    name='email'
                    type='email'
                    style={{ fontWeight: 'normal' }}
                    autoComplete='false'
                />
                <InputField
                    label=''
                    updateData={updateData}
                    placeholder='Contraseña'
                    name='password'
                    type='password'
                    style={{ fontWeight: 'normal' }}
                    autoComplete='false'
                />
                <InputField
                    label=''
                    updateData={updateData}
                    placeholder='Reingresa contrasenia'
                    name='password2'
                    type='password'
                    style={{ fontWeight: 'normal' }}
                    autoComplete='false'
                />
                <CTAButton
                    label='Registrarme'
                    handleClick={onRegister}
                    size='100%'
                    color={APP_COLORS.BLUE}
                    style={{ marginTop: '6vw' }}
                />
                <CTAButton
                    label='Atras'
                    handleClick={() => history.push('/')}
                    size='100%'
                    color={APP_COLORS.GRAY}
                    style={{ marginTop: '3vw' }}
                />
            </div>
        </div>
    )
}
