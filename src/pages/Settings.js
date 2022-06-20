import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import { APP_COLORS } from '../constants/colors'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { updateLedgerData } from '../store/reducers/ledger';

export default function Settings() {
    const [data, setData] = useState({
        authors: [],
        payTypes: [],
        categories: [],
        salary: ''
    })
    const [newAuthor, setNewAuthor] = useState(false)
    const [newPayType, setNewPayType] = useState(false)
    const [newCategory, setNewCategory] = useState(false)
    const [newSalary, setNewSalary] = useState(false)
    const [budget, setBudget] = useState({ total: 100 })

    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        pullSettings()
    }, [])

    const updateData = (key, newData) => {
        if (key === 'newSalary') setNewSalary(true)
        setData({ ...data, [key]: newData })
    }

    const handleRemoveItem = (kind, index) => {
        const newItems = data[kind]
        newItems.splice(index, 1)
        const newData = { ...data }
        newData[kind] = newItems
        setData(newData)
    }

    const pullSettings = () => {
        const { settings, id } = JSON.parse(localStorage.getItem('ledger'))
        const _settings = JSON.parse(settings)
        setData({ ..._settings, id })
        if(_settings.budget) setBudget(_settings.budget)
    }

    const handleSave = async () => {
        try {
            const newLedger = await dispatch(updateLedgerData({ 
                settings: JSON.stringify({...data, budget}), 
                id: data.id 
            })).then(data => data.payload)

            if (newLedger) {
                localStorage.removeItem('ledger')
                localStorage.setItem('ledger', JSON.stringify(newLedger.data))
                toast.success('Guardado con exito!')
                setTimeout(() => pullSettings(), 1500)
            }
        } catch (err) { console.error(err) }
    }

    const updateBudget = (category, type) => {
        const newValue = Number(budget[category]) || 0
        if (type === '-' && newValue > 0 && budget.total < 100) {
            setBudget({ ...budget, [category]: newValue-1, total: budget.total+1 })
        }
        if (type === '+' && newValue < 100 && budget.total > 0) {
            setBudget({ ...budget, [category]: newValue+1, total: budget.total-1 })
        }
    }

    return (
        <div className='settings-container'>
            <ToastContainer autoClose={2000} />
            <h4 className='settings-title'>Configuracion de Movimientos</h4>

            <h4 className='settings-module-title' style={{ marginBottom: 0 }}>Saldo Mensual</h4>
            <InputField
                label=''
                updateData={updateData}
                placeholder='$ -'
                name='newSalary'
                type='text'
                value={data.newSalary >= 0 ? data.newSalary : data.salary}
            />

            {newSalary &&
                <CTAButton
                    handleClick={() => {
                        setData({ ...data, salary: data.newSalary })
                        setNewSalary(false)
                    }}
                    label='Guardar'
                    size='25%'
                    color={APP_COLORS.YELLOW}
                    style={{ color: 'black', marginTop: '2vw' }}
                />
            }

            <div style={{ borderTop: '1px solid lightgray', margin: '8vw 2vw', width: '100%' }}></div>

            <h4 className='settings-module-title'>Categorias</h4>
            <div className='div-settings-module'>
                {
                    data.categories.map((cat, i) =>
                        <div key={i} className='settings-list-item'>
                            <h4 className='settings-list-item-text'>{cat}</h4>
                            <h4 onClick={() => handleRemoveItem('categories', i)} className='settings-list-item-text'>X</h4>
                        </div>
                    )
                }
                {newCategory ?
                    <>
                        <InputField
                            label=''
                            updateData={updateData}
                            placeholder='Nombre...'
                            name='newCategory'
                            type='text'
                            style={{ margin: '0 20vw' }}
                        />
                        <CTAButton
                            handleClick={() => {
                                if (data.newCategory) {
                                    setData({ ...data, categories: data.categories.concat(data.newCategory) })
                                    setNewAuthor(false)
                                    setNewPayType(false)
                                    setNewCategory(false)
                                }
                            }}
                            label='Guardar'
                            size='25%'
                            color={APP_COLORS.YELLOW}
                            style={{ color: 'black', marginTop: '2vw' }}
                        />
                    </>
                    :
                    <CTAButton
                        handleClick={() => setNewCategory(true)}
                        label='+'
                        size='12%'
                        color={APP_COLORS.YELLOW}
                        style={{ color: 'black', fontWeight: 'bold', marginTop: '2vw' }}
                    />
                }

                <div style={{ borderTop: '1px solid lightgray', margin: '8vw 2vw', width: '100%' }}></div>

            </div>

            <h4 className='settings-module-title'>Presupuesto</h4>
            <div className='div-budget-module'>
                {
                    data.categories.map((cat, i) =>
                        <div key={i} className='settings-list-budget'>
                            <h4 className='settings-budget-item-text'>{cat}</h4>
                            <CTAButton
                                handleClick={() => updateBudget(cat, '-')}
                                label='-'
                                size='30%'
                                color={APP_COLORS.YELLOW}
                                style={{ color: 'black', fontWeight: 'bold' }}
                            />
                            <h4 className='settings-budget-item-percent'>%{budget[cat] || 0}</h4>
                            <CTAButton
                                handleClick={() => updateBudget(cat, '+')}
                                label='+'
                                size='30%'
                                color={APP_COLORS.YELLOW}
                                style={{ color: 'black', fontWeight: 'bold' }}
                            />
                        </div>
                    )
                }

                <div style={{ borderTop: '1px solid lightgray', margin: '8vw 2vw', width: '100%' }}></div>

            </div>

            <h4 className='settings-module-title'>Autores</h4>
            <div className='div-settings-module'>
                {
                    data.authors.map((author, i) =>
                        <div key={i} className='settings-list-item'>
                            <h4 className='settings-list-item-text'>{author}</h4>
                            <h4 onClick={() => handleRemoveItem('authors', i)} className='settings-list-item-text'>X</h4>
                        </div>
                    )
                }
                {newAuthor ?
                    <>
                        <InputField
                            label=''
                            updateData={updateData}
                            placeholder='Nombre...'
                            name='newAuthor'
                            type='text'
                            style={{ margin: '0 20vw' }}
                        />
                        <CTAButton
                            handleClick={() => {
                                if (data.newAuthor) {
                                    setData({ ...data, authors: data.authors.concat(data.newAuthor) })
                                    setNewAuthor(false)
                                    setNewPayType(false)
                                    setNewCategory(false)
                                }
                            }}
                            label='Guardar'
                            size='25%'
                            color={APP_COLORS.YELLOW}
                            style={{ color: 'black', marginTop: '2vw' }}
                        />
                    </>
                    :
                    <CTAButton
                        handleClick={() => setNewAuthor(true)}
                        label='+'
                        size='12%'
                        color={APP_COLORS.YELLOW}
                        style={{ color: 'black', fontWeight: 'bold', marginTop: '2vw' }}
                    />
                }

                <div style={{ borderTop: '1px solid lightgray', margin: '8vw 2vw', width: '100%' }}></div>
            </div>

            <h4 className='settings-module-title'>Tipos de Pago</h4>
            <div className='div-settings-module'>
                {
                    data.payTypes.map((pay, i) =>
                        <div key={i} className='settings-list-item'>
                            <h4 className='settings-list-item-text'>{pay}</h4>
                            <h4 onClick={() => handleRemoveItem('payTypes', i)} className='settings-list-item-text'>X</h4>
                        </div>
                    )
                }
                {newPayType ?
                    <>
                        <InputField
                            label=''
                            updateData={updateData}
                            placeholder='Nombre...'
                            name='newPayType'
                            type='text'
                            style={{ margin: '0 20vw' }}
                        />
                        <CTAButton
                            handleClick={() => {
                                if (data.newPayType) {
                                    setData({ ...data, payTypes: data.payTypes.concat(data.newPayType) })
                                    setNewAuthor(false)
                                    setNewPayType(false)
                                    setNewCategory(false)
                                }
                            }}
                            label='Guardar'
                            size='25%'
                            color={APP_COLORS.YELLOW}
                            style={{ color: 'black', marginTop: '2vw' }}
                        />
                    </>
                    :
                    <CTAButton
                        handleClick={() => setNewPayType(true)}
                        label='+'
                        size='12%'
                        color={APP_COLORS.YELLOW}
                        style={{ color: 'black', fontWeight: 'bold', marginTop: '2vw' }}
                    />
                }

                <div style={{ borderTop: '1px solid lightgray', margin: '8vw 2vw', width: '100%' }}></div>

            </div>

            <CTAButton
                handleClick={handleSave}
                label='Guardar Cambios'
                color={APP_COLORS.YELLOW}
                disabled={!Object.keys(data).length}
                style={{ marginBottom: '8vw', color: 'black' }}
            />
        </div>
    )
}
