const express = require('express')
const router = express.Router()
const { Movement } = require('../db/models')
const { encrypt, decrypt } = require('../helpers')

router.get('/', async (req, res, next) => {
    try {
        const { ledger } = req.query
        if (ledger) {
            const movements = await Movement.find({ ledger }).sort([['date', 'descending']])
            if (!movements) return res.status(404).send('No movements found.')

            const decryptedMovs = movements.map(mov => {
                // console.log(mov)
                if (mov.isEncrypted) {
                    // console.log("detail decryptred", decrypt(mov.detail))
                    return {
                        ...mov,
                        date: mov.date,
                        author: decrypt(mov.author),
                        detail: decrypt(mov.detail),
                        amount: decrypt(mov.amount),
                        category: decrypt(mov.category),
                        pay_type: decrypt(mov.pay_type),
                        user: decrypt(mov.user)
                    }
                } else return mov
            })

            res.status(200).json(decryptedMovs)
        }
    } catch (err) { console.log(err) }
})

router.post('/', async (req, res, next) => {
    try {
        const movData = {
            ...req.body,
            author: encrypt(req.body.author),
            detail: encrypt(req.body.detail),
            amount: encrypt(req.body.amount),
            category: encrypt(req.body.category),
            pay_type: encrypt(req.body.pay_type),
            user: encrypt(req.body.user),
            isEncrypted: true
        }

        const newMovement = await Movement.create(movData)
        res.status(200).json({ newMovement })
    } catch (err) { console.log(err) }
})

router.post('/update', async (req, res, next) => {
    try {
        const { _id } = req.body
        const movData = { ...req.body }

        for (let key in movData) {
            const toEncrypt = ['author', 'detail', 'amount', 'category', 'pay_type', 'user']
            if (toEncrypt.includes(key)) {
                movData[key] = encrypt(movData[key])
                movData.isEncrypted = true
            }
        }

        const updated = await Movement.findByIdAndUpdate(_id, movData, { useFindAndModify: false })
        if (!updated) return res.status(404).send('Error updating Movement.')

        res.status(200).json({ message: 'Updated' })
    } catch (err) { console.log(err) }
})

router.post('/remove', async (req, res, next) => {
    try {
        const { _id } = req.body
        const removed = await Movement.deleteOne({ _id })
        if (!removed) return res.status(404).send('Error deleting Movement.')

        res.status(200).json({ message: 'Removed' })
    } catch (err) { console.log(err) }
})

module.exports = router