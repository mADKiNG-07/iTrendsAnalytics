const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = Schema({
    imgUrl: {
        type: String,
        required: true
    },
    cryptoPair: {
        type: String,
        required: true
    },
    typeOfTrade: {
        type: String,
        required: true
    },
    tradingPref: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    rec: {
        type: String,
        required: true
    },
    outlook: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;