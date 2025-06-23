const SignsData = require('../models/signsData.model');
const StudyPlan = require('../models/studyplan.model.js');
const QuizProgress = require('../models/quizProgress.model');

// Controller to fetch all modules subject wise
const getModulesBySub = async (req, res) => {
  const userId = req.params.userId;
  const subjectId = req.params.subjectId; // ✅ FIXED

  console.log('Fetching modules for:', req.params.subjectId);
  try {
     // 1. Get the user's study plan
    const studyPlan = await StudyPlan.findOne({ user: userId });
    
    // 2. Get starting level for this subject
    const startingLevel = studyPlan.startingLevels?.[subjectId];
    if (!startingLevel) {
      return res.status(400).json({ message: `No starting level found for subject ${subjectId}` });
    }
    // 3. Find lessons for the subject and level
    const modules = await SignsData.find({
      subject: subjectId,
      level: startingLevel
    });
    // Sort modules by numeric module number
    modules.sort((a, b) => {
      const aNum = parseInt(a.module.match(/\d+/)?.[0]);
      const bNum = parseInt(b.module.match(/\d+/)?.[0]);
      return aNum - bNum;
    });

    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching modules for subject', error });
  }
};

const getLessonsByMod = async (req, res) => {
    try {
      const userId = req.params.userId; 
      const lessonId = req.params.lessonId;
      const lesson = await SignsData.findById(lessonId);
      //console.log("Fetched Lesson:",lesson );
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
      // Get the user's level for this lesson's subject
      const studyPlan = await StudyPlan.findOne({ user: userId });
      const allowedLevel = studyPlan?.startingLevels?.[lesson.subject];
      if (!allowedLevel) {
        return res.status(400).json({ message: 'No level found for user for this subject' });
      }
      if (lesson.level !== allowedLevel) {
        return res.status(403).json({ message: 'Access denied: Lesson not part of your level' });
      }

      res.json(lesson);
    } catch (error) {
      console.error('Error fetching lesson by ID:', error);
      res.status(500).json({ message: 'Error fetching lesson', error });
    }
  };

const getNextLesson = async (req,res) => {
  try {
    const { lessonId } = req.params;
    // Step 1: Get current lesson
    const currentLesson = await SignsData.findById(lessonId);
    if (!currentLesson) {
      return res.status(404).json({ message: 'Current lesson not found' });
    }

    // Step 2: Find next lesson in the same module (or subject)
    const nextLesson = await SignsData.findOne({
      module: currentLesson.module, // or use subject if you want to continue across modules
      lessonNumber: { $gt: currentLesson.lessonNumber }
    }).sort({ lessonNumber: 1 });

    if (!nextLesson) {
      return res.status(200).json({ message: 'End of Module' });
    }
    res.status(200).json(nextLesson);
  } catch (error) {
    console.error('Error fetching next lesson:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getModuleAvailability = async (req, res) => {
  try {
    const { userId, subjectId } = req.params;

    // 1. Get all signs data for this subject
    const signs = await SignsData.find({ subject: subjectId });

    // 2. Extract unique modules, sorted by module number (e.g. Module 1, Module 2)
    const moduleSet = new Set(signs.map(sign => sign.module));
    const orderedModules = [...moduleSet].sort((a, b) => {
      const numA = parseInt(a.match(/Module (\d+)/)?.[1] || 0);
      const numB = parseInt(b.match(/Module (\d+)/)?.[1] || 0);
      return numA - numB;
    });

    // 3. Aggregate total quiz score per module for this user
    const quizData = await QuizProgress.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: "$module",
          totalScore: { $sum: "$score" }
        }
      },
      {
        $project: {
          module: "$_id",
          totalScore: 1
        }
      }
    ]);

    // Map total scores by module for quick access
    const quizScores = {};
    quizData.forEach(entry => {
      quizScores[entry.module] = entry.totalScore;
    });

    // 4. Unlock logic: always unlock first module, then unlock next if totalScore >= 70
    const unlockedModules = new Set();
    if (orderedModules.length > 0) unlockedModules.add(orderedModules[0]);

    for (let i = 0; i < orderedModules.length; i++) {
      const currentModule = orderedModules[i];
      const score = quizScores[currentModule] || 0;
      if (score >= 70) {
        const nextModule = orderedModules[i + 1];
        if (nextModule) unlockedModules.add(nextModule);
      }
    }

    return res.status(200).json({
      orderedModules,
      unlockedModules: [...unlockedModules],
    });
  } catch (error) {
    console.error("Module availability error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getModulesBySub,
  getLessonsByMod,
  getNextLesson,
  getModuleAvailability
};
