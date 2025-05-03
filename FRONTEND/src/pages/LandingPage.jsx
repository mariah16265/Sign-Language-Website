import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  const colors = {
    primary: '#FF6B6B',
    secondary: '#E68A4C',
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

        {/* Learning Cards Section - Slider Version */}
        <section className="py-12 md:py-16 px-6 overflow-hidden relative">
          <div className="max-w-7xl mx-auto">
            <div className="w-full flex justify-center">
              <motion.h2
                className="text-4xl md:text-5xl lg:text-[60px] text-center mb-12 md:mb-16 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontWeight: 500,
                  color: '#5C6BC0',
                  lineHeight: '1.2',
                  paddingBottom: '20px',
                }}
              >
                <span className="bg-gradient-to-r from-[#8E7BEF] via-[#4D96FF] to-[#6BCBDB] bg-clip-text text-transparent">
                  Our Learning Subjects
                </span>
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
                  className="absolute left-0 right-0 mx-auto"
                  style={{
                    bottom: '6px',
                    width: '100%',
                    height: '10px',
                    background:
                      'linear-gradient(90deg, #FF9E5E, #FF6B6B, #C445F4)',
                    borderRadius: '6px',
                    zIndex: -1,
                    transformOrigin: 'center',
                  }}
                />
              </motion.h2>
            </div>

            {/* Slider Container */}
            <div className="relative">
              {/* English Slide */}
              <motion.div
                className="bg-white/40 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-xl mb-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
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
                    className="text-3xl md:text-4xl font-bold"
                    style={{ color: colors.secondary }}
                  >
                    English Signs
                  </h3>
                </div>

                <p className="text-xl mb-8" style={{ color: colors.text }}>
                  Learn alphabet signs, colors, animals and everyday vocabulary
                  through clear video demonstrations.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    '/Sign Language Videos/English/Module 8- Sports/Bowling.mp4',
                    '/Sign Language Videos/English/Module 3- Colors/blue.mp4',
                    '/Sign Language Videos/English/Module 6- Natural World/Clouds.mp4',
                    // add more video paths here
                  ].map((video, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="relative h-48 md:h-56 rounded-xl overflow-hidden shadow-lg"
                    >
                      <video
                        src={video}
                        className="w-full h-full object-cover"
                        muted
                        autoPlay
                        loop
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Math Slide */}
              <motion.div
                className="bg-white/40 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-xl mb-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
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
                  <h3
                    className="text-3xl md:text-4xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    Math Signs
                  </h3>
                </div>

                <p className="text-xl mb-8" style={{ color: colors.text }}>
                  Master counting, basic operations, and shape recognition
                  through visual sign language lessons.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 relative">
                  {/* Portrait Video - Left */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative h-full rounded-xl overflow-hidden shadow-lg bg-black flex items-center justify-center"
                  >
                    <video
                      src="/Sign Language Videos/Math/Module 2- Numbers in Arabic(1 to 20)/14.mp4"
                      className="h-full w-auto max-w-full object-contain"
                      muted
                      autoPlay
                      loop
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </motion.div>

                  {/* First Landscape Video - Top Right */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-black"
                  >
                    <video
                      src="/Sign Language Videos/Math/Module 1-Numbers in English(1 to 20)/9.mp4"
                      className="w-full h-full object-cover"
                      muted
                      autoPlay
                      loop
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </motion.div>

                  {/* Second Landscape Video - Bottom Right (Shifted Down) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-black md:mt-32" // Added md:mt-8 here
                  >
                    <video
                      src="/Sign Language Videos/Math/Module 1-Numbers in English(1 to 20)/11.mp4"
                      className="w-full h-full object-cover"
                      muted
                      autoPlay
                      loop
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Arabic Slide */}
              <motion.div
                className="bg-white/40 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-xl mb-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="p-3 rounded-xl shadow-sm"
                    style={{
                      backgroundColor: '#FFF8E1',
                      border: `2px solid ${colors.text}`,
                    }}
                  >
                    <FaLanguage
                      className="text-3xl md:text-4xl"
                      style={{ color: colors.text }}
                    />
                  </div>
                  <h3
                    className="text-3xl md:text-4xl font-bold"
                    style={{ color: colors.text }}
                  >
                    Arabic Signs
                  </h3>
                </div>

                <p className="text-xl mb-8" style={{ color: colors.text }}>
                  Discover Arabic alphabet, greetings, and cultural vocabulary
                  through sign language videos.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    '/Sign Language Videos/Arabic/Module 1- Alphabets/ك.mp4',
                    '/Sign Language Videos/Arabic/Module 3- Greetings/How are you.mp4',
                    '/Sign Language Videos/Arabic/Module 6- Emirates/Ras al Khaimah.mp4',
                    // add more video paths here
                  ].map((video, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="relative h-48 md:h-56 rounded-xl overflow-hidden shadow-lg"
                    >
                      <video
                        src={video}
                        className="w-full h-full object-cover"
                        muted
                        autoPlay
                        loop
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Enhanced Colorful Sign-Up Section */}
        <section className="pt-4 pb-16 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[2rem] p-8 md:p-10 shadow-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(16px)',
                border: '3px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 10px 30px -10px rgba(142, 123, 239, 0.2)',
              }}
            >
              {/* Colorful decorative elements */}
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#FFD166]/30 blur-2xl"></div>
              <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-[#4ECDC4]/30 blur-2xl"></div>
              <div className="absolute top-1/4 -left-8 w-24 h-24 rounded-full bg-[#FF6B6B]/20 blur-xl"></div>

              <div className="relative text-center space-y-7">
                <h2
                  className="text-4xl md:text-5xl font-medium "
                  style={{
                    background: 'linear-gradient(45deg, #8E7BEF, #5C6BC0)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    fontFamily: "'Fredoka One', cursive",
                    textShadow: '2px 2px 4px rgba(0,0,0,0.05)',
                    lineHeight: '1.2', // or remove for default
                  }}
                >
                  Let's Begin the
                  <br />
                  Learning Adventure!
                </h2>

                <p
                  className="text-xl font-medium italic max-w-xl mx-auto px-4"
                  style={{
                    fontFamily: "'Quicksand', sans-serif",
                    lineHeight: '1.6',
                    color: '#1a1a1a',
                  }}
                >
                  Unlock your child's communication potential with our fun sign
                  language lessons
                </p>

                {/* Enhanced button */}
                <Link to="/signup">
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 10px 25px -5px rgba(142, 123, 239, 0.4)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-5 px-10 py-5 text-xl font-light rounded-full relative overflow-hidden group"
                    style={{
                      background: 'linear-gradient(45deg, #8E7BEF, #6BCBDB)',
                      color: 'white',
                      fontFamily: "'Fredoka One', cursive",
                      border: 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Start Learning Now
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                      >
                        →
                      </motion.span>
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-[#FF6B6B] to-[#C445F4] opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
        {/* Footer */}
        <footer
          className="text-center py-4 backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(38, 84, 124, 0.85)', // colors.text with ~85% opacity
            color: 'white',
          }}
        >
          <div className="mb-2">
            <span className="text-xl">✋</span>
            <span className="font-bold text-lg ml-2">
              Built with care, signs, and smiles!
            </span>
          </div>
          <p className="text-sm">
            © 2025 LittleSigns | Making learning magical!
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
