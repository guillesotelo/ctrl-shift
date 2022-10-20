import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import AccountIcon from '../assets/account-icon.svg'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import Dropdown from 'react-bootstrap/Dropdown'
import Flag from 'react-world-flags'
import { LANGUAGES } from '../constants/languages.js'
import { MESSAGE } from '../constants/messages'
import { APP_COLORS } from '../constants/colors'
import { updateUserData } from '../store/reducers/user'
import { getUserLanguage } from '../helpers';
import { toast } from 'react-toastify'

export default function Account() {
  const [data, setData] = useState({})
  const [showPassBox, setShowPassBox] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))
  const ledger = JSON.parse(localStorage.getItem('ledger'))
  const dispatch = useDispatch()
  const history = useHistory()
  const lan = useSelector(state => state.user && state.user.language || getUserLanguage())

  const [toggleContents, setToggleContents] = useState(<><Flag code={'us'} height="16" />{MESSAGE[lan].SET_LAN}</>)

  const updateData = (key, newData) => {
    setData({ ...data, [key]: newData })
  }

  const saveUserData = async () => {
    try {
      const saved = await dispatch(updateUserData(data)).then(data => data.payload)
      if(saved) toast.success(MESSAGE[lan].SET_SUCC)
      else toast.error(MESSAGE[lan].SAVE_ERR)
    } catch (err) { }
  }

  return (
    <div className='account-container'>
      <div className='account-info'>
        <img style={{ transform: 'scale(1.2)' }} className='svg-account' src={AccountIcon} alt="User Group" />
        <div style={{ borderLeft: '1px solid lightgray', height: '20vw' }}></div>
        <div className='info-section'>
          <h3><b>{MESSAGE[lan].NAME}: </b>{user.username}</h3>
          <h3><b>Email: </b>{user.email}</h3>
          {ledger ? <h3><b>{MESSAGE[lan].LEDGER}: </b>{ledger.name}</h3>
            :
            <button onClick={() => history.push('/ledger')} className='login-register-link'>{MESSAGE[lan].CONN_LED}</button>
          }
        </div>
      </div>
      {/* <Dropdown
        style={{ margin: '2vw 0' }}
        onSelect={selected => {
          const { code, title } = LANGUAGES.find(({ code }) => selected === code)

          updateData('language', selected)
          setToggleContents(<><Flag code={code} height="16" /> {title}</>)
        }}
      >
        <Dropdown.Toggle variant="secondary" id="cta-btn" className="text-left" style={{ width: '100%' }}>
          {toggleContents}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {LANGUAGES.map(({ code, title }) => (
            <Dropdown.Item key={code} eventKey={code}><Flag height="16" code={code} /> {title}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown> */}
      {/* <CTAButton
        label='Change Password'
        handleClick={() => setShowPassBox(true)}
        size='55%'
        color={APP_COLORS.SPACE}
        style={{ marginTop: '6vw', fontSize: '4vw' }}
      />
      {showPassBox &&
        <>
          <InputField
            label=''
            updateData={updateData}
            placeholder={MESSAGE[lan].PASS_PHR}
            name='password'
            type='text'
            style={{ fontWeight: 'normal', fontSize: '4vw' }}
            autoComplete='new-password'
          />
          <InputField
            label=''
            updateData={updateData}
            placeholder={MESSAGE[lan].PASS2}
            name='password2'
            type='text'
            style={{ fontWeight: 'normal', fontSize: '4vw' }}
            autoComplete='new-password'
          />
        </>
      }
      {(showPassBox || data.language) &&
        <CTAButton
          label='Save'
          handleClick={() => saveUserData()}
          size='55%'
          color={APP_COLORS.SPACE}
          style={{ marginTop: '6vw', fontSize: '4vw' }}
        />
      } */}
    </div>
  )
}
