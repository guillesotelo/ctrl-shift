import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker'
import TrashCan from '../assets/trash-can.svg'
import CTAButton from '../components/CTAButton'
import InputField from '../components/InputField'
import { APP_COLORS } from '../constants/colors'
import { updateLedgerData } from '../store/reducers/ledger';
import { ToastContainer, toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Tasks() {
    const [taskArr, setTaskArr] = useState([])
    const [data, setData] = useState({ date: new Date(), name: '', details: '' })
    const [ledgerId, setLedgerId] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [check, setCheck] = useState({})
    const [isEdit, setIsEdit] = useState(false)
    const [dateClicked, setDateClicked] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        pullTasks()
    }, [])

    const updateData = (key, newData) => {
        setData({ ...data, [key]: newData })
    }

    const pullTasks = () => {
        const { tasks, id } = JSON.parse(localStorage.getItem('ledger'))
        setLedgerId(id)

        if (tasks) setTaskArr(JSON.parse(tasks))
        else setTaskArr([])
    }

    const handleSave = async () => {
        try {
            if (!data.name) return toast.error('Revisa los campos')
            const _tasks = check.name ? taskArr.filter(task => task !== check) : taskArr
            const newTask = {
                name: data.name,
                details: data.details,
                date: data.date
            }

            _tasks.unshift(newTask)

            const newLedger = await dispatch(updateLedgerData({
                tasks: JSON.stringify(_tasks),
                id: ledgerId
            })).then(data => data.payload)

            if (newLedger) {
                setOpenModal(false)
                localStorage.removeItem('ledger')
                localStorage.setItem('ledger', JSON.stringify(newLedger.data))
                toast.success('Tarea guardada con éxito!')
                setTimeout(() => pullTasks(), 1500)
            }
            setData({
                name: '',
                details: '',
                date: new Date()
            })
            setIsEdit(false)
        } catch (err) { console.error(err) }
    }

    const saveTaskOrder = async newOrder => {
        try {
            if (newOrder !== taskArr) {
                const newLedger = await dispatch(updateLedgerData({
                    tasks: JSON.stringify(newOrder),
                    id: ledgerId
                })).then(data => data.payload)

                if (newLedger) {
                    setOpenModal(false)
                    localStorage.removeItem('ledger')
                    localStorage.setItem('ledger', JSON.stringify(newLedger.data))
                    setTimeout(() => pullTasks(), 200)
                }
            }
        } catch (err) { console.error(err) }
    }

    const checkTask = async checked => {
        try {
            const newTask = {
                name: checked.name,
                details: checked.details,
                date: checked.date,
                isChecked: !checked.isChecked
            }
            const _tasks = taskArr.map(task => {
                return task === checked ? newTask : task
            })

            const newLedger = await dispatch(updateLedgerData({
                tasks: JSON.stringify(_tasks),
                id: ledgerId
            })).then(data => data.payload)

            if (newLedger) {
                setOpenModal(false)
                localStorage.removeItem('ledger')
                localStorage.setItem('ledger', JSON.stringify(newLedger.data))
                toast.success(`${checked.isChecked ? 'Tarea Activada!' : 'Tarea Finalizada!'}`)
                setTimeout(() => pullTasks(), 200)
            }

        } catch (err) { console.error(err) }
    }

    const handleRemove = async () => {
        try {
            const _tasks = taskArr.filter(t => t !== check)

            const newLedger = await dispatch(updateLedgerData({
                tasks: JSON.stringify(_tasks),
                id: ledgerId
            })).then(data => data.payload)

            if (newLedger) {
                setOpenModal(false)
                localStorage.removeItem('ledger')
                localStorage.setItem('ledger', JSON.stringify(newLedger.data))
                toast.success('Tarea eliminada')
                setTimeout(() => pullTasks(), 200)
            }

        } catch (err) { console.error(err) }
    }

    const parseDate = date => {
        const taskDate = new Date(date)
        const now = new Date()
        const dayBeforeYest = new Date().setDate(now.getDate() - 3)
        const dayBefore = new Date().setDate(now.getDate() - 2)
        const yesterday = new Date().setDate(now.getDate() - 1)
        const tomorrow = new Date().setDate(now.getDate() + 1)
        const dayAfter = new Date().setDate(now.getDate() + 2)
        const afterDayAfter = new Date().setDate(now.getDate() + 3)
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        let parsed = taskDate.toLocaleDateString()
        let color = 'black'

        if (taskDate.getDay() === now.getDay()) {
            color = 'green'
            parsed = 'Hoy'
        }
        else if (taskDate.getDay() === new Date(yesterday).getDay()) {
            parsed = 'Ayer'
            color = 'red'
        }
        else if (taskDate.getDay() === new Date(tomorrow).getDay()) {
            color = 'green'
            parsed = 'Mañana'
        }
        else if (taskDate.getDay() === new Date(dayAfter).getDay() ||
            taskDate.getDay() === new Date(afterDayAfter).getDay()
        ) {
            color = 'green'
            parsed = days[taskDate.getDay()]
        }
        else if (taskDate.getDay() === new Date(dayBefore).getDay() ||
            taskDate.getDay() === new Date(dayBeforeYest).getDay()
        ) {
            color = 'red'
            parsed = days[taskDate.getDay()]
        }
        else if (taskDate.getTime() < now.getTime()) {
            color = 'red'
        }
        return { parsed, color }
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)
        return result
    }

    const onDragEnd = result => {
        if (!result.destination) return

        const items = reorder(
            taskArr,
            result.source.index,
            result.destination.index
        )
        setTaskArr(items)
        saveTaskOrder(items)
    }

    const getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: "none",
        // padding: taskArr.length * 2,
        // margin: `0 0 ${taskArr.length}px 0`,
        background: isDragging ? "white" : "",
        ...draggableStyle
    })

    return (
        <div className='tasks-container'>
            <ToastContainer autoClose={1000} />
            {openModal ?
                <div className='task-modal'>
                    <h3 style={{ color: APP_COLORS.GRAY }} className='task-modal-title'>{isEdit ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
                    <InputField
                        label=''
                        updateData={updateData}
                        placeholder='Título de la tarea'
                        name='name'
                        type='text'
                        className='task-title-input'
                        style={{ height: 'fit-content', textAlign: 'left' }}
                        value={data.name}
                    />
                    <InputField
                        label=''
                        updateData={updateData}
                        placeholder='Detalles...'
                        name='details'
                        type='textarea'
                        style={{ height: 'fit-content', textAlign: 'left', marginBottom: '2vw' }}
                        value={data.details}
                    />
                    <CTAButton
                        handleClick={() => setDateClicked(!dateClicked)}
                        label={'Fecha ' + data.date.toLocaleDateString()}
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
                    <div className='task-modal-btns'>
                        <CTAButton
                            handleClick={() => {
                                setData({
                                    name: '',
                                    details: '',
                                    date: new Date()
                                })
                                setIsEdit(false)
                                setOpenModal(false)
                            }}
                            label='Cancelar'
                            size='100%'
                            color={APP_COLORS.GRAY}
                        />
                        {isEdit ? <div onClick={() => handleRemove()}>
                            <img style={{ transform: 'scale(0.7)' }} className='svg-trash' src={TrashCan} alt="Trash Can" />
                        </div>
                            : ''}
                        <CTAButton
                            handleClick={() => handleSave()}
                            label='Guardar'
                            size='100%'
                            color={APP_COLORS.YELLOW}
                            style={{ color: 'black' }}
                        />
                    </div>
                </div>
                : ''
            }
            {taskArr.length ?
                <div className='task-list' style={{ filter: openModal && 'blur(10px)' }}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {taskArr.map((task, i) => (
                                        <Draggable key={i} draggableId={String(i)} index={i}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                >
                                                    <div className={`${task.isChecked ? 'task-div-checked' : 'task-div'}`} key={i} style={{ borderBottom: i === taskArr.length - 1 ? 'none' : '1px solid lightgray' }}>
                                                        <h4 className={`${task.isChecked ? 'task-check-checked' : 'task-check'}`} onClick={() => checkTask(task)}>✓</h4>
                                                        <h4
                                                            className='task-name'
                                                            onClick={() => {
                                                                setIsEdit(true)
                                                                setCheck(task)
                                                                setData({
                                                                    ...task,
                                                                    date: new Date(task.date)
                                                                })
                                                                setOpenModal(true)
                                                            }}>{task.name}</h4>
                                                        <h4
                                                            className='task-date'
                                                            style={{ color: parseDate(task.date).color }}
                                                            onClick={() => {
                                                                setIsEdit(true)
                                                                setCheck(task)
                                                                setData({
                                                                    ...task,
                                                                    date: new Date(task.date)
                                                                })
                                                                setOpenModal(true)
                                                            }}>
                                                            {parseDate(task.date).parsed}
                                                        </h4>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                :
                <h4 className='task-no-tasks' style={{ filter: openModal && 'blur(10px)' }}>
                    No hay tareas a la vista 🧐
                    <br />Comienza creando una nueva ➕
                </h4>
            }
            <CTAButton
                label='+'
                color={APP_COLORS.YELLOW}
                handleClick={() => {
                    setData({
                        date: new Date(),
                        name: '',
                        details: ''
                    })
                    setOpenModal(true)
                }}
                style={{ color: 'black', borderRadius: '10vw', fontSize: '4vw' }}
                className='new-task-btn-container'
                btnClass='new-task-btn'
                disabled={openModal}
            />
        </div>
    )
}
