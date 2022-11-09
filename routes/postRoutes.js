const Post = require('../models/post');
const mAuth = require('../middleware/mAuth');
const mAdmin = require('../middleware/mAdmin');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const _ = require('lodash');
const multer = require("multer");

router.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});

// set storage
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "public/img/");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: Storage,
}) //Field name and max count

router.post('/add-post', upload.single("file"), (req, res) => {
    const post = new Post({
        imgUrl: {
            data: fs.readFileSync("public/img/" + req.file.filename),
            contentType: "image/png"
        },
        cryptoPair: req.body.cryptoPair,
        typeOfTrade: req.body.typeOfTrade,
        tradingPref: req.body.tradingPref,
        desc: req.body.desc,
        rec: req.body.rec,
        outlook: req.body.outlook,
    });

    post.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => { console.log("Error saving image") });
});

// router.post('/add-post', (req, res) => {

//     upload(req, res, function (err) {
//         if (err) {
//             console.log(err);
//             return res.end("Something went wrong");
//         } else {
//             const post = new Post(_.pick(req.body, "imgUrl", "cryptoPair", "typeOfTrade", "tradingPref", "desc", "rec", "outlook"));

//             console.log(req.file.path);
//             var imageName = req.file.filename;

//             post.imgUrl = imageName;

//             post.save()
//                 .then((result) => {
//                     res.send(JSON.stringify(result, null, 3) + "\n")
//                 })
//                 .catch((err) => {
//                     console.log(err)
//                 })
//         }
//     });

// });

router.get('/all-posts', async (req, res) => {
    await Post.find()
        .then((result) => {
            res.render(JSON.stringify(result, null, 3) + "\n")
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


module.exports = router;