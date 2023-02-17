require('dotenv').config();
const config = require('config');
const express = require('express');
const postRoutes = require('./routes/postRoutes');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');
const refreshToken = require('./routes/refreshToken');
const mAuth = require('./middleware/mAuth');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');


const app = express();

// heroku config
require('./startup/prod')(app);

// mongodb connection
require('./startup/db')();

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));


// makes sure that the jwtPrivateKey is set correctly
if (!config.get('jwtPrivateKey')) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined!");
    process.exit(1);
}


app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/refreshToken', refreshToken);

app.use(mAuth);
app.use('/posts', postRoutes);


// port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});
