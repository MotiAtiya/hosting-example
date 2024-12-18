
const express = require('express');
const router = express.Router();

const apiController = require("../controllers/api");

/* '/api/' */
router.get('/', apiController.getAllAds );

/* '/api/:title' */
router.get('/:title', apiController.getAdsByTitle );

/* DELETE Ad - '/api/:id' */
router.delete('/:id', apiController.delAd );

/* APPROVE Ad - '/api/:id'  */
router.put('/:id', apiController.approveAd );

module.exports = router;