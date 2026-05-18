const express = require('express');
const router = express.Router();

const {generateQuestions} = require('../controllers/preppilotController');

router.post('/generate',generateQuestions);

module.exports = router;