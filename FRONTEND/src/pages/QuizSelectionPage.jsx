import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { motion } from 'framer-motion';
import { FaLock, FaCheckCircle, FaPlayCircle } from 'react-icons/fa';
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
        const res = await fetch(`http://localhost:5000/api/quiz-modules/info/user/${userId}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch modules');
        //extract module number (assumes "Module X" format)
        const extractModuleNumber = (moduleName) => {
          const match = moduleName.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };

        // Sort english modules by module number ascending
        const sortedEnglish = data.english.sort((a, b) => {
          return extractModuleNumber(a.module) - extractModuleNumber(b.module);
        });

        // Sort arabic modules similarly
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

  const renderQuizCards = (modules) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {modules.map(({ path, module, subject, status, totalScore }) => (
        <motion.div
          key={module}
          className={`rounded-2xl p-6 border-4 shadow-md transition-all duration-200 ${
            status === 'locked'
              ? 'border-gray-300 bg-gray-100'
              : status === 'completed'
              ? 'border-green-400 bg-green-50'
              : 'border-yellow-400 bg-yellow-50'
          }`}
          whileHover={{ scale: status !== 'locked' ? 1.03 : 1 }}
        >
          <h3 className="text-2xl font-bold text-purple-700 mb-2">{module}</h3>
           <p className="text-sm text-gray-600 mb-4">
            {status === 'completed'
              ? `Score: ${totalScore}%`
              : status === 'available'
              ? 'Ready to start! 💪'
              : 'Complete module to unlock 🔒'}
          </p>
          {status === 'locked' && (
            <span className="flex items-center text-gray-500">
              <FaLock className="mr-2" size={18} />
              Locked 
            </span>
          )}

          {status === 'completed' && (
            <div className="flex items-center justify-between">
              <span className="flex items-center text-green-600 font-semibold">
                <FaCheckCircle className="mr-2" size={18} />
                Completed
              </span>
              <button
                onClick={() => handleStartQuiz(module, subject)}
                className="text-sm font-semibold text-blue-600 underline hover:text-blue-800"
              >
                Retry
              </button>
            </div>
          )}

          {status === 'available' && (
            <button
              onClick={() => handleStartQuiz(module, subject)}              
              className="mt-2 flex items-center bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow"
            >
              <FaPlayCircle className="mr-2" size={18} />
              Start Quiz
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 overflow-hidden">
      <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />

      <div className="flex flex-col lg:flex-row min-h-screen z-10 relative">
        <Sidebar />

        <div className="flex-1 pt-4 px-4 md:pt-4 md:px-6 lg:pt-5 lg:px-12 flex flex-col items-center gap-12">
          <div className="text-4xl font-extrabold text-pink-700 drop-shadow-md text-center">
            🧠 Choose a Quiz to Begin!
          </div>

          {/* English Quizzes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-8 border-pink-300 w-full max-w-[80rem] flex flex-col gap-6"
          >
            <h2 className="text-3xl font-bold text-purple-600 text-center">📘 English Quizzes</h2>
            {renderQuizCards(englishModules)}
          </motion.div>

          {/* Arabic Quizzes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-8 border-purple-300 w-full max-w-[80rem] flex flex-col gap-6"
          >
            <h2 className="text-3xl font-bold text-green-700 text-center">📗 Arabic Quizzes</h2>
            {renderQuizCards(arabicModules)}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default QuizSelectionPage;
