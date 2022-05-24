const mongoose = require('mongoose')

const movementSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    detail: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    pay_type: {
        type: String,
        required: true
    },
    category: {
        type: String
    }
})

const Movement = mongoose.model('Movement', movementSchema)

module.exports = Movement