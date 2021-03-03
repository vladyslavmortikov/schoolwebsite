//sudo service mongod start
const mongoose = require('mongoose');
//const fs = require('fs.promises');
const express = require("express");
const app = express();
const path = require('path');
const mustache = require('mustache-express');

var bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const config = require('./config');
const port = config.ServerPort;
const dbUrl = config.DatabaseUrl;
const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true };


app.use(bodyParser.json());
app.use(busboyBodyParser({ limit: '10mb' }));
app.use(express.static('public'));
app.use(express.static('data'));

app.use(cookieParser());
app.use(session({
    secret: "vladyslav_secret",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

const viewsDir = path.join(__dirname, 'views');
app.engine('mst', mustache(path.join(viewsDir, 'partials')));
app.set('views', viewsDir);
app.set('view engine', 'mst');

mongoose.connect(dbUrl, connectOptions)
    .then(() => console.log(`Database connected on ${dbUrl}`))
    .then(() => app.listen(port, function () { console.log(`Example app is working on ${port} port`)}))
    .catch(err => console.log(`Error: ${err}`));

const authRouter = require('./routes/auth');
app.use("/", authRouter);

const indexRouter = require('./routes/index');
app.use("/", indexRouter);

const usersRouter = require('./routes/users');
app.use("/", usersRouter);

const marksRouter = require('./routes/marks');
app.use("/", marksRouter);

const itemsRouter = require('./routes/items');
app.use("/", itemsRouter);

const devRouter = require('./routes/developer');
app.use("/",devRouter);

app.use(function (req, res) {
    res.status(404).render('notFound');
});
  
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret
});