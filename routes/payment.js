const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const {paymentModel} = require('../models/payment');
 // Ensure you have the correct path to your Payment model
 const { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');

const razorpay = new Razorpay({
  key_id: 'YOUR_KEY_ID',
  key_secret: 'YOUR_KEY_SECRET',
});

router.post('/create/orderId', async (req, res) => {
  try {
    const options = {
      amount: 5000 * 100,
      currency: 'INR',
    };

    const order = await razorpay.orders.create(options);

    const newPayment = await paymentModel.create({
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
      status: 'created',
    });

    res.send(newPayment);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating order');
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
