const mongoose = require('mongoose');
const Joi = require('joi');

// Admin Mongoose Schema
const adminSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        required: true,
        enum: ['SuperAdmin', 'Admin'] // Example roles
    }
});

// Joi Validation Schema
const validateAdmin = (adminData) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().valid('SuperAdmin', 'Admin').required() // Example roles
    });

    return schema.validate(adminData);
};

// Exporting Mongoose Model and Joi Validation Function
module.exports = {
    adminModel: mongoose.model('admin', adminSchema),
    validateAdmin
};
