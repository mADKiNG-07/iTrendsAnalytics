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

// Add headers
// app.use(function (req, res, next) {
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,Accept, Authortization');

//     // Pass to next layer of middleware
//     next();
// });

// middleware for cookies
app.use(cookieParser());

// makes sure that the jwtPrivateKey is set correctly
if (!config.get('jwtPrivateKey')) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined!");
    process.exit(1);
}

// routes
app.use(express.json());
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
