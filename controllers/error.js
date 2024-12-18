'use strict';

/**
 * Checks if there is a valid error message stored in the session object.
 * If present, it proceeds to the next middleware; otherwise, redirects to the homepage.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
exports.checkValidError = (req, res, next) => {
    if (req.session && req.session.errorMsg) {
        next();
    }
    res.redirect('/');
};

/**
 * Renders the error page with appropriate error message if present.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
exports.getErrorPage = (req, res) => {
    const loggedIn = req.session.isLoggedIn ?? false;  // for navigation bar
    const errMsg = req.session.errorMsg;
    delete req.session.errorMsg;

    res.render('error', {path: '/error', pageTitle: 'ERROR', loggedIn: loggedIn, errorMsg: errMsg });
};
