'use strict';

const Sequelize = require('sequelize');
const dbController = require('./dbAccess')

/**
 * displays Post-new-Ad page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getNewAdPage = (req, res) => {
    const loggedIn = req.session.isLoggedIn ?? false;  // for navigation bar
    const postErr = req.session.postAdError ?? false;  // for error msg
    const errMsg = req.session.postAdErrorMsg ?? '';  // for error msg
    const body = req.session.body;
    if (req.session.postAdError) {
        delete req.session.postAdError;
        delete req.session.body;
        delete req.session.postAdErrorMsg;
    }
    res.render('new-ad', {path: '/new-ad', pageTitle: 'Post New Ad', loggedIn: loggedIn, error: postErr, modalTitle: 'Failed to save Ad',
        modalBody: errMsg , body});
}


/**
 * Creates a new Ad.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.createNewAd = (req, res) => {
    const { title, description, price, phone, email } = req.body; // Extract data from the request body

    dbController.addNewAd({ title, description, price, phone, email })
        .then((ad) => {
            req.session.mailOfLastAdPosted = ad.getDataValue('email');
            // Set cookies for tracking ad posting status
            res.cookie('firstAd', (!req.cookies.firstAd ?? true));
            res.cookie('postNewAd', true);
            res.cookie('idOfPrevAdPosted', req.cookies.idOfLastAdPosted ?? ad.getDataValue('id'));
            res.cookie('idOfLastAdPosted', ad.getDataValue('id'));
            res.redirect('/'); // redirect to home page - avoid resubmission of the form
        })
        .catch((err) => {
            req.session.postAdError = true;
            if (err instanceof Sequelize.ValidationError) {
                req.session.postAdErrorMsg = `<ul><li>${err.errors.map((error) => error.message).join('</li><li>')}</li></ul>`;
            } else if (err instanceof Sequelize.DatabaseError) {
                req.session.postAdErrorMsg = 'Database error';
            } else {
                req.session.postAdErrorMsg = 'Unexpected error';
            }
            req.session.body = req.body; // Set session variable for storing the form data
            res.redirect('/new-ad');     // redirect to new-ad page - avoid resubmission of the form
        })
};
