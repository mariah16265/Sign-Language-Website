const express = require('express');
const router = express.Router();

const { 
    getSignDictionary 
} = require('../controllers/signdictionary.controller');

//calling the authenticateUser function from authmiddleware
const { 
    authenticateUser 
} = require('../middleware/authMiddleware'); // authentication middleware

// POST route to create a study plan
router.get('/dictionary', authenticateUser, getSignDictionary);

module.exports = router;
