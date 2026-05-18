const express = require('express');
const router = express.Router();

const {generateQuestions,answerByUser} = require('../controllers/preppilotController');

router.post('/generate',generateQuestions);
router.post('/answer',answerByUser);

module.exports = router;