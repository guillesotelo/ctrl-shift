const express = require('express')
const router = express.Router()
const { User } = require('../db/models')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID)
const transporter = require('../helpers/mailer')
const { encrypt, decrypt } = require('../helpers')

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
            defaultLedger: user.defaultLedger || null,
            language: user.language || null
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
            defaultLedger: newUser.defaultLedger,
            language: user.language || null
        })
    } catch (err) { console.log(err) }
})

router.get('/reset', async (req, res, next) => {
    try {
        const { userEmail } = req.query
        if (!userEmail) res.send(404).json('Wrong parameters')

        const userData = await User.findOne({ email: decrypt(userEmail) })
        const generatedPass = (Math.random() + 1).toString(36).substring(7)

        const newUser = await User.findOneAndUpdate(
            { email: decrypt(userEmail) }, { ...userData, password: generatedPass }, { new: true })
        if (!newUser) return res.status(404).send('Error updating User.')

        await transporter.sendMail({
            from: `"CtrlShift" <${process.env.EMAIL}>`,
            to: email,
            subject: 'Your password has been changed',
            html: `<div style='margin-top: 3vw; text-align: center;'>
                            <h2>Hello there!</h2>
                            <h3>Use your new passowrd to login. We advise to change it afterwards</h3>
                            <h3>New Password: ${generatedPass}</h3>
                            <img src="https://i.imgur.com/8XcuFOs.png" style='height: 50px; width: auto; margin-top: 4vw;' alt="ctrlshift-logo" border="0">
                            <a href='https://ctrlshift.herokuapp.com/login'><h5 style='margin: 4px;'>CtrlShift App</h5></a>
                        </div>`
        }).catch((err) => console.error('Something went wrong!', err))

        const html = `
            <div style='margin-top: 10vw; text-align: center;'>
                <h3>Your password has been changed to:</h3>
                <h2>${generatedPass}</h2>
                <h3><a href='https://ctrlshift.herokuapp.com/login'>Login</a> again with the new credential and change it as soon as you can.</h3>
            </di>
            `
        res.send(html)

    } catch (err) { console.log(err) }
})

router.post('/reset', async (req, res, next) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email }).exec()
        if (!user) return res.status(404).json('Email not found.')

        await transporter.sendMail({
            from: `"CtrlShift" <${process.env.EMAIL}>`,
            to: email,
            subject: 'Password Reset',
            html: `<div style='margin-top: 3vw; text-align: center;'>
                        <h2>Hello there!</h2>
                        <h3>Click <a href='https://ctrlshift.herokuapp.com/api/user/reset?userEmail=${encrypt(email)}'>here</a> to reset your password.</h3>
                        <img src="https://i.imgur.com/8XcuFOs.png" style='height: 50px; width: auto; margin-top: 4vw;' alt="ctrlshift-logo" border="0">
                        <h5 style='margin: 4px;'>CtrlShift Team</h5>
                    </div>`
        }).catch((err) => console.error('Something went wrong!', err))
        
        res.status(200).json({})
    } catch (err) { console.log(err) }
})

//Logout
router.get("/logout", (req, res, next) => {
    req.user = null;
    res.status(200).json({});
})

module.exports = router