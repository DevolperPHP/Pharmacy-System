const mongoose = require('mongoose');

const newMoneySchema = new mongoose.Schema({
    name: {
        type: String,
    },

    invoice_id:{
        type: String,
    },

    total: {
        type: Number,
    },

    paid: {
        type: Number,
    },

    left: {
        type: Number,
    },

    Date: {
        type: String
    }
})

const Money = mongoose.model('Money', newMoneySchema, 'Money')
module.exports = Money