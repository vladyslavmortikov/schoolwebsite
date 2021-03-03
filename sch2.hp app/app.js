const express = require('express');
const mustache = require('mustache-express');
const path = require('path');
const indexRoutes = require('./routes/index');
const newsRoutes = require('./routes/items');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const config = require('./config');
console.log(config);
const databaseUrl = config.DatabaseUrl;
const port = config.ServerPort;

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret
});
const viewsDir = path.join(__dirname, 'views');
const partialDir = path.join(viewsDir, 'partials');

const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true};


mongoose.connect(databaseUrl, connectOptions)
    .then(() => console.log(`Database connected on ${databaseUrl}`))
    .then(() => app.listen(port, function () { console.log(`Example app is working on ${port} port`)}))
    .catch(err => console.log(`Error: ${err}`));

app.engine('mst', mustache(partialDir));
app.set('views', viewsDir);
app.set('view engine', 'mst');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/', indexRoutes);
app.use('/', newsRoutes);

app.use(function (req, res) {
    res.status(404).render('notFound');
});
  
