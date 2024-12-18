'use strict';

const dbController = require('./dbAccess');

/**
 * displays the login page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getLoginPage = (req, res) => {
    const error = req.session.loggedInError ?? false;
    if (req.session.loggedInError) {
        delete req.session.loggedInError;
    }
    res.render('login', { path: '/login', pageTitle: 'Log in', loggedIn: false, error: error,
        modalTitle: "Log in Error", modalBody: "Invalid Username Or Password."});
};


/**
 * login to system with username and password. if user found in db - login success, else - failed.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.logIn = (req, res) => {
    const { login, password } = req.body;
    dbController.findUser(login, password)
        .then((user) => {
            if (user) {
                req.session.isLoggedIn = true;
                res.redirect('/admin');
            } else {
                req.session.loggedInError = true;
                res.redirect('/login');
            }})
        .catch( err => {
            // res.status(500).send('Internal Server Error: ' + err);
            req.session.errorMsg = 'Internal Server Error: ' + err.message;
            res.redirect('/error');
        })
};


/**
 * logout from system.
 * @param req
 * @param res
 */
exports.logOut = (req, res) => {
    req.session.isLoggedIn = false;
    res.redirect('/');  // after logout go to home page
};
