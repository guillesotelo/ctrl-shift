const express = require('express')
const router = express.Router()
const { User } = require('../db/models')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID)

//User Login
router.post('/', async (req, res, next) => {
    try {
        const { email, password, isGoogleUser } = req.body

        const user = await User.findOne({ email }).exec()
        if (!user) return res.status(401).json({})

        if (!isGoogleUser) {
            const compareRes = await user.comparePassword(password)
            if (!compareRes) return res.status(401).send('Invalid credentials')
        }
        res.status(200).json({
            username: user.username,
            email,
            defaultLedger: user.defaultLedger || null
        })

    } catch (err) { console.log(err) }
})

//Google Auth
router.post("/auth/google", async (req, res) => {
    const { credential } = req.body
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.REACT_APP_GOOGLE_CLIENT_ID
    })
    const userData = ticket.getPayload()
    res.status(201)
    res.json(userData)
})

//Create user
router.post('/create', async (req, res, next) => {
    try {
        const user = await User.create(req.body)
        if (!user) return res.status(400).send('Bad request')
        res.status(201).send(`User created successfully`)
    } catch (err) { console.log(err) }
})

//Update User Data
router.post('/update', async (req, res, next) => {
    try {
        const { user, newData } = req.body
        const newUser = await User.findOneAndUpdate(
            { username: user.username, email: user.email }, newData, { new: true })
        if (!newUser) return res.status(404).send('Error updating User.')

        res.status(200).json({
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
            defaultLedger: newUser.defaultLedger
        })
    } catch (err) { console.log(err) }
})

//Logout
router.get("/logout", (req, res, next) => {
    req.user = null;
    res.status(200).json({});
})

module.exports = router