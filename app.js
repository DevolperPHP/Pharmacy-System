const express = require('express');
const flash = require('express-flash');
const session = require('express-session')
const app = express();
const db = require('./config/database')
const api = require('./routes/api')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const index = require('./routes/index')
const admin = require('./routes/admin')
const methodOverride = require('method-override')

let PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
app.use(methodOverride("_method"))
app.use("/api", api)
app.use("/", index);
app.use("/admin", admin);

app.listen(PORT, (error) => {
    if(error){
        console.log(error);
    } else {
        console.log(`Server is running on port ${PORT}`)
    }
})