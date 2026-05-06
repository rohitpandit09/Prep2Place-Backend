const express = require('express');
const router = express.Router();
const {practiceAI} = require('../controllers/practiceAIController');

// routes

router.post('/practiceAI',practiceAI);

module.exports = router;