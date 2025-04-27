import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import SubjectSlideshow from '../components/SubjectSlideshow';
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
  const [selectedStudyDays] = useState([
    'Sunday',
    'Monday',
    'Wednesday',
    'Friday',
  ]);
  const today = new Date();
  const dayName = format(today, 'EEEE');
  const dateString = format(today, 'MMMM do, yyyy');

  // Subjects data
  const subjectsData = [
    {
      name: 'English Signs',
      description: 'Learn basic English words in sign language',
      gradient: 'from-purple-500 to-indigo-600',
      modules: [
        {
          id: 1,
          title: 'Alphabet',
          subtitle: 'A-Z signs',
          emoji: '🔤',
          path: '/english/1',
          progress: 65,
        },
        {
          id: 2,
          title: 'Greetings',
          subtitle: 'Hello, Thank you',
          emoji: '👋',
          path: '/english/2',
          progress: 40,
        },
        {
          id: 3,
          title: 'Greetings',
          subtitle: 'Hello, Thank you',
          emoji: '👋',
          path: '/english/2',
          progress: 40,
        },
      ],
    },
    {
      name: 'Arabic Signs',
      description: 'Essential Arabic words in sign language',
      gradient: 'from-emerald-500 to-teal-600',
      modules: [
        {
          id: 1,
          title: 'Colors',
          subtitle: 'Red, Blue, Green',
          emoji: '🎨',
          path: '/arabic/1',
          progress: 30,
        },
      ],
    },
    {
      name: 'Math Signs',
      description: 'Numbers and basic math concepts',
      gradient: 'from-amber-500 to-orange-600',
      modules: [
        {
          id: 1,
          title: 'Numbers',
          subtitle: '1-20 signs',
          emoji: '🔢',
          path: '/math/1',
          progress: 80,
        },
        {
          id: 2,
          title: 'Shapes',
          subtitle: 'Circle, Square',
          emoji: '⭐',
          path: '/math/2',
          progress: 50,
        },
      ],
    },
  ];
  const [studySchedule] = useState({
    Monday: ['English Signs', 'Arabic Signs'],
    Wednesday: ['Math Signs', 'English Signs'],
    Friday: ['Arabic Signs', 'Math Signs'],
    Sunday: ['English Signs', 'Math Signs'],
  });
  const [progressData] = useState([
    { name: 'English', score: 65 },
    { name: 'Arabic', score: 40 },
    { name: 'Math', score: 80 },
  ]);

  const COLORS = ['#8b5cf6', '#10b981', '#f59e0b']; // Purple, Emerald, Amber

  const [stats] = useState(() => {
    const todaySubjects = studySchedule[dayName] || [];
    const signsLearned = todaySubjects.includes('English Signs')
      ? 25
      : todaySubjects.includes('Arabic Signs')
      ? 15
      : 0;

    return [
      {
        icon: <FaHands className="text-2xl" />,
        label: 'Signs Mastered',
        value: 42,
        change: '+5 this week',
        color: 'bg-purple-100 text-purple-600',
      },
      {
        icon: <FaFire className="text-2xl" />,
        label: 'Current Streak',
        value: '5 days 🔥',
        change: 'Personal best: 12 days',
        color: 'bg-orange-100 text-orange-600',
      },
      {
        icon: <FaMedal className="text-2xl" />,
        label: 'Achievements',
        value: '3/10',
        change: 'Earned 1 new badge',
        color: 'bg-blue-100 text-blue-600',
      },
    ];
  });

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

              {selectedStudyDays.includes(dayName) ? (
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
          {selectedStudyDays.includes(dayName) ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {subjectsData
                .filter((subject) =>
                  studySchedule[dayName]?.includes(subject.name)
                )
                .map((subject, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SubjectSlideshow subjects={[subject]} />
                  </motion.div>
                ))}
            </motion.div>
          ) : (
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-8 rounded-2xl shadow-md text-center mb-8">
              <p className="text-purple-800 text-xl">
                Enjoy your rest day! Come back on your next study day.
              </p>
              <p className="mt-2 text-purple-700">
                Next study day: {selectedStudyDays[0]}
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
                  <span className="text-sm text-gray-600">Weekly Update</span>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
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
                      dataKey="score"
                      radius={[6, 6, 0, 0]}
                      animationDuration={1800}
                      barSize={60} // Adjusted for better width
                    >
                      {progressData.map((entry, index) => (
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
                {progressData.map((subject, index) => (
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
