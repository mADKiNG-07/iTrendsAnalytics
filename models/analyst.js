const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;
const postSchema = require('./../models/post');

const analystSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    // country
}, { timestamps: true });


const Analyst = mongoose.model('Analyst', analystSchema);
module.exports.Analyst = Analyst;