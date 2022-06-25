import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from "react-redux";
import CTAButton from '../CTAButton'
import InputField from '../InputField'
import { APP_COLORS } from '../../constants/colors'
import { ToastContainer, toast } from 'react-toastify';
import {
    getUserLedgers,
    saveLedger,
    logLedger
} from '../../store/reducers/ledger'
import 'react-toastify/dist/ReactToastify.css';
import './styles.css'

export default function Ledger() {
    const [data, setData] = useState({})
    const [newLedger, setNewLedger] = useState(false)
    const [connect, setConnect] = useState(false)
    const history = useHistory()
    const dispatch = useDispatch()
    const ledger = JSON.parse(localStorage.getItem('ledger'))

    useEffect(() => {
        const { email } = JSON.parse(localStorage.getItem('user'))
        
        const _settings = {
            authors: ['Yo'],
            payTypes: ['Efectivo', 'Debito/Transf.', 'TC'],
            categories: ['Varios', 'Gasto Fijo', 'Mercado', 'Luxury', 'Auto'],
            salary: 0
        }

        setData({ ...data, email, settings: JSON.stringify(_settings) })
    }, [])

    const updateData = (key, newData) => {
        setData({ ...data, [key]: newData })
    }

    const handleSaveLedger = async () => {
        try {
            const ledgerBook = await dispatch(saveLedger(data)).then(d => d.payload)

            if (ledgerBook && ledgerBook.data) {
                localStorage.removeItem('ledger')
                localStorage.setItem('ledger', JSON.stringify(ledgerBook.data))
                toast.success('Guardado con exito! \nRedirigiendo...')

                setTimeout(() => history.push('/home'), 3000)

            } else toast.error('Error al guardar')
        } catch (err) { toast.error('Error al guardar') }
    }

    const handleConnect = async () => {
        try {
            const loginLedger = await dispatch(logLedger(data)).then(d => d.payload)

            if (loginLedger) {
                localStorage.removeItem('ledger')
                localStorage.setItem('ledger', JSON.stringify(loginLedger))
                toast.success('Conectado con exito! \nRedirigiendo...')

                setTimeout(() => history.push('/home'), 3000)

            } else toast.error('Error de conexion')
        } catch (err) { toast.error('Error de conexion') }
    }

    const handleDisconnect = () => {
        localStorage.removeItem('ledger')
        toast.success('Desconectado con exito! \nRedirigiendo...')
        setTimeout(() => history.go(0), 2500)
    }

    return (
        <div className='user-group-container'>
            <ToastContainer autoClose={2000} />
            <h4 className='group-text'>Para comenzar a utilizar CtrlShift, debes crear un <b>Libro Contable</b>,
                donde se guardaran todos tus movimientos.<br />
                Luego, otras personas podran participar de tu Libro, conectandose con el <b>nombre</b> y <b>PIN</b>.<br /><br />
                Tambien puedes conectarte con un <b>Libro</b> existente.</h4>
            {
                ledger && ledger.name ?
                    <div className='div-ledger-connected'>
                        <h4 className='ledger-connected'>Libro actual: <br /><br /><i>{ledger.name}</i></h4>
                        <CTAButton
                            label='Desconectar'
                            color='#363636'
                            handleClick={handleDisconnect}
                            style={{ marginTop: '4vw', fontSize: '4vw' }}
                        />
                    </div>
                    :
                    <div className='no-ledger-section'>
                        <CTAButton
                            label='Nuevo Libro'
                            color='#CCA43B'
                            handleClick={() => {
                                setNewLedger(!newLedger)
                                setConnect(false)
                            }}
                            style={{ marginBottom: '4vw', color: 'black' }}
                        />
                        <CTAButton
                            label='Conectar existente'
                            color='#242F40'
                            handleClick={() => {
                                setConnect(!connect)
                                setNewLedger(false)
                            }}
                        />
                        {
                            newLedger &&
                            <div className='new-group-section'>
                                <InputField
                                    label='Nuevo Libro Contable'
                                    updateData={updateData}
                                    placeholder='Nombre del Libro'
                                    name='name'
                                    type='text'
                                    style={{ marginTop: '1vw', alignSelf: 'center', fontWeight: 'normal', width: '45%' }}
                                />
                                <InputField
                                    label=''
                                    updateData={updateData}
                                    placeholder='PIN'
                                    name='pin'
                                    type='number'
                                    style={{ marginBottom: '1vw', alignSelf: 'center', fontWeight: 'normal', width: '45%' }}
                                />
                                <CTAButton
                                    label='Guardar'
                                    color='#242F40'
                                    handleClick={handleSaveLedger}
                                    style={{ margin: '1vw', color: '#CCA43B' }}
                                />
                            </div>
                        }
                        {
                            connect &&
                            <div className='connect-group-section'>
                                <InputField
                                    label='Conectar con Libro existente'
                                    updateData={updateData}
                                    placeholder='Nombre del Libro'
                                    name='name'
                                    type='text'
                                    style={{ marginTop: '1vw', alignSelf: 'center', fontWeight: 'normal', width: '45%' }}
                                />
                                <InputField
                                    label=''
                                    updateData={updateData}
                                    placeholder='PIN'
                                    name='pin'
                                    type='number'
                                    style={{ marginBottom: '1vw', alignSelf: 'center', fontWeight: 'normal', width: '45%' }}
                                />
                                <CTAButton
                                    label='Conectar'
                                    color='#242F40'
                                    handleClick={handleConnect}
                                    style={{ margin: '1vw', color: '#CCA43B' }}
                                />
                            </div>
                        }
                    </div>
            }
        </div>
    )
}
