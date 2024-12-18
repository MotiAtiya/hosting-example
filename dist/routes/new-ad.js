
const express = require('express');
const router = express.Router();

const newAdController = require('../controllers/new_ad');

/* GET Post-new-Ad page. */
router.get('/', newAdController.getNewAdPage );

/* POST for create new Ad. */
router.post('/', newAdController.createNewAd );

module.exports = router;
