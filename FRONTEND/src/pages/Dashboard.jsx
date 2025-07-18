import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import SubjectSlideshow from '../components/SubjectSlideshow';
import {
  useApiErrorHandler,
  useCheckTokenValid,
} from '../utils/apiErrorHandler';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  FaHands,
  FaFire,
  FaMedal,
  FaChartLine,
  FaQuestionCircle,
  FaArrowRight,
  FaRegCalendarCheck,
  FaInfoCircle,
} from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [lessonsCompleted, setLessonsCompleted] = useState([]);
  const [modulesCompleted, setModulesCompleted] = useState([]);
  const [signsCompleted, setSignsCompleted] = useState([]);
  const [nextStudyDate, setNextStudyDate] = useState([]);
  const [streak, setStreak] = useState({ currentStreak: 0, bestStreak: 0 });
  const [englishModules, setEnglishModules] = useState([]);
  const [arabicModules, setArabicModules] = useState([]);
  const [quizModules, setQuizModules] = useState([]);

  const { handleApiError } = useApiErrorHandler();
  const { checkTokenValid } = useCheckTokenValid();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Check for valid token on mount
  useEffect(() => {
    const isTokenValid = checkTokenValid();
    if (!isTokenValid) return;
  }, []);

  //  Main dashboard data fetch
  useEffect(() => {
    const setupDashboard = async () => {
      const userId = localStorage.getItem('userId');
      try {
        // 1. Fetch study plan to get actual subjects
        const studyPlanResponse = await fetch(
          `http://localhost:5000/api/studyplan/${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const studyPlanData = await studyPlanResponse.json();

        if (!studyPlanResponse.ok) {
          console.error('❌ Failed to fetch study plan');
          return;
        }

        const subjects = Object.keys(studyPlanData.startingLevels); // Only valid subjects
        // 2.----------Check Level for each subject--------------
        for (const subject of subjects) {
          const response = await fetch(
            `http://localhost:5000/api/studyplan/update-level/${userId}/${subject}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const Plandata = await response.json();
          if (!response.ok) {
            console.error(
              `❌ Failed to update level for ${subject}:`,
              Plandata.message
            );
            return;
          }

          console.log(
            `✅ Updated ${subject} level successfully:`,
            Plandata.updatedLevel
          );
        }

        // 2.----------Generate Weekly Schedule--------------
        const weekResponse = await fetch(
          'http://localhost:5000/api/dashboard/generate-weekly',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const weekData = await weekResponse.json();
        if (!weekResponse.ok)
          throw new Error(weekData.message || 'Generation failed');
        console.log('✅ Weekly schedule generated:', weekData);

        const weeklySchedule = weekData.schedule || [];

        // 2. ------------Get next study day from weekly schedule------------
        const getNextStudyDay = (flatSchedule) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const groupedByDate = {};
          for (const lesson of flatSchedule) {
            const lessonDate = new Date(lesson.date);
            lessonDate.setHours(0, 0, 0, 0);
            const key = lessonDate.getTime();
            if (!groupedByDate[key]) groupedByDate[key] = [];
            groupedByDate[key].push(lesson);
          }

          const upcomingDates = Object.keys(groupedByDate)
            .map((time) => new Date(Number(time)))
            .filter((d) => d > today)
            .sort((a, b) => a - b);

          return upcomingDates.length > 0 ? upcomingDates[0] : null;
        };

        const nextStudyDate = getNextStudyDay(weeklySchedule);
        setNextStudyDate(nextStudyDate);
        console.log(
          '📅 Next Study Day:',
          nextStudyDate?.toDateString() || 'None'
        );

        // 3.-----------------Fetch today's schedule-------------
        const todayResponse = await fetch(
          'http://localhost:5000/api/dashboard/today-schedule',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const todayData = await todayResponse.json();
        if (!todayResponse.ok)
          throw new Error(todayData.message || 'Fetch failed');

        const cleanedData = Array.isArray(todayData.todaySchedule)
          ? todayData.todaySchedule
          : [];
        console.log("✅ Today's Schedule Assigned", cleanedData);
        setTodaysSchedule(cleanedData);

        // 4.----------Fetch per-lesson progress--------------
        const progressMap = {};

        for (const lesson of cleanedData) {
          const lessonId = lesson.lessonId;

          const progressResponse = await fetch(
            `http://localhost:5000/api/progress/user/${userId}/lesson/${lessonId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!progressResponse.ok) throw new Error('Progress fetch failed');

          const progressData = await progressResponse.json();
          const watchedSignIds = new Set(
            progressData.map((progress) => progress.signId)
          );
          progressMap[lessonId] = watchedSignIds;
        }

        setProgressData(progressMap);

        // 5.------------Fetch completed lessons and modules per subject-------
        const subjectLevelMap = {};
        cleanedData.forEach((lesson) => {
          if (!subjectLevelMap[lesson.subject]) {
            subjectLevelMap[lesson.subject] = lesson.level;
          }
        });
        const lessonsArray = [];
        const modulesArray = [];

        for (const subject of subjects) {
          const level = subjectLevelMap[subject];
          try {
            const subjectResponse = await fetch(
              `http://localhost:5000/api/progress/subject-progress/${userId}/${subject}?level=${level}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const subjectData = await subjectResponse.json();
            if (!subjectResponse.ok)
              throw new Error('Subject Progress fetch failed');

            lessonsArray.push({
              name: subject,
              completed: subjectData.completedLessons,
              total: subjectData.totalLessons,
            });
            modulesArray.push({
              name: subject,
              completed: subjectData.completedModules,
            });
          } catch (err) {
            handleApiError(err);
          }
        }
        setLessonsCompleted(lessonsArray);

        const totalCompletedModules = modulesArray.reduce(
          (sum, subject) => sum + subject.completed,
          0
        );
        setModulesCompleted(totalCompletedModules);

        // 6.------------------Fetch weekly signs learned---------------
        const signsResponse = await fetch(
          `http://localhost:5000/api/progress/weekly-signs/${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!signsResponse.ok) {
          throw new Error('Failed to fetch weekly signs learned');
        }

        const signsData = await signsResponse.json(); // { signsLearnedThisWeek: number }
        setSignsCompleted(signsData.signsLearnedThisWeek);

        // ✅ 6. Get active streak
        const streakResponse = await fetch(
          `http://localhost:5000/api/progress/streak/${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const streakData = await streakResponse.json();
        if (!streakResponse.ok)
          throw new Error(streakData.message || 'Fetch failed');

        setStreak({
          currentStreak: streakData.currentStreak,
          bestStreak: streakData.bestStreak,
        });

        // ✅ 7. Fetch quiz modules
        const quizResponse = await fetch(
          `http://localhost:5000/api/quiz-modules/info/user/${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const quizData = await quizResponse.json();
        if (!quizResponse.ok)
          throw new Error(quizData.message || 'Failed to fetch modules');

        setEnglishModules(quizData.english);
        setArabicModules(quizData.arabic);

        const availableModules = [
          ...quizData.english,
          ...quizData.arabic,
        ].filter((mod) => mod.status === 'available');
        setQuizModules(availableModules);
      } catch (err) {
        handleApiError(err);
      }
    };

    setupDashboard();
  }, [navigate, token, userId]);

  const handleStartQuiz = (module, subject) => {
    let path = '';

    if (subject.toLowerCase() === 'arabic') {
      path = 'Aquiz';
    } else if (module === 'Module 1- Alphabets') {
      path = 'Equiz';
    } else {
      path = 'Wquiz';
    }

    navigate(`/${path}`, {
      state: {
        subjectName: subject,
        moduleName: module,
      },
    });
  };

  //----------------Group today's schedule by subject--------------
  const groupedBySubject = {};
  todaysSchedule.forEach((item) => {
    const subject = item.subject;
    if (!groupedBySubject[subject]) {
      groupedBySubject[subject] = {
        subject: subject,
        gradient: 'from-indigo-500 to-purple-500', // default or can be made dynamic
        lessons: [],
      };
    }

    const lesson = {
      lessonId: item.lessonId,
      lesson: item.lesson,
      module: item.module,
      signs: item.signs,
      completedSigns: progressData[item.lessonId]?.size || 0,
      totalSigns: item.signs.length,
    };

    groupedBySubject[subject].lessons.push(lesson);
    // console.log(`✅ Lesson Progress: ${lesson.lesson} - Completed: ${lesson.completedSigns}, Total: ${lesson.totalSigns}`);
  });
  const groupedSubjects = Object.values(groupedBySubject);

  //-------------------Date Formatting-------------------
  const today = new Date();
  const dayName = format(today, 'EEEE');
  const dateString = format(today, 'MMMM do, yyyy');

  // Color palette for charts or cards
  const COLORS = ['#8b5cf6', '#10b981', '#f59e0b']; // Purple, Emerald, Amber

  //------------Stats Data-----------
  const stats = [
    {
      icon: <FaHands className="text-2xl" />,
      label: 'Weekly Progress',
      value:
        signsCompleted > 1
          ? `${signsCompleted} signs`
          : signsCompleted === 1
          ? `${signsCompleted} sign`
          : 'Let’s start learning!',
      change: signsCompleted > 0 ? 'Great job this week!' : '',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: <FaFire className="text-2xl" />,
      label: 'Current Streak',
      value:
        streak.currentStreak > 1
          ? `${streak.currentStreak} days 🔥`
          : streak.currentStreak === 1
          ? `${streak.currentStreak} day 🔥`
          : 'Start your streak!',
      change:
        streak.bestStreak > 1
          ? `Personal best: ${streak.bestStreak} days`
          : streak.bestStreak === 1
          ? `Personal best: ${streak.bestStreak} day`
          : '',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: <FaMedal className="text-2xl" />,
      label: 'Modules Completed',
      value: modulesCompleted > 0 ? modulesCompleted : 'Let’s begin! 🚀',
      change: modulesCompleted > 0 ? 'Keep going!' : '',
      color: 'bg-blue-100 text-blue-600',
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />

      <div className="flex flex-col lg:flex-row min-h-screen z-10 relative">
        <Sidebar />

        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700">
              Today's Learning Adventure
            </h2>

            <div className="flex items-center gap-4">
              <div className="bg-white/80 px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                <p className="font-medium text-gray-700">
                  {dayName}, {dateString}
                </p>
              </div>

              {todaysSchedule.length > 0 ? (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Study Day
                </span>
              ) : (
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Rest Day
                </span>
              )}
            </div>
          </div>

          {/* Subjects Grid */}
          {groupedSubjects.length > 0 ? (
            <motion.div
              className={`grid grid-cols-1 ${
                groupedSubjects.length === 2 ? 'md:grid-cols-2' : ''
              } gap-6 mb-8`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {groupedSubjects.map((subjectItem, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SubjectSlideshow
                      subjects={[
                        {
                          name: subjectItem.subject,
                          gradient:
                            subjectItem.subject === 'English'
                              ? 'from-blue-300 to-blue-500'
                              : subjectItem.subject === 'Arabic'
                              ? 'from-green-500 to-emerald-500'
                              : 'from-purple-500 to-pink-500',
                          textColor:
                            subjectItem.subject === 'English'
                              ? 'text-gray-900' // Dark gray for English
                              : subjectItem.subject === 'Arabic'
                              ? 'text-gray-900' // Dark gray for Arabic
                              : 'text-white', // White for other subjects
                          description: '',
                          lessons: subjectItem.lessons.map((lessonItem, i) => {
                            const firstSign = lessonItem.signs[0]?.title || '';
                            const lastSign =
                              lessonItem.signs[lessonItem.signs.length - 1]
                                ?.title || '';

                            return {
                              id: lessonItem.lessonId,
                              title: lessonItem.lesson,
                              subtitle: `${firstSign} - ${lastSign}`,
                              moduleName:
                                lessonItem.module.split('-')[1] ||
                                lessonItem.module,
                              path: `/lesson/${lessonItem.lessonId}`,
                              progress:
                                Math.round(
                                  (lessonItem.completedSigns /
                                    lessonItem.totalSigns) *
                                    100
                                ) || 0,
                            };
                          }),
                        },
                      ]}
                      totalSubjects={groupedSubjects.length}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-8 rounded-2xl shadow-md text-center mb-8">
              <p className="text-purple-800 text-xl">
                Enjoy your rest day! Come back on your next study day.
              </p>
              <p className="mt-2 text-purple-700">
                Next study day:{' '}
                {nextStudyDate
                  ? new Date(nextStudyDate).toDateString()
                  : 'None'}
              </p>
            </div>
          )}

          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-5 rounded-2xl ${stat.color} flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/80">{stat.icon}</div>
                  <div>
                    <p className="text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
                <p className="text-xs font-medium opacity-80">{stat.change}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Quiz Reminder Cards */}
            <div className="w-full px-4 h-full">
              {quizModules?.length > 0 ? (
                <div
                  className={`grid gap-6 ${
                    quizModules.length === 1
                      ? 'grid-cols-1'
                      : 'grid-cols-1 md:grid-cols-2'
                  } h-full`}
                >
                  {quizModules.map((quiz, index) => (
                    <motion.div
                      key={quiz.module}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.15 }}
                      className="relative p-8 rounded-2xl shadow-xl transform hover:scale-[1.015] transition-all duration-300 min-h-[280px] bg-cover bg-center overflow-hidden before:absolute before:inset-0 before:z-0"
                      style={{ backgroundImage: 'url(assets/quiznotif.png)' }}
                    >
                      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                        <h3 className="text-4xl mt-6 font-medium font-['Fredoka'] text-indigo-800 mb-6 tracking-tight">
                          {quiz.subject} Quiz Available!
                        </h3>

                        <div className="rounded-xl p-6 shadow-lg max-w-md mb-6">
                          <p className="text-gray-800 text-xl mb-3">
                            You've unlocked
                          </p>
                          <p className="text-indigo-700 text-xl font-bold mb-4">
                            {quiz.module}
                          </p>
                          <p className="text-gray-700 text-base font-medium">
                            Test your knowledge now!
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            handleStartQuiz(quiz.module, quiz.subject)
                          }
                          className={`mt-3 py-3 px-7 font-['Poppins'] rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-3 ${
                            quiz.subject === 'Arabic'
                              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white'
                          }`}
                        >
                          Start Quiz
                          <FaArrowRight className="text-base" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="relative p-8 rounded-2xl shadow-xl min-h-[380px] bg-cover bg-center overflow-hidden before:absolute before:inset-0 before:z-0"
                  style={{ backgroundImage: 'url(assets/quiznotif.png)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                    <h3 className="text-4xl mt-9 font-medium font-['Fredoka'] text-indigo-800 mb-6 tracking-tight">
                      No Quizzes Available
                    </h3>

                    <div className="rounded-xl p-6 shadow-lg max-w-md mb-6">
                      <p className="text-gray-800 text-xl mt-2 mb-3">
                        You're all caught up!
                      </p>
                      <p className="text-indigo-700 text-xl font-bold mb-4">
                        Great work!
                      </p>
                      <p className="text-gray-700 text-base font-medium">
                        New quizzes will unlock as you complete lessons
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            {/* Learning Progress - Right Side */}
            <div className="bg-gradient-to-r from-lime-100 to-green-200 p-6 rounded-2xl shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-green-800">
                  Learning Progress
                </h3>
                <div className="flex items-center gap-2">
                  <FaChartLine className="text-purple-500" />
                  <span className="text-sm text-gray-600">Forever Update</span>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lessonsCompleted}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f3f4f6"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280' }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.98)',
                        borderColor: '#8b5cf6',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value) => [`${value}%`, 'Completion']}
                      labelStyle={{ color: '#6b7280', fontWeight: 'bold' }}
                    />
                    <Bar
                      dataKey="completed"
                      radius={[6, 6, 0, 0]}
                      animationDuration={1800}
                      barSize={60} // Adjusted for better width
                    >
                      {lessonsCompleted.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center gap-6 mt-4">
                {lessonsCompleted.map((subject, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-600">
                      {subject.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
