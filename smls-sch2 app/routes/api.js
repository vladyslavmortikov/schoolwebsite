const router = require('express').Router();
//
const passport = require('passport');
const auth = require('../passport');
const BasicStrategy = require('passport-http').BasicStrategy;
//
const cloudinary = require("cloudinary");
//
const User = require('../models/user');
const Subject = require('../models/subject');
const Marks = require('../models/marks');
//
passport.use(new BasicStrategy(
    function (login, password, done) {
        let hash = auth.sha512(password);
        User.getByLoginAndHashPass(login, hash)
            .then(user => {
                done(null, user)
            })
            .catch(err => done(err, false))
        //    function (err, user) {
        //        if (err) { return done(err); }
        //        if (!user) { return done(null, false); }
        //        if (!user.validPassword(password)) {
        //            return done(null, false);
        //        }
        //        return done(null, user);
        //    });
    }
));
/////////////////////////////////////////////////
router.get("/", (req, res) => {
    let obj = new Object;
    res.status(200).send(obj);
});

router.get('/me', passport.authenticate('basic', { session: false }), function (req, res) {
    res.status(200).send(req.user);
});
/////////////////////////////////////////////////// USERS
router.get('/users', passport.authenticate('basic', { session: false }), function (req, res) {
    if (req.user.role === "admin") {
        User.getAll()
            .then(users => res.status(200).send(users))
            .catch(err => res.status(500).send(err));
    }
    else {
        res.status(403).send("Forbidden")
    }
});

router.get('/users/:id', passport.authenticate('basic', { session: false }), function (req, res) {
    if (req.user.role === "admin") {
        User.getById(req.params.id)
            .then(user => {
                if (user)
                    res.status(200).send(user);
                else
                    res.status(404).send("Not found")
            })
            .catch(err => res.status(500).send(err));
    }
    else {
        res.status(403).send("Forbidden")
    }
});

router.post('/users/register', function (req, res) {
    User.getByLogin(req.body.login)
        .then(user => {
            if (user)
                res.status(402).send("This login already exists");
            else {
                let nuser = new User(req.body.login, auth.sha512(req.body.password), req.body.name)
                User.insert(nuser)
                    .then(user => res.status(201).send(user))
                    .catch(err => res.status(500).send(err));

            }
        })
        .catch(err => res.status(402).sen(err))
});
router.post('/users/update/:id', passport.authenticate('basic', { session: false }), function (req, res) {
    if (req.user.role === "admin" || req.user.id === req.params.id) {
        let id = req.params.id;
        User.getById(id)
            .then(user => {
                if (user) {
                    if (req.files.avaUrl != undefined) {
                        const fileObject = req.files.avaUrl;
                        const fileBuffer = fileObject.data;
                        cloudinary.v2.uploader.upload_stream({ resource_type: 'raw' },
                            function (error, result) {
                                if (error) res.status(500).send(error.toString())
                                else {
                                    let avaUrl = result.url
                                    let login = req.body.login != undefined ? req.body.login : user.login;
                                    let password = req.body.password != undefined ? auth.sha512(req.body.password) : user.password;
                                    let name = req.body.name != undefined ? req.body.name : user.name;
                                    let role = req.body.role != undefined ? req.body.role : user.role;
                                    let bio = req.body.bio != undefined ? req.body.bio : user.bio;
                                    let newUser = new User(login, password, name);
                                    newUser.role = role;
                                    newUser.avaUrl = avaUrl;
                                    newUser.bio = bio;
                                    User.update(id, newUser)
                                        .then((result) => {
                                            res.status(202).send(result);
                                        })
                                        .catch((err) => res.status(500).send(err.toString()))
                                }
                            })
                            .end(fileBuffer);
                    }
                    else {
                        let avaUrl = user.avaUrl
                        let login = req.body.login != undefined ? req.body.login : user.login;
                        let password = req.body.password != undefined ? auth.sha512(req.body.password) : user.password;
                        let name = req.body.name != undefined ? req.body.name : user.name;
                        let role = req.body.role != undefined ? req.body.role : user.role;
                        let bio = req.body.bio != undefined ? req.body.bio : user.bio;
                        let newUser = new User(login, password, name);
                        newUser.role = role;
                        newUser.avaUrl = avaUrl;
                        newUser.bio = bio;
                        User.update(id, newUser)
                            .then((result) => {
                                res.status(202).send(result);
                            })
                            .catch((err) => res.status(500).send(err.toString()))
                    }
                }
                else {
                    res.status(404).send("Not found");
                }


            })
            .catch(err => res.status(500).send(err.toString()))


    }
    else {
        res.status(403).send("Forbidden")
    }

});

router.post('/users/delete/:id', passport.authenticate('basic', { session: false }), function (req, res) {
    if (req.user.role === "admin" || req.user.id === req.params.id) {
        User.getById(req.params.id)
            .then(user => {
                if (user)
                    User.deleteById(req.params.id)
                        .then(user => res.status(200).send(user))
                        .catch(err => res.status(500).send(err));
                else {
                    res.status(404).send("Not found");
                }
            })

    }
    else {
        res.status(403).send("Forbidden")
    }
});

/////////////////////////////////////////////////// SUBJECTS
router.get('/subjects', passport.authenticate('basic', { session: false }), function (req, res) {
    Subject.getAll()
        .then(subjects => res.status(200).send(subjects))
        .catch(err => res.status(500).send(err));

});

router.get('/subjects/:id', passport.authenticate('basic', { session: false }), function (req, res) {
    Subject.getById(req.params.id)
        .then(subject => {
            if (subject)
                res.status(200).send(subject);
            else
                res.status(404).send("Not found")

        })

        .catch(err => res.status(500).send(err));

});

router.post('/subjects/create', passport.authenticate('basic', { session: false }), function (req, res) {
    if (req.user.role === "admin") {
        let newSubject = new Subject(
            req.body.name,
            req.user.id
        );
        Subject.insert(newSubject)
            .then(subject => res.status(201).send(subject))
            .catch((err) => res.status(500).send(err)
            );
    }
    else {
        res.status(403).send("Forbidden")
    }
});

router.post('/subjects/delete/:id', passport.authenticate('basic', { session: false }), function (req, res) {
    if (req.user.role === "admin") {
        Subject.getById(subject => {
            if (subject)
                Subject.deleteById(req.params.id)
                    .then(subject => res.status(202).send(subject))
                    .catch(err => res.status(500).send(err));
            else
                res.status(404).send("Not found");
        })
    }
    else {
        res.status(403).send("Forbidden")
    }
});
/////////////////////////////////////////////// MARKS
router.get('/marks', passport.authenticate('basic', { session: false }), function (req, res) {

    Marks.getAll()
        .then(marks => {
            //@todo pagi
            let shift = 3;
            let curr = req.query.page;
            let total = Math.ceil(marks.length / shift);
            if (curr === undefined)
                curr = 1;
            if (curr > total || curr < 1)
                curr = 1;
            // console.log(curr)
            // console.log(total)
            let beg = shift * (curr - 1);
            let end = shift * (curr);
            if (end >= marks.length)
                end = marks.length;
            marks = marks.slice(beg, end);
            //
            res.status(200).send(marks)
        })
        .catch(err => res.status(500).send(err));

});

router.get('/marks/:id', passport.authenticate('basic', { session: false }), function (req, res) {

    Marks.getByUserId(req.params.id)
        .then(marks => {
            if (marks)
                res.status(200).send(marks);
            else
                res.status(404).send("Not found")
        })
        .catch(err => res.status(500).send(err));

});
router.post('/marks/create', passport.authenticate('basic', { session: false }), function (req, res) {
    if (req.user.role === "admin" || req.user.id === req.params.id) {
        let newMark = new Marks(req.body.userId, req.body.values.split(" "), req.body.subjectId)
        Marks.checkUnicMark(newMark)
            .then(mark => {
                if (!mark) {
                    Marks.insert(newMark)
                        .then((result) => {
                            res.status(202).send(result);
                        })
                        .catch((err) => res.status(500).send(err.toString()))
                }
                else {
                    res.status(400).send("Mark Exist");
                }
            })


    }
    else {
        res.status(403).send("Forbidden")
    }
});
router.post('/marks/update/:id', passport.authenticate('basic', { session: false }), function (req, res) {
    if (req.user.role === "admin") {
        Marks.getById(req.params.id)
            .then(mark => {
                if (mark) {
                    let userId = mark.userId;
                    let values = req.body.values != undefined ? req.body.values.split(" ") : mark.values;
                    let subjectId = mark.subjectId;
                    //
                    let newMark = new Marks(userId, values, subjectId)
                    Marks.update(req.params.id, newMark)
                        .then((result) => {
                            res.status(202).send(result);
                        })
                        .catch((err) => res.status(500).send(err.toString()))
                }
                else
                    res.status(404).send("Not found")
            })
            .catch(err => res.status(500).send(err.toString()))
    }
    else {
        res.status(403).send("Forbidden")
    }
});

router.post('/marks/delete/:id', passport.authenticate('basic', { session: false }), function (req, res) {
    if (req.user.role === "admin" || req.user.id === req.params.id) {
        Marks.getById(req.params.id)
            .then(user => {
                if (user)
                    Marks.deleteById(req.params.id)
                        .then(result => res.status(202).send(result))
                else
                    res.status(404).send("Not found")
            })
            .catch(err => res.status(500).send(err))
    }
    else {
        res.status(403).send("Forbidden")
    }
});




//
module.exports = router;