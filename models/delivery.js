const mongoose = require('mongoose');
const Joi = require('joi');

// Delivery Mongoose Schema
const deliverySchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
        required: true
    },
    deliveryBoy: { type: String, required: true },
    status: { 
        type: String, 
        required: true,
        enum: ['Pending', 'In Transit', 'Delivered', 'Cancelled']
    },
    trackingURL: { type: String, required: true },
    estimatedDeliveryTime: { type: Number, required: true }
});

// Joi Validation Schema
const validateDelivery = (deliveryData) => {
    const schema = Joi.object({
        order: Joi.string().required(), // ObjectId as string
        deliveryBoy: Joi.string().uri(),
        status: Joi.string().valid('Pending', 'In Transit', 'Delivered', 'Cancelled').required(),
        trackingURL: Joi.string().required(),
        estimatedDeliveryTime: Joi.number().required()
    });

    return schema.validate(deliveryData);
};

// Exporting Mongoose Model and Joi Validation Function
module.exports = {
    deliveryModel: mongoose.model('delivery', deliverySchema),
    validateDelivery
};
