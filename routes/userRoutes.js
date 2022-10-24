const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { validate } = require('../models/user');
const bcrypt = require('bcrypt');
const mAdmin = require('../middleware/mAdmin');


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
        ["fName", "lName", "dob", "email", "password", "country", "phoneNumber", "accountType", "isAdmin"]
    ));

    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // editing the date format
    user.dob = new Date(user.dob).getTime() + 86400000;

    // manually setting the account type to free
    user.accountType = "Free";

    // manually setting the isAdmin type to false
    // user.isAdmin = false;

    // removing this lines means you dont need the 
    // user to login before getting a token
    // (the user will get a token to access routes)
    const token = user.generateAuthToken();

    user.save()
        .then((result) => {
            // set the token to the user's current token
            res.header('x-auth-token', token).send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});

router.put('/update-user/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndUpdate(id,
        {
            fName: req.body.fName,
            lName: req.body.lName,
            dob: new Date(req.body.dob).getTime() + 86400000,
            email: req.body.email,
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

router.get('/all-users', mAdmin, (req, res) => {
    User.find()
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        });
});

router.get('/all-users/:id', mAdmin, (req, res) => {
    const id = req.params.id;
    User.findById(id)
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