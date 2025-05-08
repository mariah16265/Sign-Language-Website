// controllers/user.controller.js
const User = require('../models/user.model');
const Studyplan = require('../models/studyplan.model');
const LoginActivity = require('../models/loginactivity.model');

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
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new user (sign up)
const createUser = async (req, res) => {
  console.log('Signup request body:', req.body);
  try {
    const { Femail, username, password } = req.body; // Changed from Gemail to Femail

    // Check if email exists
    const emailExists = await User.findOne({ Femail }); // Changed field
    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Check username
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      ...req.body,
      password: hashedPassword,
      // Map all required fields from frontend
      Fname: req.body.Fname,
      Forganization: req.body.Forganization,
      Frole: req.body.Frole,
      Fphone: req.body.Fphone,
      Cname: req.body.Cname,
      Cdob: req.body.Cdob,
      Cgender: req.body.Cgender,
      Cdisability: req.body.Cdisability,
    };

    const newUser = await User.create(userData);
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: err.message });
  }
};

// User login
const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res
        .status(400)
        .json({ message: 'Username and password are required' });

    // Find by email or username
    const isEmail = username.includes('@');
    const user = await User.findOne(
      isEmail ? { Femail: username } : { username } // Changed to Femail
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    // ... rest of the login logic remains the same ...
    // Keep the existing studyplan and login activity code

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: 'Invalid password' });

    // Record login activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const alreadyLogged = await LoginActivity.findOne({
      userId: user._id,
      date: today,
    });
    if (!alreadyLogged) {
      await LoginActivity.create({ userId: user._id, date: today });
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      isNewUser: !(await Studyplan.findOne({ user: user._id })),
      user,
    });
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

// Update user
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
