var express = require('express');
var router = express.Router();

var userAuth = require('../../route-helpers/auth');
var verifyUser =  userAuth.verifyUser ;
var elementsPerPage = 10;


router.post('/query/all', async function (req, res, next) {
    try{
        let docs = await req.db.collection('Teachers').find({})
        .sort( {date:-1} )
        .skip(elementsPerPage * req.body.page)
        .limit(elementsPerPage).toArray();
        res.json({
            data: docs
        });
    } catch(err) { return next(err) ;}
});

router.post('/query', async function (req, res, next) {
    try{
        let docs = await req.db.collection('Teachers').find({
            $text: {
                $search: req.body.query
            }
        })
        .project({ score: { $meta: "textScore" } })
        .sort( { score: { $meta: "textScore" } } )
        .skip(elementsPerPage * req.body.page)
        .limit(elementsPerPage).toArray();
        res.json({
            data: docs
        });
    } catch(err) { return next(err) ;}
});


module.exports = router;