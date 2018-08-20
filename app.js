var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var main = require('./routes/main');
var CRUD_API_V1 = require('./routes/v1/CRUD_API');

var session = require('client-sessions');
var app = express();

var mongo = require('mongodb');
var mongo_db;


mongo.MongoClient.connect('mongodb://localhost:27017').then(async client => {
    mongo_db = client.db('node-test-1');
    let response = await mongo_db.collection('Users').find({
        username: 'admin'
    }).toArray();
    if (response.length === 0)
        initMongo();
    console.log('connected to db');
}, function (err) {
    console.log(err);
    process.exit(-1);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    cookieName: 'session',
    secret: '4j3kljk43h2k4jh2k42hk42',
    duration: 4 * 30 * 60 * 1000,
}));

app.use(function (req, res, next) {
    req.db = mongo_db;
    next();
})
app.use(async function (req, res, next) {
    try {
        if (req.session && req.session.user) {
            let user = (await req.db.collection('Users').find({
                username: req.session.user.username
            }).toArray())[0];
            if (user) {
                req.user = user;
                delete req.user.password;
                req.session.user = user;
            }
            next();
        } else {
            next();
        }
    } catch (err) {
        return next(err);
    }
});

app.use('/v1', CRUD_API_V1);
app.use('/', main);

app.use(function (req, res, next) {
    // var err = new Error('Not Found');
    // err.status = 404;
    // next(err);
    res.redirect('/');
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Initialize database on first run
async function initMongo() {
    await mongo_db.collection('Users').insert({
        username: 'admin',
        password: '$2a$10$fiJu.K2Aa/ivBg/hL2BrSeRhSiuUnoFXowBHahOnPdxvz3eD04sFm' // 'pass'
    });
    await mongo_db.createCollection('Students');
    await mongo_db.createCollection('Teachers');
    await mongo_db.createCollection('Courses');
    await mongo_db.collection('Students').createIndex({
        givenName: "text",
        familyName: "text",
        personalId: "text",
        gender: "text"
    }, {
        weights: {
            givenName: 10,
            familyName: 10,
            personalId: 20,
            gender: 3
        },
        name: "TextIndex"
    });
    await mongo_db.collection('Teachers').createIndex({
        givenName: "text",
        familyName: "text",
        personalId: "text",
        gender: "text"
    }, {
        weights: {
            givenName: 10,
            familyName: 10,
            personalId: 20,
            gender: 3
        },
        name: "TextIndex"
    });
    await mongo_db.collection('Courses').createIndex({
        name: "text",
        courseId: "text",
        observations: "text",
    }, {
        weights: {
            name: 20,
            courseid: 30,
            observations: 5,
        },
        name: "TextIndex"
    });
}

module.exports = app;