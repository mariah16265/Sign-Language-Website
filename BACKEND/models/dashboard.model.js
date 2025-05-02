import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  date: String,         // e.g., "2025-05-01"
  day: String,          // e.g., "Monday"
  subject: String,      // e.g., "English"
  module: String,       // e.g., "MOdule 1 Alphabet"
  lesson: String ,       // e.g., "A to E"
  lessonId: mongoose.Schema.Types.ObjectId

}, { _id: false });

const weeklyScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  weekStartDate: String, // e.g., "2025-04-29"
  schedule: [lessonSchema]
});

export default mongoose.model('WeeklySchedule', weeklyScheduleSchema);
