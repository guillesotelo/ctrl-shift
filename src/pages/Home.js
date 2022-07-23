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
import { updateLedgerData } from '../store/reducers/ledger';
import { APP_COLORS } from '../constants/colors'
import { ToastContainer, toast } from 'react-toastify';
import "react-datepicker/dist/react-datepicker.css";
import 'react-toastify/dist/ReactToastify.css';
import SwitchBTN from '../components/SwitchBTN';

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
  const [authorChart, setAuthorChart] = useState({ labels: [], datasets: [] })
  const [budgetChart, setBudgetChart] = useState({ labels: [], datasets: [] })
  const [budgetChart2, setBudgetChart2] = useState({ labels: [], datasets: [] })
  const [openModal, setOpenModal] = useState(false)
  const [removeModal, setRemoveModal] = useState(false)
  const [dateClicked, setDateClicked] = useState(false)
  const [lastData, setLastData] = useState({})
  const [isEdit, setIsEdit] = useState(false)
  const [salary, setSalary] = useState(0)
  const [viewSalary, setViewSalary] = useState(false)
  const [budget, setBudget] = useState({})
  const [check, setCheck] = useState(-1)
  const [sw, setSw] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  console.log("arrData", arrData)

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'))
    const localLedger = JSON.parse(localStorage.getItem('ledger'))
    if (!localUser || !localUser.email) history.push('/')
    if (!localLedger || !localLedger.email) history.push('/')

    setUser(localUser)
    setLedger(localLedger)

    const { isMonthly } = JSON.parse(localLedger.settings)
    if (isMonthly) setSw(isMonthly)

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
      detail: '',
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
    if (!isNaN(debited)) setSalary(debited)
  }, [data.salary, arrData.length])

  useEffect(() => {
    renderCharts()
  }, [data, allCategories, allPayTypes, arrData, openModal])

  const renderCharts = () => {
    const categoryPattern = allCategories.map(_ => '#000000'.replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16) }))
    const payTypePattern = allPayTypes.map(_ => '#000000'.replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16) }))
    const authorPattern = allUsers.map(_ => '#000000'.replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16) }))

    const localLedger = JSON.parse(localStorage.getItem('ledger'))
    const { salary, isMonthly } = JSON.parse(localLedger.settings)

    const budgetArr = allCategories.map(cat => {
      const num = chartCalculator(arrData, cat, 'category')
      return (Number(budget[cat]).toFixed(1) * Number(salary) / 100) - num
    })

    if (isMonthly) setSw(isMonthly)

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

    setAuthorChart({
      labels: allUsers,
      datasets: [{
        data: allUsers.map(author => chartCalculator(arrData, author, 'author')),
        backgroundColor: authorPattern
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
  }

  const getAllMovements = async newData => {
    try {
      const movs = await dispatch(getMovements(newData)).then(d => d.payload)

      if (movs) {
        let filteredMovs = movs.data
        const localLedger = JSON.parse(localStorage.getItem('ledger'))
        const { isMonthly } = JSON.parse(localLedger.settings)
        if (isMonthly) setArrData(processMonthlyData(filteredMovs))
        else setArrData(filteredMovs)
        
        setLastData(movs.data[0])
      }
    } catch (err) { console.error(err) }
  }

  const processMonthlyData = allData => {
    if(allData) {
      return allData.filter(item => {
        const itemDate = new Date(item.date)
        const now = new Date()
        return now.getMonth() === itemDate.getMonth()
      })
    } else return []
  }

  const pullSettings = () => {
    const { settings } = JSON.parse(localStorage.getItem('ledger'))
    const _settings = JSON.parse(settings)
    if (_settings.budget) setBudget(_settings.budget)
  }

  const handleEdit = () => {
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
        toast.info('Gasto borrado!')
        setTimeout(() => getAllMovements(data), 1000)
      }
      else toast.error('Error al borrar')
      setCheck(-1)
      setIsEdit(false)
    } catch (err) { console.error(err) }
  }

  const checkDataOk = dataToCheck => {
    const num = dataToCheck.amount
    if (isNaN(num) || num < 2 || num === 0) return false
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
    try {
      if (checkDataOk(data)) {
        let saved = {}
        const submitData = data
        if (!submitData.detail) submitData.detail = '-'

        if (isEdit) saved = await dispatch(editMovement(submitData)).then(d => d.payload)
        else saved = await dispatch(saveMovement(submitData)).then(d => d.payload)

        if (saved && saved.status === 200) toast.success('Gasto guardado!')
        else toast.error('Error al guardar')

        setTimeout(() => getAllMovements(submitData), 1000)

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

        setBudgetChart({ labels: [], datasets: [] })
        setCategoryChart({ labels: [], datasets: [] })
        setTimeout(() => renderCharts(), 500)
      }
      else toast.error('Revisa los campos')
    } catch (err) { toast.error('Error al guardar') }
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
    if (arrData.length) {
      const csvData = arrData.map(mov => {
        return {
          'Fecha': (new Date(mov.date)).toLocaleDateString(),
          'Detalle': mov.detail,
          'Categoria': mov.category,
          'Tipo de Pago': mov.pay_type,
          'Usuario': mov.user,
          'Monto': mov.amount
        }
      })

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
    } else toast.info('No hay movimientos para extraer')
  }

  const updateData = (key, newData) => {
    if (key === 'search') {
      const filteredMovs = arrData.filter(mov =>
        mov.detail.toLowercase().includes(newData) ||
        mov.pay_type.toLowercase().includes(newData) ||
        mov.author.toLowercase().includes(newData) ||
        mov.category.toLowercase().includes(newData)
      )
      if (newData) setArrData(filteredMovs)
      else {
        const newData = {
          ...data,
          ledger: ledger.id || -1,
          user: ledger.email
        }
        getAllMovements(newData)
      }
    }
    else setData({ ...data, [key]: newData })
  }

  const onChangeSw = async () => {
    try {
      const newSettings = JSON.parse(ledger.settings)

      const newLedger = await dispatch(updateLedgerData({
        settings: JSON.stringify({ ...newSettings, isMonthly: !sw }),
        id: ledger.id
      })).then(data => data.payload)

      if (newLedger) {
        localStorage.removeItem('ledger')
        localStorage.setItem('ledger', JSON.stringify(newLedger.data))
        toast.info(`${!sw ? 'Cambiado a Movimientos Mensuales' : 'Cambiado a Todos los Movimientos'}`)
        setTimeout(() => {
          pullSettings()
          history.go(0)
        }, 2000)
        setSw(!sw)
      }

    } catch (err) {
      console.error(err)
      toast.error('Error de conexión')
    }
  }

  return (
    <div className='home-container'>
      <ToastContainer autoClose={2000} />
      {removeModal &&
        <div className='remove-modal'>
          <h3>Estas a punto de eliminar:<br /><br />'{arrData[check].detail}' - ${arrData[check].amount}</h3>
          <div className='remove-btns'>
            <CTAButton
              label='Cancelar'
              color={APP_COLORS.GRAY}
              handleClick={() => setRemoveModal(false)}
              size='fit-content'
            />
            <CTAButton
              label='Confirmar'
              color={APP_COLORS.BLUE}
              handleClick={() => {
                setRemoveModal(false)
                handleRemoveItem()
              }}
              size='fit-content'
            />
          </div>
        </div>
      }
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
        <div className='main-section' style={{ filter: (openModal || removeModal) && 'blur(10px)' }}>
          <CTAButton
            handleClick={handleEdit}
            label='Editar'
            size='80%'
            color={APP_COLORS.GRAY}
            disabled={!isEdit}
            style={{ fontSize: '4vw' }}
          />
          {isEdit &&
            <div onClick={() => setRemoveModal(true)}>
              <img style={{ transform: 'scale(0.7)' }} className='svg-trash' src={TrashCan} alt="Trash Can" />
            </div>
          }
          <CTAButton
            handleClick={() => {
              if(lastData.category) {
                setData({
                  ...data,
                  author: lastData.author,
                  pay_type: lastData.pay_type,
                  category: lastData.category
                })
              }
              setIsEdit(false)
              setOpenModal(!openModal)
            }}
            label='Nuevo Gasto'
            size='80%'
            color={APP_COLORS.YELLOW}
            style={{ color: 'black', fontSize: '4vw' }}
          />
        </div>
      }

      <div className='salary-div' onClick={() => setViewSalary(!viewSalary)} style={{ filter: (openModal || removeModal) && 'blur(10px)' }}>
        <h4 className='salary-text'>Saldo Actual:</h4>
        {
          viewSalary ? <h4 className='salary'>$ {salary.toLocaleString('us-US', { currency: 'ARS' })}</h4>
            : <img className='svg-eye' src={EyeClosed} alt="Show Salary" />
        }
      </div>

      <div style={{ filter: (openModal || removeModal) && 'blur(10px)' }} className='table-div'>
        <MovementsTable
          tableData={arrData}
          tableTitle='Movimientos'
          setIsEdit={setIsEdit}
          isEdit={isEdit}
          setCheck={setCheck}
          check={check}
        />
        <div className='sub-table-btns'>
          <SwitchBTN
            sw={sw}
            onChangeSw={onChangeSw}
            label='Mensual'
          />
          <CTAButton
            handleClick={downloadCSV}
            label='⇩ Extracto'
            size='fit-content'
            color={APP_COLORS.BLUE}
            style={{ fontSize: '3.5vw', margin: '2vw', alignSelf: 'flex-end', cursor: 'pointer' }}
          />
        </div>
        <div className='search-container'>
          <InputField
            label=''
            updateData={updateData}
            placeholder='Buscar movimiento...'
            type='text'
            name='search'
          />
        </div>
        <div className='div-charts'>
          <div className='separator' style={{ width: '85%' }}></div>
          {Object.keys(budget).length > 1 &&
            <>
              <BarChart chartData={budgetChart} title='Presupuesto por categoria' />
              <div className='separator' style={{ width: '85%' }}></div>
              <PieChart chartData={budgetChart2} title='Porcentaje total %' />
            </>
          }
          <div className='separator' style={{ width: '85%' }}></div>
          <BarChart chartData={categoryChart} title='Categorias' />
          <div className='separator' style={{ width: '85%' }}></div>
          <PolarChart chartData={typeChart} title='Tipos de Pago' />
          <div className='separator' style={{ width: '85%' }}></div>
          <PolarChart chartData={authorChart} title='Autores' />
        </div>
      </div>
    </div>
  )
}
