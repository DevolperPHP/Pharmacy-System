const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: true,
    },

    cart: {
        type: Array,
        default: []
    },

    buy: {
        type: Array,
        default: []
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    isMember: {
        type: Boolean,
        default: false,
    },

    backItems: {
        type: Array,
        default: []
    },

    Date: {
        type: String,
    }
})

const User = mongoose.model("User", userSchema, "User")
module.exports = User