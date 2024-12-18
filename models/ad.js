'use strict';

const { DataTypes, Model } = require('sequelize');

/**
 * Defines the Ad model for interacting with the 'ads' table in the database.
 * @param {object} sequelize - The Sequelize instance.
 * @returns {Function} - The Ad model class.
 */
module.exports = (sequelize) => {
    class Ad extends Model {
    }

    Ad.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'title is mandatory.'
                },
                len: {
                    args: [1 ,20],
                    msg: "title's length need to be between 1 and 20 chars."
                }
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: {
                    args: [0 ,200],
                    msg: "max description's length is 200 chars."
                },
            }
        },
        price: {
            type: DataTypes.FLOAT,
            isNumeric: true,          // will only allow numbers
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'price is mandatory.'
                },
                min: {
                    args: [0],
                    msg: 'Price must be a positive number.'
                }
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /^\d{2,3}-\d{7}$/,
                    msg: "phone number has invalid format (XXX-XXXXXXX or XX-XXXXXXX)."
                },
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: {
                    msg: "email has invalid format."
                },
            }
        },
        approved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        sequelize,
        modelName: 'Ad',
    });

    return Ad;
};
