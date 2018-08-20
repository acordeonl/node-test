var express = require('express');
var router = express.Router();

var fetch = require('node-fetch');

var userAuth = require('../../route-helpers/auth');
var verifyUser = userAuth.verifyUser;
var elementsPerPage = 10;
var mongo = require('mongodb');


router.post('', verifyUser , async function (req, res, next) {
    try {
        await req.db.collection('Courses').insert(req.body);
    } catch (err) {
        return next(err);
    }
    res.json({
        checkGender:false        
    }) ;
});

router.get('', verifyUser, async function (req, res, next) {
    try {
        var page = req.query.page ; 
        if(page === undefined)
            page = 0 ; 
        let query = req.query.query ; 
        if(query !== undefined){
            let docs = await req.db.collection('Courses').find({
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
            let docs = await req.db.collection('Courses').find({})
                .skip(elementsPerPage * page)
                .limit(elementsPerPage).toArray();
            res.json(docs);
        }
    } catch (err) {
        return next(err);
    }
});

router.put('/:courseID', verifyUser, async function (req, res, next) {
    var courseID = req.params.courseID ;
    try {
        await req.db.collection('Courses').update({
            _id: new mongo.ObjectID(courseID),
        }, {
            $set: req.body
        });
        res.send(200) ; 
    } catch (err) {
        return next(err);
    }
});


router.delete('/:courseID', verifyUser ,async function (req, res, next) {
    var courseID = req.params.courseID ;
    try {
        await req.db.collection('Courses').deleteOne({
            _id: new mongo.ObjectID(courseID)
        });
        res.send(200) ; 
    } catch (err) {
        return next(err);
    }
});


module.exports = router;