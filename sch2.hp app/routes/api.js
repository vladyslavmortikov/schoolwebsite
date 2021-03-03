const News = require('../models/item');

router.get('/news', function (req, res) {
    News.getAll()
        .then(news => res.status(200).send(news))
        .catch(err => res.status(500).send(err));

});

router.get('/news/:id', function (req, res) {
    News.getById(req.params.id)
        .then(news => {
            if (news)
                res.status(200).send(news);
            else
                res.status(404).send("This news not found!")
        })
        .catch(err => res.status(500).send(err));

});

module.exports = router;