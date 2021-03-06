const passport = require('passport');
const Strategy = require('../models/strategies_oauth.js');

// date and caps
const myFunc = require('../ex/time.js');

// account collections
const account = require('../models/accounts.js');

let routeFunctions = {};

// get home
routeFunctions.home = function (req, res) {
    // console.log("TCL: routeFunctions.home -> req", req.user)
    if (req.user) {
        account.findOne({
            username: req.user.username,
        }, 'food_ate reacted', (err, docs) => {
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
                    let thisYear = year;
                    // including the first day
                    if ((month === elMonth) && (currentDay === elDay) && (year === elYear)) {
                        currFood.push(element);
                    }
                    // to set the get operation for last day of last year
                    if (prevMonth === -1) {
                        prevMonth = 12;
                        thisYear--;
                    }
                    // to get the last day of last year
                    if ((prevMonth === elMonth) && (elDay === myFunc.lastDayOfPrevMonth(thisYear, prevMonth)) && (thisYear === elYear)) {
                        currFood.push(element);
                    }
                } else if ((yesterday <= elDay) && (elYear === year) && (elMonth === month)) {
                    currFood.push(element);
                }
            });
			console.log("TCL: routeFunctions.home -> reacted", docs.reacted)
            return res.render('home', {
                item: currFood,
                history: docs.food_ate,
                name: docs.name,
                reacted: docs.reacted
            });
        })
    } else {
        res.redirect('/login');
    }
}

routeFunctions.postHome = (req, res) => {
    let addItem = req.body.newItem;
    let removeItem = req.body.removeItem;
    let operation = req.body.operation;
    let day = req.body.day;
    let hour = req.body.hour;

    if (addItem && (operation === 'true')) {
        account.findOneAndUpdate({
            username: req.user.username
        }, {
            $push: {
                food_ate: {
                    food_name: myFunc.caps(addItem),
                    hour: hour,
                    day: day,
                    day_of_month: myFunc.getDayOfMonth(),
                    month: myFunc.getMonth(),
                    year: myFunc.getYear(),
                }
            }
        }, (err, user) => {
            return (err ? err : user);
        });
    }
    if (((typeof removeItem) === 'object') && (operation === 'false')) {
        account.findOneAndUpdate({
            username: req.user.username
        }, {
            $pull: {
                food_ate: {
                    food_name: {
                        $in: removeItem
                    }
                }
            }
        }, (err, docs) => {
            return (err ? err : docs);
        });
    } else if (((typeof removeItem) === 'string') && (operation === 'false')) {
        account.findOneAndUpdate({
            username: req.user.username
        }, {
            $pull: {
                food_ate: {
                    food_name: removeItem
                }
            }
        }, (err, docs) => {
            return (err ? err : docs);
        });
    }
    res.redirect('/');
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
            // console.log("TCL: routeFunctions.postRegister -> err", err.name)
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

// temporary policy
routeFunctions.policy = (req, res) => {
    res.send('Privacy Policy of FoodTrack FoodTrack operates the FoodTrack website, which provides the SERVICE. This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service, the FoodTrack. If you choose to use our Service, then you agree to the collection and use of information in relation with this policy. The Personal Information that we collect are used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy. The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at localhost:3000, unless otherwise defined in this Privacy Policy.')
}

module.exports = routeFunctions;