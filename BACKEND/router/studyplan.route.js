const express = require('express');
const router = express.Router();

const { 
    createStudyPlan,
    updateStudyPlanLevel
} = require('../controllers/studyplan.controller');

//calling the authenticateUser function from authmiddleware
const { 
    authenticateUser 
} = require('../middleware/authMiddleware'); // authentication middleware

// POST route to create a study plan
router.post('/', authenticateUser, createStudyPlan);

router.patch('/update-level/:userId/:subject', authenticateUser, updateStudyPlanLevel);

module.exports = router;
