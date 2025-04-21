import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiSpellBook, GiAbacus } from 'react-icons/gi';
import { FaPlay } from 'react-icons/fa';

// Replace these imports with actual unique subject GIFs
import englishGif1 from '../assets/england1.gif';
import englishGif2 from '../assets/england2.gif';
import englishGif3 from '../assets/england3.gif';

import mathGif1 from '../assets/england1.gif';
import mathGif2 from '../assets/england2.gif';
import mathGif3 from '../assets/england3.gif';

import arabicGif1 from '../assets/england1.gif';
import arabicGif2 from '../assets/england2.gif';
import arabicGif3 from '../assets/england3.gif';

const LearningShowcase = () => {
  const [activeTab, setActiveTab] = useState('English');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setActiveTab((prev) =>
        prev === 'English' ? 'Math' : prev === 'Math' ? 'Arabic' : 'English'
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const subjects = {
    English: {
      icon: <GiSpellBook className="text-4xl" />,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-100',
      title: 'English Basics',
      description:
        'Learn foundational English concepts through sign language with topics like animals, body parts, alphabets, and numbers.',
      highlights: ['Animals', 'Body Parts', 'Alphabets', 'Numbers'],
      gifs: [englishGif1, englishGif2, englishGif3],
    },
    Math: {
      icon: <GiAbacus className="text-4xl" />,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-100',
      title: 'Math Starter',
      description:
        'Grasp basic math ideas through engaging sign language content—alphabets, numbers, and early addition.',
      highlights: ['Alphabets', 'Numbers', 'Basic Addition'],
      gifs: [mathGif1, mathGif2, mathGif3],
    },
    Arabic: {
      icon: <div className="text-3xl font-arabic">أ</div>,
      color: 'from-blue-500 to-teal-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-teal-100',
      title: 'Arabic Essentials',
      description:
        'Start learning Arabic using sign language with key topics like animals, body parts, alphabets, and numbers.',
      highlights: ['Animals', 'Body Parts', 'Alphabets', 'Numbers'],
      gifs: [arabicGif1, arabicGif2, arabicGif3],
    },
  };

  return (
    <section className="relative py-16 px-4 sm:px-6 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            Interactive Learning
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Explore our engaging sign language courses designed for all ages.
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex rounded-2xl bg-white p-1 shadow-md border">
            {Object.keys(subjects).map((subject) => (
              <button
                key={subject}
                onClick={() => {
                  setActiveTab(subject);
                  setIsAutoRotating(false);
                }}
                className={`px-5 py-2 text-base font-medium rounded-xl relative transition-all ${
                  activeTab === subject
                    ? `text-white bg-gradient-to-r ${subjects[subject].color}`
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {subject}
                {activeTab === subject && (
                  <motion.div
                    layoutId="activeTabPill"
                    transition={{ type: 'spring', bounce: 0.3 }}
                    className="absolute inset-0 rounded-xl border-2 border-white"
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="relative h-[450px] md:h-[550px] rounded-3xl overflow-hidden">
          <AnimatePresence mode="wait">
            {Object.entries(subjects).map(
              ([subject, data]) =>
                activeTab === subject && (
                  <motion.div
                    key={subject}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 ${data.bgColor} p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4`}
                  >
                    <div className="flex flex-col justify-center">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-4 mb-4"
                      >
                        <div className="p-3 rounded-2xl bg-white shadow-md">
                          {data.icon}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                          {data.title}
                        </h3>
                      </motion.div>

                      <motion.p
                        className="text-base md:text-lg text-gray-700 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {data.description}
                      </motion.p>

                      <motion.ul
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {data.highlights.map((highlight, i) => (
                          <motion.li
                            key={highlight}
                            initial={{ x: -20 }}
                            animate={{ x: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            className="flex items-center gap-2"
                          >
                            <div
                              className={`w-2 h-2 rounded-full bg-gradient-to-r ${data.color}`}
                            />
                            <span className="text-base text-gray-700">
                              {highlight}
                            </span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {data.gifs.map((gif, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.15 }}
                          whileHover={{ y: -5 }}
                          onHoverStart={() => setHoveredCard(`${subject}-${i}`)}
                          onHoverEnd={() => setHoveredCard(null)}
                          className={`relative rounded-2xl overflow-hidden shadow-md border-4 border-white transition-all ${
                            hoveredCard === `${subject}-${i}`
                              ? 'z-10 scale-105'
                              : 'z-0'
                          }`}
                        >
                          <img
                            src={gif}
                            alt={`${subject} example ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {hoveredCard === `${subject}-${i}` && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute inset-0 bg-black/20 flex items-center justify-center"
                            >
                              <div className="p-3 bg-white/90 rounded-full">
                                <FaPlay className="text-pink-500" />
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default LearningShowcase;
