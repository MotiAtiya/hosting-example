
const express = require('express');
const router = express.Router();

const homePageController = require("../controllers/homePage");

/* GET home page. */
router.get('/', homePageController.getHomePage );

/* GET home page, fot search by title. */
router.get('/search', homePageController.getHomePageByTitle );

module.exports = router;
