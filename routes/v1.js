var express = require('express');
var fetch = require('node-fetch');
var router = express.Router();

router.post('/postTest', async function (req, res, next) {
    console.log(req.body.firstname);
    console.log(req.body.lastname);
    try {
        let response = (await req.db.collection('Users').find({
            givenName: req.body.firstname
        }).toArray())[0];
        let getResponse = await fetch('http://localhost:3000/v1/getTest');
        console.log(getResponse, response);
        res.send(200);
        // next() ;
    } catch (err) {
        return next(err);
    }
});


router.get('/getTest', function (req, res, next) {
    console.log(req.query.firstname);
    console.log(req.query.lastname);
    res.send(200);
});

module.exports = router;