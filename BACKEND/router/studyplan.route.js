const express = require('express');
const router = express.Router();

const { 
    createStudyPlan,
    getStudyPlan,
    editStudyPlan,
    updateStudyPlanLevel
} = require('../controllers/studyplan.controller');

//calling the authenticateUser function from authmiddleware
const { 
    authenticateUser 
} = require('../middleware/authMiddleware'); // authentication middleware

// POST  to create a study plan
router.post('/', authenticateUser, createStudyPlan);

// POST to edit study plan
router.put('/edit/:userId', authenticateUser, editStudyPlan);

// GET study plan
router.get('/:userId', authenticateUser, getStudyPlan );

router.patch('/update-level/:userId/:subject', authenticateUser, updateStudyPlanLevel);

module.exports = router;
