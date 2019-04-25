const mongoose = require('mongoose');
const passport = require('passport');
const Strategy = require('../models/strategies_oauth.js');

const myFunc = require('../ex/time.js');

// food collections
const account = require('../models/accounts.js');

let routeFunctions = {};

// get home
routeFunctions.home = function (req, res) {
    // console.log("TCL: routeFunctions.home -> req", req.user)
    if (req.user) {
        account.findOne({
            username: req.user.username,
        }, 'food_ate', (err, docs) => {
            if (err) return err;
            let food = docs.food_ate;
            let currFood = [];
            let currentDay = myFunc.getDayOfMonth();
            let yesterday = currentDay - 1; // can be 0
            let year = myFunc.getYear();
            let month = myFunc.getMonth();
            food.forEach(element => {
                let elDay = element.day_of_month;
                let elYear = element.year;
                let elMonth = element.month;

                //every first of month, have to get the last day before the current month
                if (currentDay === 1) {
                    let prevMonth = myFunc.getMonth() - 1;
                    if (prevMonth === -1) {
                        prevMonth = 12;
                        year--;
                    }
                    if ((prevMonth === elMonth) && (elDay === myFunc.lastDayOfPrevMonth(year, prevMonth))) {
                        currFood.push(element);
                    }
                } else if ((yesterday <= elDay) && (elYear === year) && (elMonth === month)) {
                    currFood.push(element);
                }
                // new year, 
                // let month = myFunc.getMonth();
                // if (month === 1) {

                // }
            });
            console.log(currFood);
            console.log(docs);
            return res.render('home', {
                item: currFood,
                history: docs.food_ate
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
        name: req.body.username || req.body.name,
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