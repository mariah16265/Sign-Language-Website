import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import {
  useApiErrorHandler,
  useCheckTokenValid,
} from '../utils/apiErrorHandler';
import { useNavigate } from 'react-router-dom';
import {
  FaBook,
  FaLanguage,
  FaCalendarAlt,
  FaLock,
  FaRocket,
} from 'react-icons/fa';

const StudyPlanPage = () => {
  const [studyPlan, setStudyPlan] = useState({
    startingLevels: { English: '', Arabic: '' },
    weeklyLessons: { English: 0, Arabic: 0 },
    subjectDays: { English: [], Arabic: [] },
  });

  const navigate = useNavigate();
  const { handleApiError } = useApiErrorHandler();
  const { checkTokenValid } = useCheckTokenValid();
  const token = localStorage.getItem('token');
  const isNewUser = localStorage.getItem('isNewUser');

  useEffect(() => {
    if (isNewUser === 'false') {
      navigate('/dashboard');
    }
  }, [isNewUser, navigate]);

  useEffect(() => {
    const isTokenValid = checkTokenValid();
    if (!isTokenValid) {
      navigate('/login');
    }
  }, [checkTokenValid, navigate]);

  const handleStudyPlan = async () => {
    try {
      const payload = {
        startingLevels: Object.fromEntries(
          Object.entries(studyPlan.startingLevels).filter(([_, v]) => v !== '')
        ),
        weeklyLessons: Object.fromEntries(
          Object.entries(studyPlan.weeklyLessons).filter(([_, v]) => v > 0)
        ),
        subjectDays: Object.fromEntries(
          Object.entries(studyPlan.subjectDays).filter(
            ([k]) =>
              studyPlan.startingLevels[k] && studyPlan.weeklyLessons[k] > 0
          )
        ),
      };

      const response = await fetch('http://localhost:5000/api/studyplan/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save study plan');
      }

      localStorage.setItem('isNewUser', 'false');
      navigate('/dashboard');
    } catch (error) {
      handleApiError(error);
    }
  };

  const subjects = [
    {
      id: 'English',
      name: 'English Sign Language',
      icon: FaBook,
      levels: [
        {
          id: 'beginner',
          name: 'Little Explorer',
          description: 'Start with basic signs and greetings',
          icon: '🐥',
        },
        {
          id: 'intermediate',
          name: 'Word Builder',
          description: 'Expand your sign vocabulary',
          icon: '🏗️',
        },
        {
          id: 'advanced',
          name: 'Story Master',
          description: 'Learn phrases, conversations & stories',
          icon: '📖',
        },
      ],
    },
    {
      id: 'Arabic',
      name: 'Arabic Sign Language',
      icon: FaLanguage,
      levels: [
        {
          id: 'beginner',
          name: 'Mubtadi مبتدئ',
          description: 'تعلم الإشارات الأساسية',
          icon: '🌱',
        },
        {
          id: 'intermediate',
          name: 'Mutawassit متوسط',
          description: 'التوسع في المفردات',
          icon: '🚀',
        },
        {
          id: 'advanced',
          name: 'Coming Soon',
          description: 'Advanced lessons arriving soon!',
          icon: '🔒',
          disabled: true,
        },
      ],
    },
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Updated validation logic
  const selectedSubjects = Object.entries(studyPlan.startingLevels)
    .filter(([_, level]) => level !== '')
    .map(([subject]) => subject);

  const isValid =
    selectedSubjects.length > 0 &&
    selectedSubjects.every(
      (subject) =>
        studyPlan.weeklyLessons[subject] > 0 &&
        studyPlan.subjectDays[subject].length > 0
    );

  // Darker color configuration
  const colorSchemes = {
    English: {
      bg: 'bg-blue-100',
      button: 'bg-blue-600',
      gradient: 'from-blue-600 to-blue-700',
      secondaryBg: 'bg-indigo-100',
      secondaryButton: 'bg-indigo-600',
      text: 'text-blue-800',
      border: 'border-blue-300',
    },
    Arabic: {
      bg: 'bg-orange-100',
      button: 'bg-orange-600',
      gradient: 'from-orange-600 to-amber-700',
      secondaryBg: 'bg-amber-100',
      secondaryButton: 'bg-amber-600',
      text: 'text-orange-800',
      border: 'border-orange-300',
    },
  };

  return (
    <div
      className="min-h-screen bg-cover bg-fixed bg-center relative"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/studybg.webp)`,
      }}
    >
      {/* Ultra subtle overlay with slight blur */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>{' '}
      <div className="relative z-10">
        <Navbar />
        <div className="max-w-[85rem] mx-auto px-6 py-6 flex flex-col min-h-[calc(100vh-100px)]">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-[3rem] font-bold text-gray-800 ">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Create Your Learning Path
              </span>
            </h1>
            <p className="text-lg text-gray-600 ">
              Let's build your personalized sign language journey
            </p>
          </motion.div>

          <div className="flex flex-col mt-4 lg:flex-row gap-4 flex-1 h-[calc(100vh-180px)] overflow-hidden">
            {/* Level Selection - Centered */}
            <div className="lg:w-[55%] bg-white rounded-xl p-4 shadow-lg border border-gray-100 overflow-hidden flex flex-col">
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4 ">
                  {' '}
                  {/* Centered header */}
                  <motion.div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    <span className="text-lg">1</span>
                  </motion.div>
                  <h2 className="text-xl font-semibold">
                    Select Starting Level
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  {' '}
                  {/* Increased gap */}
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className={`p-4 rounded-lg ${
                        colorSchemes[subject.id].bg
                      } flex flex-col h-full`}
                    >
                      {/* Centered subject heading */}
                      <div className="flex items-center gap-2 mb-4 ">
                        {' '}
                        {/* Centered and increased mb */}
                        <subject.icon
                          className={`text-xl ${colorSchemes[subject.id].text}`}
                        />
                        <h3
                          className={`text-lg font-semibold ${
                            colorSchemes[subject.id].text
                          }`}
                        >
                          {subject.name}
                        </h3>
                      </div>

                      <div className="space-y-3 flex-1 flex flex-col justify-between">
                        {' '}
                        {/* Increased spacing */}
                        {subject.levels.map((level) => (
                          <motion.div
                            key={level.id}
                            className={`p-3 rounded-lg flex items-start gap-3 text-base cursor-pointer transition-colors
                  min-h-[80px] /* Added minimum height */
                  ${
                    studyPlan.startingLevels[subject.id] === level.id
                      ? `bg-white shadow-lg ${
                          colorSchemes[subject.id].border
                        } border-2`
                      : 'bg-transparent hover:bg-white/50'
                  }
                  ${level.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={
                              !level.disabled
                                ? () =>
                                    setStudyPlan((prev) => ({
                                      ...prev,
                                      startingLevels: {
                                        ...prev.startingLevels,
                                        [subject.id]: level.id,
                                      },
                                    }))
                                : undefined
                            }
                          >
                            <span className="text-3xl">{level.icon}</span>{' '}
                            {/* Increased icon size */}
                            <div className="flex-1">
                              <h4
                                className={`font-semibold text-lg ${
                                  colorSchemes[subject.id].text
                                }`}
                              >
                                {level.name}
                              </h4>
                              <p className="text-gray-600 text-base mt-1">
                                {' '}
                                {/* Increased text size */}
                                {level.description}
                              </p>
                            </div>
                            {level.disabled && (
                              <FaLock className="ml-auto text-gray-400 text-xl mt-1" />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly Lessons & Study Days */}
            <div className="lg:w-[45%] flex flex-col gap-4 flex-1">
              {/* Weekly Lessons - Centered */}
              <div className="bg-white  rounded-xl p-4 shadow-lg border border-gray-100 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                    <span className="text-lg">2</span>
                  </motion.div>
                  <h2 className="text-lg font-semibold">Weekly Lessons</h2>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className={`p-4 rounded-lg ${
                          colorSchemes[subject.id].bg
                        } flex flex-col justify-between`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <subject.icon
                            className={`text-lg ${
                              colorSchemes[subject.id].text
                            }`}
                          />
                          <h3
                            className={`text-md font-medium ${
                              colorSchemes[subject.id].text
                            }`}
                          >
                            {subject.name}
                          </h3>
                        </div>

                        <div className="flex justify-between gap-2 px-2 items-center h-full">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <motion.button
                              key={num}
                              onClick={() =>
                                setStudyPlan((prev) => ({
                                  ...prev,
                                  weeklyLessons: {
                                    ...prev.weeklyLessons,
                                    [subject.id]: num,
                                  },
                                }))
                              }
                              className={`flex-1 h-10 rounded-lg text-base font-medium flex items-center justify-center
                              ${
                                studyPlan.weeklyLessons[subject.id] === num
                                  ? `${
                                      colorSchemes[subject.id].button
                                    } text-white`
                                  : 'bg-white text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {num}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Study Days - Centered */}
              <div className="bg-white  rounded-xl p-4 shadow-lg border border-gray-100 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                    <span className="text-lg">3</span>
                  </motion.div>
                  <h2 className="text-lg font-semibold">Study Days</h2>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className={`p-4 rounded-lg ${
                          colorSchemes[subject.id].secondaryBg
                        } flex flex-col justify-between`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <FaCalendarAlt
                            className={`text-lg ${
                              colorSchemes[subject.id].text
                            }`}
                          />
                          <h3
                            className={`text-md font-medium ${
                              colorSchemes[subject.id].text
                            }`}
                          >
                            {subject.name}
                          </h3>
                        </div>

                        <div className="flex flex-wrap gap-1.5 items-center justify-center">
                          {daysOfWeek.map((day) => (
                            <motion.button
                              key={day}
                              whileHover={{ scale: 1.05 }}
                              onClick={() =>
                                setStudyPlan((prev) => {
                                  const currentDays =
                                    prev.subjectDays[subject.id];
                                  return {
                                    ...prev,
                                    subjectDays: {
                                      ...prev.subjectDays,
                                      [subject.id]: currentDays.includes(day)
                                        ? currentDays.filter((d) => d !== day)
                                        : [...currentDays, day],
                                    },
                                  };
                                })
                              }
                              className={`min-w-[70px] p-2 rounded-lg text-sm font-medium flex items-center justify-center
                              ${
                                studyPlan.subjectDays[subject.id].includes(day)
                                  ? `${
                                      colorSchemes[subject.id].secondaryButton
                                    } text-white`
                                  : 'bg-white text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {day}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <motion.button
              className={`px-8 py-3 rounded-lg text-lg font-semibold ${
                isValid
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              whileHover={isValid ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
              onClick={handleStudyPlan}
              disabled={!isValid}
            >
              Start Learning Journey
              <FaRocket className="inline-block ml-2 text-yellow-300" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanPage;
