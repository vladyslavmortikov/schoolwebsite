const router = require('express').Router();
const User = require("../models/user")
const crypto = require("crypto");
const config = require('../config');
const serverSalt = config.serverSalt;

const auth = require('../passport')

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;



router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());

router.use(passport.initialize());
router.use(passport.session());

router.use(session({
    secret: config.secretString,
    resave: false,
    saveUninitialized: true
}));

router.get("/auth/login", (req, res) => {
    res.render('login', {});
});

router.get("/auth/register", (req, res) => {
    res.render('register', { registerError: req.query.error || "" });
});

router.post('/auth/login', passport.authenticate('local-login', { succesfulRedirect: '/', failureRedirect: '/auth/login' }), (req, res) => res.redirect('/'));

router.post("/auth/register", (req, res, next) => {
    passport.authenticate('local-register', (err, user, info) => {
        //console.log(user);
        if (!user) res.redirect("/auth/register?" + info.message)
        else res.redirect("/auth/login")
    })(req, res, next)
})

router.get('/auth/logout',
    (req, res) => {
        req.logout();
        res.redirect('/');
    });

router.get("/checkLogin", (req, res) => {
    User.getByLogin(req.query.login)
        .then(user => {
            if (user === null)
                res.send(false)
            else
                res.send(true)

        })
})
router.get("/checkLoginAndPassword", (req, res) => {
    let login = req.query.login
    let password = req.query.password
    let hash = auth.sha512(password)
    User.getByLoginAndHashPass(login, hash)
        .then(user => {
            if (user === null)
                res.send(false)
            else
                res.send(true)
        })
})

module.exports = router;