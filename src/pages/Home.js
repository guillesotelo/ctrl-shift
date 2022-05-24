import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import CTAButton from '../components/CTAButton'
import DropdownBTN from '../components/DropdownBTN'
import InputField from '../components/InputField'
import MovementsTable from '../components/MovementsTable'
import { getMovements, saveMovement } from '../store/reducers/movement'
import { APP_COLORS } from '../constants/colors'
import { ToastContainer, toast } from 'react-toastify';
import "react-datepicker/dist/react-datepicker.css";
import 'react-toastify/dist/ReactToastify.css';
import { setUserVoid } from '../store/services/reduxServices';

export default function Home() {
  const [data, setData] = useState({})
  const [user, setUser] = useState({})
  const [arrData, setArrData] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [payTypes, setPayTypes] = useState([])
  const [categories, setCategories] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [dateClicked, setDateClicked] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'))
    if (!localUser || !localUser.email) history.push('/')

    setUser(localUser)
    
    const users = ['Guille', 'Dany']
    const types = [
      'Efectivo',
      'Debito / Transf.',
      'TC'
    ]
    const categorie = [
      'n/a',
      'Mercado',
      'Gasto Fijo',
      'Luxury',
      'Auto',
      'Bespoken',
      'Varios',
    ]

    setAllUsers(users)
    setPayTypes(types)
    setCategories(categorie)

    setData({
      ...data,
      pay_type: types[0],
      author: localUser.username,
      amount: 0,
      date: new Date(),
      category: categories[0]
    })

    getAllMovements()

  }, [])

  const getAllMovements = async () => {
    try {
      const movs = await dispatch(getMovements()).then(data => data.payload)
      if (movs) setArrData(movs.data)
    } catch (err) { console.error(err) }
  }

  const handleClick = () => {
    setOpenModal(!openModal)
  }

  const checkDataOk = dataToCheck => {
    const num = dataToCheck.amount
    if (isNaN(num) || num < 2 || num === 0) return false
    return true
  }


  const handleSave = async () => {
    if (checkDataOk(data)) {
      const saved = await dispatch(saveMovement(data)).then(d => d.payload)
      if (saved) toast.success('Gasto guardado!')
      else toast.error('Error al guardar')
      getAllMovements()
      setOpenModal(false)
    }
    else toast.error('Datos no validos')
  }

  const handleCancel = () => {
    setOpenModal(false)
  }

  const updateData = (key, newData) => {
    setData({ ...data, [key]: newData })
  }

  return (
    <div className='home-container'>
      <ToastContainer autoClose={2000} />
      {openModal ?
        <div className='fill-section-container'>
          <h3 style={{ color: APP_COLORS.GRAY }}>Info del pago:</h3>
          <div className='fill-section'>
            <CTAButton
              handleClick={() => setDateClicked(!dateClicked)}
              label={data.date.toLocaleDateString()}
              size='100%'
              color={APP_COLORS.BLUE}
            />
            {dateClicked &&
              <DatePicker
                selected={data.date || ''}
                onChange={date => {
                  updateData('date', date)
                  setTimeout(() => setDateClicked(false), 200)
                }
                }
                dateFormat="dd/MM/YYY"
                inline
              />
            }
            <InputField
              label=''
              updateData={updateData}
              placeholder='$ -'
              name='amount'
              type='number'
            />
            <InputField
              label=''
              updateData={updateData}
              placeholder='Detalle del gasto...'
              name='detail'
              type='text'
            />
            <DropdownBTN
              options={allUsers}
              label='Autor'
              name='author'
              updateData={updateData}
            />
            <DropdownBTN
              options={payTypes}
              label='Tipo de pago'
              name='pay_type'
              updateData={updateData}
            />
            <DropdownBTN
              options={categories}
              label='Categoria'
              name='category'
              updateData={updateData}
            />
            <div className='div-modal-btns'>
              <CTAButton
                handleClick={handleCancel}
                label='Cancelar'
                size='100%'
                color={APP_COLORS.GRAY}
              />
              <CTAButton
                handleClick={handleSave}
                label='Guardar'
                size='100%'
                color={APP_COLORS.YELLOW}
              />
            </div>
          </div>
        </div>
        :
        <div className='main-section'>
          <CTAButton
            handleClick={handleClick}
            label='Nuevo Gasto'
          />
        </div>
      }
      <MovementsTable
        tableData={arrData}
        tableTitle='Movimientos'
      />
    </div>
  )
}
