import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedStudyDays] = useState(['Sunday', 'Monday', 'Wednesday', 'Friday', 'Thursday','Saturday']);
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
      name: 'Emergency Signs',
      path: '/emergency',
      image: '/assets/life.jpeg',
      gradient: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-500',
    },
    {
      name: 'Awareness Signs',
      path: '/awareness',
      image: '/assets/mental.jpeg',
      gradient: 'from-pink-500 to-red-600',
      borderColor: 'border-pink-500',
    },
  ];

  const [studySchedule] = useState({
    Monday: ['English Signs', 'Arabic Signs'],
    Wednesday: ['Life Skill Signs', 'English Signs', 'Arabic Signs'],
    Thursday: ['Life Skill Signs', 'English Signs', 'Arabic Signs'],
    Friday: ['Emergency Signs', 'English Signs', 'Arabic Signs','Awareness Signs'],
    Saturday: ['Emergency Signs', 'English Signs', 'Arabic Signs','Awareness Signs'],
    Sunday: ['English Signs', 'Life Skill Signs'],
  });

  return (
    <div
      style={{
        background: 'linear-gradient(-180deg, rgba(255, 229, 202, 0.9), rgba(255, 206, 250, 0.9))',
        color: '#333',
      }}
      className="relative min-h-screen overflow-hidden"
    >
      <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />

      <div className="flex flex-col lg:flex-row min-h-screen z-10 relative">
        <Sidebar />

        <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-center items-center mb-20 gap-4">
  <h2 className="text-4xl md:text-5xl font-bold text-purple-700 text-center">Get Ready to Explore!</h2>
</div>


          {selectedStudyDays.includes(dayName) ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16 mb-8 mx-auto max-w-5xl"  // Changed gap-x-4 to gap-x-12 and max-w-4xl to max-w-5xl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {subjectsData
                .filter(subject => studySchedule[dayName]?.includes(subject.name))
                .map((subject, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    className="flex justify-center"
                  >
                    <Link
                      to={subject.path}
                      className="block transition duration-300 transform hover:shadow-xl hover:scale-105 rounded-2xl w-full max-w-md"  // Added w-full max-w-md
                    >
                      <div
                        className={`min-h-[320px] rounded-2xl shadow-md overflow-hidden bg-gradient-to-r ${subject.gradient}`}
                      >
                        <div
                          className={`w-full h-60 bg-white border-8 ${subject.borderColor} rounded-2xl overflow-hidden`}
                        >
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