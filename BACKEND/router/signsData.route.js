const express = require('express');
const router = express.Router();

// Import the controllers
const { 
    getAllModules, 
    getModulesBySub,
    getLessonsByMod } = require('../controllers/signsData.controller');


router.get('/:lessonId', getLessonsByMod); // fetch lessons by modules

//for studyplan and learn page
router.get('/subject/:subjectId', getModulesBySub); // fetch modules by subject (english, arabic etc.) 

module.exports = router;
