const express = require('express');
const router = express.Router();

//calling the authenticateUser function from authmiddleware
const { 
    authenticateUser 
} = require('../middleware/authMiddleware'); // authentication middleware

const { 
    saveProgress, 
    getLessonProgress,
    getSubjectProgress,
    getThisWeekSignsLearned
} = require('../controllers/progress.controller');

const { 
    getLoginStreak 
} = require('../controllers/streak.controller');


// Save progress
router.post('/', saveProgress);

//Get subject-level progress
router.get('/user/:userId/lesson/:lessonId', authenticateUser, getLessonProgress);

//Get subject-level progress
router.get('/subject-progress/:userId/:subject',authenticateUser, getSubjectProgress);

//Get signs progress week wise
router.get('/weekly-signs/:userId', authenticateUser, getThisWeekSignsLearned);

//Get current and best streak
router.get('/streak/:userId', authenticateUser, getLoginStreak);

module.exports = router;
