const express = require('express');
const Product = require('../models/Product');
const SoldHistory = require('../models/SoldHistory');
const User = require('../models/User');
const router = express.Router()
const moment = require('moment');
const Customers = require('../models/coustmers');

router.get("/", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const products = await Product.find({}).sort({ score: -1})
        if(user){
            if(user.isAdmin == true){
                res.render("user/index", {
                    user: user,
                    err: req.flash("admin-error"),
                    products: products
                })
            } else {
                res.redirect("/api/login")
            }
        }else {
            res.redirect("/api/login")
        }
    } catch (error) {
        console.error(error)
    }
})

router.get("/cart", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const products = await Product.find({})
        const productName = products.map(x => x.name)
        const customers = await Customers.find({}).sort({ Date: -1 })

        if (user.isAdmin == true || user.isMember == true) {
            res.render("user/cart", {
                user: user,
                products: products,
                productName: productName,
                customers: customers,
                err: req.flash("cart-error"),
                stor: req.flash("cart-storage-error")
            })
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.error(error)
    }
})

router.put("/cart/add/:code", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await Product.findOne({ code: req.params.code, storage: { $gt: 0 } })
        const { qty, free } = req.body

        if (user.isAdmin == true || user.isMember == true) {
            if (data.storage >= Number(qty) + Number(free)) {
                await User.updateOne({ _id: userID }, {
                    $push: { cart: { name: data.name, qty: qty, free: free ,price: data.sell_price, code: data.code ,bach: data.bach, expire: data.expire } }
                })

                await Product.updateOne({ code: req.params.code, storage: { $gt: 0}}, {
                    $inc: { storage: -(Number(qty)+Number(free)), score: +(Number(qty)+Number(free))},
                    
                })

                res.redirect("/cart")
            } else {
                req.flash("cart-storage-error", " ")
                res.redirect("/cart")
            }
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.error(error)
    }
})

router.post("/cart/bill/save", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const soldhistory = await SoldHistory.find({})
        const bill_id = soldhistory.length+1

        if (user.isAdmin == true || user.isMember == true) {

            if (!req.body.name) {
                req.flash("cart-error", " ")
                res.redirect("/cart")
            } else {

                const newSoldHistory = [
                    new SoldHistory({
                        name: req.body.name,
                        bill_id: bill_id,
                        order: user.cart,
                        Date: moment().locale("ar-kw").format('l'),
                    })
                ]

                newSoldHistory.forEach((data) => {
                    data.save()
                })

                await User.updateOne({ _id: userID }, {
                    $set: { cart: [] }
                })
            }
            res.redirect(`/bill/get/${bill_id}`)
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.error(error)
    }
})

router.put("/cart/delete/:name/:bach/:qty", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await Product.findOne({ name: req.params.name, bach: req.params.bach })
        const qty = req.body.qty
 

        if (user.isAdmin == true || user.isMember == true) {
            await User.updateOne({ _id: userID }, {
                $pull: { cart: { name: data.name, qty: qty, price: data.sell_price, expire: data.expire } }
            })

            await Product.updateOne({ name: req.params.name, bach: req.params.bach }, {
                $inc: { storage: +Number(req.params.qty), score: -Number(req.params.qty)},
            })

            res.redirect("/cart")
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.error(error)
    }
})

router.get("/bill/get/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const soldhistory = await SoldHistory.findOne({ bill_id: req.params.id })

        if (user.isAdmin == true || user.isMember == true) {
            res.render("user/bill", {
                user: user,
                data: soldhistory,
            })
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")

        }
    } catch (error) {
        console.error(error)
    }
})

module.exports = router