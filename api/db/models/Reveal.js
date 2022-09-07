const mongoose = require('mongoose')

const revealSchema = new mongoose.Schema({
    date: {
        type: String,
    },
    email: {
        type: Date,
        required: true
    },
    gender: {
        type: String
    },
    name: {
        type: String,
        required: true
    }
})

const Reveal = mongoose.model('Reveal', revealSchema)

module.exports = Reveal