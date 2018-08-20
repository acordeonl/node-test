var express = require('express');
var router = express.Router();

var fetch = require('node-fetch');

var userAuth = require('../../route-helpers/auth');
var verifyUser = userAuth.verifyUser;
var elementsPerPage = 10;
var mongo = require('mongodb');


router.post('/:entity', verifyUser , async function (req, res, next) {
    let entity = req.params.entity.charAt(0).toUpperCase() +req.params.entity.substr(1) ;
    let apiResponse,expectedGender,genderProbability ; 
    let checkGender = false ;
    if(entity !== 'Courses') {
        // use external api
        apiResponse = await(await fetch('https://api.genderize.io/?name='+req.body.givenName)).json();
        expectedGender = (apiResponse.gender === 'male')?"M":"F" ; 
        genderProbability = apiResponse.probability ; 
        if(expectedGender !== req.body.gender && genderProbability > 0.7){
            checkGender = true ; 
        }
    }
    try {
        await req.db.collection(entity).insert(req.body);
    } catch (err) {
        return next(err);
    }
    res.json({
        checkGender:checkGender        
    })
});

router.get('/:entity', verifyUser, async function (req, res, next) {
    let entity = req.params.entity.charAt(0).toUpperCase() +req.params.entity.substr(1) ;
    try {
        var page = req.query.page ; 
        if(page === undefined)
            page = 0 ; 
        let query = req.query.query ; 
        if(query !== undefined){
            let docs = await req.db.collection(entity).find({
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
            let docs = await req.db.collection(entity).find({})
                .skip(elementsPerPage * page)
                .limit(elementsPerPage).toArray();
            res.json(docs);
        }
    } catch (err) {
        return next(err);
    }
});

router.put('/:entity/:entityId', verifyUser, async function (req, res, next) {
    let entity = req.params.entity.charAt(0).toUpperCase() +req.params.entity.substr(1) ;
    var entityId = req.params.entityId ;
    try {
        await req.db.collection(entity).update({
            _id: new mongo.ObjectID(entityId),
        }, {
            $set: req.body
        });
        res.send(200) ; 
    } catch (err) {
        return next(err);
    }
});


router.delete('/:entity/:entityId', verifyUser ,async function (req, res, next) {
    let entity = req.params.entity.charAt(0).toUpperCase() +req.params.entity.substr(1) ;
    var entityId = req.params.entityId ;
    try {
        await req.db.collection(entity).deleteOne({
            _id: new mongo.ObjectID(entityId)
        });
        res.send(200) ; 
    } catch (err) {
        return next(err);
    }
});


module.exports = router;