const express = require('express');
const { cartModel, validateCart } = require('../models/cart');
const { productModel } = require('../models/product');
const { userIsLoggedIn } = require('../middlewares/admin_middlewares');
const router = express.Router();

router.get('/', userIsLoggedIn, async function (req, res) {
    try {
        let cart = await cartModel
    .findOne({ user: req.session.passport.user })
    .populate("products");
    let cartDataStructure ={};
    cart.products.forEach(product =>{
        let key = product._id.toString();
        if(cartDataStructure[key]){
            cartDataStructure[key].quantity++;
        }
        else{
            cartDataStructure[key] = {
                ...product._doc,
                quantity: 1,
              
            }}
    })
    let finalarray = Object.values(cartDataStructure);
let finalprice = cart.totalPrice+34   
    res.render('cart', {cart: finalarray,finalprice: finalprice,userid: req.session.passport.user});
    } catch (error) {
        console.log(error);
        
    }
});

router.get('/add/:id', userIsLoggedIn, async function (req, res) {
    let cart = await cartModel.findOne({ user: req.session.passport.user });
    let product = await productModel.findOne({ _id: req.params.id });
    
    if (!cart) {
        cart = await cartModel.create({
            user: req.session.passport.user,
            products: [req.params.id],
            totalPrice: Number(product.price)
        });
    } else {
        cart.products.push(req.params.id);
        cart.totalPrice = Number(cart.totalPrice) + Number(product.price);
        console.log(cart.totalPrice);
        
        await cart.save();
    }

    res.redirect("back");
});
router.get('/remove/:id', userIsLoggedIn, async function (req, res) {
    let cart = await cartModel.findOne({ user: req.session.passport.user });
    let product = await productModel.findOne({ _id: req.params.id });

    if(!cart) {
        return res.status(404).send('Cart not found');
    }

    
    
    let productIndex = cart.products.indexOf(req.params.id);
    if(productIndex !== -1) {
        cart.products.splice(productIndex, 1);
        cart.totalPrice = Number(cart.totalPrice) - Number(product.price);

        await cart.save();
        res.redirect("back");

    }else{
        return res.status(404).send('Product not found in cart');
    }
});

module.exports = router;
