const express = require('express');
const router = express.Router();

const {
    inferSign,
    getConfidence
} = require('../controllers/gestureQuiz.controller');

const { authenticateUser } = require('../middleware/authMiddleware'); // authentication middleware

// POST route to 
router.post('/infer', authenticateUser, inferSign);
router.post('/confidence', authenticateUser, getConfidence);

module.exports = router;
