const express = require('express');
const router = express.Router();

// Import the controllers
const { 
    getAllModules, 
    getModulesBySub,
    getLessonsByMod, 
    getNextLesson} = require('../controllers/signsData.controller');


router.get('/:lessonId', getLessonsByMod); // fetch lessons by modules

router.get('/next/:lessonId', getNextLesson); // fetch next lesson by current lesson ID

//for studyplan and learn page
router.get('/subject/:subjectId', getModulesBySub); // fetch modules by subject (english, arabic etc.) 

module.exports = router;
