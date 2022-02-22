const mongoose = require('mongoose')

const customersSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },

    Date: {
        type: String
    }
})

const Customers = mongoose.model("Customers", customersSchema, "Customers")
module.exports = Customers