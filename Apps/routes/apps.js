var express = require('express');
var router = express.Router();

var baseUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/driver', function(req, res, next) {
  res.render('driver', { title: 'Driver', baseUrl: baseUrl });
});

router.get('/customer', function(req, res, next) {
  res.render('customer', { title: 'Customer', baseUrl: baseUrl });
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Dashboard', baseUrl: baseUrl });
});

module.exports = router;
