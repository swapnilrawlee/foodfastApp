const mongoose = require('mongoose');
const Joi = require('joi');

// Payment Mongoose Schema
const paymentSchema = mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
    },
    signature: {
        type: String,
    },
    status: { 
        type: String, 
        default: "pending"
    },
    currency: { 
        type: String, 
        required: true 
    }
},
{
    timestamps: true 
});

// Joi Validation Schema
const validatePayment = (payment) => {
    const schema = Joi.object({
        orderId: Joi.string().required(),
        amount: Joi.number().required(), // Added validation for amount
        paymentId: Joi.string().optional(),
        signature: Joi.string().optional(),
        status: Joi.string().valid("pending", "completed", "failed").optional(),
        currency: Joi.string().required()
    });

    return schema.validate(payment);
};

module.exports = {
    paymentModel: mongoose.model('payment', paymentSchema),
    validatePayment 
};
