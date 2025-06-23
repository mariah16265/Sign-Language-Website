import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { FaLayerGroup, FaRegClipboard } from 'react-icons/fa';
import './ModulePage.css';
import { FaLock } from 'react-icons/fa';
import {
  useApiErrorHandler,
  useCheckTokenValid,
} from '../utils/apiErrorHandler';

const ModulesPage = () => {
  const [lessonProgress, setLessonProgress] = useState({});
  const [modules, setModules] = useState([]);
  const [openModule, setOpenModule] = useState(null);
  const [unlockedModules, setUnlockedModules] = useState([]);
  const { checkTokenValid } = useCheckTokenValid();
  const { handleApiError } = useApiErrorHandler();

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSubject = location.state?.subject; //comes from learn page, also from back to modules button(lesson page)
  const selectedModule = location.state?.module; //comes from lesson page

  // Check for valid token on mount
  useEffect(() => {
    const isTokenValid = checkTokenValid();
    if (!isTokenValid) return;
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchModulesForSubject(selectedSubject);
      fetchModuleAvailability(userId, selectedSubject);
    }
  }, [selectedSubject]);

  const fetchModuleAvailability = async (userId, subjectId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/module-availability/quiz/user/${userId}/${subjectId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUnlockedModules(data.unlockedModules || []);
      } else {
        throw new Error(data.message || 'Failed to fetch module availability');
      }
    } catch (error) {
      handleApiError(error);
    }
  };
  // Set initial openModule to the module passed in location state from lessons page
  useEffect(() => {
    if (selectedModule) {
      setOpenModule(selectedModule);
    }
  }, [selectedModule]);

  // Open "Module 1-" by default if no module already opened
  useEffect(() => {
    if (modules.length > 0 && !openModule) {
      const module1 = modules.find((mod) => mod.module.startsWith('Module 1-'));
      if (module1) {
        setOpenModule(module1.module);
      }
    }
  }, [modules, openModule]);

  const fetchModulesForSubject = async (subject) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/modules/user/${userId}/subject/${subject}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch modules');
      }
      setModules(data);

      setLessonProgress({}); // clear or reset first
      const progressMap = {};
      for (const lesson of data) {
        try {
          const res = await fetch(
            `http://localhost:5000/api/progress/user/${userId}/lesson/${lesson._id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const progress = await res.json();
          progressMap[lesson._id] = progress;
          setLessonProgress((prev) => ({ ...prev, [lesson._id]: progress }));
        } catch (err) {
          console.error(
            `Error fetching progress for lesson ${lesson._id}`,
            err
          );
        }
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Extract unique modules based on module title
  const uniqueModules = Array.from(
    new Map(modules.map((item) => [item.module, item])).values()
  );

  // Group lessons under each module
  const getLessonsForModule = (moduleName) => {
    return modules.filter((lesson) => lesson.module === moduleName);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 overflow-hidden">
      <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />
      <div className="flex flex-col lg:flex-row min-h-screen z-10 relative">
        <Sidebar />

        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Module List Section */}
          <div className="w-full lg:w-[25%] p-4 space-y-6 overflow-y-auto border-b lg:border-r border-white-200">
            <h2 className="text-3xl font-bold text-center text-pink-600 mb-10 mt-2">
              <FaLayerGroup className="inline mr-2" /> Modules
            </h2>
            {uniqueModules.map((mod, index) => {
              const isUnlocked = unlockedModules.includes(mod.module);

              return (
                <motion.div
                  key={mod._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`rounded-xl p-3 text-center cursor-pointer shadow-md mx-auto overflow-hidden relative ${
                    openModule === mod.module
                      ? 'bg-purple-600 text-white font-bold'
                      : isUnlocked
                      ? 'bg-white hover:bg-purple-200 text-black font-bold'
                      : 'bg-white text-gray-700 opacity-100 cursor-default'
                  }`}
                  style={{
                    maxWidth: '260px', // Reduced from 300px
                    minWidth: '200px', // Reduced from 250px
                    marginBottom: '15px', // Reduced from 25px
                  }}
                  onClick={() => {
                    if (isUnlocked) setOpenModule(mod.module);
                  }}
                >
                  <span className="flex items-center justify-center space-x-2 text-base lg:text-base block truncate whitespace-normal break-words px-2">
                    {' '}
                    {/* Added px-2 */}
                    <span>{mod.module}</span>
                    {!isUnlocked && (
                      <FaLock size={18} className="text-gray-500" />
                    )}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Lesson Section */}
          <div className="w-full lg:w-[75%] pt-8 overflow-y-auto bg-gradient-to-br from-purple-200 via-pink-100 to-white">
            {openModule && (
              <>
                <h2 className="text-4xl font-bold text-center text-pink-600 mb-10">
                  <FaRegClipboard className="inline mr-4 -mt-2" />
                  Lessons for {openModule}
                </h2>

                {/* Centered Lesson Grid */}
                <div className="flex justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl mx-auto px-4">
                    {' '}
                    {/* Reduced gap from 10 to 6, added px-6 */}
                    {getLessonsForModule(openModule).map((lesson, index) => {
                      const hasProgress =
                        lessonProgress[lesson._id]?.length > 0;
                      const isComplete =
                        lessonProgress[lesson._id]?.length ===
                        lesson.signs.length;

                      return (
                        <motion.div
                          key={lesson._id}
                          className="lesson-card flex flex-col h-full "
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.1 }}
                          whileHover={{ scale: 1.03, y: -3 }} // Reduced hover effect
                        >
                          <h4 className="lesson-title text-center mb-4 px-4">
                            {' '}
                            {/* Added px-4, reduced mb from 4 to 3 */}
                            Lesson {lesson.lessonNumber}
                          </h4>

                          <div className="relative flex-1 pl-3 sm:pl-6 overflow-hidden">
                            {' '}
                            {/* Reduced pl from 4/8 to 3/6 */}
                            <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-pink-400 to-purple-500 rounded-full"></div>
                            <div className="signs-container overflow-y-auto pr-2">
                              <div className="space-y-3">
                                {' '}
                                {/* Reduced from space-y-4 */}
                                {lesson.signs.map((sign, idx) => (
                                  <motion.div
                                    key={sign._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      duration: 0.4,
                                      delay: idx * 0.1,
                                    }}
                                    className="lesson-signs bg-white rounded-xl shadow-md border-l-4 border-purple-500 p-2 ml-2 hover:shadow-lg transition-transform hover:translate-x-1" // Reduced p from 3 to 2
                                  >
                                    <h5 className="text-sm">{sign.title}</h5>{' '}
                                    {/* Added text-sm */}
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex-center mt-3 mb-1">
                            {' '}
                            {/* Reduced mt/mb */}
                            <button
                              onClick={() => navigate(`/lesson/${lesson._id}`)}
                              className="button-soft py-1 px-1 text-xs" // Added smaller padding and text
                            >
                              {isComplete
                                ? 'Rewatch Lesson'
                                : hasProgress
                                ? 'Resume Lesson'
                                : 'Start Lesson'}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulesPage;
