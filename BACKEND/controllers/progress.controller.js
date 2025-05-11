const Progress = require('../models/progress.model');
const SignsData=require('../models/signsData.model');
// Create or skip progress
const saveProgress = async (req, res) => {
  try {
    const { userId, lessonId, signId, signTitle,level, module, subject} = req.body;

    // Check if already exists
    const existingProgress = await Progress.findOne({
      userId,
      lessonId,
      signId,
      level,
    });
    if (existingProgress) {
      // If already exists, do nothing
      return res.status(200).json({ message: 'Progress already saved.' });
    }

    // Else, create new progress
    const progress = new Progress({
      userId,
      lessonId,
      signId,
      level,
      module,
      subject,
      signTitle,
      status: 'watched', // Default value
    });
 //   console.log('Saving progress for:', userId, lessonId, signId, signTitle, module,subject);
    await progress.save();
    res.status(201).json({ message: 'Progress saved successfully.' });

  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ message: 'Server error while saving progress.' });
  }
};

const getLessonProgress = async (req, res) => {
    const { userId, lessonId } = req.params;
   // console.log('Fetching progress for:', req.params);
    try {
      const progress = await Progress.find({ userId, lessonId});
      res.json(progress);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching progress.' });
    }

};

//to get all modules progress
//to get all lessons progress
const getSubjectProgress = async (req, res) => {
    const { userId, subject } = req.params;
  
    try {
      // 1. Get all lessons for this subject
      const allLessons = await SignsData.find({ subject });
  
      // 2. Group lessons by module name
      const moduleMap = {};
      allLessons.forEach(lesson => {
        if (!moduleMap[lesson.module]) {
          moduleMap[lesson.module] = [];
        }
        moduleMap[lesson.module].push(lesson);
      });
  
      // 3. Get user progress
      const userProgress = await Progress.find({ userId, subject });
      const watchedSignIds = new Set(userProgress.map(p => p.signId.toString()));
  
      // 4. Count completed modules and lessons
      let completedModules = 0;
      const totalModules = Object.keys(moduleMap).length;
  
      let completedLessons = 0;
      const totalLessons = allLessons.length;
  
      for (const lessons of Object.values(moduleMap)) {
        let moduleComplete = true;
  
        for (const lesson of lessons) {
          const lessonSignIds = lesson.signs.map(sign => sign._id.toString());
          const allSignsWatched = lessonSignIds.every(id => watchedSignIds.has(id));
  
          // Count completed lesson
          if (allSignsWatched) {
            completedLessons++;
          } else {
            moduleComplete = false;
          }
        }
  
        if (moduleComplete) completedModules++;
      }
  
      // 5. Return results
      res.json({
        subject,
        completedModules,
        completedLessons,
        totalLessons
      });
  
    } catch (err) {
      console.error('❌ Error in getSubjectProgress:', err);
      res.status(500).json({ message: 'Failed to calculate subject progress' });
    }
  };

const getThisWeekSignsLearned = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const now = new Date();
      const dayOfWeek = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
      const diffToMonday = (dayOfWeek + 6) % 7; // days since Monday
      const monday = new Date(now);
      monday.setDate(now.getDate() - diffToMonday);
      monday.setHours(0, 0, 0, 0); // Start of Monday
  
      // Find signs learned since this week's Monday
      const progressData = await Progress.find({
        userId,
        createdAt: { $gte: monday }
      });
  
      // Count unique signs learned
      const uniqueSigns = new Set(progressData.map(p => p.signId.toString()));
      const signsLearnedThisWeek = uniqueSigns.size;
      res.json({ signsLearnedThisWeek });
  
    } catch (err) {
      console.error("❌ Error in getThisWeekSignsLearned:", err);
      res.status(500).json({ message: "Failed to fetch this week's sign progress" });
    }
  };
  
  module.exports = { saveProgress, getLessonProgress, getSubjectProgress, getThisWeekSignsLearned };