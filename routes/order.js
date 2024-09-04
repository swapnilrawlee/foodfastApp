const express = require('express');
const router = express.Router();
const { paymentModel } = require('../models/payment');
const { orderModel } = require('../models/order');
const { cartModel } = require('../models/cart');

router.get('/:userid/:orderid/:paymentid/:signature', async (req, res) => {
  const { orderid, paymentid, signature } = req.params;
  try {
      const payment = await paymentModel.findOne({ orderId: orderid });

      if (payment && payment.paymentId === paymentid && payment.signature === signature) {
          const cart = await cartModel.findOne({ user: req.params.userid });
          if (!cart) {
              return res.status(404).json({ success: false, message: 'Cart not found' });
          }

          const newOrder = await orderModel.create({
              orderId: orderid,
              user: req.params.userid,
              products: cart.products,
              totalPrice: cart.totalPrice,
              status: 'Processed',
              payment: payment._id,
          });

          await cartModel.deleteOne({ user: req.params.userid });

          console.log(`Redirecting to /map/${orderid}`);
          res.redirect(`/map/${orderid}`);
      } else {
          res.status(400).json({ success: false, message: 'Payment verification failed' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
  }
});

router.post('/address/:orderid', async function (req, res) {
    try {
        const order = await orderModel.findOne({ orderId: req.params.orderid });
        if (!order) return res.status(404).send("Order not found");

        if (!req.body.address) return res.status(400).send("Address is required");

        order.address = req.body.address;
        await order.save();

        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while updating the address.');
    }
});

module.exports = router;
