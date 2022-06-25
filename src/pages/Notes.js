import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/colors'
import { updateLedgerData } from '../store/reducers/ledger';
import { ToastContainer, toast } from 'react-toastify';
import TrashCan from '../assets/trash-can.svg'

export default function Notes() {
    const [isEdit, setIsEdit] = useState(false)
    const [removeModal, setRemoveModal] = useState(false)
    const [data, setData] = useState({ notes: [] })
    const [check, setCheck] = useState(-1)
    const dispatch = useDispatch()

    useEffect(() => {
        pullNotes()
    }, [])

    const updateData = (key, newData) => {
        setData({ ...data, [key]: newData })
    }

    const handleSave = async () => {
        try {
            if (!data.name || !data.details) return toast.error('Chequea los campos')
            const _notes = data.notes
            const newNote = {
                name: data.name,
                details: data.details
            }
            _notes.unshift(newNote)

            const newLedger = await dispatch(updateLedgerData({
                notes: JSON.stringify(_notes),
                id: data.id
            })).then(data => data.payload)

            if (newLedger) {
                localStorage.removeItem('ledger')
                localStorage.setItem('ledger', JSON.stringify(newLedger.data))
                toast.success('Guardado con exito!')
                setTimeout(() => pullNotes(), 1500)
            }
            setIsEdit(false)
        } catch (err) { console.error(err) }
    }

    const handleRemoveItem = async () => {
        try {
            const _notes = data.notes.filter(note => note !== check)
            const newLedger = await dispatch(updateLedgerData({
                notes: JSON.stringify(_notes),
                id: data.id
            })).then(data => data.payload)

            if (newLedger) {
                localStorage.removeItem('ledger')
                localStorage.setItem('ledger', JSON.stringify(newLedger.data))
                toast.success('Nota eliminada')
                setTimeout(() => pullNotes(), 1500)
            }
            setIsEdit(false)
            setCheck(-1)
        } catch (err) { console.error(err) }
      }

    const pullNotes = () => {
        const { notes, id } = JSON.parse(localStorage.getItem('ledger'))
        if (notes) {
            const _notes = JSON.parse(notes)
            setData({ notes: _notes, id })
        } else {
            setData({ notes: [], id })
        }
    }

    return (
        <div className='notes-container'>
            <ToastContainer autoClose={2000} />
            {removeModal &&
                <div className='remove-modal'>
                    <h3>Estas a punto de eliminar:<br/><br/>'{check.name}'</h3>
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
            {!isEdit &&
                <CTAButton
                    label='Nueva Nota'
                    color={APP_COLORS.YELLOW}
                    handleClick={() => {
                        setIsEdit(true)
                    }}
                    size='100%'
                    style={{ color: 'black', fontSize: '5vw' }}
                />
            }
            {isEdit &&
                <div className='new-note-container'>
                    <InputField
                        label=''
                        updateData={updateData}
                        placeholder='Nombre de la nota...'
                        name='name'
                        type='text'
                        style={{ height: 'fit-content', textAlign: 'left' }}
                    />
                    <InputField
                        label=''
                        updateData={updateData}
                        placeholder='Detalles...'
                        name='details'
                        type='textarea'
                    />
                    {(data.name || data.details) &&
                        <CTAButton
                            label='Guardar'
                            color={APP_COLORS.YELLOW}
                            handleClick={() => {
                                handleSave()
                            }}
                            size='100%'
                            style={{ color: 'black', fontSize: '5vw' }}
                        />
                    }
                </div>
            }
            {data.notes.length &&
                <div className='note-list' style={{ filter: removeModal && 'blur(10px)' }}>
                    {data.notes.map((note, i) =>
                        <div key={i} className='note-container' onClick={() => setCheck(note)} style={{ borderColor: check === note ? '#CCA43B' : 'lightgray' }}>
                            <h4 className='note-name'>{note.name}</h4>
                            <textarea rows={5} cols={40} readOnly="readonly" className='note-details' defaultValue={note.details} />
                            {check === note && 
                                <img style={{ transform: 'scale(0.6)' }} onClick={() => setRemoveModal(true)} className='svg-trash' src={TrashCan} alt="Trash Can" />
                            }
                        </div>
                    )}
                </div>
            }
        </div>
    )
}
