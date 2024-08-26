const mongoose = require('mongoose');
const Joi = require('joi');

// Order Mongoose Schema
const orderSchema = mongoose.Schema({
    orderId: { type: String ,required:true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    address: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processed', 'Shipped', 'Delivered', 'Cancelled'] // Example statuses
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'payment',
        required: true
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'delivery',
        required: true
    }
});

// Joi Validation Schema
const validateOrder = (orderData) => {
    const schema = Joi.object({
        user: Joi.string().required(), // ObjectId as string
        products: Joi.array().items(Joi.string().required()).required(), // Array of ObjectIds
        totalPrice: Joi.number().required(),
        address: Joi.string(),
        status: Joi.string().valid('Pending', 'Processed', 'Shipped', 'Delivered', 'Cancelled').required(), // Example statuses
        payment: Joi.string().required(), // ObjectId as string
        delivery: Joi.string().required() // ObjectId as string
    });

    return schema.validate(orderData);
};

// Exporting Mongoose Model and Joi Validation Function
module.exports = {
    orderModel: mongoose.model('order', orderSchema),
    validateOrder
};
