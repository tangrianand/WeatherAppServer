const express = require('express');
const router = express.Router();

const weatherController = require('../controllers/weather');

router.post('/search', weatherController.search);

router.get('/search/history/:userId', weatherController.searchHistory);

router.post('/search/geo', weatherController.searchGeo);

module.exports = router;