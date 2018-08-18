var express = require('express');
var router = express.Router();

var userAuth = require('../route-helpers/auth');
var verifyUser =  userAuth.verifyUser ;

router.post('/login', async function (req, res, next) {
    if(req.body.username !== undefined && req.body.password !== undefined) {
        let user = (await req.db.collection('Users').find({
                username:req.body.username
            }).toArray())[0];
        if(user !== undefined && user.password === req.body.password){
            req.session.user = user ; 
            res.redirect('/dashboard') ; 
        }
        else{ 
            res.render('login',{response:'Unauthorized'}) ; 
        }
    }
    else if(req.body.username !== undefined)
        res.render('login',{response:'Unauthorized'}) ; 
    else 
        res.render('login',{response:''}) ; 
});

router.get('/login', function (req, res, next) {
    if(req.user)
        res.redirect('/dashboard') ; 
    res.render('login' , {response:''}) ; 
});


router.get('/', function (req, res, next) {
    if(req.user)
        res.redirect('/dashboard') ; 
    res.redirect('/login');
}) ; 

router.get('/logout', function (req, res, next) {
    req.session.user = undefined ; 
    res.redirect('/login');
}) ; 

router.get('/dashboard' , verifyUser,  function (req, res, next) {
    res.render('dashboard') ; 
});



module.exports = router;