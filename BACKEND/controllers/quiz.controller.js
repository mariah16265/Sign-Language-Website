const QuizQuestion = require('../models/quizQuestions.model');
const SignsData = require('../models/signsData.model');
const QuizProgress = require('../models/quizProgress.model');

const shuffle = (arr) => arr.sort(() => 0.5 - Math.random());

// ─────────────── Generate Quiz ───────────────
const generateQuizForModule = async (req, res) => {
  const { module } = req.params;
  console.log('Fetching Quiz Questions..');
  try {
    const lessons = await SignsData.find({ module });
    const allSigns = lessons.flatMap((lesson) => lesson.signs);
    const signTitles = allSigns.map((sign) => sign.title);

    const allQuestions = await QuizQuestion.find({ module });

    const staticQs = shuffle(allQuestions.filter((q) => q.type === 'static'));
    const dynamicQs = shuffle(allQuestions.filter((q) => q.type === 'dynamic'));

    const orderedQuestions = [];

    const pushN = (list, n) => {
      for (let i = 0; i < n && list.length > 0; i++) {
        orderedQuestions.push(list.shift());
      }
    };

    pushN(staticQs, 10);
    // Optional more dynamic/static
    // pushN(dynamicQs, 2);
    // pushN(staticQs, 3);
    // pushN(dynamicQs, 3);

    const finalQuestions = orderedQuestions.map((q) => {
      if (q.type === 'static') {
        const incorrectLabels = shuffle(
          signTitles.filter((title) => title !== q.signTitle)
        ).slice(0, 3);

        const options = shuffle([
          { label: q.signTitle, isCorrect: true },
          ...incorrectLabels.map((label) => ({ label: label.toUpperCase(), isCorrect: false })),
        ]);

        return {
          type: 'static',
          prompt: 'What does this sign represent?',
          signTitle: q.signTitle,
          signUrl: q.signUrl,
          options,
        };
      } else {
        return {
          type: 'dynamic',
          prompt: `Show the sign for "${q.signTitle}"`,
          correctLabel: q.signTitle,
        };
      }
    });

    res.json(finalQuestions);
  } catch (err) {
    console.error('❌ Error generating quiz:', err);
    res.status(500).json({ message: 'Failed to generate quiz questions' });
  }
};

// ─────────────── Get Quiz Score ───────────────
const getQuizProgressForModule = async (req, res) => {
  const { userId, module } = req.params;
  try {
    const progress = await QuizProgress.find({ userId, module });
    const totalScore = progress.reduce((acc, item) => acc + item.score, 0);
    console.log("SCORE:", totalScore);
    res.json({ totalScore });
  } catch (err) {
    console.error('❌ Error fetching quiz progress:', err);
    res.status(500).json({ message: 'Failed to fetch quiz progress' });
  }
};

// ─────────────── Get Quiz Score ───────────────
const getQuizModuleInfo = async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. Get all beginner modules with their subjects
    const allModules = await SignsData.find({ level: 'beginner' });

    // Create a map from module name to subject (assume module names are unique)
    const moduleToSubject = new Map();
    allModules.forEach(({ module, subject }) => {
      if (!moduleToSubject.has(module)) {
        moduleToSubject.set(module, subject);
      }
    });

    // 2. Get all user's quiz progress (which only contains module, no subject)
    const userProgress = await QuizProgress.find({ userId });

    // 3. Aggregate progress by module + subject (subject from moduleToSubject map)
    const progressByModuleSubject = {};

    userProgress.forEach(({ module, score }) => {
      const subject = moduleToSubject.get(module) || 'Unknown';

      const key = `${module}-${subject}`;
      if (!progressByModuleSubject[key]) {
        progressByModuleSubject[key] = { questionsAnswered: 0, totalScore: 0 };
      }
      progressByModuleSubject[key].questionsAnswered += 1;
      progressByModuleSubject[key].totalScore += score;
    });

    // 4. Build final response arrays
    const englishModules = [];
    const arabicModules = [];

    // Use the module-subject map as source for all beginner modules
    moduleToSubject.forEach((subject, module) => {
      const key = `${module}-${subject}`;
      const progress = progressByModuleSubject[key] || { questionsAnswered: 0, totalScore: 0 };

      let status = 'available';
      if (progress.questionsAnswered >= 10) {
        status = 'completed';
      } else if (progress.questionsAnswered === 0) {
        status = 'locked';
      }

      const moduleInfo = {
        module,
        subject,
        status,
        totalScore: progress.questionsAnswered >= 10 ? progress.totalScore : 0,
        questionsAnswered: progress.questionsAnswered,
      };

      if (subject.toLowerCase() === 'english') {
        englishModules.push(moduleInfo);
      } else {
        arabicModules.push(moduleInfo);
      }
    });

    res.json({
      english: englishModules,
      arabic: arabicModules,
    });

  } catch (err) {
    console.error('❌ Error fetching quiz module info:', err.message);
    res.status(500).json({ message: 'Failed to fetch quiz module info' });
  }
};


// ─────────────── Get Quiz Progress ───────────────
const saveQuizProgress = async (req, res) => {
  const { userId } = req.params;
  const { module, signTitle, isCorrect } = req.body;

  if (!module || !signTitle || typeof isCorrect !== 'boolean') {
    return res
      .status(400)
      .json({ message: 'Missing required fields or invalid data' });
  }

  const answer = isCorrect ? 'correct' : 'incorrect';
  const score = isCorrect ? 10 : 0;

  try {
    // Check if a progress record already exists for this user, module, and signTitle
    const existingProgress = await QuizProgress.findOne({
      userId,
      module,
      signTitle,
    });

    if (existingProgress) {
      // Update existing record
      existingProgress.answer = answer;
      existingProgress.score = score;
      existingProgress.timestamp = new Date(); // update timestamp to now
      await existingProgress.save();
      return res
        .status(200)
        .json({ message: 'Quiz progress updated', updated: true });
    }

    // Create new progress record
    const newProgress = new QuizProgress({
      userId,
      module,
      signTitle,
      answer,
      score,
      timestamp: new Date(),
    });

    await newProgress.save();
    res.status(201).json({ message: 'Quiz progress saved', created: true });
  } catch (error) {
    console.error('❌ Error saving quiz progress:', error);
    res.status(500).json({ message: 'Failed to save quiz progress' });
  }
};

module.exports = {
  generateQuizForModule,
  getQuizProgressForModule,
  getQuizModuleInfo,
  saveQuizProgress,
};
