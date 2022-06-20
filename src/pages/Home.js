import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom'
import { ExportToCsv } from 'export-to-csv';
import DatePicker from 'react-datepicker'
import CTAButton from '../components/CTAButton'
import DropdownBTN from '../components/DropdownBTN'
import InputField from '../components/InputField'
import MovementsTable from '../components/MovementsTable'
import BarChart from '../components/BarChart'
import PieChart from '../components/PieChart'
import PolarChart from '../components/PolarChart'
import TrashCan from '../assets/trash-can.svg'
import EyeClosed from '../assets/eye-closed.svg'
import { getMovements, saveMovement, editMovement, removeMovement } from '../store/reducers/movement'
import { APP_COLORS } from '../constants/colors'
import { ToastContainer, toast } from 'react-toastify';
import "react-datepicker/dist/react-datepicker.css";
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [data, setData] = useState({})
  const [user, setUser] = useState({})
  const [ledger, setLedger] = useState('')
  const [arrData, setArrData] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [allPayTypes, setAllPayTypes] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [categoryChart, setCategoryChart] = useState({ labels: [], datasets: [] })
  const [typeChart, setTypeChart] = useState({ labels: [], datasets: [] })
  const [budgetChart, setBudgetChart] = useState({ labels: [], datasets: [] })
  const [budgetChart2, setBudgetChart2] = useState({ labels: [], datasets: [] })
  const [openModal, setOpenModal] = useState(false)
  const [dateClicked, setDateClicked] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [salary, setSalary] = useState(0)
  const [viewSalary, setViewSalary] = useState(false)
  const [budget, setBudget] = useState({})
  const [check, setCheck] = useState(-1)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'))
    const localLedger = JSON.parse(localStorage.getItem('ledger'))
    if (!localUser || !localUser.email) history.push('/')
    if (!localLedger || !localLedger.email) history.push('/')

    setUser(localUser)
    setLedger(localLedger)

    const {
      authors,
      categories,
      payTypes,
      salary
    } = JSON.parse(localLedger.settings)

    setAllUsers(authors)
    setAllPayTypes(payTypes)
    setAllCategories(categories)

    const newData = {
      ...data,
      pay_type: payTypes[0],
      author: authors[0],
      amount: 0,
      date: new Date(),
      category: categories[0],
      ledger: localLedger.id || -1,
      user: localUser.email,
      salary
    }

    setData(newData)

    getAllMovements(newData)

    pullSettings()

  }, [])

  useEffect(() => {
    const debited = data.salary - arrData.reduce((item, current) => item + Number(current.amount), 0)
    setSalary(debited)
  }, [data.salary, arrData.length])

  useEffect(() => {
    const categoryPattern = allCategories.map(_ => '#' + Math.floor(Math.random() * 16777215).toString(16))
    const payTypePattern = allPayTypes.map(_ => '#' + Math.floor(Math.random() * 16777215).toString(16))
    const localLedger = JSON.parse(localStorage.getItem('ledger'))
    const { salary } = JSON.parse(localLedger.settings)

    const budgetArr = allCategories.map(cat => {
      const num = chartCalculator(arrData, cat, 'category')
      return (Number(budget[cat]) * Number(salary) / 100) - num
    })

    const budgetPattern = budgetArr.map(item => item > 0 ? '#A5DF6A' : '#DF736A')

    setCategoryChart({
      labels: allCategories,
      datasets: [{
        data: allCategories.map(cat => chartCalculator(arrData, cat, 'category')),
        backgroundColor: categoryPattern
      }]
    })

    setTypeChart({
      labels: allPayTypes,
      datasets: [{
        data: allPayTypes.map(type => chartCalculator(arrData, type, 'pay_type')),
        backgroundColor: payTypePattern
      }]
    })

    setBudgetChart({
      labels: allCategories,
      datasets: [{
        data: budgetArr,
        backgroundColor: budgetPattern
      }]
    })

    setBudgetChart2({
      labels: allCategories.map(c => c + ' %'),
      datasets: [{
        data: allCategories.map(cat => budget[cat]),
        backgroundColor: categoryPattern
      }]
    })

  }, [data, allCategories, allPayTypes, arrData])

  const getAllMovements = async newData => {
    try {
      const movs = await dispatch(getMovements(newData)).then(d => d.payload)
      if (movs) setArrData(movs.data)
    } catch (err) { console.error(err) }
  }

  const pullSettings = () => {
    const { settings } = JSON.parse(localStorage.getItem('ledger'))
    const _settings = JSON.parse(settings)
    if (_settings.budget) setBudget(_settings.budget)
  }

  const handleClick = () => {
    if (isEdit) {
      const item = arrData[check]
      setData({
        ...item,
        date: new Date(item.date)
      })
    }
    setOpenModal(!openModal)
  }

  const handleRemoveItem = async () => {
    try {
      const removed = await dispatch(removeMovement(arrData[check])).then(d => d.payload)
      if (removed) {
        toast.success('Gasto borrado!')
        setTimeout(() => getAllMovements(data), 2000)
      }
      else toast.error('Error al borrar')
      setCheck(-1)
      setIsEdit(false)
    } catch (err) { console.error(err) }
  }

  const checkDataOk = dataToCheck => {
    const num = dataToCheck.amount
    if (isNaN(num) || num < 2 || num === 0 || !dataToCheck.detail) return false
    return true
  }

  const chartCalculator = (data, col, type) => {
    let sum = 0
    data.forEach(mov => {
      if (mov[type] === col) sum += parseInt(mov.amount)
    })
    return sum
  }

  const handleSave = async () => {

    if (checkDataOk(data)) {
      const saved = await isEdit ? dispatch(editMovement(data)).then(d => d.payload) : dispatch(saveMovement(data)).then(d => d.payload)
      if (saved) toast.success('Gasto guardado!')
      else toast.error('Error al guardar')

      setTimeout(() => getAllMovements(data), 2000)

      setData({
        ...data,
        pay_type: allPayTypes[0],
        category: allCategories[0],
        author: allUsers[0],
        amount: '',
        detail: '',
        date: new Date(),
        ledger: ledger.id,
        user: user.email
      })
      setOpenModal(false)
      setIsEdit(false)
      setCheck(-1)
    }
    else toast.error('Chequea los campos')
  }

  const handleCancel = () => {
    setIsEdit(false)
    setCheck(-1)
    setOpenModal(false)
    setData({
      ...data,
      amount: '',
      detail: '',
      pay_type: allPayTypes[0],
      category: allCategories[0],
      author: allUsers[0],
      date: new Date(),
    })
  }

  const downloadCSV = () => {
    const csvData = arrData.map(el => {
        return {
          'Fecha': el.date,
          'Detalle': el.detail,
          'Categoria': el.category,
          'Tipo de Pago': el.pay_type,
          'Usuario': el.user,
          'Monto': el.amount
        }
      }
    )
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: `Movimientos del Libro "${ledger.name}"`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      filename: `Extracto de ${ledger.name}`
    }
    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(csvData);
  }

  const updateData = (key, newData) => {
    setData({ ...data, [key]: newData })
  }

  return (
    <div className='home-container'>
      <ToastContainer autoClose={2000} />
      {openModal &&
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
              value={data.amount || ''}
            />
            <InputField
              label=''
              updateData={updateData}
              placeholder='Detalle del gasto...'
              name='detail'
              type='text'
              value={data.detail}
            />
            <DropdownBTN
              options={allUsers}
              label='Autor'
              name='author'
              updateData={updateData}
              value={data.author}
            />
            <DropdownBTN
              options={allPayTypes}
              label='Tipo de pago'
              name='pay_type'
              updateData={updateData}
              value={data.pay_type}
            />
            <DropdownBTN
              options={allCategories}
              label='Categoria'
              name='category'
              updateData={updateData}
              value={data.category}
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
      }{
        <div className='main-section' style={{ filter: openModal && 'blur(10px)' }}>
          <CTAButton
            handleClick={handleClick}
            label='Editar'
            size='80%'
            color={APP_COLORS.GRAY}
            disabled={!isEdit}
            style={{ fontSize: '4vw' }}
          />
          {isEdit &&
            <div onClick={handleRemoveItem}>
              <img style={{ transform: 'scale(0.7)' }} className='svg-trash' src={TrashCan} alt="Trash Can" />
            </div>
          }
          <CTAButton
            handleClick={() => {
              setIsEdit(false)
              handleClick()
            }}
            label='Nuevo Gasto'
            size='80%'
            color={APP_COLORS.YELLOW}
            style={{ color: 'black', fontSize: '4vw' }}
          />
        </div>
      }

      <div className='salary-div' style={{ filter: openModal && 'blur(10px)' }}>
        <h4>Saldo Actual:</h4>
        {
          viewSalary ? <h4 onClick={() => setViewSalary(false)} className='salary'>$ {salary.toLocaleString('us-US', { currency: 'ARS' })}</h4>
            : <img onClick={() => setViewSalary(true)} style={{}} className='svg-menu' src={EyeClosed} alt="Show Salary" />
        }
      </div>

      <div style={{ filter: openModal && 'blur(10px)' }}>
        <MovementsTable
          tableData={arrData}
          tableTitle='Movimientos'
          setIsEdit={setIsEdit}
          setCheck={setCheck}
          check={check}
        />
        <CTAButton
          handleClick={downloadCSV}
          label='⇩ CSV'
          size='25%'
          color={APP_COLORS.BLUE}
          style={{ fontSize: '3.5vw', margin: '2vw', alignSelf: 'flex-end' }}
        />
        <div style={{ borderTop: '1px solid lightgray', margin: '10vw 2vw' }}></div>
        <BarChart chartData={categoryChart} title='Categorias' />
        <div style={{ borderTop: '1px solid lightgray', margin: '10vw 2vw' }}></div>
        {Object.keys(budget).length &&
          <>
            <BarChart chartData={budgetChart} title='Presupuesto por categoria' />
            <h4 className='table-title' style={{ marginTop: 30 }}>Porcentaje total %</h4>
            <PieChart chartData={budgetChart2} title='' />
          </>
        }
        <div style={{ borderTop: '1px solid lightgray', margin: '10vw 2vw' }}></div>
        <PolarChart chartData={typeChart} title='Tipos de Pago' />
      </div>
    </div>
  )
}
