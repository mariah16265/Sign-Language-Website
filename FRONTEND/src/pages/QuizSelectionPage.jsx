import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaPlayCircle, FaBook, FaStar } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const QuizSelectionPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const [englishModules, setEnglishModules] = useState([]);
  const [arabicModules, setArabicModules] = useState([]);

  useEffect(() => {
    const fetchQuizModules = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/quiz-modules/info/user/${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch modules');

        const extractModuleNumber = (moduleName) => {
          const match = moduleName.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };

        const sortedEnglish = data.english.sort((a, b) => {
          return extractModuleNumber(a.module) - extractModuleNumber(b.module);
        });

        const sortedArabic = data.arabic.sort((a, b) => {
          return extractModuleNumber(a.module) - extractModuleNumber(b.module);
        });

        setEnglishModules(sortedEnglish);
        setArabicModules(sortedArabic);
      } catch (err) {
        console.error('Quiz modules fetch error:', err.message);
      }
    };

    fetchQuizModules();
  }, [token, userId]);

  const handleStartQuiz = (module, subject) => {
    let path = '';

    if (subject.toLowerCase() === 'arabic') {
      path = 'Aquiz';
    } else if (module === 'Module 1- Alphabets') {
      path = 'Equiz';
    } else {
      path = 'Wquiz';
    }

    navigate(`/${path}`);
  };

  const renderQuizCards = (modules, subject) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map(({ path, module, status, totalScore }) => (
        <motion.div
          key={module}
          className={`rounded-xl p-5 transition-all duration-200 flex flex-col h-full w-full max-w-xs mx-auto
            ${
              status === 'locked'
                ? 'bg-gradient-to-br from-yellow-50 via-amber-100 to-orange-100 border border-orange-300'
                : status === 'completed'
                ? 'bg-gradient-to-br from-orange-100 via-amber-300 to-yellow-200 border border-amber-300'
                : 'bg-gradient-to-br from-cyan-100 via-blue-200 to-indigo-200 border border-blue-300'
            } shadow-lg hover:shadow-xl relative overflow-hidden`}
          whileHover={{ y: status !== 'locked' ? -5 : 0 }}
        >
          {/* Card Header with Icon */}
          <div className="flex items-start mb-3">
            <div
              className={`text-lg p-2 rounded-lg mr-3
              ${
                status === 'locked'
                  ? 'bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 text-amber-800'
                  : status === 'completed'
                  ? 'bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200 text-amber-800'
                  : 'bg-gradient-to-br from-blue-100 to-cyan-100 border border-blue-200 text-blue-800'
              }`}
            >
              {subject === 'english' ? <FaBook /> : <FaStar />}
            </div>
            <h3
              className={`text-lg font-bold flex-1 ${
                status === 'locked'
                  ? 'text-amber-800'
                  : status === 'completed'
                  ? 'text-amber-800'
                  : 'text-blue-800'
              }`}
            >
              {module}
            </h3>
          </div>

          {/* Card Body */}
          <div className="flex-grow flex flex-col justify-center mb-4">
            {status === 'completed' ? (
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {totalScore}%
                </div>
                <div className="text-sm font-medium text-amber-700 px-1">
                  Challenge Completed!
                </div>
              </div>
            ) : (
              <p
                className={`text-sm font-medium px-1 ${
                  status === 'available' ? 'text-blue-700' : 'text-amber-700'
                }`}
              >
                {status === 'available'
                  ? 'Ready to start your learning adventure!'
                  : 'Complete lessons to unlock this challenge'}
              </p>
            )}
          </div>

          {/* Card Footer */}
          <div className="mt-auto">
            {status === 'completed' && (
              <button
                onClick={() => handleStartQuiz(module, subject)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-amber-50 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center shadow-md"
              >
                <FaPlayCircle className="mr-2" />
                Play Again
              </button>
            )}

            {status === 'available' && (
              <button
                onClick={() => handleStartQuiz(module, subject)}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-blue-50 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center shadow-md"
              >
                <FaPlayCircle className="mr-2" />
                Start Challenge
              </button>
            )}

            {status === 'locked' && (
              <button
                className="w-full bg-gradient-to-r from-amber-200 to-orange-300 text-amber-700 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center shadow-sm cursor-not-allowed"
                disabled
              >
                <FaLock className="mr-2" />
                Locked
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('/assets/quizselect.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 backdrop-blur-[5px] z-0" />

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />
      </div>

      <div className="flex pt-16">
        {/* Fixed Sidebar */}
        <div className="flex flex-col lg:flex-row min-h-screen z-10 relative">
          <Sidebar />
          <div className="flex-1 pt-4 px-4 md:pt-4 md:px-6 lg:pt-5 lg:px-8 flex flex-col items-center gap-6 ml-28">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4"
            >
              <h1 className="inline-block bg-white/80 px-4 py-2 rounded-lg shadow-sm text-4xl mt-5 md:text-5xl font-bold text-gray-800 font-display">
                <span className="text-blue-600">Ready,</span>{' '}
                <span className="text-purple-600">Set,</span>{' '}
                <span className="text-orange-500">Quiz!</span>
              </h1>
            </motion.div>

            {/* English Quizzes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/90 rounded-2xl px-7 py-9 md:px-9 w-full max-w-5xl border border-gray-200 shadow-md backdrop-blur-sm"
            >
              <div className="flex items-center mb-5">
                <div className="text-2xl mr-3 -mt-2 text-blue-500">🔤</div>
                <h2 className="text-2xl mb-2 font-bold text-blue-800">
                  English Quests
                </h2>
                <div className="ml-auto bg-blue-100 text-blue-800 px-5 py-2 rounded-full font-medium text-sm border border-blue-200">
                  {englishModules.filter((m) => m.status !== 'locked').length}/
                  {englishModules.length} Completed
                </div>
              </div>
              {renderQuizCards(englishModules, 'english')}
            </motion.div>

            {/* Arabic Quizzes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white/90 rounded-2xl px-7 py-9 md:px-9 w-full max-w-5xl border border-gray-200 shadow-md mb-8 backdrop-blur-sm"
            >
              <div className="flex items-center mb-5">
                <div className="text-2xl mr-3 -mt-2 text-amber-500">🌙</div>
                <h2 className="text-2xl font-bold mb-2 text-amber-800">
                  Arabic Adventures
                </h2>
                <div className="ml-auto bg-amber-100 text-amber-800 px-5 py-2  rounded-full font-medium text-sm border border-amber-200">
                  {arabicModules.filter((m) => m.status !== 'locked').length}/
                  {arabicModules.length} Completed
                </div>
              </div>
              {renderQuizCards(arabicModules, 'arabic')}
            </motion.div>
          </div>
        </div>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@700&display=swap');

          /* Main heading font */
          .font-display {
            font-family: 'Fredoka', sans-serif;
          }
        `}</style>
      </div>
    </div>
  );
};

export default QuizSelectionPage;
