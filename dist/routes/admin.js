
const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const loginController = require('../controllers/login');

/* GET admin page. */
router.get('/', adminController.getAdminPage );

/* GET for logout. */
router.get('/logout', loginController.logOut )

module.exports = router;
