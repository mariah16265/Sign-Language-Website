import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { FaBookOpen, FaCalculator, FaLanguage } from 'react-icons/fa';

const LandingPage = () => {
  const [stars, setStars] = useState([]);

  const addStar = (e) => {
    if (e.target.closest('button, a, input, textarea, nav')) return;

    const newStar = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 20 + 10,
      color: ['#FF6B6B', '#4ECDC4', '#FFD166'][Math.floor(Math.random() * 3)],
    };
    setStars([...stars.slice(-10), newStar]);
  };
  const arabicGifs = [
    '/assets/england3.gif',
    '/assets/england1.gif',
    '/assets/england2.gif',
  ];
  const colors = {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFD166',
    text: '#26547C',
  };

  return (
    <div
      className="relative min-h-screen font-sans cursor-default"
      onClick={addStar}
      style={{ fontFamily: "'Poppins', sans-serif" }} // Default font for the page
    >
      {/* Navbar (fixed on top) */}
      <nav className="fixed top-0 w-full z-50 h-24">
        <Navbar />
      </nav>

      {/* Background Image - Fixed but not stretched */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img
          src="/assets/backgroundpic.jpg"
          alt="Background"
          className="min-w-full min-h-full object-cover"
          style={{
            width: '100%',
            height: 'auto',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 min-h-screen">
        {/* Hero Section - Centered with proper spacing */}
        <main
          className="flex items-center justify-center px-6"
          style={{ minHeight: 'calc(100vh - 6rem)' }}
        >
          <motion.div
            className="max-w-6xl w-full text-center space-y-12 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Header Section */}
            <div className="relative mb-16">
              <motion.h1
                className="text-5xl md:text-6xl lg:text-[90px] font-black mb-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ fontFamily: "'Fredoka One', cursive" }} // Playful font for main heading
              >
                <span className="bg-gradient-to-r from-[#FF6B6B] via-[#FFD166] to-[#4ECDC4] bg-clip-text text-transparent">
                  Learn Through <br />
                  Signs & Smiles! ✨
                </span>
              </motion.h1>

              <motion.p
                className="text-2xl font-semibold md:text-3xl text-gray-700 mb-12 max-w-3xl mx-auto leading-snug"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ fontFamily: "'Quicksand', sans-serif" }} // Friendly font for subtitle
              >
                An interactive journey where{' '}
                <span className="font-bold text-[#8A2BE2]">Arabic letters</span>
                ,{' '}
                <span className="font-bold text-[#4ECDC4]">math concepts</span>,
                and{' '}
                <span className="font-bold text-[#ffa366]">English words</span>{' '}
                come alive!
              </motion.p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {/* Child-Friendly Feature Card */}
              <motion.div
                className="feature-card bg-orange-100 p-8 rounded-3xl shadow-2xl border-b-4 border-[#FFD166] transform transition-all hover:scale-105"
                whileHover={{ rotate: -2 }}
                style={{ fontFamily: "'Comfortaa', cursive" }}
              >
                <div className="icon-container mb-6">
                  <div className="w-20 h-20 bg-[#FFD166]/10 rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-4xl">🧸</span>
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold mb-4 text-[#ceb548e0]">
                  Made for Young Minds
                </h3>
                <p className="text-gray-800 text-lg">
                  Visual-first interface designed for ages 2-5
                </p>
              </motion.div>
              {/* Language Feature Card */}
              <motion.div
                className="feature-card bg-sky-100 p-8 rounded-3xl shadow-2xl border-b-4 border-[#4ECDC4] transform transition-all hover:scale-105"
                whileHover={{ rotate: 2 }}
                style={{ fontFamily: "'Comfortaa', cursive" }}
              >
                <div className="icon-container mb-6">
                  <div className="w-20 h-20 bg-[#4ECDC4]/10 rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-4xl">🌍</span>
                  </div>
                </div>
                <h3 className="text-[23px] font-extrabold mb-4 text-[#4ECDC4]">
                  Dual Language Support
                </h3>
                <p className="text-gray-800 text-lg">
                  Learn in both ASL & ArSL with cultural context
                </p>
              </motion.div>
              {/* AI Feature Card */}
              <motion.div
                className="feature-card bg-rose-100 p-8 rounded-3xl shadow-2xl border-b-4 border-[#FF6B6B] transform transition-all hover:scale-105"
                whileHover={{ rotate: -2 }}
                style={{ fontFamily: "'Comfortaa', cursive" }} // Rounded, friendly font for feature cards
              >
                <div className="icon-container mb-6">
                  <div className="w-20 h-20 bg-[#FF6B6B]/10 rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-4xl">🤖</span>
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold mb-4 text-[#FF6B6B]">
                  Smart Sign Recognition
                </h3>
                <p className="text-gray-800 text-lg">
                  Real-time AI feedback on sign language gestures
                </p>
              </motion.div>
            </div>
          </motion.div>
        </main>

        {/* Learning Cards Section */}
        <section className="py-12 md:py-16 px-6 overflow-hidden relative">
          <div className="max-w-7xl mx-auto">
            <div className="w-full flex justify-center">
              <motion.h2
                className="text-4xl md:text-5xl lg:text-[60px] text-center mb-8 md:mb-10 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontWeight: 500,
                  color: '#5C6BC0', // Dark cool purple
                  // background:
                  //   'linear-gradient(90deg, #4ECDC4, #A0E7E5, #BDE0FE)', // Aqua gradient                  letterSpacing: '0.5px',
                  lineHeight: '1.2',
                  paddingBottom: '20px', // Only bottom padding
                }}
              >
                <span className="bg-gradient-to-r from-[#8E7BEF] via-[#4D96FF] to-[#6BCBDB] bg-clip-text text-transparent">
                  Let's Learn With Fun!
                </span>{' '}
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{
                    scaleX: 1,
                    transition: {
                      duration: 0.8,
                      delay: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                  className="absolute left-0 right-0 mx-auto" // Center horizontally
                  style={{
                    bottom: '6px',
                    width: '100%', // Full width of text
                    height: '10px',
                    background:
                      'linear-gradient(90deg, #FF9E5E, #FF6B6B, #C445F4)',
                    borderRadius: '6px',
                    zIndex: -1,
                    transformOrigin: 'center', // Scale from center
                  }}
                />
              </motion.h2>
            </div>
            <div className="grid gap-6 md:gap-8">
              {' '}
              {/* English Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                className="relative group"
              >
                <div className="relative bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-lg border-4 border-[#4ECDC4] overflow-hidden group-hover:shadow-xl transition-all duration-300">
                  <div
                    className="absolute top-0 right-0 p-2 text-xl"
                    style={{ color: colors.secondary }}
                  >
                    📚
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
                    <div className="md:w-2/5">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-4 mb-6"
                      >
                        <div
                          className="p-3 rounded-xl shadow-sm"
                          style={{
                            backgroundColor: '#E0F7FA',
                            border: `2px solid ${colors.secondary}`,
                          }}
                        >
                          <FaBookOpen
                            className="text-3xl md:text-4xl"
                            style={{ color: colors.secondary }}
                          />
                        </div>
                        <h3
                          className="text-2xl md:text-3xl font-bold"
                          style={{ color: colors.secondary }}
                        >
                          English Adventures
                        </h3>
                      </motion.div>
                      <motion.p
                        className="mb-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        style={{ color: colors.text }}
                      >
                        Discover everyday words, colorful signs, and your
                        favorite animals through interactive storytelling!
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex gap-2 flex-wrap"
                      >
                        {['Vocabulary', 'Storytelling', 'Animals'].map(
                          (tag, i) => (
                            <motion.span
                              key={tag}
                              initial={{ scale: 0.8 }}
                              whileInView={{ scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 * i }}
                              className="px-3 py-1 rounded-full text-sm font-medium border"
                              style={{
                                backgroundColor: '#E0F7FA',
                                color: colors.secondary,
                                borderColor: colors.secondary,
                              }}
                            >
                              {tag}
                            </motion.span>
                          )
                        )}
                      </motion.div>
                    </div>
                    <div className="md:w-3/5">
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {['/assets/england1.gif', '/assets/england2.gif'].map(
                          (gif, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: 0.1 * i }}
                              className="relative h-40 md:h-48 rounded-xl overflow-hidden shadow-md border-2 border-white transition-all"
                              style={{ borderColor: colors.secondary }}
                            >
                              <img
                                src={gif}
                                alt="English sign"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </motion.div>
                          )
                        )}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="relative h-40 md:h-48 rounded-xl overflow-hidden shadow-md border-2 border-white transition-all col-span-2"
                          style={{ borderColor: colors.secondary }}
                        >
                          <img
                            src="/assets/england3.gif"
                            alt="English sign"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              {/* Math Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                className="relative group"
              >
                <div className="relative bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-lg border-4 border-[#FF6B6B] overflow-hidden group-hover:shadow-xl transition-all duration-300">
                  <div
                    className="absolute top-0 right-0 p-2 text-xl"
                    style={{ color: colors.primary }}
                  >
                    🧮
                  </div>

                  <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-10">
                    <div className="md:w-2/5">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-4 mb-6 justify-end md:justify-start"
                      >
                        <h3
                          className="text-2xl md:text-3xl font-bold"
                          style={{ color: colors.primary }}
                        >
                          Math Magic
                        </h3>
                        <div
                          className="p-3 rounded-xl shadow-sm"
                          style={{
                            backgroundColor: '#FFEEEE',
                            border: `2px solid ${colors.primary}`,
                          }}
                        >
                          <FaCalculator
                            className="text-3xl md:text-4xl"
                            style={{ color: colors.primary }}
                          />
                        </div>
                      </motion.div>
                      <motion.p
                        className="mb-6 text-right md:text-left"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        style={{ color: colors.text }}
                      >
                        Count, compare, and solve puzzles with animated numbers
                        and playful challenges!
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex gap-2 flex-wrap justify-end md:justify-start"
                      >
                        {['Counting', 'Puzzles', 'Shapes'].map((tag, i) => (
                          <motion.span
                            key={tag}
                            initial={{ scale: 0.8 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 * i }}
                            className="px-3 py-1 rounded-full text-sm font-medium border"
                            style={{
                              backgroundColor: '#FFEEEE',
                              color: colors.primary,
                              borderColor: colors.primary,
                            }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </motion.div>
                    </div>
                    <div className="md:w-3/5">
                      <div className="grid grid-cols-3 gap-3 md:gap-4">
                        {[
                          '/assets/england1.gif',
                          '/assets/england2.gif',
                          '/assets/england3.gif',
                        ].map((gif, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 * i }}
                            className={`relative h-32 md:h-40 rounded-xl overflow-hidden shadow-md border-2 border-white transition-all ${
                              i === 1 ? 'mt-6' : ''
                            }`}
                            style={{ borderColor: colors.primary }}
                          >
                            <img
                              src={gif}
                              alt="Math sign"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              {/* Arabic Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                className="relative group"
              >
                <div className="relative bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-lg border-4 border-[#FFD166] overflow-hidden group-hover:shadow-xl transition-all duration-300">
                  <div
                    className="absolute top-0 right-0 p-2 text-xl"
                    style={{ color: colors.accent }}
                  >
                    🌍
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
                    <div className="md:w-2/5">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-4 mb-6"
                      >
                        <div
                          className="p-3 rounded-xl shadow-sm"
                          style={{
                            backgroundColor: '#FFF8E1',
                            border: `2px solid ${colors.accent}`,
                          }}
                        >
                          <FaLanguage
                            className="text-3xl md:text-4xl"
                            style={{ color: colors.accent }}
                          />
                        </div>
                        <h3
                          className="text-2xl md:text-3xl font-bold"
                          style={{ color: colors.accent }}
                        >
                          Arabic Wonders
                        </h3>
                      </motion.div>
                      <motion.p
                        className="mb-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        style={{ color: colors.text }}
                      >
                        Explore beautiful Arabic letters, kind greetings, and
                        cultural stories through sign language!
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex gap-2 flex-wrap"
                      >
                        {['Alphabet', 'Culture', 'Greetings'].map((tag, i) => (
                          <motion.span
                            key={tag}
                            initial={{ scale: 0.8 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 * i }}
                            className="px-3 py-1 rounded-full text-sm font-medium border"
                            style={{
                              backgroundColor: '#FFF8E1',
                              color: colors.accent,
                              borderColor: colors.accent,
                            }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </motion.div>
                    </div>
                    <div className="md:w-3/5">
                      <div className="grid grid-cols-3 gap-3 md:gap-4">
                        {arabicGifs.map((gif, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.5,
                              delay: 0.1 * i,
                              type: 'spring',
                              stiffness: 100,
                            }}
                            className="relative h-32 md:h-40 rounded-xl overflow-hidden shadow-md border-2 border-white transition-all"
                            style={{ borderColor: colors.accent }}
                            whileHover={{ y: -5 }}
                          >
                            <img
                              src={gif}
                              alt={`Arabic sign ${i + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        {/* New Sign-Up Section */}
        <section className="py-16 px-6 ">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-t-4 border-[#4ECDC4]"
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{
                  color: colors.text,
                  fontFamily: "'Fredoka One', cursive",
                }}
              >
                Ready to Start Learning? 🎉
              </h2>
              <p
                className="text-xl mb-8 max-w-2xl mx-auto"
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                }}
              >
                Join our community of young learners and give your child the
                gift of communication!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full text-lg font-bold text-white shadow-lg transition-all duration-300"
                style={{
                  background: `linear-gradient(45deg, ${colors.primary}, ${colors.accent})`,
                  fontFamily: "'Comfortaa', cursive",
                }}
              >
                Sign Up for Free Today
              </motion.button>
              <p
                className="mt-6 text-gray-600"
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                }}
              >
                Already have an account?{' '}
                <a
                  href="/login"
                  className="text-[#4ECDC4] font-bold hover:underline"
                >
                  Log in here
                </a>
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="text-center py-4"
          style={{ backgroundColor: colors.text, color: 'white' }}
        >
          <motion.div whileHover={{ scale: 1.05 }} className="mb-2">
            <span className="text-xl">✋</span>
            <span className="font-bold text-lg ml-2">
              Built with care, signs, and smiles!
            </span>
          </motion.div>
          <p className="text-sm">
            © 2025 LittleSigns | Making learning magical!
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
