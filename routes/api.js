const express = require('express');
const router = express.Router();
const User = require('../models/User')
const moment = require('moment');
const bcrypt = require('bcrypt');

router.get("/register", async (req, res) => {
    try {
        const uesrID = req.cookies.userID
        const user = await User.findOne({ _id: uesrID })
        res.render("api/register", {
            user: user
        })
    } catch (error) {
        console.error(error)
    }
})

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, phone } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = [
            new User({
                name: name,
                email: email,
                phone: phone,
                password: hashedPassword,
                Date: moment().locale("ar-kw").format('l'),
            })
        ]

        newUser.forEach((data) => {
            data.save((error) => {
                if (error) {
                    console.log(error)
                } else {
                    req.flash("success-register", " ")
                    res.redirect("/api/login")
                    console.log(data)
                }
            })
        })
    } catch (error) {
        console.error(error)
    }
})

router.get("/login", async (req, res) => {
    try {
        const uesrID = req.cookies.id
        const user = await User.findOne({ _id: uesrID })
        res.render("api/login", {
            user: user,
            suc: req.flash("success-register"),
            err: req.flash("login-error")
        })
    } catch (error) {
        console.log(error)
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email })
        const comparedPassword = await bcrypt.compare(password, user.password)

        if (user) {
            if (comparedPassword) {
                res.cookie("id", user._id)
                res.redirect("/")
            } else {
                req.flash("login-error", " ")
                res.redirect("/api/login")
            }
        } else {
            req.flash("login-error", " ")
            res.redirect("/api/login")
        }
    } catch (error) {
        console.log(error)
    }
})


router.get("/logout", async (req, res) => {
    try {
        res.clearCookie("id")
        res.redirect("/api/login")
    } catch (error) {
        console.log(error)
    }
})
module.exports = router