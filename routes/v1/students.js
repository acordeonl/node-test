var express = require('express');
var router = express.Router();

var fetch = require('node-fetch');

var userAuth = require('../../route-helpers/auth');
var verifyUser = userAuth.verifyUser;
var elementsPerPage = 10;
var mongo = require('mongodb');


router.post('', verifyUser , async function (req, res, next) {
    let apiResponse,expectedGender,genderProbability ; 
    let checkGender = false ;
    // use external api
    apiResponse = await(await fetch('https://api.genderize.io/?name='+req.body.givenName)).json();
    expectedGender = (apiResponse.gender === 'male')?"M":"F" ; 
    genderProbability = apiResponse.probability ; 
    if(expectedGender !== req.body.gender && genderProbability > 0.7){
        checkGender = true ; 
    }
    try {
        await req.db.collection('Students').insert(req.body);
    } catch (err) {
        return next(err);
    }
    res.json({
        checkGender:checkGender        
    })
});

router.get('', verifyUser, async function (req, res, next) {
    try {
        var page = req.query.page ; 
        if(page === undefined)
            page = 0 ; 
        let query = req.query.query ; 
        if(query !== undefined){
            let docs = await req.db.collection('Students').find({
                $text: {
                    $search: query
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
            .skip(elementsPerPage * page)
            .limit(elementsPerPage).toArray();

            res.json(docs);
        }
        else{
            let docs = await req.db.collection('Students').find({})
                .skip(elementsPerPage * page)
                .limit(elementsPerPage).toArray();
            res.json(docs);
        }
    } catch (err) {
        return next(err);
    }
});

router.put('/:studentID', verifyUser, async function (req, res, next) {
    var studentID = req.params.studentID ;
    try {
        await req.db.collection('Students').update({
            _id: new mongo.ObjectID(studentID),
        }, {
            $set: req.body
        });
        res.send(200) ; 
    } catch (err) {
        return next(err);
    }
});


router.delete('/:studentID', verifyUser ,async function (req, res, next) {
    var studentID = req.params.studentID ;
    try {
        await req.db.collection('Students').deleteOne({
            _id: new mongo.ObjectID(studentID)
        });
        res.send(200) ; 
    } catch (err) {
        return next(err);
    }
});


module.exports = router;