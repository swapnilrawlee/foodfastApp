const mongoose = require('mongoose');
const Joi = require('joi');

// Category Mongoose Schema
const categorySchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true,
    }
});

// Joi Validation Schema
const validateCategory = (categoryData) => {
    const schema = Joi.object({
        name: Joi.string().valid('Electronics', 'Clothing', 'Books', 'Furniture', 'Toys').required() // Example categories
    });

    return schema.validate(categoryData);
};

// Exporting Mongoose Model and Joi Validation Function
module.exports = {
    categoryModel: mongoose.model('category', categorySchema),
    validateCategory
};
