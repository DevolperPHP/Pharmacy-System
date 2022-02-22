const mongoose = require('mongoose');

const soldHistorySchema = new mongoose.Schema({
    name:{
        type:String,
    },
    
    bill_id: {
        type: Number,
        required: true,
    },

    order:{
        type: Array,
    }, 

    Date:{
        type: String,
    },
    
    backItems:{
        type: Array,
        default: []
    }
})

const SoldHistory = mongoose.model('Sold History', soldHistorySchema, 'Sold History')
module.exports = SoldHistory