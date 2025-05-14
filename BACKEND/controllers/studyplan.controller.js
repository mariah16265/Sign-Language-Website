const { differenceInCalendarDays, addDays, format } = require('date-fns');
const StudyPlan = require('../models/studyplan.model');
const Progress = require('../models/progress.model');
const SignsData = require('../models/signsData.model');
const WeeklySchedule = require('../models/dashboard.model.js');

const createStudyPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const existingPlan = await StudyPlan.findOne({ user: userId });
    if (existingPlan) {
      return res.status(400).json({ message: 'Study Plan already exists for this user' });
    }

    const { startingLevels, weeklyLessons, subjectDays } = req.body;

    // Create and save the StudyPlan
    const newPlan = new StudyPlan({
      user: userId,
      startingLevels,
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

const editStudyPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startingLevels, weeklyLessons, subjectDays } = req.body;

    const existingPlan = await StudyPlan.findOne({ user: userId });
    if (!existingPlan) {
      return res.status(404).json({ message: 'Study Plan not found' });
    }
    
    // ✅ Calculate current dynamic weekStartDate
    const today = new Date();
    const createdDate = new Date(existingPlan.createdAt);
    const daysSinceStart = differenceInCalendarDays(today, createdDate);
    const fullWeeksPassed = Math.floor(daysSinceStart / 7);
    const weekStart = addDays(createdDate, fullWeeksPassed * 7);
    const weekStartDateString = format(weekStart, 'yyyy-MM-dd');

    // ✅ Delete this week's WeeklySchedule only
    await WeeklySchedule.deleteOne({
      userId,
      weekStartDate: weekStartDateString,
    });

    // Update all fields
    existingPlan.startingLevels = startingLevels;
    existingPlan.weeklyLessons = weeklyLessons;
    existingPlan.subjectDays = subjectDays;

    existingPlan.markModified('startingLevels');
    existingPlan.markModified('weeklyLessons');
    existingPlan.markModified('subjectDays');

    await existingPlan.save();

    res.status(200).json({message: 'Study Plan updated successfully'});
  } catch (error) {
    console.error('Error editing study plan:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getStudyPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const studyPlan = await StudyPlan.findOne({ user: userId });
    if (!studyPlan) {
      return res.status(404).json({ message: 'Study Plan not found' });
    }
    res.status(200).json(studyPlan );
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- Update Level ---
const updateStudyPlanLevel = async (req, res) => {
  const levelOrder = {
    English: ['beginner', 'intermediate', 'advanced'],
    Arabic: ['beginner', 'intermediate'], // advanced not yet implemented
  };
  const { userId, subject } = req.params;

  try {
    const studyPlan = await StudyPlan.findOne({ user: userId });
    if (!studyPlan) {
      return res.status(404).json({ error: 'Study Plan not found' });
    }

    const currentLevel = studyPlan.startingLevels[subject];
    const levels = levelOrder[subject];
    const currentIndex = levels.findIndex(
      lvl => lvl.toLowerCase() === currentLevel.toLowerCase()
    );

    if (currentIndex === -1) {
      return res.status(400).json({ error: 'Invalid level in study plan' });
    }

    if (currentIndex === levels.length - 1) {
      return res.status(200).json({ message: 'Already at highest level' });
    }

    // Fetch all lessons for the current level and subject
    const lessonsInLevel = await SignsData.find({
      subject,
      level: new RegExp(`^${currentLevel}$`, 'i')
    });

    const allSignIds = lessonsInLevel.flatMap(lesson =>
      lesson.signs.map(sign => sign._id.toString())
    );

    // Get user's progress
    const progress = await Progress.find({ userId, subject });
    const watchedSignIds = new Set(progress.map(p => p.signId.toString()));

    const allWatched = allSignIds.every(id => watchedSignIds.has(id));
    if (!allWatched) {
      return res.status(200).json({ message: 'Level not yet completed' });
    }

    // Upgrade to next level
    const nextLevel = levels[currentIndex + 1];
    studyPlan.startingLevels[subject] = nextLevel;
    studyPlan.markModified('startingLevels');
    await studyPlan.save();

    res.status(200).json({ message: `Level updated to ${nextLevel}` });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

module.exports = {
  createStudyPlan,
  editStudyPlan,
  getStudyPlan,
  updateStudyPlanLevel,
};
