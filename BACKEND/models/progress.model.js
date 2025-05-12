const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  signId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sign',
    required: true,
  },
  module: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  subject: { 
    type: String, required: true 
  },
  signTitle: { 
    type: String, required: true 
  }, 
  status: {
    type: String,
    enum: ['watched', ''],
    default: '',
  },
}, { timestamps: true });


module.exports = mongoose.model('Progress', progressSchema);
