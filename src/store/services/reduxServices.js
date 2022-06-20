import axios from 'axios';

const loginUser = async user => {
    try {
        const res = await axios.post(`/api/user`, user)
        const finalUser = res.data
        localStorage.setItem('user', JSON.stringify(finalUser))
        return finalUser
    } catch (error) { console.log(error) }
}

const registerUser = async data => {
    try {
        const newUser = await axios.post(`/api/user/create`, data)
        return newUser
    } catch (err) { console.log(err) }
}

const setUserVoid = async () => {
    try {
        await axios.get(`/api/auth/logout`)
        localStorage.removeItem('user')
        return {}
    } catch (err) { console.log(err) }
}

const getAllMovements = async data => {
    try {
        const movements = await axios.get(`/api/movement`, { params: data })
        return movements
    } catch (err) { console.log(err) }
}

const createMovement = async data => {
    try {
        const movement = await axios.post(`/api/movement`, data)
        return movement
    } catch (err) { console.log(err) }
}

const updateMovement = async data => {
    try {
        const ledger = await axios.post(`/api/movement/update`, data)
        return ledger
    } catch (err) { console.log(err) }
}

const deleteMovement = async data => {
    try {
        const deleted = await axios.post(`/api/movement/remove`, data)
        return deleted
    } catch (err) { console.log(err) }
}

const createLedger = async data => {
    try {
        const ledger = await axios.post(`/api/ledger/create`, data)
        return ledger
    } catch (err) { console.log(err) }
}

const updateLedger = async data => {
    try {
        const ledger = await axios.post(`/api/ledger/update`, data)
        return ledger
    } catch (err) { console.log(err) }
}

const getAllLedgersByEmail = async email => {
    try {
        const ledgers = await axios.get(`/api/ledger/all`, email)
        return ledgers
    } catch (err) { console.log(err) }
}

const loginLedger = async data => {
    try {
        const res = await axios.post(`/api/ledger`, data)
        return res.data
    } catch (error) { console.log(error) }
}

export {
    loginUser,
    registerUser,
    setUserVoid,
    getAllMovements,
    createMovement,
    updateMovement,
    createLedger,
    getAllLedgersByEmail,
    loginLedger,
    updateLedger,
    deleteMovement
}
