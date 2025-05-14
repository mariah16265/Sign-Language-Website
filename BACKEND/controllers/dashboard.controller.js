const { differenceInCalendarDays, addDays, format } = require('date-fns');
const StudyPlan = require('../models/studyplan.model.js');
const SignsData = require('../models/signsData.model.js');
const WeeklySchedule = require('../models/dashboard.model.js');
const Progress = require('../models/progress.model.js');
const { getTodaysScheduleWithSigns } = require('./schedule.controller.js');

const generateWeeklySchedule = async (req, res) => {
  try {
    const userId = req.user.id;
  //-------------DYNAMIC Schedule Generation--------------
    const today = new Date();

    const studyPlan = await StudyPlan.findOne({ user: userId });
    if (!studyPlan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }
    // Calculate custom week start based on study plan creation date
    const studyPlanCreatedDate = new Date(studyPlan.createdAt);
    const daysSinceStart = differenceInCalendarDays(today, studyPlanCreatedDate);
    const fullWeeksPassed = Math.floor(daysSinceStart / 7);
    const weekStart = addDays(studyPlanCreatedDate, fullWeeksPassed * 7);
    const weekStartDateString = format(weekStart, 'yyyy-MM-dd');

    const existingSchedule = await WeeklySchedule.findOne({
      userId,
      weekStartDate: weekStartDateString,
    });
    if (existingSchedule) {
      return res.status(200).json({
        message: 'Schedule already exists',
        schedule: existingSchedule.schedule,
      });
    }

    const rawSignsData = await SignsData.find();
    const watchedProgress = await Progress.find({ userId, status: 'watched' });
    const watchedSignIds = new Set(watchedProgress.map(p => p.signId.toString()));

    const groupedData = {};

    for (const doc of rawSignsData) {
      const { subject, module, lessonNumber, level } = doc;
      const moduleNumber = parseInt(module.match(/Module (\d+)/)?.[1] || 0);

      if (!groupedData[subject]) groupedData[subject] = [];

      let moduleGroup = groupedData[subject].find(m => m.moduleName === module);
      if (!moduleGroup) {
        moduleGroup = { moduleName: module, moduleNumber, level, lessons: [] };
        groupedData[subject].push(moduleGroup);
      }

      moduleGroup.lessons.push({
        lessonName: `Lesson ${lessonNumber}`,
        lessonNumber,
        lessonId: doc._id,
        signs: doc.signs,
      });
    }

    for (const subject in groupedData) {
      groupedData[subject].sort((a, b) => a.moduleNumber - b.moduleNumber);
      for (const module of groupedData[subject]) {
        module.lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);
      }
    }

    const schedule = [];

    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      const dayName = format(date, 'EEEE');
      const dateString = format(date, 'yyyy-MM-dd');

      const subjects = Object.keys(studyPlan.startingLevels || {});
      for (const subjectName of subjects) {
        const subjectDays = studyPlan.subjectDays[subjectName] || [];
        if (!subjectDays.includes(dayName.slice(0, 3))) continue;

        const lessonsPerWeek = studyPlan.weeklyLessons[subjectName];
        const userLevel = studyPlan.startingLevels?.[subjectName]?.current || studyPlan.startingLevels?.[subjectName];

        let subjectModules = groupedData[subjectName];
        if (!subjectModules) {
          console.log(`No data for subject: ${subjectName}`);
          continue;
        }

        if (userLevel) {
          subjectModules = subjectModules.filter(m => m.level === userLevel);
        }

        if (!subjectModules.length) {
          console.log(`No modules found for level ${userLevel} in subject ${subjectName}`);
          continue;
        }

        const lessons = [];
        let lessonsCount = 0;

        for (const module of subjectModules) {
          for (const lesson of module.lessons) {
            const allSignsWatched = lesson.signs.every(sign =>
              watchedSignIds.has(sign._id.toString())
            );
            if (allSignsWatched) continue;

            lessons.push({
              date: dateString,
              day: dayName,
              subject: subjectName,
              module: module.moduleName,
              level: module.level,
              lesson: lesson.lessonName,
              lessonId: lesson.lessonId,
            });

            lessonsCount++;
            if (lessonsCount >= lessonsPerWeek) break;
          }
          if (lessonsCount >= lessonsPerWeek) break;
        }

        schedule.push(...lessons);
      }
    }

    await WeeklySchedule.findOneAndUpdate(
      { userId, weekStartDate: weekStartDateString },
      { schedule, weekStartDate: weekStartDateString },
      { upsert: true }
    );

    console.log(`Weekly schedule generated`);
    res.status(200).json({ message: 'Schedule generated successfully', schedule });
  } catch (err) {
    console.error('Error generating weekly schedule:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDashboardData = async (req, res) => {
  const userId = req.user.id;

  try {
    const todaySchedule = await getTodaysScheduleWithSigns(userId);
    res.json({
      todaySchedule,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Dashboard fetch failed' });
  }
};

module.exports = { generateWeeklySchedule, getDashboardData };
