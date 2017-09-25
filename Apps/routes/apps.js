var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/driver', function(req, res, next) {
  res.render('driver', { title: 'Driver' });
});

router.get('/customer', function(req, res, next) {
  res.render('customer', { title: 'Customer' });
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Dashboard' });
});

module.exports = router;
