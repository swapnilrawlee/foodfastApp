require('dotenv').config();
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const {paymentModel} = require('../models/payment');
const { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create/orderId', async (req, res) => {
  try {
    const options = {
      amount: 5000 * 100,
      currency: 'INR',
    };

    const order = await razorpay.orders.create(options);
    res.send(order);

    const newPayment = await paymentModel.create({
      orderId: order.id,
      amount: order.amount,
      status: 'pending',
      currency: order.currency
    });


  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating order');
  }
});

router.post('/api/payment/verify', async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  try {
    const result = validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
      signature,
      secret
    );
  

    if (result) {
      const payment = await paymentModel.findOne({ orderId: razorpayOrderId });
      if (payment) {
        payment.paymentId = razorpayPaymentId;
        payment.signature = signature;
        payment.status = 'completed';
        await payment.save();
        res.json({ status: 'success' });
      } else {
        res.status(404).send('Payment not found');
      }
    } else {
      res.status(400).send('Invalid signature');
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error verifying payment');
  }
});


router.post('/api/payment/verify', async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  try {
    const isValid = validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
      signature,
      secret
    );

    if (isValid) {
      const payment = await paymentModel.findOne({ orderId: razorpayOrderId,status:"pending" });
      if (payment) {
        payment.paymentId = razorpayPaymentId;
        payment.signature = signature;
        payment.status = 'completed';
        await payment.save();
        res.json({ status: 'success' });
      } else {
        res.status(404).send('Payment not found');
      }
    } else {
      res.status(400).send('Invalid signature');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error verifying payment');
  }
});
module.exports = router;
