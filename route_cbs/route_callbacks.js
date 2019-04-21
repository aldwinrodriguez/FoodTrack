const mongoose = require('mongoose');
const passport = require('passport');
const Strategy = require('../models/strategies_oauth.js');


// food collections
const food = require('../models/food.js');

let routeFunctions = {};

// get home
routeFunctions.home = function (req, res) {
	console.log("TCL: routeFunctions.home -> req", req.user)
    if (req.user) {
        food.find(function (err, docs) {
            res.render('home', {
                item: docs,
            });
        })
    } else {
        res.redirect('/login');
    }
}

// get login
routeFunctions.login = (req, res) => {
    if (req.user) {
        return res.redirect('/')
    }
    res.render('login', {
        message: '',
    });
}

// post login
routeFunctions.postLogin = (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            if (info.message === 'true') {
                return res.render('login', {
                    message: 'Password is incorrect',
                });
            }
            return res.render('login', {
                message: info.message,
            });
        }
        // console.log('login user', user);
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
}

// get register
routeFunctions.register = (req, res) => {
    if (req.user) {
        return res.redirect('/')
    }
    return res.render('register', {
        message: ''
    });
}

// post register
routeFunctions.postRegister = (req, res) => {
    Strategy.local.register(new Strategy.local({
        username: req.body.username,
        name: req.body.username||req.body.name,
        allergies: req.body.allergies,
        provider: 'local'
    }), req.body.password, function (err, account) {
        if (err) {
		console.log("TCL: routeFunctions.postRegister -> err", err.name)
        // console.log("TCL: routeFunctions.postRegister -> account", account)
        if (err.name === 'UserExistsError') {
            return res.render('register', {
                message: 'User already exist !! Try another one'
            });
        }
            return res.render('register', {
                account: account
            });
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
}

// logout
routeFunctions.logout = function (req, res) {
    req.logout();
    res.redirect('/');
}

module.exports = routeFunctions;