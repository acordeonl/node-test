var express = require('express');
var router = express.Router();

var verifyUser = async function (req, res, next) {
    if(!req.user){
        res.redirect('/login') ; 
    }
    else{
        next() ; 
    }
}

module.exports.verifyUser = verifyUser;

