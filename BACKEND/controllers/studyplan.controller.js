const StudyPlan = require('../models/studyplan.model');

const createStudyPlan = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user ID from authentication middleware

    // Check if the user already has a study plan
    const existingPlan = await StudyPlan.findOne({ user: userId });
    if (existingPlan) {
      return res.status(400).json({ message: 'Study Plan already exists for this user' });
    }

    // Create a new study plan
    const newPlan = new StudyPlan({
      user: userId,
      startingModules: req.body.startingModules,
      weeklyLessons: req.body.weeklyLessons,
      subjectDays: req.body.subjectDays,
    });

    await newPlan.save();

    res.status(201).json(newPlan);
  } catch (error) {
    console.error('Error creating study plan:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createStudyPlan };
