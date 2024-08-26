const mongoose = require('mongoose');
const Joi = require('joi');

// Product Mongoose Schema
const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: Buffer, required: true },
}, 
{ timestamps: true }
);

// Joi Validation Schema
const validateProduct = (productData) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string().required(),
        stock: Joi.number().required(),
        description: Joi.string().optional(),
        image: Joi.string().optional() // Image is now optional
    });

    return schema.validate(productData);
};

// Exporting Mongoose Model and Joi Validation Function
module.exports = {
productModel: mongoose.model('product', productSchema),
    validateProduct
};
