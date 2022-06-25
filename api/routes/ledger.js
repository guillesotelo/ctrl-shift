const express = require('express')
const router = express.Router()
const { Ledger } = require('../db/models')

router.get('/all', async (req, res, next) => {
    try {
        const email = req.body
        const ledgers = await Ledger.find({ email })
        if(!ledgers) return res.status(404).send('No ledgers found.')

        res.status(200).json(ledgers)
    } catch(err) { console.log(err) }
})

router.post('/', async (req, res, next) => {
    try {
        const { name, pin } = req.body
        const ledger = await Ledger.findOne({ name })
        if(!ledger) return res.status(404).send('No ledger found.')

        const compareRes = await ledger.comparePin(pin)
        if (!compareRes) return res.status(401).send('Invalid credentials')

        res.status(200).json({ 
            id: ledger.id,
            email: ledger.email,
            name: ledger.name,
            settings: ledger.settings,
            pin: 'null',
            notes: ledger.notes || []
        })

    } catch(err) { console.log(err) }
})

router.post('/create', async (req, res, next) => {
    try {
        const newLedger = await Ledger.create(req.body)
        if(!newLedger) return res.status(404).send('Error creating Ledger.')

        res.status(200).json({ 
            id: newLedger.id,
            email: newLedger.email,
            name: newLedger.name,
            settings: newLedger.settings,
            pin: 'null',
            notes: newLedger.notes || []
        })
    } catch(err) { console.log(err) }
})

router.post('/update', async (req, res, next) => {
    try {
        const { id } = req.body
        const _ = await Ledger.findByIdAndUpdate( id, req.body, { useFindAndModify: false } )
        const newLedger = await Ledger.findById(id)
        if(!newLedger) return res.status(404).send('Error updating Ledger.')

        res.status(200).json({ 
            id: newLedger.id,
            email: newLedger.email,
            name: newLedger.name,
            settings: newLedger.settings,
            pin: 'null',
            notes: newLedger.notes || []
        })
    } catch(err) { console.log(err) }
})

module.exports = router