const mongoose = require('mongoose');
const Joi = require('joi');

// Payment Mongoose Schema
const paymentSchema = mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
        required: true
    },
    paymentId: { 
        type: String, 
        required: true 
    },
    signature: { 
        type: String, 
        required: true,
        enum: ['Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'] // Example payment methods
    },
    status: { 
        type: String, 
        required: true,
    },
    currency: { 
        type: String, 
        required: true 
    }
});



module.exports = {
    paymentModel: mongoose.model('payment', paymentSchema),
};
