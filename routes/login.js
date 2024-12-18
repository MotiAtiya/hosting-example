
const express = require('express');
const router = express.Router();

const loginController = require('../controllers/login');

/* GET login page. */
router.get('/', loginController.getLoginPage );

/* POST for login. */
router.post('/', loginController.logIn );

module.exports = router;