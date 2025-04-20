import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GiHand } from 'react-icons/gi';
import { FaStar, FaRegLaughBeam, FaSignLanguage } from 'react-icons/fa';
import wavingHand from '../assets/hello1.webp';
import englishGif from '../assets/englishGif.gif';
import mathGif from '../assets/mathGif.gif';
import arabicGif from '../assets/arabicGif.gif';

const LandingPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [stars, setStars] = useState([]);

  const addStar = (e) => {
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
      className="relative min-h-screen bg-white overflow-hidden font-sans cursor-default"
      onClick={addStar}
    >
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
              scale: [0, 1, 0],
              opacity: [1, 0.5, 0],
              y: star.y - star.size / 2 - 50,
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute text-yellow-400 pointer-events-none"
            style={{ width: star.size, height: star.size }}
          >
            <FaStar className="w-full h-full drop-shadow-lg" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Background elements */}
      <div className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] bg-purple-100 opacity-20 blur-xl rounded-full z-0 animate-float-slow"></div>
      <div className="absolute bottom-[-100px] right-[-150px] w-[500px] h-[500px] bg-blue-100 opacity-20 blur-xl rounded-full z-0 animate-float-slower"></div>
      <div className="absolute top-1/4 left-1/3 w-[250px] h-[250px] bg-pink-100 opacity-20 blur-xl rounded-full z-0 animate-float-medium"></div>

      {/* Floating elements */}
      {[...Array(40)].map((_, i) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const startX = col * 12.5 + Math.random() * 5;
        const startYOffset = row * 15;
        const driftAmount = (Math.random() * 40 - 20) * (1 + row * 0.2);
        const rotation = Math.random() * 360;
        const size = `${Math.random() * 12 + 14}px`;
        const emoji = ['✋', '👐', '👆', '👇', '👈', '👉', '🤟', '🤘'][row % 8];
        const duration = 25 + row * 2;
        const delay = col * 0.05;

        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none select-none will-change-transform"
            style={{
              left: `${startX}vw`,
              top: `${110 + startYOffset}vh`,
              fontSize: size,
              color: [
                '#a78bfa', // purple-400
                '#f9a8d4', // pink-300
                '#93c5fd', // blue-300
              ][row % 3],
              zIndex: 0,
            }}
            initial={{ y: 0, opacity: 0.8 }}
            animate={{
              y: [-100, -300, -500, -700, -900],
              x: [
                0,
                driftAmount * 0.3,
                driftAmount * 0.7,
                driftAmount,
                driftAmount * 0.7,
              ],
              rotate: [
                rotation,
                rotation + 90,
                rotation + 180,
                rotation + 270,
                rotation + 360,
              ],
              opacity: [0.8, 0.9, 0.8, 0.6, 0.3, 0],
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              repeatDelay: 5,
              ease: [0.5, 0.7, 0.3, 0.1],
            }}
          >
            {emoji}
          </motion.div>
        );
      })}

      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-40">
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <GiHand className="text-4xl text-purple-600" />
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            LittleSigns
          </h1>
        </motion.div>
        <ul className="flex space-x-6 font-medium text-purple-800 text-lg items-center">
          {['Home', 'About', 'Curriculum'].map((item) => (
            <motion.li
              key={item}
              className="hover:text-pink-500 transition-colors flex items-center"
              whileHover={{ scale: 1.1 }}
            >
              <Link to={`/${item.toLowerCase()}`} className="flex items-center">
                {item}
              </Link>
            </motion.li>
          ))}
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/login"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full shadow hover:shadow-md transition-all flex items-center font-bold"
            >
              Login <FaSignLanguage className="ml-2" />
            </Link>
          </motion.li>
        </ul>
      </nav>

      {/* Hero Section - Now Larger and More Prominent */}
      <main className="flex flex-col-reverse md:flex-row items-center justify-center gap-16 py-20 px-6 relative z-20 max-w-7xl mx-auto min-h-[70vh]">
        <div className="text-center md:text-left max-w-2xl space-y-8">
          <motion.h1
            className="text-6xl md:text-7xl font-extrabold leading-tight mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.12 }}
          >
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500"
              animate={{
                backgroundImage: [
                  'linear-gradient(to right, #9333ea, #ec4899)',
                  'linear-gradient(to right, #9333ea, #e879f9)',
                  'linear-gradient(to right, #9333ea, #ec4899)',
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

          <motion.p
            className="text-xl md:text-2xl text-purple-700 mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Explore the magical world of letters, numbers, and everyday
            words—all through{' '}
            <span className="font-bold text-pink-500">playful signs</span> and{' '}
            <span className="font-bold text-purple-500">friendly games</span>{' '}
            made just for you!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="pt-4"
          >
            <Link to="/signup">
              <button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-4 px-10 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-xl">
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

      {/* Learning Cards */}
      <section className="bg-white py-20 px-6 shadow-inner relative z-20">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            What You'll Learn
          </span>
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-10 max-w-6xl mx-auto">
          {[
            {
              title: 'English',
              icon: (
                <FaSignLanguage className="text-5xl text-purple-500 mb-3" />
              ),
              gif: englishGif,
              bgColor: 'bg-purple-50',
              borderColor: 'border-purple-200',
              delay: 0.1,
              content:
                'Discover everyday words, colorful signs, and your favorite animals!',
            },
            {
              title: 'Math',
              icon: <FaSignLanguage className="text-5xl text-pink-500 mb-3" />,
              gif: mathGif,
              bgColor: 'bg-pink-50',
              borderColor: 'border-pink-200',
              delay: 0.2,
              content:
                'Count, compare, and solve little puzzles with fruits and fun!',
            },
            {
              title: 'Arabic',
              icon: <FaSignLanguage className="text-5xl text-blue-500 mb-3" />,
              gif: arabicGif,
              bgColor: 'bg-blue-50',
              borderColor: 'border-blue-200',
              delay: 0.3,
              content:
                'Learn kind greetings, explore letters, and speak a new language with joy!',
            },
          ].map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: card.delay }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
              className={`${card.bgColor} w-80 md:w-96 text-center p-8 rounded-3xl shadow-md border-2 ${card.borderColor} cursor-default`}
            >
              <img
                src={card.gif}
                alt={card.title}
                className="w-48 h-48 object-contain mb-6 mx-auto rounded-xl"
              />
              <h3 className="text-3xl font-bold text-purple-800 mb-4">
                {card.title}
              </h3>
              <p className="text-xl text-purple-700">{card.content}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 mt-6 z-10 relative bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-100">
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
          <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            Built with care, signs, and smiles!
          </span>
        </motion.div>
        <div className="text-purple-700 text-lg">
          © 2025 LittleSigns | Making learning magical!
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }
        @keyframes float-slower {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(30px) rotate(-2deg);
          }
        }
        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.05);
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
