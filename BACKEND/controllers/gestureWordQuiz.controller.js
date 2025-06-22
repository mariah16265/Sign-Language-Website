const { spawn } = require('child_process');
const QuizProgress = require('../models/quizProgress.model');

const inferWord = async (req, res) => {
  const { features, question, hand, module } = req.body;
  const userId = req.user.id;

  console.log(`🧠 Word inference for: ${question}, Hand: ${hand}`);

  try {
    const py = spawn('python', ['inference-models/ASL_Word_Inference_Classifier.py',
    ]);

    let output = '';
    let errorOutput = '';

    py.stderr.on('data', (data) => (errorOutput += data.toString()));
    py.stdout.on('data', (data) => (output += data.toString()));
    py.stdin.write(JSON.stringify({ features, hand }));
    py.stdin.end();

    py.on('close', async (code) => {
      if (errorOutput) console.error('Python error:', errorOutput);

      try {
        const { predicted, confidence } = JSON.parse(output);

        const isCorrect = predicted === question;
        const answer = isCorrect ? 'correct' : 'incorrect';
        const score = isCorrect ? 10 : 0;

        const existing = await QuizProgress.findOne({
          userId,
          module,
          signTitle: question,
        });

        if (existing) {
          existing.answer = answer;
          existing.score = score;
          existing.timestamp = new Date();
          await existing.save();
        } else {
          const newAttempt = new QuizProgress({
            userId,
            module,
            signTitle: question,
            answer,
            score,
            timestamp: new Date(),
          });
          await newAttempt.save();
        }

        res.status(200).json({ predicted, confidence, answer });
        console.log(
          `✅ Word Predicted: ${predicted}, Confidence: ${confidence}%, ` +
          `Answer: ${answer}`
        );
      } catch (parseErr) {
        console.error('Failed to parse Python output:', parseErr.message);
        res.status(500).json({
          message: 'Failed to parse Python output',
          error: parseErr.message,
        });
      }
    });

    py.on('error', (spawnErr) => {
      console.error('Failed to start Python process:', spawnErr);
      res.status(500).json({
        message: 'Failed to start Python process',
        error: spawnErr.message,
      });
    });
  } catch (err) {
    console.error('Unexpected error during word inference:', err);
    res.status(500).json({ message: 'Word inference failed', error: err.message });
  }
};

module.exports = {
  inferWord,
};