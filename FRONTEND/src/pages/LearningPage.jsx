import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedStudyDays] = useState(['Sunday', 'Monday', 'Wednesday', 'Friday','Thursday']);
  const today = new Date();
  const dayName = format(today, 'EEEE');
  const dateString = format(today, 'MMMM do, yyyy');

  const subjectsData = [
    {
      name: 'English Signs',
      path: '/english',
      image: '/assets/english.jpeg',
      gradient: 'from-purple-500 to-indigo-600',
      borderColor: 'border-purple-500',
    },
    {
      name: 'Arabic Signs',
      path: '/arabic',
      image: '/assets/arabic.jpeg',
      gradient: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-500',
    },
    {
      name: 'Math Signs',
      path: '/math',
      image: '/assets/numbers.jpeg',
      gradient: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-500',
    },
  ];
  

  const [studySchedule] = useState({
    Monday: ['English Signs', 'Arabic Signs'],
    Wednesday: ['Math Signs', 'English Signs', 'Arabic Signs'],
    Thursday: ['Math Signs', 'English Signs', 'Arabic Signs'],
    Friday: ['Math Signs', 'English Signs', 'Arabic Signs'],
    Sunday: ['English Signs', 'Math Signs'],
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />

      <div className="flex flex-col lg:flex-row min-h-screen z-10 relative">
        <Sidebar />

        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Let's Begin</h2>

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

          {selectedStudyDays.includes(dayName) ? (
            <motion.div
            className="flex flex-col gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <div className="flex flex-col md:flex-row justify-center gap-12 gap-y-8">
              {subjectsData
                .filter((subject, index) => index < 2 && studySchedule[dayName]?.includes(subject.name))
                .map((subject, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Link
                      to={subject.path}
                      className="block transition duration-300 transform hover:shadow-xl hover:scale-105 rounded-2xl"
                    >
                      <div className={`min-h-[340px] rounded-2xl shadow-md overflow-hidden bg-gradient-to-r ${subject.gradient}`}>
                        <div className={`w-full h-64 bg-white border-8 ${subject.borderColor} rounded-2xl overflow-hidden`}>
                          <img
                            src={subject.image}
                            alt={subject.name}
                            className="w-full h-full object-cover rounded-t-2xl"
                          />
                        </div>
                        <div className="flex justify-center items-center h-[80px]">
                          <h3 className="text-2xl font-bold text-white tracking-wide">
                            {subject.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          
            <div className="flex justify-center">
              {subjectsData
                .filter((subject, index) => index === 2 && studySchedule[dayName]?.includes(subject.name))
                .map((subject, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: (index + 2) * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Link
                      to={subject.path}
                      className="block transition duration-300 transform hover:shadow-xl hover:scale-105 rounded-2xl"
                    >
                      <div className={`min-h-[340px] rounded-2xl shadow-md overflow-hidden bg-gradient-to-r ${subject.gradient}`}>
                        <div className={`w-full h-64 bg-white border-8 ${subject.borderColor} rounded-2xl overflow-hidden`}>
                          <img
                            src={subject.image}
                            alt={subject.name}
                            className="w-full h-full object-cover rounded-t-2xl"
                          />
                        </div>
                        <div className="flex justify-center items-center h-[80px]">
                          <h3 className="text-2xl font-bold text-white tracking-wide">
                            {subject.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </motion.div>
          
          ) : (
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-8 rounded-2xl shadow-md text-center mb-8">
              <p className="text-purple-800 text-xl">Enjoy your rest day! Come back on your next study day.</p>
              <p className="mt-2 text-purple-700">Next study day: {selectedStudyDays[0]}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
