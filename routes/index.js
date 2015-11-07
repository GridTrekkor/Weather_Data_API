var express = require('express');
var path = require('path');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/accountsModel');

var apiChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function makeApiKey() {
    var apiKey = "";
    for(var i = 0; i < 20; i++) {
        apiKey += apiChars.charAt(Math.floor(Math.random() * apiChars.length));
    }
    return apiKey;
}

/* GET home page. */
router.get('/', function (req, res) {
    //res.sendFile(path.join(__dirname, "../views/project.html"));
    res.render('project', {user: req.user});
});

router.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname, "../views/register.html"))
});

router.get('/getApiKey', function(req, res) {
    res.json({user: req.user});
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }
        // add API key to account
        Account.findOneAndUpdate(
            { username : req.body.username },
            { apiKey : makeApiKey() },
            { safe : true, upsert : true },
            function(err, model) {
                console.log(err);
            }

        );
        passport.authenticate('local')(req, res, function () {

            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    //console.log(req.user);
    res.redirect('/');
});

//router.post('/login', function(req, res) {
//    console.log('login route = ' + req);
//    res.redirect('/');
//});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
    //res.render('project', [{user:''}, {loggedOut:true}]);
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});


///////////////////////////////////////////////////////////////////////////
/* handle root angular route redirects */


//console.log('Route * loaded.');

module.exports = router;