const mongoose = require('mongoose');
const Joi = require('joi');

// Cart Mongoose Schema
const cartSchema = mongoose.Schema({
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
    }
});

// Joi Validation Schema
const validateCart = (cartData) => {
    const schema = Joi.object({
        user: Joi.string().required(), // ObjectId as string
        products: Joi.array().items(Joi.string().required()).required(), // Array of ObjectIds
        totalPrice: Joi.number().required()
    });

    return schema.validate(cartData);
};

// Exporting Mongoose Model and Joi Validation Function
module.exports = {
    cartModel: mongoose.model('cart', cartSchema),
    validateCart
};
