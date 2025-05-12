const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    date: String,
    day: String,
    subject: String,
    level: String, 
    module: String,
    lesson: String,
    lessonId: mongoose.Schema.Types.ObjectId,
  },
  { _id: false }
);

const weeklyScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  weekStartDate: String,
  schedule: [lessonSchema],
});

module.exports = mongoose.model('WeeklySchedule', weeklyScheduleSchema);
