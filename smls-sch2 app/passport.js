const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const User = require('./models/user');
const config = require('./config');

const hashing = require('./hashing')
const serverSalt = config.serverSalt;



passport.serializeUser(function (user, doneCB) {
    doneCB(null, user.id);
});

passport.deserializeUser(function (id, doneCB) {
    User.getById(id)
        .then((user) => {
            if (user)
                doneCB(null, user);
            else
                doneCB(null, false);
        })
        .catch((err) => done(err))
});
//
function sha512(password) {
    let salt = serverSalt;
    const hash = crypto.createHmac('sha512', salt);
    //const value = hash.digest('hex');
    return hash.update(password).digest('hex');
};

passport.use('local-register', new localStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true
}, (req, login, password, done) => {

    process.nextTick(() => {
        if (!req.user) {
            User.getByLogin(login)
                .then(data => {
                    if (data) {
                        return done(null, false, { message: "error=Username+already+exists" });
                    }
                    if (req.body.passwordRepeat !== password) {
                        done(null, false, { message: 'error=Passwords+do+not+match' });
                    }
                    else {
                        //console.log("lol");
                        let user = new User(login, sha512(password), req.body.name);

                        //console.log(user);
                        User.insert(user)
                            .then(data => {
                                //console.log(data);
                                done(null, data)
                            })
                    }

                })
                .catch(err => {
                    console.log(err)
                    done(err)
                })
        }
        else {
            console.log("user is signed in ")
            done(null, false, { message: "error=User+is+already+signed+in"});
        }
    })
}))

passport.use('local-login', new localStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true
}, (req, login, password, done) => {
    console.log("I`m in local login");
    //process.nextTick(() => {
    if (!req.user) {
        User.getByLogin(login)
            .then(usr => {
                if (!usr)
                    return done(null, false, { message: "error=Incorrect_username" });
                if (!checkPassword(password, usr.password))
                    return done(null, false, { message: 'error=Incorrect_password' });
                return done(null, usr);
            })
            .catch(err => done(err));
    }
    else {
        console.log("user is registered");
        done(null, false, { message: "error=User+is+already+signed+in"});
    }
    //})
}));

function checkPassword(password, userPassword) {
    return sha512(password) === userPassword;
}

function checkAuth(req, res, next) {
    if (!req.user) return res.sendStatus(401);
    next();
}

function checkAdmin(req, res, next) {
    if (!req.user) return res.sendStatus(401);
    if (req.user.role !== "admin") return res.sendStatus(403);
    next();
}

function checkProfile(req, res, next) {
    if (!req.user) return res.sendStatus(401);
    if (req.user.id !== req.params.id) return res.status(403)
    next();
}

function getCharter(req)
{
    let charter = new Object();

    charter.logged = req.user ? true : false;
    //console.log(req.user);
    charter.admin = req.user ? req.user.role === "admin" ? true : false : false;
    charter.id = req.user ? req.user.id : "" ;
   // console.log("ID: " + charter.id);
    return charter;
}

module.exports = {
    checkAuth,
    checkAdmin,
    checkProfile,
    getCharter,
    sha512
};