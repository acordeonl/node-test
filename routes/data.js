var express = require('express');
var router = express.Router();

var userAuth = require('../route-helpers/auth');
var verifyUser = userAuth.verifyUser;
var elementsPerPage = 10;
var mongo = require('mongodb');


router.post('/create', async function (req, res, next) {
    console.log(req.body.elementData);
    try {
        await req.db.collection(req.body.entity).insert(req.body.elementData);
    } catch (err) {
        return next(err);
    }
    res.json({
        data: 'OK'
    })
});


router.post('/read/all', async function (req, res, next) {
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

router.post('/read', async function (req, res, next) {
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

router.post('/update', async function (req, res, next) {
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


router.post('/delete', async function (req, res, next) {
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