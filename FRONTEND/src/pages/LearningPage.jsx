import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useCheckTokenValid } from '../utils/apiErrorHandler';

const LearningPage = () => {
  const navigate = useNavigate();
  const today = new Date();
  const dayName = format(today, 'EEEE');
  const dateString = format(today, 'MMMM do, yyyy');
  const { checkTokenValid } = useCheckTokenValid();

  // Check for valid token on mount
  useEffect(() => {
    const isTokenValid = checkTokenValid();
    if (!isTokenValid) return;
  }, []);

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
  
  const onSelectSubject = (subject) => {
    navigate('/learn/subjects', { state: { subject: subject.name.split(" ")[0] } });
  };
  
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
            </div>
          </div>

          <motion.div
            className="flex flex-col gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <div className="flex flex-wrap justify-center gap-8">
              {subjectsData.map((subject, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => onSelectSubject(subject)}
                    className="cursor-pointer"
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;