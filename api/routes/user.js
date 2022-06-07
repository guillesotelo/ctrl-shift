const express = require('express')
const router = express.Router()
const { User } = require('../db/models')

//user Login
router.post('/', async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email }).exec()
        if (!user) return res.status(401).json({})

        const compareRes = await user.comparePassword(password)
        if (!compareRes) return res.status(401).send('Invalid credentials')

        const token = generateToken(user)

        res.status(200).json({ username: user.username, email, token })

    } catch (err) { console.log(err) }
})

//Create user
router.post('/create', async (req, res, next) => {
    try {
        const user = await User.create(req.body)
        if (!user) return res.status(400).send('Bad request')
        res.status(201).send(`User created successfully`)
    } catch (err) { console.log(err) }
})

//Logout
router.get("/logout", (req, res, next) => {
    req.user = null;
    res.status(200).json({});
})

const generateToken = data => {
    const { email, password } = data
    const userToken = email.charCodeAt(0) + password.charCodeAt(0) * email.charCodeAt(0) * 99 * 99 * 99
    return userToken
}

module.exports = router