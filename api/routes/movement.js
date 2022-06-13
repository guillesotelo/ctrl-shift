const express = require('express')
const router = express.Router()
const { Movement } = require('../db/models')

router.get('/', async (req, res, next) => {
    try {
        const { ledger } = req.query
        if(ledger) {
            const movements = await Movement.find({ ledger }).sort([['date', 'descending']])
            if(!movements) return res.status(404).send('No movements found.')
            res.status(200).json(movements)
        }
    } catch(err) { console.log(err) }
})

router.post('/', async (req, res, next) => {
    try {
        const newMovement = await Movement.create(req.body)
        res.status(200).json({newMovement})
    } catch(err) { console.log(err) }
})

router.post('/update', async (req, res, next) => {
    try {
        const { _id } = req.body
        const updated = await Movement.findByIdAndUpdate( _id, req.body, { useFindAndModify: false } )
        if(!updated) return res.status(404).send('Error updating Movement.')

        res.status(200).json({ message: 'Updated' })
    } catch(err) { console.log(err) }
})

router.post('/remove', async (req, res, next) => {
    try {
        const { _id } = req.body
        const removed = await Movement.deleteOne({ _id })
        if(!removed) return res.status(404).send('Error deleting Movement.')

        res.status(200).json({ message: 'Removed' })
    } catch(err) { console.log(err) }
})

module.exports = router