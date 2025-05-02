const LoginActivity = require('../models/loginActivity.model');

const getLoginStreak = async (req, res) => {
    try {
      const userId = req.user.id;
      const activities = await LoginActivity.find({ userId }).sort({ date: -1 });
  
      if (activities.length === 0) {
        return res.status(200).json({ currentStreak: 0, bestStreak: 0 });
      }
  
      // Normalize dates to remove time
      const uniqueDates = [...new Set(
        activities.map(act => {
          const d = new Date(act.date);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      )].map(time => new Date(time));
  
      // Sort descending
      uniqueDates.sort((a, b) => b - a);
  
      // 1. Calculate currentStreak from today
      let currentStreak = 1;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      if (uniqueDates[0].getTime() !== today.getTime()) {
        currentStreak = 0;
      }
  
      for (let i = 0; i < uniqueDates.length - 1; i++) {
        const diff = (uniqueDates[i] - uniqueDates[i + 1]) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          if (i === 0 || currentStreak > 0) currentStreak++;
        } else {
          if (i === 0 || currentStreak > 0) break;
        }
      }
  
      // 2. Calculate bestStreak in full history
      let bestStreak = 1;
      let tempStreak = 1;
      for (let i = 0; i < uniqueDates.length - 1; i++) {
        const diff = (uniqueDates[i] - uniqueDates[i + 1]) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          tempStreak++;
          bestStreak = Math.max(bestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }
    return res.status(200).json({ currentStreak, bestStreak });
  
    } catch (error) {
      console.error('Error calculating streak:', error);
      res.status(500).json({ message: 'Server error while calculating streak' });
    }
  };
  

module.exports = { getLoginStreak };
