const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    let user = await User.findOne({ refreshToken: refreshToken });

    jwt.verify(
        refreshToken,
        config.get('jwtPrivateKey'),
        (err, decoded) => {
            if (err || user.email !== decoded.email) return res.sendStatus(403);
            const accessToken = user.generateAuthToken();
            res.json(accessToken);
        }
    )

});


module.exports = router;

