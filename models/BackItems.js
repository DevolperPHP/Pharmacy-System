const mongoose = require('mongoose')

const backItemsSchema = new mongoose.Schema({
    name: {
        type: String,
    },

    Date: {
        type: String,
    },

    invoice: {
        type: Number,
    },
    
    items: {
        type: Array,
        default: [],
    }
})

const BackItems = mongoose.model("BackItems", backItemsSchema, "BackItems")
module.exports = BackItems