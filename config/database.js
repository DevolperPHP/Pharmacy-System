const mongoose = require('mongoose');
const MONGO_URI = "mongodb://localhost:27017/pharmacy"

mongoose.connect(MONGO_URI, (error) => {
    if(error) throw error;
    console.log("Database is running")
})