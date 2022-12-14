const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    country: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
    },
    roles: {
        User: {
            type: Number,
            default: 5732
        },
        Editor: Number,
        Admin: Number
    },
    refreshToken: {
        type: String,
        required: false
    },
    // country
}, { timestamps: true });

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        email: this.email,
        roles: this.roles
    },
        config.get('jwtPrivateKey'),
        {
            expiresIn: '1h'
        });

    return token;
}

userSchema.methods.generateRefreshToken = function () {
    const token = jwt.sign({
        _id: this._id,
        email: this.email,
        isAdmin: this.isAdmin,
        isAnalyst: this.isAnalyst
    },
        config.get('jwtPrivateKey'),
        {
            expiresIn: '2d'
        });

    return token;
}

function validateUser(user) {
    const schema = {
        fName: Joi.string().min(5).max(50).required(),
        lName: Joi.string().min(5).max(50).required(),
        dob: Joi.date().required(),
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required(),
        country: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        accountType: Joi.string(),
        isAdmin: Joi.boolean()
    }

    return Joi.validate(user, schema);
}

const User = mongoose.model('User', userSchema);
module.exports.User = User;
module.exports.validate = validateUser;