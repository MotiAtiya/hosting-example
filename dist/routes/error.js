
const express = require('express');
const router = express.Router();

const errorController = require('../controllers/error');

/* Middleware for checking that there is actually an error */
router.get('/', errorController.checkValidError );

/* GET error page. */
router.get('/', errorController.getErrorPage );

module.exports = router;
