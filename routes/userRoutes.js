const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { validate } = require('../models/user');
const bcrypt = require('bcrypt');
const mAdmin = require('../middleware/mAdmin');
const { Router } = require('express');
const nodemailer = require("nodemailer");
require('dotenv').config();



// Use middleware to set the default Content - Type
router.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});

router.post('/add-user', async (req, res) => {
    // validate body of params
    const { error } = validate(req.body);
    if (error) {
        res.status(404).send(error.details[0].message);
        return;
    }

    // checks if user(email) already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(404).send('User already registered!');

    user = new User(_.pick(req.body,
        ["username", "email", "password", "dob", "country", "accountType"]
    ));

    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // editing the date format
    user.dob = new Date(user.dob).getTime() + 86400000;

    // manually setting the account type to free
    user.accountType = "Free";
    // user.isAnalyst = true;

    // manually setting the isAdmin type to false
    // user.isAdmin = false;

    // removing this lines means you dont need the 
    // user to login before getting a token
    // (the user will get a token to access routes)
    const token = user.generateAuthToken();

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'infinitetrendsanalytics@gmail.com',
            pass: process.env.MAILER_PASSWORD
        }
    });

    var mailOptions = {
        from: 'infinitetrendsanalytics@gmail.com',
        to: user.email,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    user.save()
        .then((result) => {
            // set the token to the user's current token
            res.header('x-auth-token', token).send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});

router.put('/makeAnalyst/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndUpdate(id,
        {
            isAnalyst: true
        },
        { new: true })
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        });
});

router.put('/removeAnalyst/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndUpdate(id,
        {
            isAnalyst: false
        },
        { new: true })
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        });
});

router.get('/viewAnalyst', (req, res) => {
    const isAnalyst = true;
    User.find({ isAnalyst: isAnalyst })
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});

router.get('/viewAnalyst/:email', (req, res) => {
    const isAnalyst = true;
    const email = req.params.email;

    User.find({ isAnalyst: isAnalyst, email: email })
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});

router.put('/update-user/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndUpdate(id,
        {
            username: req.body.username,
            email: req.body.email,
            dob: new Date(req.body.dob).getTime() + 86400000,
            country: req.body.country,
            phoneNumber: req.body.phoneNumber,
            accountType: req.body.accountType,
        },
        { new: true })
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        });

});

router.delete('/delete-user/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id)
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});

router.get('/all-users', (req, res) => {
    User.find()
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        });
});

router.get('/all-users/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});

router.get('/all-users/:username', (req, res) => {
    const username = req.params.username;
    User.findOne({ username: username })
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});

router.get('/all-users/account-type/:accountType', mAdmin, (req, res) => {
    const accountType = req.params.accountType;
    User.find({ accountType: accountType })
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});

router.get('/all-users/country/:country', mAdmin, (req, res) => {
    const country = req.params.country;
    User.find({ country: country })
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});

module.exports = router;