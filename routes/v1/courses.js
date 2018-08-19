var express = require('express');
var router = express.Router();

var fetch = require('node-fetch');

var userAuth = require('../../route-helpers/auth');
var verifyUser = userAuth.verifyUser;
var elementsPerPage = 10;
var mongo = require('mongodb');


router.post('/create', verifyUser , async function (req, res, next) {
    try {
        await req.db.collection('Courses').insert(req.body.elementData);
    } catch (err) {
        return next(err);
    }
    res.json({
        data: 'OK'
    })
});


router.post('/read/all', verifyUser, async function (req, res, next) {
    try {
        let docs = await req.db.collection('Courses').find({})
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
        let docs = await req.db.collection('Courses').find({
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
        await req.db.collection('Courses').update({
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
        await req.db.collection('Courses').deleteOne({
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