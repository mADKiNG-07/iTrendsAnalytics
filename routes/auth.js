const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');


// Use middleware to set the default Content - Type
router.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});

router.post('/', async (req, res) => {
    // validate body of params
    const { error } = validate(req.body);
    if (error) {
        res.status(404).send(error.details[0].message);
        return;
    }

    // checks if user exists
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password!');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password!')

    const roles = Object.values(user.roles).filter(Boolean);

    const token = user.generateAuthToken();

    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    const result = await user.save();
    // console.log(result);
    // console.log(roles);

    res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 48 * 60 * 60 * 1000 });

    res.json({ roles, token });
});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required(),
    }

    return Joi.validate(req, schema);
}

module.exports = router;