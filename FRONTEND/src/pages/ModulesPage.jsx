import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { FaLayerGroup, FaRegClipboard } from 'react-icons/fa';
import './ModulePage.css'; // <-- You'll create this for styles

function LearnPage() {
  const [subjects, setSubjects] = useState(["English", "Arabic", "Math"]);
  const [selectedSubject, setSelectedSubject] = useState("English");
  const [modules, setModules] = useState([]);
  const [openModule, setOpenModule] = useState(null);
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
            { _id: "1e", title: "Prepositions"}, { _id: "1f", title: "Conjunction"} ,{ _id: "1g", title: "Proverbs" }
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

  const getLessonsForModule = (moduleName) =>
    modules.filter((lesson) => lesson.module === moduleName);

  const uniqueModules = Array.from(new Map(modules.map(item => [item.module, item])).values());

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 overflow-hidden">
      <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />
      <div className="flex flex-col lg:flex-row min-h-screen z-10 relative">
        <Sidebar
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSelectSubject={(subject) => {
            setSelectedSubject(subject);
            setOpenModule(null);
          }}
        />

        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Module List */}
          <div className="w-full lg:w-1/4 p-6 bg-white-50 space-y-4 overflow-y-auto border-b lg:border-r border-white-200">
            <h2 className="text-3xl font-bold text-center text-pink-600 mb-4">
              <FaLayerGroup className="inline mr-2" /> Modules
            </h2>
            {uniqueModules.map((mod, index) => (
              <motion.div
                key={mod._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`rounded-2xl p-4 text-center cursor-pointer shadow-md ${
                  openModule === mod.module
                    ? "bg-purple-600 text-white font-bold"
                    : "bg-white hover:bg-purple-200 text-black font-bold"
                }`}
                onClick={() => setOpenModule(mod.module)}
              >
                <span className="text-xl">{mod.module}</span>
              </motion.div>
            ))}
          </div>

          <div className="w-full lg:w-3/4 p-8 overflow-y-auto bg-gradient-to-br from-purple-200 via-pink-100 to-white">
          {/* <div className="w-full lg:w-3/4 p-8 overflow-y-auto"> */}


            {openModule && (
              <>
                <h2 className="text-4xl font-extrabold text-center text-pink-600 mb-8">
                  <FaRegClipboard className="inline mr-2" />
                  Lessons for {openModule}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {getLessonsForModule(openModule).map((lesson, index) => (
                    <motion.div
                      key={lesson._id}
                      className="lesson-card flex flex-col h-full"  // <-- added flex-col h-full
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
                                className="lesson-signs bg-white rounded-xl shadow-md border-l-4 border-purple-500 p-3 ml-2 sm:ml-4 hover:shadow-lg transition-transform hover:translate-x-1"
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
                          Get Started
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearnPage;
