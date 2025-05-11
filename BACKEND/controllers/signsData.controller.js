const SignsData = require('../models/signsData.model');
const StudyPlan = require('../models/studyplan.model.js');

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
      return res.status(404).json({ message: 'No next lesson found' });
    }
    res.status(200).json(nextLesson);
  } catch (error) {
    console.error('Error fetching next lesson:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getModulesBySub, getLessonsByMod, getNextLesson };
