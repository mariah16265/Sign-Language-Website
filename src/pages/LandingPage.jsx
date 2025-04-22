import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaBookOpen, FaCalculator, FaLanguage } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import wavingHand from '../assets/hello1.webp';
import englishGif from '../assets/england1.gif';
import englishGif2 from '../assets/england2.gif';
import englishGif3 from '../assets/england3.gif';
import mathGif from '../assets/england2.gif';
import mathGif2 from '../assets/england1.gif';
import mathGif3 from '../assets/england3.gif';
import arabicGif from '../assets/england3.gif';
import arabicGif2 from '../assets/england1.gif';
import arabicGif3 from '../assets/england2.gif';

const LandingPage = () => {
  const [stars, setStars] = useState([]);

  const addStar = (e) => {
    // Check if we're clicking on an interactive element
    if (e.target.closest('button, a, input, textarea')) {
      return;
    }

    const newStar = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 20 + 10,
    };
    setStars([...stars.slice(-10), newStar]);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden font-sans cursor-default"
      onClick={addStar}
    >
      {/* Background elements */}
      {/* Replace the ENTIRE current background div with this: */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50">
        {/* Animated confetti elements */}
        {[...Array(120)].map((_, i) => {
          const colors = [
            '#FF3CAC',
            '#8E2DE2',
            '#4A00E0',
            '#00D2FF',
            '#FF4E50',
            '#F9D423',
            '#56CCF2',
            '#2F80ED',
          ];
          const shapes = ['circle', 'rect', 'polygon'];
          const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const size = Math.random() * 20 + 10;

          return (
            <motion.div
              key={i}
              className="absolute opacity-70"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}vw`,
                top: `${Math.random() * 100}vh`,
                background: randomColor,
                borderRadius: randomShape === 'circle' ? '50%' : '4px',
                clipPath:
                  randomShape === 'polygon'
                    ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                    : undefined,
              }}
              animate={{
                y: [
                  `${Math.random() * 100}vh`,
                  `${Math.random() * 100 + 100}vh`,
                ],
                x: [
                  `${Math.random() * 20 - 10}vw`,
                  `${Math.random() * 20 - 10}vw`,
                ],
                rotate: [0, Math.random() * 360],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'linear',
              }}
            />
          );
        })}
      </div>
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm z-0"></div>

      {/* Interactive stars */}
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{
              x: star.x - star.size / 2,
              y: star.y - star.size / 2,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [1, 0.6, 0],
              y: star.y - star.size / 2 - 60,
            }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="fixed text-yellow-400 pointer-events-none drop-shadow-xl"
            style={{
              width: star.size,
              height: star.size,
              zIndex: 100,
              left: 0,
              top: 0,
            }}
          >
            <FaStar className="w-full h-full" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <main className="flex flex-col-reverse md:flex-row items-center justify-center gap-16 py-20 px-6 max-w-7xl mx-auto min-h-[70vh]">
          {' '}
          <div className="text-center md:text-left max-w-2xl space-y-8">
            <motion.h1
              className="text-6xl md:text-7xl font-extrabold leading-tight mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.12 }}
            >
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400"
                animate={{
                  backgroundImage: [
                    'linear-gradient(to right, #9333ea, #8b5cf6)',
                    'linear-gradient(to right, #8b5cf6, #a855f7)',
                    'linear-gradient(to right, #a855f7, #9333ea)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
              >
                Hello, Bright Stars!
              </motion.span>
            </motion.h1>

            {/* In your hero section */}
            <motion.p
              className="text-xl md:text-2xl text-black/90 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Explore the magical world of letters, numbers, and everyday
              words—all through{' '}
              <span className="font-bold text-purple-500">playful signs</span>{' '}
              and{' '}
              <span className="font-bold text-purple-600">friendly games</span>{' '}
              made just for you!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="pt-4"
            >
              <Link to="/signup">
                <button className="bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white py-4 px-10 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-xl transform hover:scale-105 active:scale-95">
                  Let's Begin the Fun!
                </button>
              </Link>
            </motion.div>
          </div>
          <motion.div
            className="w-full max-w-lg md:w-[600px] h-[500px]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={wavingHand}
              alt="Sign language welcome"
              className="w-full h-full object-contain rounded-2xl shadow-lg"
            />
          </motion.div>
        </main>

        {/* Learning Cards Section */}
        <section className="py-16 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-3xl md:text-5xl font-bold text-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
                Interactive Learning Journey
              </span>
            </motion.h2>

            <div className="grid gap-12">
              {/* English Card */}
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
                className="relative"
              >
                <div className="absolute -inset-3 bg-gradient-to-r from-purple-300 to-purple-400 rounded-3xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-xl border-2 border-purple-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmNWY1ZjUiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS4yLTQuMSAzLTUuMXYtLjVjMC0xLjEtLjktMi0yLTJoLTJjLTEuMSAwLTIgLjktMiAydi41YzEuOCAxIDMgMi45IDMgNS4xdjNoLTJ2LTNoLTFjLTEuMSAwLTIgLjktMiAydjFjMCAxLjEuOSAyIDIgMmgxdjNoLTJ2LTNoLTFjLTEuMSAwLTIgLjktMiAydjFjMCAxLjEuOSAyIDIgMmgxdjNoLTJ2LTNoLTFjLTEuMSAwLTIgLjktMiAydjFjMCAxLjEuOSAyIDIgMmg3YzEuMSAwIDItLjkgMi0ydi0xYzAtMS4xLS45LTItMi0yaC0xdi0zem0wIDBoLTJ2LTNjMC0xLjctMS4zLTMtMy0zaC0xdjVoNHptLTcgMGgtMnYtNWgxdjV6bTAgM2gtMnYtNWgxdjV6bTAgM2gtMnYtNWgxdjV6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10 -z-10"></div>
                  <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="md:w-2/5">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex items-center gap-4 mb-6"
                      >
                        <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow">
                          <FaBookOpen className="text-4xl text-purple-600" />
                        </div>
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                          English Adventures
                        </h3>
                      </motion.div>
                      <motion.p
                        className="text-lg text-gray-700 mb-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        Discover everyday words, colorful signs, and your
                        favorite animals through interactive storytelling!
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="flex gap-3 flex-wrap"
                      >
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          Vocabulary
                        </span>
                        <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
                          Storytelling
                        </span>
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                          Animals
                        </span>
                      </motion.div>
                    </div>
                    <div className="md:w-3/5">
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className="relative h-48 rounded-xl overflow-hidden shadow-lg border-2 border-white group-hover:border-purple-200 transition-all"
                        >
                          <img
                            src={englishGif}
                            alt="English sign"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="relative h-48 rounded-xl overflow-hidden shadow-lg border-2 border-white group-hover:border-purple-300 transition-all"
                        >
                          <img
                            src={englishGif2}
                            alt="English sign"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                          className="relative h-48 rounded-xl overflow-hidden shadow-lg border-2 border-white group-hover:border-purple-400 transition-all col-span-2"
                        >
                          <img
                            src={englishGif3}
                            alt="English sign"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Math Card */}
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
                className="relative"
              >
                <div className="absolute -inset-3 bg-gradient-to-r from-purple-200 to-purple-300 rounded-3xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-xl border-2 border-purple-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmNWY1ZjUiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS4yLTQuMSAzLTUuMXYtLjVjMC0xLjEtLjktMi0yLTJoLTJjLTEuMSAwLTIgLjktMiAydi41YzEuOCAxIDMgMi45IDMgNS4xdjNoLTJ2LTNoLTFjLTEuMSAwLTIgLjktMiAydjFjMCAxLjEuOSAyIDIgMmgxdjNoLTJ2LTNoLTFjLTEuMSAwLTIgLjktMiAydjFjMCAxLjEuOSAyIDIgMmgxdjNoLTJ2LTNoLTFjLTEuMSAwLTIgLjktMiAydjFjMCAxLjEuOSAyIDIgMmg3YzEuMSAwIDItLjkgMi0ydi0xYzAtMS4xLS45LTItMi0yaC0xdi0zem0wIDBoLTJ2LTNjMC0xLjctMS4zLTMtMy0zaC0xdjVoNHptLTcgMGgtMnYtNWgxdjV6bTAgM2gtMnYtNWgxdjV6bTAgM2gtMnYtNWgxdjV6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10 -z-10"></div>
                  <div className="flex flex-col md:flex-row-reverse items-center gap-10">
                    <div className="md:w-2/5">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex items-center gap-4 mb-6 justify-end md:justify-start"
                      >
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
                          Math Magic
                        </h3>
                        <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow">
                          <FaCalculator className="text-4xl text-purple-600" />
                        </div>
                      </motion.div>
                      <motion.p
                        className="text-lg text-gray-700 mb-6 text-right md:text-left"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        Count, compare, and solve puzzles with animated numbers
                        and playful challenges!
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="flex gap-3 flex-wrap justify-end md:justify-start"
                      >
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          Counting
                        </span>
                        <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
                          Puzzles
                        </span>
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                          Shapes
                        </span>
                      </motion.div>
                    </div>
                    <div className="md:w-3/5">
                      <div className="grid grid-cols-3 gap-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="relative h-40 rounded-xl overflow-hidden shadow-lg border-2 border-white group-hover:border-purple-200 transition-all"
                        >
                          <img
                            src={mathGif}
                            alt="Math sign"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="relative h-40 rounded-xl overflow-hidden shadow-lg border-2 border-white group-hover:border-purple-300 transition-all mt-6"
                        >
                          <img
                            src={mathGif2}
                            alt="Math sign"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          className="relative h-40 rounded-xl overflow-hidden shadow-lg border-2 border-white group-hover:border-purple-400 transition-all"
                        >
                          <img
                            src={mathGif3}
                            alt="Math sign"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Arabic Card */}
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
                className="relative"
              >
                <div className="absolute -inset-3 bg-gradient-to-r from-purple-300 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-xl border-2 border-purple-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmNWY1ZjUiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS4yLTQuMSAzLTUuMXYtLjVjMC0xLjEtLjktMi0yLTJoLTJjLTEuMSAwLTIgLjktMiAydi41YzEuOCAxIDMgMi45IDMgNS4xdjNoLTJ2LTNoLTFjLTEuMSAwLTIgLjktMiAydjFjMCAxLjEuOSAyIDIgMmgxdjNoLTJ2LTNoLTFjLTEuMSAwLTIgLjktMiAydjFjMCAxLjEuOSAyIDIgMmgxdjNoLTJ2LTNoLTFjLTEuMSAwLTIgLjktMiAydjFjMCAxLjEuOSAyIDIgMmg3YzEuMSAwIDItLjkgMi0ydi0xYzAtMS4xLS45LTItMi0yaC0xdi0zem0wIDBoLTJ2LTNjMC0xLjctMS4zLTMtMy0zaC0xdjVoNHptLTcgMGgtMnYtNWgxdjV6bTAgM2gtMnYtNWgxdjV6bTAgM2gtMnYtNWgxdjV6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10 -z-10"></div>
                  <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="md:w-2/5">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex items-center gap-4 mb-6"
                      >
                        <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow">
                          <FaLanguage className="text-4xl text-purple-600" />
                        </div>
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                          Arabic Wonders
                        </h3>
                      </motion.div>
                      <motion.p
                        className="text-lg text-gray-700 mb-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        Explore beautiful Arabic letters, kind greetings, and
                        cultural stories through sign language!
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="flex gap-3 flex-wrap"
                      >
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          Alphabet
                        </span>
                        <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
                          Culture
                        </span>
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                          Greetings
                        </span>
                      </motion.div>
                    </div>
                    <div className="md:w-3/5">
                      <div className="grid grid-cols-3 gap-4">
                        {[arabicGif, arabicGif2, arabicGif3].map(
                          (gif, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.6,
                                delay: 0.3 + index * 0.1,
                                type: 'spring',
                                stiffness: 100,
                              }}
                              className="relative h-40 rounded-xl overflow-hidden shadow-lg border-2 border-white group-hover:border-purple-300 transition-all"
                              whileHover={{ y: -10 }}
                            >
                              <img
                                src={gif}
                                alt={`Arabic sign ${index + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-12 mt-6 bg-gradient-to-r from-purple-100 to-purple-50 border-t-4 border-purple-200 bg-opacity-80">
          {' '}
          <motion.div
            className="flex justify-center items-center gap-4 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              className="text-3xl"
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              ✋
            </motion.span>
            <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
              Built with care, signs, and smiles!
            </span>
          </motion.div>
          <div className="text-purple-700 text-lg">
            © 2025 LittleSigns | Making learning magical!
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
