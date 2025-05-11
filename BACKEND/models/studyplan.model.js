const mongoose = require('mongoose');

const StudyPlanSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    //Connects it to the user model and matched the _id
    ref: 'User', 
    required: true 
  },
  startingLevels: { 
    type: Object, 
    required: true 
  },
  weeklyLessons: { 
    type: Object, 
    required: true 
  },
  subjectDays: { 
    type: Object, 
    required: true 
  },
}, 
{ timestamps: true });

module.exports = mongoose.model('StudyPlan', StudyPlanSchema);
