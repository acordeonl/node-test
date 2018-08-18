var express = require('express');
var router = express.Router();

var userAuth = require('../route-helpers/auth');
var verifyUser =  userAuth.verifyUser ;

router.post('/auth', async function (req, res, next) {
    console.log(req.body.user);
    console.log(req.body.pass);
    req.redirect('/dashboard') ; 
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


router.get('/', function (req, res, next) {
    res.redirect('/login');
})

router.get('/login', function (req, res, next) {
    res.render('login',{response:''});
});

router.get('/dashboard', function (req, res, next) {
    res.render('dashboard') ; 
});



module.exports = router;