const mongoose = require('mongoose');
const passport = require('passport');
const Account = require('../models/account.js');

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
    res.render('register');
}

// post register
routeFunctions.postRegister = (req, res) => {
    Account.register(new Account({
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        allergies: req.body.allergies,
    }), req.body.password, function (err, account) {
        if (err) {
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