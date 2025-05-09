const SignsData = require('../models/signsData.model');

// Controller to fetch all modules
const getAllModules = async (req, res) => {
  try {
    const modules = await SignsData.find({});
    res.status(200).json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ message: 'Failed to fetch modules' });
  }
};

const getModulesBySub = async (req, res) => {
  console.log('Subject ID received:', req.params.subjectId);
  try {
    const subjectId = req.params.subjectId; // <-- this grabs 'english', 'arabic' etc from URL
    const modules = await SignsData.find({subject: subjectId }); 
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching modules for subject', error });
  }
};

const getLessonsByMod = async (req, res) => {
    try {
      const lessonId = req.params.lessonId;
      const lesson = await SignsData.findById(lessonId);
      //console.log("Fetched Lesson:",lesson );
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
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

module.exports = { getAllModules, getModulesBySub, getLessonsByMod, getNextLesson };
