import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import SubjectSlideshow from '../components/SubjectSlideshow';
import {  useApiErrorHandler, useCheckTokenValid } from '../utils/apiErrorHandler';
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
import { FaHands, FaFire, FaMedal, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [lessonsCompleted, setLessonsCompleted] = useState([]);
  const [modulesCompleted, setModulesCompleted] = useState([]);
  const [signsCompleted, setSignsCompleted] = useState([]);
  const [nextStudyDate, setNextStudyDate] = useState([]);
  const [streak, setStreak] = useState({ currentStreak: 0, bestStreak: 0 });

  const { handleApiError } = useApiErrorHandler();
  const { checkTokenValid } = useCheckTokenValid();
  const token = localStorage.getItem("token");

  // Check for valid token on mount
  useEffect(() => {
    const isTokenValid = checkTokenValid();
    if (!isTokenValid) return;
  }, []);

  //  Main dashboard data fetch
  useEffect(() => {
    const setupDashboard = async () => {
      try {
        // 1.----------Generate Weekly Schedule--------------
        const weekResponse = await fetch('http://localhost:5000/api/dashboard/generate-weekly', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const weekData = await weekResponse.json();
        if (!weekResponse.ok) throw new Error(weekData.message || 'Generation failed');
        console.log("✅ Weekly schedule generated:", weekData);

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
            .map(time => new Date(Number(time)))
            .filter(d => d > today)
            .sort((a, b) => a - b);

          return upcomingDates.length > 0 ? upcomingDates[0] : null;
        };

        const nextStudyDate = getNextStudyDay(weeklySchedule);
        setNextStudyDate(nextStudyDate);
        console.log("📅 Next Study Day:", nextStudyDate?.toDateString() || "None");

        // 3.-----------------Fetch today's schedule-------------
        const todayResponse = await fetch('http://localhost:5000/api/dashboard/today-schedule', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const todayData = await todayResponse.json();
        if (!todayResponse.ok) throw new Error(todayData.message || 'Fetch failed');

        const cleanedData = Array.isArray(todayData.todaySchedule) ? todayData.todaySchedule : [];
        console.log("✅ Today's Schedule Assigned", cleanedData);
        setTodaysSchedule(cleanedData);

        // 4.----------Fetch per-lesson progress--------------
        const progressMap = {};
        const userId = localStorage.getItem("userId");

        for (const lesson of cleanedData) {
          const lessonId = lesson.lessonId;

          const progressResponse = await fetch(`http://localhost:5000/api/progress/user/${userId}/lesson/${lessonId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!progressResponse.ok) throw new Error('Progress fetch failed');

          const progressData = await progressResponse.json();
          const watchedSignIds = new Set(progressData.map(progress => progress.signId));
          progressMap[lessonId] = watchedSignIds;
        }

        setProgressData(progressMap);

        // 5.------------Fetch completed lessons and modules per subject-------
        const subjects = ['English', 'Arabic', 'Math'];
        const lessonsArray = [];
        const modulesArray = [];

        for (const subject of subjects) {
          try {
            const subjectResponse = await fetch(`http://localhost:5000/api/progress/subject-progress/${userId}/${subject}`,{
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });
    
            const subjectData = await subjectResponse.json();
            if (!subjectResponse.ok) throw new Error('Subject Progress fetch failed');

            lessonsArray.push({
              name: subject,
              completed: subjectData.completedLessons,
              total: subjectData.totalLessons
            });
            modulesArray.push({
              name: subject,
              completed: subjectData.completedModules,
            });

          } catch (err) {
            console.error(`❌ Failed to fetch subject progress for ${subject}`, err);
          }
        }

        setLessonsCompleted(lessonsArray);

        const totalCompletedModules = modulesArray.reduce(
          (sum, subject) => sum + subject.completed, 0);
        setModulesCompleted(totalCompletedModules);

        // 6.------------------Fetch weekly signs learned---------------
        const signsResponse = await fetch(`http://localhost:5000/api/progress/weekly-signs/${userId}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!signsResponse.ok){
           throw new Error('Failed to fetch weekly signs learned');}

        const signsData = await signsResponse.json(); // { signsLearnedThisWeek: number }
        setSignsCompleted(signsData.signsLearnedThisWeek);

        // ✅ 6. Get active streak
        const streakResponse = await fetch(`http://localhost:5000/api/progress/streak/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const streakData = await streakResponse.json();
        if (!streakResponse.ok) throw new Error(streakData.message || 'Fetch failed');

        setStreak({
          currentStreak: streakData.currentStreak,
          bestStreak: streakData.bestStreak,
        });

      } catch (err) {
        handleApiError(err);
      }
    };

    setupDashboard();
  }, [navigate]);

  //----------------Group today's schedule by subject--------------
  const groupedBySubject = {};
  todaysSchedule.forEach((item) => {
    const subject = item.subject;
    if (!groupedBySubject[subject]) {
      groupedBySubject[subject] = {
        subject: subject,
        gradient: "from-indigo-500 to-purple-500", // default or can be made dynamic
        lessons: [],
      };
    }

    const lesson = {
      lessonId: item.lessonId,
      lesson: item.lesson,
      module: item.module,
      signs: item.signs,
      completedSigns: progressData[item.lessonId]?.size || 0,
      totalSigns: item.signs.length
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
      label: "Weekly Progress",
      value: signsCompleted > 0 ? `${signsCompleted} signs` : 'Let’s start learning!',
      change: signsCompleted > 0 ? 'Great job this week!' : '',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: <FaFire className="text-2xl" />,
      label: 'Current Streak',
      value: streak.currentStreak > 0 ? `${streak.currentStreak} days 🔥` : 'Start your streak!',
      change: streak.bestStreak > 0 ? `Personal best: ${streak.bestStreak} days` : '',
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
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
                          subjectItem.subject === "English"
                            ? "from-blue-500 to-indigo-500"
                            : subjectItem.subject === "Arabic"
                            ? "from-green-500 to-emerald-500"
                            : "from-purple-500 to-pink-500",
                          description: "",

                          lessons: subjectItem.lessons.map((lessonItem, i) => {
                            const firstSign = lessonItem.signs[0]?.title || "";
                            const lastSign = lessonItem.signs[lessonItem.signs.length - 1]?.title || "";

                            return {
                              id: lessonItem.lessonId,
                              title: lessonItem.lesson,
                              subtitle: `${firstSign} - ${lastSign}`,
                              moduleName: lessonItem.module.split("-")[1] || lessonItem.module,
                              path: `/lesson/${lessonItem.lessonId}`,
                              progress: Math.round((lessonItem.completedSigns / lessonItem.totalSigns) * 100) || 0
                            };
                          }),
                        },
                      ]}
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
              Next study day: {nextStudyDate ? new Date(nextStudyDate).toDateString() : "None"}
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
            {/* Future Scope Placeholder - Left Side */}
            <div className="bg-amber-200 p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Future Scope
                </h3>
                <p className="text-gray-600">
                  Coming soon with exciting new features!
                </p>
              </div>
            </div>

            {/* Learning Progress - Right Side */}
            <div className="bg-red-100 p-6 rounded-2xl shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
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
