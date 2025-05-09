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
    weeklyLessons: { English: 2, Arabic: 2 },
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
      return;
    }
  });

  const handleStudyPlan = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/studyplan/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startingLevels: studyPlan.startingLevels,
          weeklyLessons: studyPlan.weeklyLessons,
          subjectDays: studyPlan.subjectDays,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save the study plan');
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
      color: 'bg-blue-100',
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
      color: 'bg-emerald-100',
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

  const selectLevel = (subjectId, levelId) => {
    setStudyPlan((prev) => ({
      ...prev,
      startingLevels: {
        ...prev.startingLevels,
        [subjectId]: levelId,
      },
    }));
  };

  const updateWeeklyLessons = (subjectId, count) => {
    setStudyPlan((prev) => ({
      ...prev,
      weeklyLessons: { ...prev.weeklyLessons, [subjectId]: count },
    }));
  };

  const toggleSubjectDay = (subjectId, day) => {
    setStudyPlan((prev) => {
      const currentDays = prev.subjectDays[subjectId];
      const newDays = currentDays.includes(day)
        ? currentDays.filter((d) => d !== day)
        : [...currentDays, day];
      return {
        ...prev,
        subjectDays: { ...prev.subjectDays, [subjectId]: newDays },
      };
    });
  };

  const allLevelsSelected = subjects.every(
    (subject) => studyPlan.startingLevels[subject.id]
  );

  const allSubjectsHaveDays = Object.values(studyPlan.subjectDays).every(
    (d) => d.length > 0
  );
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          className="text-center mb-8" // Reduced from mb-12
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Create Your Learning Path
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Let's build your personalized sign language journey
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Level Selection */}
          {/* Level Selection - Fully Centered Content */}
          <div className="lg:w-[59%] bg-white rounded-xl p-6 shadow-lg border border-gray-100 flex flex-col justify-center">
            {/* Section Header - Now part of centered content */}
            <div className="flex items-center gap-3 mb-6">
              <motion.div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                <span className="text-lg">1</span>
              </motion.div>
              <h2 className="text-xl font-semibold">Select Starting Level</h2>
            </div>

            {/* Language Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className={`p-4 rounded-lg ${subject.color} h-full`}
                >
                  {/* Language Heading */}
                  <div className="flex items-center gap-3 mb-4">
                    <subject.icon className="text-xl text-gray-700" />
                    <h3 className="text-lg font-medium">{subject.name}</h3>
                  </div>

                  {/* Levels */}
                  <div className="space-y-3">
                    {subject.levels.map((level) => (
                      <motion.div
                        key={level.id}
                        className={`p-3 rounded-lg flex items-start gap-3 text-base cursor-pointer transition-colors
                ${
                  studyPlan.startingLevels[subject.id] === level.id
                    ? 'bg-white shadow-md border border-blue-200'
                    : 'bg-transparent hover:bg-white/50'
                }
                ${level.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={
                          !level.disabled
                            ? () => selectLevel(subject.id, level.id)
                            : undefined
                        }
                      >
                        <span className="text-2xl">{level.icon}</span>
                        <div>
                          <h4 className="font-medium">{level.name}</h4>
                          <p className="text-gray-600 text-sm">
                            {level.description}
                          </p>
                        </div>
                        {level.disabled && (
                          <FaLock className="ml-auto text-gray-400 mt-1" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>{' '}
          {/* Weekly Lessons & Study Days - Wider Section */}
          <div className="lg:w-[41%] flex flex-col gap-6">
            {' '}
            {/* Increased width */}
            {/* Weekly Lessons */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-7 shadow-lg">
              {' '}
              {/* Increased padding */}
              <div className="flex items-center gap-3 mb-6">
                <motion.div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                  <span className="text-lg">2</span>
                </motion.div>
                <h2 className="text-xl font-semibold">Weekly Lessons</h2>
              </div>
              <div className="grid grid-cols-2 gap-7">
                {' '}
                {/* Increased gap */}
                {subjects.map((subject) => (
                  <div key={subject.id} className="space-y-5">
                    {' '}
                    {/* Increased spacing */}
                    <div className="flex items-center gap-3">
                      <subject.icon className="text-lg" />
                      <h3 className="font-medium">{subject.name}</h3>
                    </div>
                    {/* Updated Weekly Lessons Buttons */}
                    <div className="flex justify-between gap-3">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <motion.button
                          key={num}
                          onClick={() => updateWeeklyLessons(subject.id, num)}
                          className={`flex-1 h-9 rounded-lg text-lg font-medium transition-colors flex items-center justify-center border
        ${
          studyPlan.weeklyLessons[subject.id] === num
            ? 'bg-purple-500 text-white shadow-md border-purple-600'
            : 'bg-white text-gray-600 hover:bg-purple-100 hover:shadow-sm border-gray-300'
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
            {/* Study Days */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-7 shadow-lg">
              {' '}
              {/* Increased padding */}
              <div className="flex items-center gap-3 mb-6">
                <motion.div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                  <span className="text-lg">3</span>
                </motion.div>
                <h2 className="text-xl font-semibold">Study Days</h2>
              </div>
              <div className="grid grid-cols-2 gap-7">
                {' '}
                {/* Increased gap */}
                {subjects.map((subject) => (
                  <div key={subject.id} className="space-y-5">
                    {' '}
                    {/* Increased spacing */}
                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-lg" />
                      <h3 className="font-medium">{subject.name}</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {daysOfWeek.map((day) => (
                        <motion.button
                          key={day}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => toggleSubjectDay(subject.id, day)}
                          className={`p-2 rounded-lg text-sm font-medium shadow-md border
        ${
          studyPlan.subjectDays[subject.id].includes(day)
            ? subject.id === 'English'
              ? 'bg-gradient-to-br from-blue-400 to-purple-400 text-white border-blue-500'
              : 'bg-gradient-to-br from-emerald-400 to-cyan-400 text-white border-emerald-500'
            : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
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

      {/* Updated Submit Button - Fixed Animation */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="text-center ">
          <motion.button
            className={`px-8 py-3 rounded-xl text-lg font-semibold flex items-center gap-1.5 mx-auto
        ${
          allLevelsSelected && allSubjectsHaveDays
            ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
            whileHover={
              allLevelsSelected && allSubjectsHaveDays
                ? {
                    scale: 1.05,
                    rotate: [0, -3, 3, 0],
                    transition: { duration: 0.4 },
                  }
                : {}
            }
            whileTap={{ scale: 0.95 }}
            onClick={handleStudyPlan}
            disabled={!allLevelsSelected || !allSubjectsHaveDays}
          >
            Start Learning Journey
            <motion.div>
              <FaRocket className="text-yellow-300 text-lg" />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanPage;
