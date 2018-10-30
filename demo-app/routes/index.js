var express = require('express');
var router = express.Router();
var Membership = require('../../membership/')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/login', function (req, res) {
  res.render('welcome');
});

router.post('/register', function (req, res) {
  var mem = new Membership('test');
  mem.register(req.body.email, req.body.password, req.body.confirm, function (err, result) {
    if (result.success) {
      res.send(result.message);
    } else {
      res.send(result.message);
    }
  });

})
module.exports = router;