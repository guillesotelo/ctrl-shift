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

const getAllMovements = async () => {
    try {
        const movements = await axios.get(`/api/movement`)
        return movements
    } catch (err) { console.log(err) }
}

const createMovement = async data => {
    try {
        const movement = await axios.post(`/api/movement`, data)
        return movement
    } catch (err) { console.log(err) }
}

export { 
  loginUser,
  registerUser,
  setUserVoid,
  getAllMovements,
  createMovement
 }
