const express = require('express');
const router = express.Router();

const {
  inferSign,
  getConfidence, // Uncommented this line
} = require('../controllers/gestureQuiz.controller');

const { authenticateUser } = require('../middleware/authMiddleware');

// POST route for sign inference
router.post('/infer', authenticateUser, inferSign);

// POST route for confidence checking (uncommented)
router.post('/confidence', authenticateUser, getConfidence);

module.exports = router;
