var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var appLogic = require('./routes/v1');
var main = require('./routes/main');
var session = require('client-sessions') ; 
var app = express();

var mongo = require('mongodb');
var mongo_db ; 
mongo.MongoClient.connect('mongodb://localhost:27017').then( client => {
    mongo_db = client.db('node-test') ; 
    console.log('connected to db');
} , function (err) {
    console.log(err);
    process.exit(-1);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    cookieName:'session', 
    secret:'4j3kljk43h2k4jh2k42hk42',
    duration:30*60*1000, 
})) ; 

app.use(function (req, res, next) { req.db = mongo_db ; next();})
app.use( async function(req,res,next){
    try{
        if(req.session && req.session.user){
            let user = (await req.db.collection('Users').find({
                username:req.session.user.username
            }).toArray())[0];
            if(user){
                req.user = user ; 
                delete req.user.password ;
                req.session.user = user ; 
            }
            next() ; 
        }   
        else{
            next() ; 
        }
    }catch(err){return next(err) ; }
}) ; 

app.use('/', main);
app.use('/v1', appLogic);


app.use(function (req, res, next) {
    // var err = new Error('Not Found');
    // err.status = 404;
    // next(err);
    res.redirect('/') ;
    console.log('aja');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
