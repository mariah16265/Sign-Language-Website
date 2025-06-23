const express = require('express');
const router = express.Router();

const { inferSign } = require('../controllers/gestureQuiz.controller');

const { inferWord } = require('../controllers/gestureWordQuiz.controller');

const { authenticateUser } = require('../middleware/authMiddleware');

// POST route for sign inference
router.post('/infer', authenticateUser, inferSign);

router.post('/inferWord', authenticateUser, inferWord);

module.exports = router;
