import React, { useEffect, useState } from 'react';
import { useNavigate,useLocation  } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { FaLayerGroup, FaRegClipboard } from 'react-icons/fa';
import './ModulePage.css'; 
import { useApiErrorHandler, useCheckTokenValid } from '../utils/apiErrorHandler';

const ModulesPage = () => {
  const [lessonProgress, setLessonProgress] = useState({});
  const [modules, setModules] = useState([]);
  const [openModule, setOpenModule] = useState(null);
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
    }
  }, [selectedSubject]);

  // Set initial openModule to the module passed in location state from lessons page
  useEffect(() => {
    if (selectedModule) {
      setOpenModule(selectedModule); 
    }
  }, [selectedModule]);

  const fetchModulesForSubject = async (subject) => {
    try {
      const response = await fetch(`http://localhost:5000/api/modules/user/${userId}/subject/${subject}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch modules');
      }
      setModules(data);
      
      setLessonProgress({}); // clear or reset first
      const progressMap = {};
      for (const lesson of data) {
        try {
          const res = await fetch(`http://localhost:5000/api/progress/user/${userId}/lesson/${lesson._id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const progress = await res.json();
          progressMap[lesson._id] = progress;
          setLessonProgress((prev) => ({ ...prev, [lesson._id]: progress }));
        } catch (err) {
          console.error(`Error fetching progress for lesson ${lesson._id}`, err);
        }
      }
  } catch (error) {
        handleApiError(error);
  }
};

  // Extract unique modules based on module title
  const uniqueModules = Array.from(
    new Map(modules.map(item => [item.module, item])).values()
  );

 // Group lessons under each module
 const getLessonsForModule = (moduleName) => {
  return modules.filter((lesson) => lesson.module === moduleName);
};

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 overflow-hidden">
      <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />
      <div className="flex flex-col lg:flex-row min-h-screen z-10 relative">
        <Sidebar
        />

        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Module List */}
          <div className="w-full lg:w-[25%] p-4 space-y-4 overflow-y-auto border-b lg:border-r border-white-200">
            <h2 className="text-3xl font-bold text-center text-pink-600 mb-10 mt-2">
              <FaLayerGroup className="inline mr-2" /> Modules
            </h2>
            {uniqueModules.map((mod, index) => (
              <motion.div
                key={mod._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`rounded-xl p-3 text-center cursor-pointer shadow-md mx-auto overflow-hidden ${
                  openModule === mod.module
                    ? "bg-purple-600 text-white font-bold"
                    : "bg-white hover:bg-purple-200 text-black font-bold"
                }`}
                style={{ maxWidth: "300px", minWidth: "250px", marginBottom: "25px"}}
                onClick={() => setOpenModule(mod.module)}
              >
                <span className="text-base lg:text-lg block truncate whitespace-normal break-words">{mod.module}</span>
              </motion.div>
            ))}
          </div>

          {/* Lesson Section */}
          <div className="w-full lg:w-[75%] pt-8 overflow-y-auto bg-gradient-to-br from-purple-200 via-pink-100 to-white">
            {openModule && (
              <>
                <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-8">
                  <FaRegClipboard className="inline mr-2" />
                  Lessons for {openModule}
                </h2>
                
                {/* Centered Lesson Grid */}
                <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl mx-auto px-4">
                {getLessonsForModule(openModule).map((lesson, index) => {
                  const hasProgress = lessonProgress[lesson._id]?.length > 0;
                  const isComplete = lessonProgress[lesson._id]?.length === lesson.signs.length; // Checks if all signs are watched
                  return(
                    <motion.div
                      key={lesson._id}
                      className="lesson-card flex flex-col h-full"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <h4 className="lesson-title text-center mb-4">
                        Lesson {lesson.lessonNumber}
                      </h4>

                      <div className="relative flex-1 pl-4 sm:pl-8 overflow-hidden">
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-pink-400 to-purple-500 rounded-full"></div>
                        <div className="signs-container overflow-y-auto pr-2">
                          <div className="space-y-4">
                            {lesson.signs.map((sign, idx) => (
                              <motion.div
                                key={sign._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                className="lesson-signs bg-white rounded-xl shadow-md border-l-4 border-purple-500 p-3 ml-2 sm:ml-1 hover:shadow-lg transition-transform hover:translate-x-1"
                              >
                                <h5>{sign.title}</h5>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex-center mt-4 mb-2">
                        <button
                          onClick={() => navigate(`/lesson/${lesson._id}`)}
                          className="button-soft"
                        >
                        {isComplete ? 'Rewatch Lesson' : hasProgress ? 'Resume Lesson' : 'Start Lesson'}  
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
}

export default ModulesPage;
