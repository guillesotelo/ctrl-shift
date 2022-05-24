const express = require('express')
const router = express.Router()

const userRoutes = require('./user')
const movementRoutes = require('./movement')

router.use('/movement', movementRoutes)
router.use('/user', userRoutes)

module.exports = router