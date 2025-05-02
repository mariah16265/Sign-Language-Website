const express = require('express');
const router = express.Router();

// Import the controllers
const { 
    getAllModules, 
    getModulesBySub } = require('../controllers/signsData.controller');

// Routes to GET data
router.get('/', getAllModules); // fetch ALL modules (if needed)
router.get('/:subjectId', getModulesBySub); // fetch modules by subject (english, arabic etc.) 

module.exports = router;
