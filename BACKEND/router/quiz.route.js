const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middleware/authMiddleware'); // authentication middleware

const { 
    generateQuizForModule,
    getQuizProgressForModule,
    saveQuizProgress
} = require('../controllers/quiz.controller');

router.get('/module/:module', authenticateUser, generateQuizForModule);
router.get('/user/:userId/:module', authenticateUser, getQuizProgressForModule);
router.post('/save/:userId/', authenticateUser, saveQuizProgress);

module.exports = router;
