'use strict';

const dbController = require('./dbAccess')

/**
 * Get all ads from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getAllAds = (req, res) => {
    handleRes(dbController.getAllAds(), req, res);
};


/**
 * Get ads by title from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getAdsByTitle = (req, res) => {
    handleRes(dbController.getAdsByTitle(req.params.title, false), req, res);
};


/**
 * Delete an Ad from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.delAd = (req, res) => {
    const id = parseInt(req.params.id);
    handleRes(dbController.delAdById(id), req, res);
};


/**
 * Approve an Ad in the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.approveAd = (req, res) => {
    const id = parseInt(req.params.id);
    handleRes(dbController.approveAdById(id), req, res);
};


/**
 * Handle the promise returned by database operations, send response to client or handle errors.
 * @param {Promise} promise - The promise returned by the database operation.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function handleRes(promise, req, res) {
    promise
        .then(response => {
            return res.send(response);
        })
        .catch((err) => {
            err.error = 1;                       // some error code for client side
            return res.status(400).send(err);    // send the error to the client
        });
}
