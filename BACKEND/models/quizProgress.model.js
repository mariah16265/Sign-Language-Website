const mongoose = require('mongoose');

const quizProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  module: {
    type: String,
    required: true
  },
  signTitle: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    enum: ['correct', 'incorrect'],
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QuizProgress', quizProgressSchema);
