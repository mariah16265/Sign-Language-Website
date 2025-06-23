const QuizQuestion = require('../models/quizQuestions.model');
const SignsData = require('../models/signsData.model');
const QuizProgress = require('../models/quizProgress.model');

const shuffle = (arr) => arr.sort(() => 0.5 - Math.random());

const generateQuizForModule = async (req, res) => {
  const { module } = req.params;
  console.log('Fetching Quiz Questions..');
  try {
    // Get all signs for the specified module
    const lessons = await SignsData.find({ module });
    const allSigns = lessons.flatMap((lesson) => lesson.signs);
    const signTitles = allSigns.map((sign) => sign.title);

    // Fetch quiz questions
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
//    pushN(dynamicQs, 2);
//    pushN(staticQs, 3);
//    pushN(dynamicQs, 3);

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
          signUrl: q.signUrl, // image or video for the question
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

const getQuizProgressForModule = async (req, res) => {
  const { userId, module } = req.params;
  try {
    const progress = await QuizProgress.find({ userId, module });
    const totalScore = progress.reduce((acc, item) => acc + item.score, 0);
    console.log("PROGRESs:",progress);
    console.log("SCORE:", totalScore);
    res.json({
      totalScore
    });
  } catch (err) {
    console.error('❌ Error fetching quiz progress:', err);
    res.status(500).json({ message: 'Failed to fetch quiz progress' });
  }
};


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
  saveQuizProgress,
};
