const express = require('express');
const router = express.Router();

// Import the controllers
const {  
    getModulesBySub,
    getLessonsByMod, 
    getNextLesson,
    getModuleAvailability} = require('../controllers/signsData.controller');
const { 
    authenticateUser 
} = require('../middleware/authMiddleware'); // authentication middleware


router.get('/:lessonId/user/:userId', authenticateUser, getLessonsByMod); // fetch lessons by modules

router.get('/next/:lessonId', authenticateUser,  getNextLesson); // fetch next lesson by current lesson ID

router.get('/user/:userId/subject/:subjectId', authenticateUser, getModulesBySub); //for learn page

router.get('/quiz/user/:userId/:subjectId', authenticateUser, getModuleAvailability); //for MOdules page

module.exports = router;
