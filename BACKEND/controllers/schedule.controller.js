const SignsData = require('../models/signsData.model.js');
const WeeklySchedule = require('../models/dashboard.model.js');
const moment = require('moment');

// Get today's schedule with sign video URLs
const getTodaysScheduleWithSigns = async (userId) => {
  const today = moment().format('YYYY-MM-DD');
  //console.log('Today\'s date:', today);

  // Find the latest schedule that includes today
  const weeklySchedule = await WeeklySchedule.findOne({
    userId,
    'schedule.date': today,
  }).lean();

  if (!weeklySchedule) {   // Find the user's full schedule
    const fullSchedule = await WeeklySchedule.findOne({ userId })
      .sort({ weekStartDate: -1 })  // Get latest by weekStartDate
      .lean();
    let nextStudyDate = null;

    if (fullSchedule && fullSchedule.schedule) {
      const futureLessons = fullSchedule.schedule
        .filter(entry => moment(entry.date).isAfter(today))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      nextStudyDate = futureLessons.length > 0 ? futureLessons[0].date : null;
    }

    console.log(`Rest day for user ${userId}.\nNext lesson is on ${nextStudyDate || 'N/A'}.`);

    return []
  }
  //console.log('Weekly schedule found:', weeklySchedule);

  // Filter today's lessons
  const todayLessons = weeklySchedule.schedule.filter(
    (entry) => entry.date === today
  );

  // console.log('Today\'s lessons:', todayLessons);

  // Map each lesson to its signs
  const lessonsWithSigns = await Promise.all(
    todayLessons.map(async (lesson) => {
      //console.log('Lesson object:', lesson); // Log the full lesson object

      const signDoc = await SignsData.findOne({
        subject: lesson.subject,
        module: lesson.module,
        lessonNumber: parseInt(lesson.lesson.split(' ')[1]),
      });

      // Map the signs to only include relevant fields (title, videoUrl)
      const formattedSigns =
        signDoc?.signs?.map((sign) => ({
          title: sign.title,
          videoUrl: sign.videoUrl,
        })) || [];

      return {
        ...lesson,
        signs: formattedSigns,
      };
    })
  );

  //console.log('Lessons with signs:', lessonsWithSigns);
  return lessonsWithSigns;
};
module.exports = { getTodaysScheduleWithSigns };
