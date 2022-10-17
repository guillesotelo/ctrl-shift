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
import { MESSAGE } from '../constants/messages'
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [data, setData] = useState({})
    const dispatch = useDispatch()
    const history = useHistory()
    const lan = navigator.language || navigator.userLanguage

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
                toast.info(`${MESSAGE[lan].WELCOME_TOAST}, ${login.username}!`)
                setTimeout(() => history.push(`${hasLedger ? '/' : '/ledger'}`), 2000)
            } else toast.error(MESSAGE[lan].WRONG_CREDENTIALS)
        } catch (_) { toast.error(MESSAGE[lan].LOGIN_ERROR) }
    }

    const handleFailure = () => toast.error(MESSAGE[lan].LOGIN_ERROR)

    const goToRegister = e => {
        e.preventDefault()
        history.push('/register')
    }

    return (
        <div className='login-container'>
            <ToastContainer autoClose={2000} />
            <div className='logo-login-container'>
                <img className='logo-img' src={Logo} alt="Control Shift" />
            </div>
            <div className='login-section'>
                <h4 className='hi-login'>{MESSAGE[lan].HI}<br />{MESSAGE[lan].HI_MESSAGE}</h4>
                <InputField
                    label=''
                    updateData={updateData}
                    placeholder='Email'
                    name='email'
                    type='email'
                    style={{ fontWeight: 'normal', fontSize: '4vw' }}
                />
                <InputField
                    label=''
                    updateData={updateData}
                    placeholder={MESSAGE[lan].PASS_PHR}
                    name='password'
                    type='password'
                    style={{ fontWeight: 'normal', fontSize: '4vw' }}
                />
                <CTAButton
                    label={MESSAGE[lan].LOGIN_BTN}
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
                <h4 className='login-register-text'>{MESSAGE[lan].LOGIN_REG_TEXT} <button onClick={goToRegister} className='login-register-link'>{MESSAGE[lan].LOGIN_REG_LINK}</button></h4>
            </div>
        </div>
    )
}
