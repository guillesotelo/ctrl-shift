const express = require('express')
const router = express.Router()
const { Reveal } = require('../db/models')

//Get reveal
router.get('/', async (req, res, next) => {
    try {
        const { email } = req.body
        const revealed = await Reveal.findOne({ email })
        if(!revealed) return res.status(404).send('Reveal not found.')

        return revealed
    } catch (err) { console.log(err) }
})

//Add reveal
router.post('/', async (req, res, next) => {
    try {
        // const { email, name } = req.body
        // const exists = await Reveal.findOne({ email, name })
        // if (!exists) return res.status(404).send('Email and name already in use.')

        const reveal = await Reveal.create(req.body)
        if (!reveal) return res.status(404).send('Error creating Reveal.')

        res.status(200).json({ message: 'Created' })
    } catch (err) { console.log(err) }
})

module.exports = router