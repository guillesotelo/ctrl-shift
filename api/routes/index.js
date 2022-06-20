const express = require('express')
const router = express.Router()

const userRoutes = require('./user')
const movementRoutes = require('./movement')
const ledgerRoutes = require('./ledger')

router.use('/movement', movementRoutes)
router.use('/user', userRoutes)
router.use('/ledger', ledgerRoutes)

module.exports = router