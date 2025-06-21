const { spawn } = require('child_process');
const QuizProgress = require('../models/quizProgress.model');

const inferSign = async (req, res) => {
  const { features, question, hand, module } = req.body;
  const userId = req.user.id;
  console.log(`Received features length: ${features.length}, question: ${question}, hand: ${hand}`);

  try {
    const py = spawn('python', ['inference-models/ASL_Alphabet_Inference_Classifier.py']);
    let output = '';
    let errorOutput = '';

    py.stderr.on('data', (data) => errorOutput += data.toString());
    py.stdout.on('data', (data) => output += data.toString());
    py.stdin.write(JSON.stringify({ features, hand }));
    py.stdin.end();

    py.on('close', async (code) => {
      if (errorOutput) console.error('Python error:', errorOutput);

      try {
        const { predicted, confidence } = JSON.parse(output);
        const isCorrect = confidence > 50 && predicted === question;
        const answer = isCorrect ? 'correct' : 'incorrect';
        const score = isCorrect ? 10 : 0;

        const existing = await QuizProgress.findOne({ userId, module, signTitle: question });

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
            timestamp: new Date()
          });
          await newAttempt.save();
        }

        res.status(200).json({ predicted, confidence, answer });
        console.log(`Predicted: ${predicted}, Confidence: ${confidence}, Answer: ${answer}`);
 
      } catch (parseError) {
        console.error('Failed to parse Python output:', parseError.message);
        res.status(500).json({ message: 'Failed to parse Python output', error: parseError.message });
      }
    });

    py.on('error', (spawnErr) => {
      console.error('Failed to start Python process:', spawnErr);
      res.status(500).json({ message: 'Failed to start Python process', error: spawnErr.message });
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ message: 'Inference failed', error: err.message });
  }
};

/* New Confidence-only Route
const getConfidence = async (req, res) => {
  const { features, label, hand, module } = req.body;

  try {
    const py = spawn('python', ['inference-models/ASL_Alphabet_Inference_Classifier.py']);
    let output = '';
    let errorOutput = '';
    console.log("Gettnig Confidence");
    py.stderr.on('data', (data) => errorOutput += data.toString());
    py.stdout.on('data', (data) => output += data.toString());
    py.stdin.write(JSON.stringify({ features, hand }));
    py.stdin.end();

    py.on('close', (code) => {
      if (errorOutput) console.error('Python error:', errorOutput);

      try {
        const { predicted, confidence } = JSON.parse(output);
        res.status(200).json({ predicted, confidence });
      } catch (parseError) {
        console.error('Failed to parse Python output:', parseError.message);
        res.status(500).json({ message: 'Failed to parse Python output', error: parseError.message });
      }
    });

    py.on('error', (spawnErr) => {
      console.error('Failed to start Python process:', spawnErr);
      res.status(500).json({ message: 'Failed to start Python process', error: spawnErr.message });
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ message: 'Confidence check failed', error: err.message });
  }
};

module.exports = {
  inferSign,
  getConfidence
};
*/s