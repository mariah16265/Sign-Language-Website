const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./router/user.route');
const signsDataSync = require('./utils/signsDataSync');   //syncs data
const signsDataRoutes = require('./router/signsData.route');  //sends data to frontend
const studyPlanRoutes = require('./router/studyplan.route');
const dashboardRoutes = require('./router/dashboard.route');
const progressRoutes = require('./router/progress.route');
const signDictionaryRoutes = require('./router/signdictionary.route');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cors());
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
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Route for users
app.use('/api/users', userRoutes);

// Route to get modules data for learn & lesson
app.use('/api/modules', signsDataRoutes);
app.use('/api/lessons', signsDataRoutes);

//Route to save studyplan
app.use('/api/studyplan', studyPlanRoutes);

//Route to display dashboard content
app.use('/api/dashboard', dashboardRoutes);

// Progress API
app.use('/api/progress', progressRoutes);   //to get lesson's & subjects progress

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
