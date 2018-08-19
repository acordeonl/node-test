var express = require('express');
var router = express.Router();

var fetch = require('node-fetch');

var userAuth = require('../route-helpers/auth');
var verifyUser = userAuth.verifyUser;
var elementsPerPage = 10;
var mongo = require('mongodb');


router.post('/create', verifyUser , async function (req, res, next) {
    let apiResponse,expectedGender,genderProbability ; 
    let checkGender = false ;
    if(req.body.entity === 'Students' || req.body.entity === 'Teachers'){
        // use external api
        apiResponse = await(await fetch('https://api.genderize.io/?name='+req.body.elementData.givenName)).json();
        expectedGender = (apiResponse.gender === 'male')?"M":"F" ; 
        genderProbability = apiResponse.probability ; 
        if(expectedGender !== req.body.elementData.gender && genderProbability > 0.7){
            checkGender = true ; 
            console.log(checkGender);
        }
    }   
    try {
        await req.db.collection(req.body.entity).insert(req.body.elementData);
    } catch (err) {
        return next(err);
    }
    res.json({
        data: 'OK',
        checkGender:checkGender        
    })
});


router.post('/read/all', verifyUser, async function (req, res, next) {
    try {
        let docs = await req.db.collection(req.body.entity).find({})
            .skip(elementsPerPage * req.body.page)
            .limit(elementsPerPage).toArray();
        res.json({
            data: docs
        });
    } catch (err) {
        return next(err);
    }
});

router.post('/read', verifyUser, async function (req, res, next) {
    try {
        let docs = await req.db.collection(req.body.entity).find({
                $text: {
                    $search: req.body.query
                }
            })
            .project({
                score: {
                    $meta: "textScore"
                }
            })
            .sort({
                score: {
                    $meta: "textScore"
                }
            })
            .skip(elementsPerPage * req.body.page)
            .limit(elementsPerPage).toArray();
        res.json({
            data: docs
        });
    } catch (err) {
        return next(err);
    }
});

router.post('/update', verifyUser, async function (req, res, next) {
    try {
        await req.db.collection(req.body.entity).update({
            _id: new mongo.ObjectID(req.body.elementId),
        }, {
            $set: req.body.elementData
        });
        res.json({
            data: 'OK'
        });
    } catch (err) {
        return next(err);
    }
});


router.post('/delete', verifyUser ,async function (req, res, next) {
    try {
        await req.db.collection(req.body.entity).deleteOne({
            _id: new mongo.ObjectID(req.body.elementId)
        });
        res.json({
            data: 'OK'
        });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;