// models/LoginActivity.model.js
const mongoose = require('mongoose');

const LoginActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date } // Only the day (e.g., 2025-05-01)
});

module.exports = mongoose.models.LoginActivity || mongoose.model('LoginActivity', LoginActivitySchema);
