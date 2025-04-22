const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./router/user.route');

dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
  //origin: 'http://localhost:3000', // frontend default port
  //credentials: true
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGOOSE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Route for users
app.use('/api/users', userRoutes);

// Test Route (Optional)
app.get('/', (req, res) => {
  res.send('Backend is running ');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
