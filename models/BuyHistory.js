const mongoose = require('mongoose');

const buyHistorySchema = new mongoose.Schema({
    list_id:{
        type: String,
    },

    Date: {
        type: String,
    },

    seller: {
        type: String,
    },

    worker: {
        type: String,
    },

    items: {
        type: Array,
        default: []
    }
    
})

const BuyHistory = mongoose.model("Buy History", buyHistorySchema, "Buy History")
module.exports = BuyHistory