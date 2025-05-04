const express = require('express');
const router = express.Router();

const { generateWeeklySchedule,getDashboardData  } = require('../controllers/dashboard.controller');
const { authenticateUser } = require('../middleware/authMiddleware');

// Protect the dashboard route
router.post('/generate-weekly', authenticateUser, generateWeeklySchedule );
router.get('/today-schedule', authenticateUser, getDashboardData);

module.exports = router;
