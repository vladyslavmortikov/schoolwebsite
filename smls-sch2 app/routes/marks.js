
const express = require('express');
const router = express.Router();
const Mark = require('../models/mark');
const User = require('../models/user');
const Subject = require('../models/subject')
const multer = require("multer");
const fs = require('fs');
const bodyParser = require("body-parser");
const busboyBodyParser = require("busboy-body-parser");
const busboy = require('connect-busboy');
const auth = require("../passport");


router.use(busboy());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(express.static('public'));
router.use(busboyBodyParser({ limit: '5mb' }));
router.use(express.static('fs'));

router.get('/marks', auth.checkAuth,function (req, res) {
  Mark.getAll()
    .then(marks => res.render('marks/marks', {
      marks: marks
    }))
    .catch(err => res.status(500).send(err.toString()));
});

router.post('/marks/new', auth.checkAdmin, (req, res) => { // create

  Mark.insert(new Mark(null, req.body.userId, req.body.subjectId, parseInt(req.body.value), req.body.description))
    .then(mark => res.render('marks/mark', {
      mark: mark
    }))
    .catch(err => res.status(500).send(err.toString()));
});

router.get("/marks/:id/edit", auth.checkAdmin, function (req, res) {
  const markId = req.params.id;
  Mark.getById(markId)
    .then(mark => {
      if (!mark) {
        res.status(404).send(`Mark with id = ${markId} not found`);
      } else {
        res.render('marks/edit', {
          mark: mark
        });
      }
    })
    .catch(err => res.status(500).send(err.toString()));
});

/* router.post("/marks/:id/edit", (req, res) => {
  //let markId = req.param.id;
  let updMark= new Mark(req.body.value, req.body.description);

  Mark.update(updMark)
      .then(res.redirect("/marks"))
      .catch(err => res.status(500).send(err.toString()));
}); */

router.post("/marks/:id/edit", auth.checkAdmin, (req, res) => {
  const markId = req.body.id;

  let updating = new Mark(markId, req.body.value, req.body.description);

  Mark.update(updating)
    .then(X => res.redirect("/marks"))
    .catch(err => res.status(500).send(err.toString()));
});

router.post("/marks/:id/delete", auth.checkAdmin, function (req, res) {
  const markId = req.params.id;
  Mark.deleteById(markId)
    .then(X => res.redirect('/marks'))
    .catch(err => res.status(500).send(err.toString()));
});

router.get('/marks/new', (req, res) => {
  res.render('marks/new');
});

router.get("/marks/:id", auth.checkAuth, function (req, res) {
  const markId = req.params.id;
  Mark.getById(markId)
    .then(mark => {
      if (!mark) {
        res.status(404).send(`Mark with id = ${markId} not found`);
      } else {
        res.render('marks/mark', {
          mark: mark
        });
      }
    })
    .catch(err => res.status(500).send(err.toString()));
});

module.exports = router;
