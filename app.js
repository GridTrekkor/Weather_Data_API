var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var api = require('./routes/api');
//var users = require('./routes/users');

var app = express();

var mongoURI = "mongodb://localhost:27017/Weather";
var mongoDB = mongoose.connect(mongoURI).connection;
mongoDB.once('open', function () {
    console.log("[" + new Date() + "] Connected to Mongo");
});
mongoDB.on('error', function (err) {
    if (err) {
        console.log('Mongo error', err);
    }
});

// view engine setup for EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, './views')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/weather/api', api);
//app.use('/views', express.static(__dirname + '/views'));
//app.use('/views', express.static(path.join(__dirname, 'views')));

// handle angular routes that are not found
app.get('/*', function (req, res, next) {
    var url = req.originalUrl;
    if (url.split('.').length > 1) {
        next();
    } else {
        res.redirect('/');
    }
});


// passport config
var Account = require('./models/accountsModel');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.jade', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;