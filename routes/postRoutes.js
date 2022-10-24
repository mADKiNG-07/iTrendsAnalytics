const Post = require('../models/post');
const mAuth = require('../middleware/mAuth');
const mAdmin = require('../middleware/mAdmin');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const store = require('./../middleware/multer');
const fileUpload = require('express-fileupload');

router.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});

router.use(fileUpload());

router.post('/add-post', store.array('images', 12), (req, res) => {
    const post = new Post(_.pick(req.body, "imgUrl", "cryptoPair", "typeOfTrade", "tradingPref", "desc", "rec", "outlook"));
    post.imgUrl = req.file.filename;

    if (req.imgUrl === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    const file = req.imgUrl.file;

    file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    });

    post.save()
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});

router.put('/update-blog/:id', [mAuth, mAdmin], (req, res) => {
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

router.delete('/delete-post/:id', [mAuth, mAdmin], (req, res) => {
    const id = req.params.id;
    Post.findByIdAndDelete(id)
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});

router.get('/all-posts', mAuth, (req, res) => {
    Post.find()
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        });
});

router.get('/all-posts/:id', mAuth, (req, res) => {
    const id = req.params.id;
    Post.findById(id)
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});

router.get('/all-posts/time-frame/:timeFrame', mAuth, (req, res) => {
    const timeframe = req.params.timeFrame;
    Post.find({ timeFrame: timeframe })
        .then((result) => {
            res.send(JSON.stringify(result, null, 3) + "\n")
        })
        .catch((err) => {
            console.log(err)
        })
});



module.exports = router;