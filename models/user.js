'use strict';

const { DataTypes, Model } = require('sequelize');

/**
 * Defines the User model for interacting with the 'users' table in the database.
 * @param {object} sequelize - The Sequelize instance.
 * @returns {Function} - The User model class.
 */
module.exports = (sequelize) => {
    class User extends Model {
    }

    User.init({
        login: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'User',
    });

    return User;
};
