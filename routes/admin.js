const express = require('express');
const User = require('../models/User');
const router = express.Router();
const Category = require('../models/Category');
const moment = require('moment');
const Product = require('../models/Product');
const BuyHistory = require('../models/BuyHistory');
const SoldHistory = require('../models/SoldHistory');
const res = require('express/lib/response');
const Customers = require('../models/coustmers');
const Money = require('../models/Money');
const BackItems = require('../models/BackItems');

router.get("/category", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const category = await Category.find({}).sort({ Date: -1 })
        if (user.isAdmin == true) {
            res.render("admin/category/category", {
                user: user,
                category: category,
                del: req.flash("category-delete"),
                err: req.flash("edit-category-error"),
                suc: req.flash("edit-category-success")
            })
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})

router.post("/category", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            const name = req.body.name

            const newCategory = [
                new Category({
                    name: name,
                    Date: moment().locale("ar-kw").format('l'),
                })
            ]

            newCategory.forEach((data) => {
                data.save((error) => {
                    if (error) {
                        console.log(error)
                    } else {
                        res.redirect("/admin/category")
                    }
                })
            })
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
})

router.delete("/category/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            await Category.deleteOne({ _id: req.params.id })
            req.flash("category-delete", " ")
            res.redirect("/admin/category")
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/category/edit/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await Category.findOne({ _id: req.params.id })
        if (user.isAdmin == true) {
            res.render("admin/category/edit-category", {
                user: user,
                data: data,
            })
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.put("/category/edit/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const category = await Category.findOne({ _id: req.params.id })
        if (user.isAdmin == true) {
            const name = req.body.name
            const unique = await Category.findOne({ name: name })

            if (unique) {
                req.flash("edit-category-error", " ")
                res.redirect("/admin/category")
            } else {
                await Category.updateOne({ _id: req.params.id }, {
                    $set: {
                        name: name
                    }
                })

                await Product.updateMany({ category: category.name }, {
                    $set: {
                        category: name,
                    }
                })

                req.flash("edit-category-success", " ")
                res.redirect("/admin/category")
            }
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/products", async (req, res) => {
    try {
        res.redirect("/admin/products/all/all")
    } catch (error) {
        console.log(error)
    }
})

router.get("/products/:category/:filter", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        if (user.isAdmin == true) {
            if (req.params.category == "all") {
                const products = await Product.find({}).sort({ Date: -1 })
                const category = await Category.find({})
                res.render("admin/product/products", {
                    user: user,
                    products: products,
                    suc: req.flash("product-edit-success"),
                    war: req.flash("product-edit-warning"),
                    del: req.flash("product-delete-suc"),
                    category: category,
                    cat: req.params.category,
                    filter: req.params.filter
                })
            } else {
                const products = await Product.find({ category: req.params.category }).sort({ Date: -1 })
                const category = await Category.find({})
                res.render("admin/product/products", {
                    user: user,
                    products: products,
                    suc: req.flash("product-edit-success"),
                    war: req.flash("product-edit-warning"),
                    del: req.flash("product-delete-suc"),
                    category: category,
                    cat: req.params.category,
                    filter: req.params.filter
                })
            }
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/product/add", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const category = await Category.find({}).sort({ Date: -1 })
        if (user.isAdmin == true) {
            res.render("admin/product/add-product", {
                user: user,
                category: category,
                suc: req.flash("add-product-success")
            })
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.post("/product/add", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        if (user.isAdmin == true) {
            const { name, since_name, code, buy_price, sell_price,
                expire, category, bach } = req.body

            const newProduct = [
                new Product({
                    name: name,
                    since_name: since_name,
                    code: code,
                    buy_price: buy_price,
                    sell_price: sell_price,
                    category: category,
                    earn: sell_price - buy_price,
                    expire: expire,
                    bach: bach,
                    Date: moment().locale("ar-kw").format('l'),
                })
            ]

            newProduct.forEach((data) => {
                data.save((error) => {
                    if (error) {
                        console.log(error)
                    } else {
                        req.flash("add-product-success", " ")
                        res.redirect("/admin/product/add")
                    }
                })
            })
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/product/get/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await Product.findOne({ _id: req.params.id })
        if (user.isAdmin == true) {
            res.render("admin/product/get-product", {
                user: user,
                data: data,
            })
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/product/edit/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await Product.findOne({ _id: req.params.id })
        const category = await Category.find({}).sort({ Date: -1 })
        if (user.isAdmin == true) {
            res.render("admin/product/edit-product", {
                user: user,
                data: data,
                category: category,
            })
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.put("/product/edit/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const { name, since_name, code, buy_price, sell_price, storage,
            expire, company, category, bought, bach } = req.body
        if (user.isAdmin == true) {
            const unique = await Product.findOne({ name: name })
            if (unique) {
                await Product.updateOne({ _id: req.params.id }, {
                    $set: {
                        since_name: since_name,
                        code: code,
                        buy_price: buy_price,
                        sell_price: sell_price,
                        storage: storage,
                        expire: expire,
                        company: company,
                        category: category,
                        bought: bought,
                        bach: bach
                    }
                })

                req.flash("product-edit-warning", " ")
                res.redirect("/admin/products")
            } else {
                await Product.updateOne({ _id: req.params.id }, {
                    $set: {
                        name: name,
                        since_name: since_name,
                        code: code,
                        buy_price: buy_price,
                        sell_price: sell_price,
                        storage: storage,
                        expire: expire,
                        company: company,
                        category: category,
                        bought: bought
                    }
                })

                req.flash("product-edit-success", " ")
                res.redirect("/admin/products")
            }
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.delete("/product/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            await Product.deleteOne({ _id: req.params.id })
            req.flash("product-delete-suc", " ")
            res.redirect("/admin/products")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/storage/:company/:filter", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const category = await Category.find({})
        const filter = req.params.filter
        const company = req.params.company
        if (user.isAdmin == true) {
            if (company == "all") {
                if (filter == "all") {
                    const products = await Product.find({})
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                } else if (filter == "most") {
                    const products = await Product.find({}).sort({ storage: -1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                } else if (filter == "little") {
                    const products = await Product.find({}).sort({ storage: 1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                } else if (filter == "high") {
                    const products = await Product.find({}).sort({ score: -1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                } else if (filter == "low") {
                    const products = await Product.find({}).sort({ score: 1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                } else if (filter == "new") {
                    const products = await Product.find({}).sort({ Date: -1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                } else if (filter == "old") {
                    const products = await Product.find({}).sort({ Date: 1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                } else if (filter == "expire") {
                    const products = await Product.find({}).sort({ expire: 1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                } else if (filter == "a-z") {
                    const products = await Product.find({}).sort({ name: 1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                } else if (filter == "z-a") {
                    const products = await Product.find({}).sort({ name: -1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                }
            } else {
                if (filter == "all") {
                    const products = await Product.find({ category: company })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                } else if (filter == "most") {
                    const products = await Product.find({ category: company }).sort({ storage: -1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                } else if (filter == "little") {
                    const products = await Product.find({ category: company }).sort({ storage: 1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                } else if (filter == "high") {
                    const products = await Product.find({ category: company }).sort({ score: -1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                } else if (filter == "low") {
                    const products = await Product.find({ category: company }).sort({ score: 1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                } else if (filter == "new") {
                    const products = await Product.find({ category: company }).sort({ Date: -1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                } else if (filter == "old") {
                    const products = await Product.find({ category: company }).sort({ Date: 1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                } else if (filter == "expire") {
                    const products = await Product.find({ category: company }).sort({ expire: 1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                }else if (filter == "a-z") {
                    const products = await Product.find({ category: company }).sort({ name: 1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                } else if (filter == "z-a") {
                    const products = await Product.find({ category: company }).sort({ name: -1 })
                    res.render("admin/product/storage", {
                        filter: filter,
                        company: company,
                        products: products,
                        category: category
                    })
                }
            }
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/product/buy/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const product = await Product.findOne({ _id: req.params.id })
        if (user.isAdmin == true) {
            res.render("admin/list/buy", {
                user: user,
                data: product
            })
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.post("/product/buy/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const product = await Product.findOne({ _id: req.params.id })
        if (user.isAdmin == true) {
            const { list_number, Date_meet, seller, worker, buy_price, sell_price,
                company, qty, expire, card_number } = req.body

            const newBuyHistory = [
                new BuyHistory({
                    Date: Date_meet,
                    list_number: list_number,
                    seller: seller,
                    worker: worker,
                    buy_price: buy_price,
                    sell_price: sell_price,
                    product_code: product.code,
                    product_name: product.name,
                    product_since_name: product.since_name,
                    company: company,
                    qty: qty,
                    expire: expire,
                    card_number: card_number
                })
            ]

            await Product.updateOne({ _id: req.params.id }, {
                $set: {
                    buy_price: buy_price,
                    sell_price: sell_price,
                    company: company,
                    expire: expire,
                },

                $inc: {
                    storage: +qty,
                    bought: +qty,
                }
            })

            newBuyHistory.forEach((data => {
                data.save((error) => {
                    if (error) {
                        console.log(error)
                    } else {
                        res.redirect("/admin/buyhistory/all")
                    }
                })
            }))

        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/buyhistory/get/:filter", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const filter = req.params.filter

        if (user.isAdmin == true) {
            if (filter == "all") {
                const buyData = await BuyHistory.find({}).sort({ Date: -1 })
                res.render("admin/buy/buyhistory", {
                    user: user,
                    buyData: buyData,
                })
            }
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/buyhistory/get-one/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await BuyHistory.findOne({ _id: req.params.id })

        if (user.isAdmin == true) {
            res.render("admin/buy/list", {
                user: user,
                data: data,
            })
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/buyhistory/newlist", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            res.render("admin/buy/new-list", {
                user: user,
            })
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }

    } catch (error) {
        console.log(error)
    }
})

router.put("/buyhistory/newlist/new/:code", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await Product.findOne({ code: req.params.code })
        const unique_name = await Product.find({ name: data.name })
        const { qty, free, buy_price, sell_price, expire, bach } = req.body
        const unique = await Product.find({ bach: data.bach })
        const total = Number(qty) + Number(free)

        

        if (user.isAdmin == true) {

            if (buy_price == 0 || sell_price == 0) {

                if (unique_name.length > 1) {
                    await Product.updateOne({ bach: bach }, {
                        $inc: { storage: +total },
                        $push: { storageAnalysis: total },
                        $set: { expire: expire }
                    })
                } else {

                    if (unique.length > 1) {
                        await Product.updateOne({ code: req.params.code }, {
                            $inc: { storage: +total },
                            $push: { storageAnalysis: total },
                            $set: { expire: expire }
                        })
                    } else {
                        await Product.updateOne({ bach: bach }, {
                            $inc: { storage: +total },
                            $push: { storageAnalysis: total },
                            $set: { expire: expire }
                        })
                    }

                }
            } else {

                if (unique_name.length > 1) {
                    await Product.updateOne({ bach: bach }, {
                        $inc: { storage: +total },
                        $push: { storageAnalysis: total },
                        $set: { buy_price: buy_price, sell_price: sell_price, expire: expire }
                    })
                } else {

                    if (unique.length > 1) {
                        await Product.updateOne({ code: req.params.code }, {
                            $inc: { storage: +total },
                            $push: { storageAnalysis: total },
                            $set: { buy_price: buy_price, sell_price: sell_price, expire: expire }
                        })
                    } else {
                        await Product.updateOne({ bach: bach }, {
                            $inc: { storage: +total },
                            $push: { storageAnalysis: total },
                            $set: { buy_price: buy_price, sell_price: sell_price, expire: expire }
                        })
                    }

                }
            }


            await User.updateOne({ _id: userID }, {
                $push: {
                    buy: {
                        name: data.name, code: data.code, since_name: data.since_name,
                        company: data.category, qty: qty, free: free, buy_price: buy_price, sell_price: sell_price,
                        expire: expire, bach: bach
                    }
                }
            })

            res.redirect("/admin/buyhistory/newlist")
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.put("/buyhistory/newlist/delete/:code", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await Product.findOne({ code: req.params.code })
        const bach_id = data.bach;
        const unique_name = await Product.find({ name: data.name })
        const unique = await Product.find({ bach: bach_id })
        const { qty, free, buy_price, sell_price, expire, bach } = req.body
        const lastAdded = data.storageAnalysis[data.storageAnalysis.length - 1]

        if (user.isAdmin == true) {

            console.log(data.storageAnalysis[0])
            if (data.storageAnalysis.length > -1) {

                if(unique_name.length > 1){
                    await Product.updateOne({ bach: bach_id }, {
                        $set: { storage: Number(data.storage) - Number(data.storageAnalysis[0]) },
                    })
                } else {
                    if (unique.length > 1) {
                        await Product.updateOne({ code: req.params.code }, {
                            $set: { storage: Number(data.storage) - Number(data.storageAnalysis[0]) },
                        })
                    } else {
                        await Product.updateOne({ bach: bach_id }, {
                            $set: { storage: Number(data.storage) - Number(data.storageAnalysis[0]) },
                            $set: { storageAnalysis: [] }
                        })
                    }
                }
            } else {
                if (unique) {
                    await Product.updateOne({ code: req.params.code }, {
                        $set: { storage: Number(data.storage) - Number(lastAdded) },
                        $set: { storageAnalysis: [] }
                    })
                } else {
                    await Product.updateOne({ bach: bach_id }, {
                        $set: { storage: Number(data.storage) - Number(lastAdded) },
                        $set: { storageAnalysis: [] }
                    })
                }
            }

            await User.updateOne({ _id: userID }, {
                $pull: {
                    buy: {
                        name: data.name, code: data.code, since_name: data.since_name,
                        company: data.category, qty: qty, free: free, buy_price: buy_price, sell_price: sell_price,
                        expire: expire, bach: bach
                    }
                }
            }) 


            res.redirect("/admin/buyhistory/newlist")
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.post("/buyhistory/save", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const random = Math.floor(Math.random() * 1234) + Math.floor(Math.random() * 1234) - Math.floor(Math.random() * 1234)

        const { seller, worker } = req.body
        if (user.isAdmin == true) {
            const newBuyList = [
                new BuyHistory({
                    list_id: random,
                    Date: moment().locale("ar-kw").format('l'),
                    seller: seller,
                    worker: worker,
                    items: user.buy
                })
            ]

            newBuyList.forEach((data) => {
                data.save()
            })

            await User.updateOne({ _id: userID }, {
                $set: { buy: [] }
            })

            res.redirect("/admin/buyhistory/get/all")
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/list/bills", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const soldhistory = await SoldHistory.find({}).sort({ Date: 1 })
        const customers = await Customers.find({}).sort({ Date: -1 })

        if (user.isAdmin == true) {
            res.render("admin/list/bills", {
                user: user,
                soldhistory: soldhistory,
                customers: customers,
                suc: req.flash("bill-delete")
            })
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/list/bills/getid/:bill_id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const soldhistory = await SoldHistory.find({ bill_id: req.params.bill_id }).sort({ Date: 1 })

        if (user.isAdmin == true) {
            res.render("admin/list/folders", {
                user: user,
                soldhistory: soldhistory,
                suc: req.flash("bill-delete")
            })
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/list/bills/folders/:name", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const soldhistory = await SoldHistory.find({ name: req.params.name }).sort({ Date: 1 })

        if (user.isAdmin == true) {
            res.render("admin/list/folders", {
                user: user,
                soldhistory: soldhistory,
                suc: req.flash("bill-delete")
            })
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/list/bill/get/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await SoldHistory.findOne({ bill_id: req.params.id })

        if (user.isAdmin == true) {
            res.render("admin/list/bill", {
                user: user,
                data: data,
            })
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.put("/list/bill/back/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            const { qty, bach, code, free } = req.body
            const data = await Product.findOne({ code: code, bach: bach })
            
            await SoldHistory.updateOne({ bill_id: req.params.id}, { 
                $push: {backItems: { name: data.name, sell_price: data.sell_price, qty: qty, bach: bach, code: code, free: free}}
            })

            await Product.updateOne({ code: code, bach: bach}, {
                $inc: { storage: +(Number(qty) + Number(free)) }
            })

            res.redirect("back")
        } else {
            req.flash("admin-error", " ")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
})

router.delete("/bill/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            const order = await SoldHistory.findOne({ bill_id: req.params.id })
            const items = order.order

            for (let index = 0; index < items.length; index++) {
                await Product.updateOne({ name: items[index].name, expire: items[index].expire }, {
                    $inc: {
                        score: -(Number(items[index].qty) + Number(items[index].free)),
                        storage: +(Number(items[index].qty) + Number(items[index].free))
                    }
                })
            }

            await SoldHistory.deleteOne({ bill_id: req.params.id })
            console.log(items.order)
            req.flash("bill-delete", " ")
            res.redirect("/admin/list/bills")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/customers", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const customers = await Customers.find({}).sort({ Date: -1 })

        if (user.isAdmin == true) {
            res.render("admin/customers/customers", {
                user: user,
                customers: customers
            })
        }
    } catch (error) {
        console.log(error)
    }
})

router.post("/customers", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            const { name } = req.body

            const newCustomer = [
                new Customers({
                    name: name,
                    Date: moment().locale("ar-kw").format('l'),
                })
            ]

            newCustomer.forEach((data) => {
                data.save()
            })

            res.redirect("/admin/customers")
        }
    } catch (error) {
        console.log(error)
    }
})

router.delete("/customers/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            await Customers.deleteOne({ _id: req.params.id })
            req.flash("bill-delete", " ")
            res.redirect("/admin/customers")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/money", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const money = await Money.find({}).sort({ Date: -1 })

        if (user.isAdmin == true) {
            res.render("admin/money/money", {
                user: user,
                money: money
            })
        }
    } catch (error) {
        console.log(error)
    }
})

router.delete("/money/delete/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            await Money.deleteOne({ _id: req.params.id })
            res.redirect("..")
        }
    } catch (error) {
        console.log(error)
    }
})

router.post("/money", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const { name, invoice_id, total, paid } = req.body

        if (user.isAdmin == true) {
            const newMoneyList = [
                new Money({
                    name: name,
                    invoice_id: invoice_id,
                    total: total,
                    paid: paid,
                    left: Number(total) - Number(paid),
                    Date: moment().locale("ar-kw").format('l'),
                })
            ]

            newMoneyList.forEach((data) => {
                data.save((error) => {
                    if (error) {
                        console.log(error)
                    } else {
                        res.redirect("/admin/money")
                    }
                })
            })
        }
    } catch (error) {
        console.log(error)
    }
})

router.delete("/buyhistory/delete-one/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })

        if (user.isAdmin == true) {
            await BuyHistory.deleteOne({ _id: req.params.id })
            res.redirect("/admin/buyhistory/get/all")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/unknown-items", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const customers = await Customers.find({}).sort({ Date: -1 })

        if(user.isAdmin == true) {
            res.render("admin/unknown-items/unknown-items", {
                customers: customers,
                suc: req.flash("back-items-suc")
            })
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/unknown-items/get/:name", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const backItems = await BackItems.find({ name: req.params.name }).sort({ Date: -1 })

        if(user.isAdmin == true) {
            res.render("admin/unknown-items/get-bills", {
                backItems: backItems,
            })
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/unknown-items/make-bill", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const customers = await Customers.find({}).sort({ Date: -1 })

        if(user.isAdmin == true) {
            res.render("admin/unknown-items/make-bill", {
                user: user,
                customers: customers
            })
        }
    } catch (error) {
        console.log(error)
    }
})

router.put("/unknown-items/make-bill/add/:code/:bach", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const { code, bach } = req.params
        const { qty, free } = req.body
        const product = await Product.findOne({ code: code, bach: bach})

        if(user.isAdmin == true) {
            await User.updateOne({ _id: userID }, {
                $push: { backItems: { name: product.name, code: code, bach: bach,
                                     qty: qty, sell_price: product.sell_price,
                                     expire: product.expire, free: free } }
            })

            await Product.updateOne({ code: code, bach: bach}, {
                $inc: { storage: +(Number(free) + Number(qty)) },
                $push: { backAnalysis: Number(free)+Number(qty) }
            })

            res.redirect("back")
        }
    } catch (error) {
        console.log(error)
    }
})

router.put("/unknown-items/make-bill/remove/:code/:bach/:qty/:free", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const { code, bach, qty, free } = req.params

        if(user.isAdmin == true) {
            await User.updateOne({ _id: userID }, {
                $pull: { backItems: { code: code, bach: bach } }
            })

            await Product.updateOne({ code: code, bach: bach}, {
                $inc: { storage: -( Number(qty)+Number(free) ) },
            })

            res.redirect("back")
        }
    } catch (error) {
        console.log(error)
    }
})

router.post("/unknown-items/save", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const { name, invoice } = req.body

        if(user.isAdmin == true) {
            const newBackItems = [
                new BackItems({
                    name: name,
                    Date: moment().locale("ar-kw").format('l'),
                    invoice: invoice,
                    items: user.backItems
                })
            ]

            await User.updateOne({ _id: req.cookies.id }, {
                $set: { backItems: [] }
            })

            newBackItems.forEach((data) => {
                data.save();
            })

            req.flash("back-items-suc", " ")
            res.redirect("/admin/unknown-items")
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/unknown-items/bill/:id", async (req, res) => {
    try {
        const userID = req.cookies.id
        const user = await User.findOne({ _id: userID })
        const data = await BackItems.findOne({ _id: req.params.id})

        if(user.isAdmin == true) {
            res.render("admin/unknown-items/bill", {
                user: user,
                data: data
            })
        }
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;