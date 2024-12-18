'use strict';

const db = require("../models");
const Sequelize = require('sequelize');

/**
 * Retrieve all ads from the database.
 * @returns {Promise} A promise that resolves with an array of all ads, ordered by creation date in descending order.
 */
exports.getAllAds = () => {
    return db.Ad.findAll({ attributes: ['title', 'description', 'price', 'phone', 'email', 'approved', 'id'],
        order: [['createdAt', 'DESC']] // Order by createdAt column in descending order
        })
};


/**
 * Retrieve all approved ads from the database.
 * @returns {Promise} A promise that resolves with an array of all approved ads, ordered by creation date in descending order.
 */
exports.getApprovedAds = () => {
    return db.Ad.findAll({where: { approved: true }, attributes: ['title', 'description', 'price', 'phone', 'email' ],
        order: [['createdAt', 'DESC']] // Order by createdAt column in descending order
    })
};


/**
 * Retrieve ads from the database that match the given title and optionally filter by approved status.
 * @param {string} title - The title to search for.
 * @param {boolean} approvedOnly - If true, only approved ads will be returned.
 * @returns {Promise} A promise that resolves with an array of ads that match the search criteria, ordered by creation date in descending order.
 */
exports.getAdsByTitle = (title, approvedOnly) => {
    const searchConditions = { title: { [Sequelize.Op.like]: `%${title}%` } };
    if (approvedOnly) {
        searchConditions.approved = true; // Include approved condition only if approvedOnly is true
    }
    const attributes = approvedOnly ?
        ['title', 'description', 'price', 'phone', 'email'] : // Only include certain attributes if approvedOnly is true
        ['title', 'description', 'price', 'phone', 'email', 'approved', 'id']; // Include all attributes otherwise

    return db.Ad.findAll({
        where: searchConditions,
        attributes: attributes,
        order: [['createdAt', 'DESC']] // Order by createdAt column in descending order
    })
};


/**
 * Retrieves an ad from the database by its ID.
 * @param {number} id - The ID of the ad to retrieve.
 * @returns {Promise<object|null>} A promise that resolves to the ad object if found,
 * or null if no ad with the specified ID exists.
 */
exports.getAdById = (id) => {
    return db.Ad.findByPk(id)
};


/**
 * Delete an ad from the database by its ID.
 * @param {number} id - The ID of the ad to delete.
 * @returns {Promise} A promise that resolves with a status message indicating the outcome of the operation.
 */
exports.delAdById = (id) => {
    return db.Ad.findByPk(id)
        .then((ad) => {
            if (ad) {
                return ad.destroy({force: true});
            }
            return Promise.resolve({ status: 222, message: `Ad with id = ${id} is not found` });
        });
};


/**
 * Approve an ad in the database by its ID.
 * @param {number} id - The ID of the ad to approve.
 * @returns {Promise} A promise that resolves with a status message indicating the outcome of the operation.
 */
exports.approveAdById = (id) => {
    const approved = true;
    return db.Ad.findByPk(id)
        .then((ad) => {
            if (ad) {
                return ad.update({ approved });
            }
            return Promise.resolve({ status: 222, message: `Ad with id = ${id} is not found` });
        });
};


/**
 * Adds a new ad to the database.
 * @param {object} ad - The ad object to be added to the database.
 * @returns {Promise<object>} A promise that resolves to the newly created ad object.
 */
exports.addNewAd = (ad) => {
    return db.Ad.create(ad)
};


/**
 * Find a user in the database by their login credentials.
 * @param {string} login - The user's login username.
 * @param {string} password - The user's login password.
 * @returns {Promise} A promise that resolves with the user object if found, otherwise resolves with null.
 */
exports.findUser = (login, password) => {
    return db.User.findOne({ where: { login: login, password: password } })
};
