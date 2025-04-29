import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import {  useApiErrorHandler, useCheckTokenValid } from '../utils/apiErrorHandler';
import { useNavigate } from 'react-router-dom';

import {
  FaBook,
  FaCalculator,
  FaLanguage,
  FaChevronRight,
  FaCalendarAlt,
} from 'react-icons/fa';
import {
  BsAlphabet,
  BsPalette,
  Bs123,
  BsTree,
  BsCarFront,
} from 'react-icons/bs';
import { GiElephant, GiButterfly, GiJumpingDog } from 'react-icons/gi';

const StudyPlanPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [studyPlan, setStudyPlan] = useState({
    startingModules: { English: '', Arabic: '', Math: '' },
    weeklyLessons: { English: 2, Arabic: 2, Math: 2 },
    subjectDays: { English: [], Arabic: [], Math: [] },
  });
  //initialized to get modules,handle errors and token
  const navigate = useNavigate();
  const { handleApiError } = useApiErrorHandler();
  const { checkTokenValid } = useCheckTokenValid();
  const [modulesPerSubject, setModulesPerSubject] = useState({});
  const token = localStorage.getItem('token');
  const isNewUser = localStorage.getItem('isNewUser');
    
  useEffect(() => {
    // Redirect to the dashboard if not a new user
    if (isNewUser === "false") {
      navigate('/dashboard');
    }
  }, [isNewUser, navigate]); 

  const videoRef = useRef(null);
  useEffect(() => {
    // Ensure video plays and loops
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Video autoplay prevented, trying to play manually');
      });
    }
  }, []);

    //BACKEND
    //token validation, on expiry-when user click on a component or reloads-they will be alerted
    useEffect(() => {
      const isTokenValid = checkTokenValid();
      if (!isTokenValid) { return; }
    });
  
    //getting modules data from DB
    const fetchModulesForSubject = async (subjectId) => {
      try {
        const response = await fetch(`http://localhost:5000/api/modules/${subjectId}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch modules');
        }
        console.log('Fetched modules for subject', subjectId, ':', data); 
        setModulesPerSubject((prev) => ({
          ...prev,
          [subjectId]: data,
        }));
      } catch (error) {
        handleApiError(error); 
      }
    };
  
    const handleSubjectClick = (subject) => {
      setSelectedSubject(subject);        
      fetchModulesForSubject(subject.id); // Fetch modules for selected subject
    };
  
    //save studyplan data to DB
    const handleStudyPlan = async () => {
      try {
        //sending POST request with the token
        const response = await fetch('http://localhost:5000/api/studyplan/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Attach the JWT token
          },
          body: JSON.stringify({ 
              startingModules: studyPlan.startingModules,
              weeklyLessons: studyPlan.weeklyLessons,
              subjectDays: studyPlan.subjectDays,
          }), //break down study plan and send 
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message ||  'Failed to save the study plan');
        }
        navigate('/dashboard');  
      } catch (error) {
        handleApiError(error);
      }
    };
    
  const subjects = [
    {
      id: 'English',
      name: 'English Adventure',
      icon: FaBook,
      color: 'from-blue-400 to-blue-600',
      /*modules: [
        {
          id: 'alphabet',
          name: 'Alphabet Safari',
          icon: BsAlphabet,
          emoji: '🔤',
        },
        { id: 'colors', name: 'Color Magic', icon: BsPalette, emoji: '🌈' },
        { id: 'numbers', name: 'Number Friends', icon: Bs123, emoji: '🔢' },
        {
          id: 'animals',
          name: 'Animal Kingdom',
          icon: GiElephant,
          emoji: '🐘',
        },
        { id: 'nature', name: 'Nature Explorer', icon: BsTree, emoji: '🌳' },
      ],*/
    },
    {
      id: 'Arabic',
      name: 'Arabic Journey',
      icon: FaLanguage,
      color: 'from-emerald-400 to-teal-600',
      /*modules: [
        {
          id: 'alphabet',
          name: 'Arabic Letters',
          icon: BsAlphabet,
          emoji: '🆎',
        },
        { id: 'numbers', name: 'Counting Fun', icon: Bs123, emoji: '1️⃣' },
        { id: 'colors', name: 'Color World', icon: GiButterfly, emoji: '🎨' },
      ],*/
    },
    {
      id: 'Math',
      name: 'Math Wonderland',
      icon: FaCalculator,
      color: 'from-amber-400 to-pink-500',
      /*modules: [
        { id: 'numbers', name: 'Number Party', icon: Bs123, emoji: '🧮' },
        {
          id: 'shapes',
          name: 'Shape Detectives',
          icon: GiJumpingDog,
          emoji: '🔷',
        },
        {
          id: 'addition',
          name: 'Adding Adventures',
          icon: BsCarFront,
          emoji: '➕',
        },
      ],*/
    },
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Card flip animation variants
  const cardVariants = {
    hidden: { rotateY: 90, opacity: 0 },
    visible: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 },
  };

  const selectModule = (subjectId, moduleId) => {
    setStudyPlan((prev) => ({
      ...prev,
      startingModules: { ...prev.startingModules, [subjectId]: moduleId },
    }));
    setSelectedSubject(null);
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

  const allModulesSelected = subjects.every(
    (subject) => studyPlan.startingModules[subject.id] && studyPlan.startingModules[subject.id] !== ''
  );
  const allSubjectsHaveDays = Object.values(studyPlan.subjectDays).every(
    (d) => d.length > 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 relative overflow-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/assets/studypage-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* <div className="absolute inset-0 bg-black bg-opacity-20"></div>{' '} */}
        {/* reduced opacity */}
      </div>
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 relative z-10">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-4">
              <motion.h1
                style={{ fontFamily: 'Fredoka, sans-serif' }}
                className="text-5xl leading-[1.3] font-bold mb-3 bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
              >
                {currentStep === 1
                  ? "Let's Begin Your Adventure!"
                  : 'Plan Your Journey!'}
              </motion.h1>
            </div>

            {/* Progress indicators */}
            <div className="flex justify-center mb-8 gap-4">
              {[1, 2].map((step) => (
                <motion.div
                  key={step}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-lg ${
                    currentStep >= step
                      ? 'bg-purple-500 text-white'
                      : 'bg-white text-gray-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {step}
                </motion.div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Subject Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className=" backdrop-blur-md rounded-3xl p-6 shadow-xl border-2 border-white"
                >
                  <h2 className="text-3xl font-bold text-left mb-8 text-white">
                    Where do you want to start from?
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subjects.map((subject) => (
                      <motion.div
                        key={subject.id}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div
                          className={`p-6 rounded-2xl cursor-pointer bg-gradient-to-br ${subject.color} text-white shadow-lg`}
                          onClick={() => handleSubjectClick(subject)}
                        >
                          <div className="flex flex-col items-center gap-4">
                            <subject.icon className="text-4xl" />
                            <h3 className="text-2xl font-bold">
                              {subject.name}
                            </h3>
                            {studyPlan.startingModules[subject.id] && (
                              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                Selected:{' '}
                                {
                                  modulesPerSubject[subject.id]?.find(
                                    (m) =>
                                      m._id ===
                                      studyPlan.startingModules[subject.id]
                                  )?.module
                                }
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Module Selection Modal */}
                  <AnimatePresence>
                    {selectedSubject && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                          className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl mx-4 flex flex-col"
                          initial={{ scale: 0.9, opacity: 0, y: 20 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.9, opacity: 0, y: 20 }}
                          style={{
                            height: '420px',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <h3 className="text-2xl font-bold text-center mb-4">
                            Select {selectedSubject.name} Module
                          </h3>

                          <div
                            className="overflow-y-auto flex-grow"
                            style={{ height: 'calc(100% - 120px)' }}
                          >
                            <div
                              className="grid gap-2"
                              style={{ gridAutoRows: '80px' }}
                            >
                              {' '}
                              {/* Only changed gap from 4 to 2 */}
                              {/* Filter to get unique modules based on module._id */}
                              {modulesPerSubject[selectedSubject.id]
                                 ?.filter((module, index, self) =>
                                  index === self.findIndex((m) => m.module === module.module) // Ensure unique module names only
                                ).map((module) => (
                                <motion.div
                                  key={module._id}
                                  variants={cardVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  transition={{ duration: 0.3 }}
                                >
                                  <div
                                    className={`h-full rounded-lg cursor-pointer flex items-center gap-3 border-2 px-4 ${
                                      studyPlan.startingModules[
                                        selectedSubject.id
                                      ] === module._id
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-purple-300'
                                    }`}
                                    onClick={() =>
                                      selectModule(
                                        selectedSubject.id,
                                        module._id
                                      )
                                    }
                                  >
                                    <span className="text-2xl flex-shrink-0">
                                      {module.emoji}
                                    </span>
                                    <div className="min-w-0">
                                      <h4 className="font-bold">
                                        {module.module}
                                      </h4>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <button
                            className="mt-4 w-full py-3 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            onClick={() => setSelectedSubject(null)}
                          >
                            Close
                          </button>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-end mt-8">
                    <motion.button
                      className={`px-8 py-3 rounded-xl text-white font-bold text-lg shadow-lg ${
                        allModulesSelected
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      whileHover={allModulesSelected ? { scale: 1.05 } : {}}
                      whileTap={allModulesSelected ? { scale: 0.98 } : {}}
                      onClick={() => setCurrentStep(2)}
                      disabled={!allModulesSelected}
                    >
                      Continue <FaChevronRight className="ml-2 inline" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Schedule Setup */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="backdrop-blur-md rounded-3xl p-8 shadow-xl border-2 border-white"
                >
                  <div className="space-y-6">
                    {/* Weekly Lessons */}
                    <div>
                      <h3
                        className="text-2xl font-bold text-left mb-6 text-white"
                        // style={{
                        //   textShadow:
                        //     '1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000',
                        // }}
                      >
                        Lessons Per Week
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {subjects.map((subject) => (
                          <motion.div
                            key={subject.id}
                            onClick={() => handleSubjectClick(subject)}  // Passing whole subject object
                            whileHover={{ scale: 1.02 }}
                            className="bg-white p-5 rounded-xl shadow-md border-2 border-gray-100"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div
                                className={`p-2 rounded-lg bg-gradient-to-br ${subject.color}`}
                              >
                                <subject.icon className="text-white text-xl" />
                              </div>
                              <h4 className="font-bold">{subject.name}</h4>
                            </div>
                            <div className="flex justify-center gap-2">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <motion.button
                                  key={num}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                    studyPlan.weeklyLessons[subject.id] === num
                                      ? 'bg-purple-500 text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                  onClick={() =>
                                    updateWeeklyLessons(subject.id, num)
                                  }
                                >
                                  {num}
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Learning Days */}
                    <div>
                      <h3
                        className="text-2xl font-bold text-left mb-6 text-white"
                        // style={{
                        //   textShadow:
                        //     '1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000',
                        // }}
                      >
                        Learning Days
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {subjects.map((subject) => (
                          <motion.div
                            key={subject.id}
                            onClick={() => handleSubjectClick(subject)}  // Passing whole subject object
                            whileHover={{ scale: 1.02 }}
                            className="bg-white p-5 rounded-xl shadow-md border-2 border-gray-100"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div
                                className={`p-2 rounded-lg bg-gradient-to-br ${subject.color}`}
                              >
                                <FaCalendarAlt className="text-white text-xl" />
                              </div>
                              <h4 className="font-bold">{subject.name}</h4>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {daysOfWeek.map((day) => (
                                <motion.button
                                  key={day}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`p-2 rounded text-center text-sm font-medium ${
                                    studyPlan.subjectDays[subject.id].includes(
                                      day
                                    )
                                      ? 'bg-purple-500 text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                  onClick={() =>
                                    toggleSubjectDay(subject.id, day)
                                  }
                                >
                                  {day}
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <motion.button
                      className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium"
                      whileHover={{ x: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep(1)}
                    >
                      <FaChevronRight className="transform rotate-180 inline mr-2" />
                      Back
                    </motion.button>
                    <motion.button
                      className={`px-6 py-2 rounded-xl text-white font-bold text-lg shadow-lg ${
                        allSubjectsHaveDays
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      whileHover={allSubjectsHaveDays ? { scale: 1.05 } : {}}
                      whileTap={allSubjectsHaveDays ? { scale: 0.98 } : {}}
                      onClick={handleStudyPlan}  
                      disabled={!allSubjectsHaveDays}
                    >
                      Complete Plan!
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanPage;
