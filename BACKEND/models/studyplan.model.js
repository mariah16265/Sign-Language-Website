const mongoose = require('mongoose');

const StudyPlanSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    //Connects it to the user model and matched the _id
    ref: 'User', 
    required: true 
  },
  //since map(key val pair) is being used in the frontend, here also we use the same
  //Each key is a subject name (English, Arabic, Math).
  //Each value is a String (the module name you start with).    
  startingModules: { 
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
