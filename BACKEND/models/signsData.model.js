const mongoose = require('mongoose');

const signsDataSchema = new mongoose.Schema({
  subject: { 
    type: String, 
    required: true 
  },
  module: { 
    type: String, 
    required: true 
  },
  lessonNumber: { 
    type: Number, 
    required: true
   },
  level: {  
    type: String,
    required: true
  },
  signs: [
    {
      title: { type: String, required: true },
      videoUrl: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('SignsData', signsDataSchema);
