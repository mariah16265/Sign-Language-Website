const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./router/user.route');
const signsDataSync = require('./utils/signsDataSync'); //syncs data
const signsDataRoutes = require('./router/signsData.route'); //sends data to frontend
const studyPlanRoutes = require('./router/studyplan.route');
const dashboardRoutes = require('./router/dashboard.route');
const progressRoutes = require('./router/progress.route');
const gestureQuizRoutes = require('./router/gestureQuiz.route');
const quizRoutes = require('./router/quiz.route');
const signDictionaryRoutes = require('./router/signdictionary.route');
const questionsDataSync = require('./utils/questionsDataSync');

// Import the confidence controller directly
const { getConfidence } = require('./controllers/gestureQuiz.controller');
const { authenticateUser } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    signsDataSync();
    questionsDataSync();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Route for users
app.use('/api/users', userRoutes);

// Route to get modules data for learn & lesson
app.use('/api/modules', signsDataRoutes);
app.use('/api/lessons', signsDataRoutes);
app.use('/api/module-availability', signsDataRoutes);

//Route to save or get studyplan
app.use('/api/studyplan', studyPlanRoutes);

//Route to display dashboard content
app.use('/api/dashboard', dashboardRoutes);

// Progress API
app.use('/api/progress', progressRoutes); //to get lesson's & subjects progress

// Gesture Prediction for Quiz API
app.use('/api/predict', gestureQuizRoutes);

// Add confidence endpoint directly
app.post('/api/confidence', authenticateUser, getConfidence);

// Quiz API for getting questions
app.use('/api/quiz-questions', quizRoutes);
// for getting quiz progress
app.use('/api/quiz-progress', quizRoutes);
// for saving quiz progress
app.use('/api/quiz-static/', quizRoutes);
// for saving quiz modules info
app.use('/api/quiz-modules/', quizRoutes)

//Route to get dictionary content
app.use('/api/signs', signDictionaryRoutes);

// Test Route (Optional)
app.get('/', (req, res) => {
  res.send('Backend is running ');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
