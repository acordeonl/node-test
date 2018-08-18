var express = require('express');
var router = express.Router();

var verifyUser = async function (req, res, next) {
    try{
       
        next();
    } catch(err) { return next(err) ;}
}

module.exports.verifyUser = verifyUser;

