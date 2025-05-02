import { startOfWeek, addDays, format } from 'date-fns';
import StudyPlan from '../models/studyplan.model.js';
import SignsData from '../models/signsData.model.js';
import WeeklySchedule from '../models/dashboard.model.js';
import Progress from '../models/progress.model.js';
import { getTodaysScheduleWithSigns } from './schedule.controller.js';

export const generateWeeklySchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    //-------------Scheduling Generation On Monday--------------
    const today = new Date();
    const isMonday = today.getDay() === 5; // 1 = Monday, 5=Friday
    if (!isMonday) {
      return res.status(200).json({ message: 'Schedule already exists'});
    }

    const weekStart = startOfWeek(today, { weekStartsOn: 5 });
    const weekStartDateString = format(weekStart, 'yyyy-MM-dd');

    // Check if schedule already exists for this week
    const existingSchedule = await WeeklySchedule.findOne({ userId, weekStartDate: weekStartDateString });
    if (existingSchedule) {
      return res.status(200).json({
        message: 'Schedule already exists',
        schedule: existingSchedule.schedule
      });
    }

    const studyPlan = await StudyPlan.findOne({ user: userId });
    if (!studyPlan) return res.status(404).json({ message: 'Study plan not found' });

    const rawSignsData = await SignsData.find();

    const watchedProgress = await Progress.find({ userId, status: 'watched' });
    const watchedSignIds = new Set(watchedProgress.map(p => p.signId.toString()));

    const groupedData = {};
    for (const doc of rawSignsData) {
      const { subject, module, lessonNumber } = doc;
      const moduleNumber = parseInt(module.match(/Module (\d+)/)?.[1] || 0);

      if (!groupedData[subject]) groupedData[subject] = [];

      let moduleGroup = groupedData[subject].find(m => m.moduleName === module);
      if (!moduleGroup) {
        moduleGroup = { moduleName: module, moduleNumber, lessons: [] };
        groupedData[subject].push(moduleGroup);
      }

      moduleGroup.lessons.push({
        lessonName: `Lesson ${lessonNumber}`,
        lessonNumber,
        lessonId: doc._id,
        signs: doc.signs
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

      const subjects = Object.keys(studyPlan.startingModules);
      for (const subjectName of subjects) {
        const subjectDays = studyPlan.subjectDays[subjectName] || [];
        if (!subjectDays.includes(dayName.slice(0, 3))) continue; // e.g., "Wed"

        const lessonsPerWeek = studyPlan.weeklyLessons[subjectName];
        const startingModuleName = studyPlan.startingModules[subjectName].name;

        const subjectModules = groupedData[subjectName];
        if (!subjectModules) {
          console.log(`No data for subject: ${subjectName}`);
          continue;
        }

        const startIndex = subjectModules.findIndex(m => m.moduleName === startingModuleName);
        if (startIndex === -1) {
          console.log(`Starting module ${startingModuleName} not found in subject ${subjectName}`);
          continue;
        }

        const lessons = [];
        let lessonsCount = 0;

        for (const module of subjectModules.slice(startIndex)) {
          for (const lesson of module.lessons) {
            const allSignsWatched = lesson.signs.every(sign => watchedSignIds.has(sign._id.toString()));
            if (allSignsWatched) continue;

            lessons.push({
              date: dateString,
              day: dayName,
              subject: subjectName,
              module: module.moduleName,
              lesson: lesson.lessonName,
              lessonId: lesson.lessonId
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


export const getDashboardData = async (req, res) => {
  const userId = req.user.id;

  try {
    const todaySchedule = await getTodaysScheduleWithSigns(userId);
    
    // ... fetch other dashboard data if needed
    //console.log(`todays schedule: ${todaySchedule}`);
    res.json({
      todaySchedule,
      // other data here...
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Dashboard fetch failed' });
  }
};
