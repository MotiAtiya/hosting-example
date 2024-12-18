'use strict';

/**
 * check if admin already logged in, if so redirect to admin page.
 * @param req
 * @param res
 * @param next
 */
exports.checkIfLoggedIn = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect(303, '/admin'); // 303 to redirect with GET method
    }
    next(); // forward the request to next routes that match the URL
};


/**
 * check if admin already logged in, if didn't redirect to login page.
 * @param req
 * @param res
 * @param next
 */
exports.checkIfNotLoggedIn = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect(303, '/login'); // 303 to redirect with GET method
    }
    next(); // forward the request to next routes that match the URL
};


/**
 * displays the admin page (SPA page).
 * @param req
 * @param res
 */
exports.getAdminPage = (req, res) => {
    res.render('admin', { path: '/admin', pageTitle: 'Admin page', loggedIn: true });
};
