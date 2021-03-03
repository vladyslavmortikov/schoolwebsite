const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const multer = require("multer");
const fs = require('fs');
const bodyParser = require("body-parser");
const busboyBodyParser = require("busboy-body-parser");
const busboy = require('connect-busboy');
const config = require('../config');

const cloudinary = require('cloudinary');

router.use(busboy());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(busboyBodyParser({ limit: '5mb' }));
router.use(express.static('public'));
router.use(express.static('fs'));

router.get("/news/:id", function (req, res) {
    const newsId = req.params.id;
    Item.getById(newsId)
        .then(item => {
            if (!item) {
                res.status(404).send(`News with id = ${newsId} not found`);
            } else {
                res.render('item', {
                    item: item,
                    postedAt: item.postedAt,
                    id: item.id,
                    title: item.title,
                    text:item.text,
                    photo: item.photo
                });
            }
        })
        .catch(err => res.status(500).send(err.toString()));
});


router.get('/news', (req, res) => {
    Item.getAll()
        .then(items => res.render('items', {
            items: items
        }))
        .catch(err => res.status(500).send(err.toString()));
});

module.exports = router;