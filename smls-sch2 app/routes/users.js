const router = require('express').Router();
const User = require('../models/user');
const auth = require("../passport");

const config = require('../config');

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret
});

router.get('/users', auth.checkAdmin, function (req, res, next) {
    User.getAll()
        .then((users) => res.render('users/users', { users: users, user: req.user }))
        .catch(err => res.status(500).send(err.toString()))
});

router.get('/users/:id', auth.checkAuth, function (req, res, next) {
    User.getById(req.params.id)
        .then(user => {
            console.log(user)
            if (user != undefined) {
                res.render('users/user', {
                    user: req.user,
                    previewUser: user
                })
            }
            else
                res.render('notFound')
        })
        .catch(err => res.render('notFound'));
})

router.post('/users/:id', auth.checkAdmin, function (req, res, next) {
    User.getById(req.params.id)
        .then(user => {
            if (user.role)
                user.role = false;
            else
                user.role = true
            return (User.update(user))
        })
        .then((user) => {
            console.log('new:')
            console.log(user)
            res.render('users/user', {
                user: req.user,
                previewUser: user
            })
        })
        .catch(err => res.status(500).send(err.toString()));
})

router.get("/users/profile/:id", auth.checkAuth, auth.checkProfile, (req, res) => {
    User.getById(req.params.id)
        .then((user) => {
            if (user.id === req.user.id)
                user.logout = true;
            res.render('users/user', { user: user, charter: auth.getCharter(req) });
            console.log(user)
        })
        .catch(err => res.status(500).send(err.toString()));
});


router.post("/logout", auth.checkAuth, (req, res) => {
    req.logout();
    res.redirect('/auth/login');
});

module.exports = router;