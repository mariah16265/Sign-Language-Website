const StudyPlan = require('../models/studyplan.model');

const createStudyPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const existingPlan = await StudyPlan.findOne({ user: userId });
    if (existingPlan) {
      return res.status(400).json({ message: 'Study Plan already exists for this user' });
    }

    const { startingModules, weeklyLessons, subjectDays } = req.body;

    // Create and save the StudyPlan
    const newPlan = new StudyPlan({
      user: userId,
      startingModules,
      weeklyLessons,
      subjectDays,
    });

    await newPlan.save();

    res.status(201).json({
      message: 'Study Plan created successfully',
      studyPlan: newPlan
    });
  } catch (error) {
    console.error('Error creating study plan and dashboard:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { createStudyPlan };
