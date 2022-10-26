const mongoose = require('mongoose');
require('dotenv').config();

module.exports = function () {
    const dbURI = process.env.DB;
    mongoose.connect(dbURI)
        .then(() => console.log('Connected to MongoDB'));

}
