const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
    },

    since_name: {
        type: String,
    },

    code: {
        type: String,
    },

    buy_price: {
        type: Number,
        default: 0,
    },

    sell_price: {
        type: Number,
        default: 0,
    },

    expire: {
        type: String,
    },

    storage: {
        type: Number,
        default: 0
    },

    company: {
        type: String,
    },

    category: {
        type: String,
    },

    earn: {
        type: Number,
    },

    score: {
        type: Number,
        default: 0,
    },

    scoreAnalysis: {
        type: Array,
        default: []
    },

    storageAnalysis: {
        type: Array,
        default: []
    },

    backAnalysis: {
        type: Array,
        default: []
    },

    bought: {
        type: Number,
    },

    Date: {
        type: String,
    },

    bach: {
        type: String,
    }

})

const Product = mongoose.model('Product', productSchema, 'Product')
module.exports = Product