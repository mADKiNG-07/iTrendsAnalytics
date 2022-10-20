const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();

// mongodb connection
require('./startup/prod')(app);
require('./startup/db')();

// routes
app.use(express.json());
app.use('/users', userRoutes);


// port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});
