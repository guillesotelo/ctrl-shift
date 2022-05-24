const express = require('express')
const router = express.Router()
// const transporter = require('../mailer')
const { Movement } = require('../db/models')

router.get('/', async (req, res, next) => {
    try {
        const movements = await Movement.find()
        if(!movements) return res.status(404).send('No movements found.')
        res.status(200).json(movements)
    } catch(err) { console.log(err) }
})

router.post('/', async (req, res, next) => {
    try {
        const newMovement = await Movement.create(req.body)
        res.status(200).json({newMovement})
    } catch(err) { console.log(err) }
})

module.exports = router