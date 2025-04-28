// controllers/user.controller.js
//defines functions for wht happens when req hits endpoint
const User = require('../models/user.model');
const Studyplan = require('../models/studyplan.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific user by ID
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user){
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Add new user(sign up) check for email and username its unique
const createUser = async (req, res) => {
  console.log('Signup request body:', req.body); // add this
  try {
    const { Gemail, username, password} = req.body;

    // Check if email already exists
    const emailExists = await User.findOne({ Gemail });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use'});
    }

    // Check if username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already in use'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { ...req.body, password: hashedPassword };
    const newUser = await User.create(userData);

    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: err.message });
  }
};

//Checking for existing user (Login user)
const userLogin = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Add this line
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: 'Username and password are required' });

    // Determine if identifier is an email
    const isEmail = username.includes('@');

    // Find user by email or username
    const user = await User.findOne(isEmail ? { Gemail: username } : { username });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const studyplan = await Studyplan.findOne({ user: user._id });
    const isNewUser = !studyplan;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });
    //If password valid, send a token
    const token = jwt.sign(
      { id: user._id },       // small data to put inside token
      process.env.JWT_SECRET,  // Secret key (you will later put it in .env file)
      { expiresIn: '1d' }     // Expire after 7 days (you can choose)
    );
    res.status(200).json({ message: 'Login successful', token, isNewUser, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createUser,
  userLogin,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
};
