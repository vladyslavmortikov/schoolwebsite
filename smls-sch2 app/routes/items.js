const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const multer = require("multer");
const fs = require('fs');
const Bot = require('../bot');
const bodyParser = require("body-parser");
const busboyBodyParser = require("busboy-body-parser");
const busboy = require('connect-busboy');
const config = require('../config');
const passport = require("../passport")

const cloudinary = require('cloudinary');

router.use(busboy());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(busboyBodyParser({ limit: '5mb' }));
router.use(express.static('public'));
router.use(express.static('fs'));


router.get('/news/new', passport.checkAdmin, (req, res) => {
    res.render('items/new');
});

router.post('/news/new', passport.checkAdmin, function (req, res) {
    const fileObject = req.files.posterUrl;
    const fileBuffer = fileObject.data;
    let it = 0;
    cloudinary.v2.uploader.upload_stream({ resource_type: 'raw' },
        function (error, result) {
            if (error) {
                res.sendStatus(500);
                return;
            }
            let Url = result.url;
            Item.insert(new Item(null, req.body.title, req.body.preview, Url, req.body.text))
                .then((item) => {
                    it = item;
                    res.redirect(`/news/${item.id}`);
                })
                .then(() => { return User.getAll(); })
                .then(users => {
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].chatId) Bot.sendMessage(users[i].chatId, `Новина: ${it.title}`);
                    }
                })
                .catch(err => res.status(500).send(err.toString()));
        })
        .end(fileBuffer);
});
            
router.post("/news/:id/edit", passport.checkAdmin, (req, res) => {
    const itemId = req.params.id;

    const fileObject = req.files.pic;
    const fileBuffer = fileObject.data;
    cloudinary.v2.uploader.upload_stream({ resource_type: 'raw' },
        function (error, result) {
            if (error) {
                res.sendStatus(500);
                return;
            }
            let photo = result.url;
            let updItem = new Item(itemId, req.body.title, req.body.preview, photo, req.body.text);

            Item.update(updItem)
                .then(res.redirect("/news"))
                .catch(err => res.status(500).send(err.toString()));
        })
        .end(fileBuffer);

});

router.get("/news/:id/edit", passport.checkAdmin, function (req, res) {
    const newsId = req.params.id;
    Item.getById(newsId)
        .then(item => {
            if (!item) {
                res.status(404).send(`This news with id = ${newsId} not found`);
            } else {
                res.render('items/edit', {
                    item: item
                });
            }
        })
        .catch(err => res.status(500).send(err.toString()));
});

router.get("/news/:id", passport.checkAdmin, function (req, res) {
    const newsId = req.params.id;
    Item.getById(newsId)
        .then(item => {
            if (!item) {
                res.status(404).send(`News with id = ${newsId} not found`);
            } else {
                res.render('items/item', {
                    item: item
                });
            }
        })
        .catch(err => res.status(500).send(err.toString()));
});


router.post("/news/:id/delete", passport.checkAdmin, function (req, res) {
    const newsId = req.params.id;
    Item.deleteById(newsId)
        .then(res.redirect('/news'))
        .catch(err => res.status(500).send(err.toString()));
});


router.get('/news', passport.checkAdmin, (req, res) => {
    let searchword = req.query.search;
    if (!searchword) searchword = "";
    if (!req.query.page) req.query.page = 0;
    const lm = 2;
    let skp = req.query.page * lm;
    let countOfItems = 0;

    Item.getQuantityOfItems(searchword)
        .then(count => {
            countOfItems = count;
            return Item.getAll(searchword, skp, lm);
        })
        .then(items => {
            let maxPage = Math.ceil(countOfItems / 2);
            let maxPageOnSite = maxPage;
            const pageOnSite = +req.query.page + 1;
            let prevPage = +req.query.page - 1;
            let nextPage = +req.query.page + 1;
            let right = false;
            let left = false;
            if (prevPage < 0) left = false;
            else left = true;
            if (nextPage >= maxPage) right = false;
            else right = true;
            if (maxPage > 1) maxPage = maxPage - 1;
            if (maxPageOnSite == 0) maxPageOnSite = 1;
            res.render('items/items', { pageOnSite, right, left, prevPage, nextPage, maxPageOnSite, searchword, count: countOfItems, items: items, currUser: req.user });
        })
        .catch(err => res.status(500).send(err.toString()));
    // Item.getAll()
    //     .then(items => res.render('items/items', {
    //         items: items
    //     }))
    //     .catch(err => res.status(500).send(err.toString()));
});

module.exports = router;