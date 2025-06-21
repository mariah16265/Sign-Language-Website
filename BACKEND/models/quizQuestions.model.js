const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['static', 'dynamic'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  level: {
    type: String,
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
  signUrl: {
    type: String,
    required: function () {
      return this.type === 'static';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
