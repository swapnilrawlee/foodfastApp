const express = require('express');
const router = express.Router();
const { paymentModel } = require('../models/payment')
const { orderModel } = require('../models/order')

router.get('/:userid/order/:orderid/:payment/:signature',async function (req, res) {
   let paymentDetails = paymentModel.find0ne({ orderId: req.params.orderid });
   if (!paymentDetails) {
     return res.status(404).send('Payment not found');
   }

   if(req.params.signature === paymentDetails.signature && req.params.paymentId === paymentDetails.paymentId) {
   let cart = await cartModel.findOne({user:req.params.userid})
    orderModel.create({
   
    orderId: req.params.orderid,
    user:req.params.userid,
    products:cart.products,
    totalPrice:cart.totalPrice,
        status:"processing",
        payment:paymentDetails._id,
        
   })
     return res.redirect(`/map/${req.params.orderid}`);
 
}
});

router.post('/address/:orderid',async function (req, res) {
    let order =await orderModel.findOne({orderId: req.params.orderid })
    if(!order) return res.send("not available")
    if(!req.body.address) return res.send("not available address")

        order.address = req.body.address;
        order.save();
        res.redirect("/")
});
module.exports = router;