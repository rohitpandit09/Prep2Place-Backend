const express = require('express');
const { createRoadmap } = require('../controllers/roadmapController');
const router = express.Router();

// routes

router.post('/roadmap',createRoadmap);

// export

module.exports = router;