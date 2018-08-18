var express = require('express');
var router = express.Router();

var userAuth = require('../route-helpers/auth');
var verifyUser =  userAuth.verifyUser ;

router.get('/', function (req, res, next) {
    res.redirect('/login');
})

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.get('/dashboard', function (req, res, next) {
    res.render('dashboard') ; 
});

module.exports = router;