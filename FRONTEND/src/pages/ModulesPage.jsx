import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { FaBookOpen, FaGraduationCap, FaChevronDown, FaChevronUp, FaLayerGroup, FaRegClipboard } from 'react-icons/fa';

function LearnPage() {
  const [subjects, setSubjects] = useState(["English", "Arabic", "Math"]);
  const [selectedSubject, setSelectedSubject] = useState("English");
  const [modules, setModules] = useState([]);
  const [openModule, setOpenModule] = useState(null);
  const [openLessonId, setOpenLessonId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedSubject) {
      fetchModulesForSubject(selectedSubject);
    }
  }, [selectedSubject]);

  const fetchModulesForSubject = async (subject) => {
    const dataBySubject = {
      English: [
        { _id: "1-1", module: "Grammar", lessonNumber: 1, signs: [
            { _id: "1a", title: "Nouns" }, { _id: "1b", title: "Verbs" },
            { _id: "1c", title: "Adjectives" }, { _id: "1d", title: "Adverbs" },
            { _id: "1e", title: "Prepositions" }
        ]},
        { _id: "1-2", module: "Grammar", lessonNumber: 2, signs: [
            { _id: "2a", title: "Nouns" }, { _id: "2b", title: "Verbs" },
            { _id: "2c", title: "Adjectives" }, { _id: "2d", title: "Adverbs" },
            { _id: "2e", title: "Prepositions" }
        ]},
        { _id: "1-3", module: "Grammar", lessonNumber: 3, signs: [
            { _id: "3a", title: "Nouns" }, { _id: "3b", title: "Verbs" },
            { _id: "3c", title: "Adjectives" }, { _id: "3d", title: "Adverbs" },
            { _id: "3e", title: "Prepositions" }
        ]},
        { _id: "1-4", module: "Grammar", lessonNumber: 4, signs: [
            { _id: "4a", title: "Nouns" }, { _id: "4b", title: "Verbs" },
            { _id: "4c", title: "Adjectives" }, { _id: "4d", title: "Adverbs" },
            { _id: "4e", title: "Prepositions" }
        ]},
        { _id: "2", module: "Literature", lessonNumber: 1, signs: [
            { _id: "2a", title: "Poetry" }, { _id: "2b", title: "Prose" },
            { _id: "2c", title: "Shakespeare" }, { _id: "2d", title: "Modern Literature" },
            { _id: "2e", title: "Short Stories" }
        ]},
        { _id: "3", module: "Writing", lessonNumber: 1, signs: [
            { _id: "3a", title: "Essays" }, { _id: "3b", title: "Reports" },
            { _id: "3c", title: "Creative Writing" }, { _id: "3d", title: "Research Papers" },
            { _id: "3e", title: "Letters" }
        ]},
        { _id: "4", module: "Reading Comprehension", lessonNumber: 1, signs: [
            { _id: "4a", title: "Main Idea" }, { _id: "4b", title: "Supporting Details" },
            { _id: "4c", title: "Inference" }, { _id: "4d", title: "Summarizing" },
            { _id: "4e", title: "Context Clues" }
        ]},
        { _id: "5", module: "Spelling and Vocabulary", lessonNumber: 1, signs: [
            { _id: "5a", title: "Commonly Misspelled Words" }, { _id: "5b", title: "Word Roots" },
            { _id: "5c", title: "Prefixes and Suffixes" }, { _id: "5d", title: "Synonyms and Antonyms" },
            { _id: "5e", title: "Word Meanings in Context" }
        ]}
      ],
      Arabic: [
        { _id: "3", module: "Syntax", lessonNumber: 1, signs: [
            { _id: "3a", title: "Sentence Structure" }, { _id: "3b", title: "Word Types" }
        ]}

      ],
      Math: [
        { _id: "4", module: "Algebra", lessonNumber: 1, signs: [
            { _id: "4a", title: "Linear Equations" }, { _id: "4b", title: "Quadratic Equations" }
        ]},
        { _id: "5", module: "Geometry", lessonNumber: 1, signs: [
            { _id: "5a", title: "Triangles" }, { _id: "5b", title: "Circles" }
        ]}
      ]
    };

    const subjectModules = dataBySubject[subject] || [];
    setModules(subjectModules);
    if (subjectModules.length > 0) setOpenModule(subjectModules[0].module);
  };

  const getLessonsForModule = (moduleName) => modules.filter(lesson => lesson.module === moduleName);

  const toggleLesson = (lessonId) => {
    setOpenLessonId(prev => (prev === lessonId ? null : lessonId));
  };
  
  const uniqueModules = Array.from(new Map(modules.map(item => [item.module, item])).values());

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 overflow-hidden">
      <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />
      <div className="flex flex-col lg:flex-row min-h-screen z-10 relative">
        <Sidebar
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSelectSubject={(subject) => { setSelectedSubject(subject); setOpenModule(null); }}
        />

        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Module List */}
          <div className="w-full lg:w-1/4 p-6 bg-white-50 space-y-4 overflow-y-auto border-b lg:border-r border-white-200">
            <h2 className="text-3xl font-bold text-center text-pink-600 mb-4">
              <FaLayerGroup className="inline mr-2" /> Modules
            </h2>
            <div className="space-y-6">
              {uniqueModules.map((mod, index) => (
                <motion.div
                  key={mod._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05, ease: "easeOut" }}
                  className={`rounded-2xl p-4 text-center cursor-pointer shadow-md transition-all ${
                    openModule === mod.module ? "bg-purple-600 text-white font-bold" : "bg-white hover:bg-pink-200 text-gray-700 font-bold"
                  }`}
                  onClick={() => setOpenModule(mod.module)}
                >
                  <span className="text-xl">{mod.module}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Lesson List */}
          <div
            className="w-full lg:w-3/4 p-8 rounded-tl-3xl overflow-y-auto"
            style={{
              background: "linear-gradient(135deg, rgba(233, 246, 255, 0.9), rgba(243, 249, 255, 0.9))", // super light gradient for a soft look
              boxShadow: "inset 0 0 30px rgba(0,0,0,0.03)"
            }}
          >
            {openModule && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <h2 className="text-3xl font-extrabold text-center text-purple-600 mb-6">
                  <FaRegClipboard className="inline mr-2" />
                  Lessons for {openModule}
                </h2>
                <div className="space-y-6">
                  {getLessonsForModule(openModule).map((lesson) => (
                    <motion.div
                      key={lesson._id}
                      className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleLesson(lesson._id)}
                      >
                        <h4 className="text-lg font-bold text-pink-700">
                          Lesson {lesson.lessonNumber}
                        </h4>
                        <span className="text-purple-600 text-xl">
                        {openLessonId === lesson._id ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                      </div>

                      {openLessonId === lesson._id && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                          {lesson.signs.map((sign, idx) => (
                            <motion.div
                              key={sign._id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-white border-2 border-blue-300 p-4 rounded-2xl shadow-md cursor-pointer hover:bg-purple-100 transition duration-300 ease-in-out overflow-hidden"
                              onClick={() => navigate(`/lesson/${sign._id}`)}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: idx * 0.1 }}
                            >
                              <h5 className="text-md font-semibold text-purple-700">
                                {lesson.lessonNumber}.{idx + 1} {sign.title}
                              </h5>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearnPage;
