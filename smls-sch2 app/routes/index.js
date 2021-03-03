const express = require('express');
const router = express.Router();
const auth = require("../passport");
const Subject = require("../models/subject");

router.get('/', function(req, res) {
  res.render('index', {charter: auth.getCharter(req)});
});

router.get('/subjects', auth.checkAuth, function(res,req){
  Subject.getAll()
  .then(subjects => res.render('subjects/subjects', {
      items: items
  }))
  .catch(err => res.status(500).send(err.toString()));
})

module.exports = router;
