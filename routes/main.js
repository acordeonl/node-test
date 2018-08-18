var express = require('express');
var router = express.Router();

var userAuth = require('../route-helpers/auth');
var verifyUser =  userAuth.verifyUser ;

router.post('/login', async function (req, res, next) {
    console.log('in login');
    if(req.body.user === 'user' && req.body.pass === 'pass')
        res.redirect('/dashboard') ; 
    else if(req.body.user !== undefined)
        res.render('login',{response:'Unauthorized'}) ; 
    else 
        res.render('login',{response:''}) ; 
    // try {
    //     let response = (await req.db.collection('Users').find({
    //         givenName: req.body.firstname
    //     }).toArray())[0];
    //     let getResponse = await fetch('http://localhost:3000/v1/getTest');
    //     console.log(getResponse, response);
    //     res.send(200);
    //     // next() ;
    // } catch (err) {
    //     return next(err);
    // }
});

router.get('/login', function (req, res, next) {
    res.render('login' , {response:''}) ; 
});


router.get('/', function (req, res, next) {
    res.redirect('/login');
}) ; 

router.get('/logout', function (req, res, next) {
    console.log('in log out');
    res.redirect('/login');
}) ; 

router.get('/dashboard', function (req, res, next) {
    res.render('dashboard') ; 
});



module.exports = router;