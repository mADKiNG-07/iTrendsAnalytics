const Post = require('../models/post');
const mAdmin = require('../middleware/mAdmin');
const mAnalyst = require('../middleware/mAnalyst');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const _ = require('lodash');
const multer = require("multer");
const jwt = require('jsonwebtoken');
const config = require('config');

router.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});

router.post('/add-post', (req, res) => {
    const token = req.header('x-auth-token');

    // checks if the token was provided
    if (!token) return res.status(401)
    send("Access Denied! No Token Provided!");

    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    const email = req.user.email;

    const post = new Post({
        imgUrl: req.body.imgUrl,
        cryptoPair: req.body.cryptoPair,
        typeOfTrade: req.body.typeOfTrade,
        tradingPref: req.body.tradingPref,
        desc: req.body.desc,
        rec: req.body.rec,
        outlook: req.body.outlook,
        analystEmail: email,
    });

    post.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => { console.log("Error saving data") });
});

router.get('/all-posts', (req, res) => {
    Post.find()
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});

router.get('/all-posts/:id', (req, res) => {
    const id = req.params.id;
    Post.findById(id)
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});

router.get('/all-posts/time-frame/:timeFrame', (req, res) => {
    const timeframe = req.params.timeFrame;
    Post.find({ timeFrame: timeframe })
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});

router.get('/all-posts/analyst/:analystEmail', (req, res) => {
    const analystEmail = req.params.analystEmail;
    Post.find({ analystEmail: analystEmail })
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});


router.put('/update-blog/:id', [mAdmin], (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndUpdate(id,
        {
            title: req.body.title,
            body: req.body.body,
            imgUrl: req.body.imgUrl,
            timeFrame: req.body.timeFrame
        },
        { new: true })
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        });

});

router.delete('/delete-post/:id', [mAdmin], (req, res) => {
    const id = req.params.id;
    Post.findByIdAndDelete(id)
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});


module.exports = router;