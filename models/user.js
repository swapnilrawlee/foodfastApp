const mongoose = require('mongoose');
const Joi = require('joi');

const AddressSchema = mongoose.Schema(
    {
        state: { type: String, required: true },
        zip: { type: Number, required: true },
        city: { type: String, required: true },
        address: { type: String, required: true },
    }
);

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        phone: { type: Number},
        addresses: { type: [AddressSchema], required: true }
    },
    { timestamps: true } 
);

// Joi Validation Schema
const validateUser = (userData) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8),
        phone: Joi.number(),
        addresses: Joi.array().items(
            Joi.object({
                state: Joi.string().required(),
                zip: Joi.number().required(),
                city: Joi.string().required(),
                address: Joi.string().required(),
            })
        ).required()
    });

    return schema.validate(userData);
};

// Exporting Mongoose Model and Joi Validation Function
module.exports = {
    userModel: mongoose.model('user', userSchema),
    validateUser
};
