//define routes or url paths, map them to controller functions we created
const express = require('express');
const router = express.Router();

//importing functions
const {
  createUser,
  userLogin,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser
} = require('../controllers/user.controller');

//DEFINING ROUTES

//Sign up
// POST request to /signup --> calls createUser() to register a new user
router.post('/signup', createUser);

//Login
router.post('/login', userLogin);

//Get all users
router.get('/', getAllUsers);

//Get a single user by ID
router.get('/:id', getUser);

//Update user by ID
router.put('/:id', updateUser);

//Delete user by ID
router.delete('/:id', deleteUser);

module.exports = router;
