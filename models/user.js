const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {
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
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    dob: {
        type: Date,
        required: true
    },
    country: {
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
}, { timestamps: true });

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        // username = this.username
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
        // username = this.username
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
        username: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required(),
        dob: Joi.date().required(),
        country: Joi.string().required(),
        accountType: Joi.string(),
    }

    return Joi.validate(user, schema);
}

const User = mongoose.model('User', userSchema);
module.exports.User = User;
module.exports.validate = validateUser;