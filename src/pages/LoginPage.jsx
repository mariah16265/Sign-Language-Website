import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Updated emoji options to match signup page
  const emojis = [
    '🌈',
    '⭐',
    '🌟',
    '✨',
    '🎈',
    '🎀',
    '🎁',
    '🧸',
    '🦄',
    '🐝',
    '🦋',
    '🐞',
    '🐶',
    '🐱',
    '🦁',
    '🐯',
    '🦊',
    '🐻',
    '🐧',
    '🦉',
    '🐙',
    '🦕',
    '🚀',
    '🎠',
    '🎪',
    '🎨',
    '🧩',
    '🎯',
    '🍎',
    '🍭',
    '🍪',
    '🧁',
    '👋',
    '✋',
    '🤚',
    '📚',
    '✏️',
    '🎨',
    '🖍️',
    '🎮',
    '🧩',
    '🎲',
    '🏆',
    '🎵',
    '🎶',
    '🎤',
    '🎧',
    '🎭',
    '🤹',
    '🎪',
  ];

  const colors = [
    '#a78bfa',
    '#f9a8d4',
    '#93c5fd',
    '#86efac',
    '#fde047',
    '#fca5a5',
    '#7dd3fc',
    '#c4b5fd',
    '#bef264',
    '#fda4af',
  ];

  // Memoize the emoji data to prevent recreation on re-renders
  const floatingEmojis = useMemo(() => {
    return [...Array(60)].map((_, i) => {
      const row = Math.floor(i / 10);
      const col = i % 10;
      const startX = col * 10 + Math.random() * 5;
      const startYOffset = row * 12;
      const driftAmount = (Math.random() * 60 - 30) * (1 + row * 0.1);
      const rotation = Math.random() * 360;
      const size = `${Math.random() * 16 + 16}px`;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const duration = 15 + row * 1.5;
      const delay = col * 0.03;

      return {
        id: i,
        startX,
        startYOffset,
        driftAmount,
        rotation,
        size,
        emoji,
        duration,
        delay,
        color: colors[i % colors.length],
      };
    });
  }, []); // Empty dependency array means this only runs once

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8 pt-24 overflow-hidden bg-gradient-to-br from-blue-100 via-pink-50 to-purple-50">
      <div className="absolute top-0 left-0 w-full z-20">
        <Navbar hideLoginButton={true} />
      </div>

      {/* Background elements - matching signup page */}
      <div className="absolute top-[-50px] left-[-50px] w-[300px] h-[300px] bg-pink-200 opacity-30 blur-xl rounded-full animate-float-slow"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] bg-blue-300 opacity-30 blur-xl rounded-full animate-float-slower"></div>
      <div className="absolute top-1/3 left-1/4 w-[250px] h-[250px] bg-purple-200 opacity-20 blur-xl rounded-full animate-float-medium"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-yellow-100 opacity-20 blur-xl rounded-full animate-float-slowest"></div>

      {/* Floating emojis - now using memoized data */}
      {floatingEmojis.map((emojiData) => (
        <motion.div
          key={emojiData.id}
          className="absolute pointer-events-none select-none will-change-transform"
          style={{
            left: `${emojiData.startX}vw`,
            top: `${80 + emojiData.startYOffset}vh`,
            fontSize: emojiData.size,
            color: emojiData.color,
            zIndex: 0,
            filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.1))',
          }}
          initial={{ y: 0, opacity: 0.8 }}
          animate={{
            y: [-100, -400, -700, -1000, -1300],
            x: [
              0,
              emojiData.driftAmount * 0.3,
              emojiData.driftAmount * 0.7,
              emojiData.driftAmount,
              emojiData.driftAmount * 0.5,
            ],
            rotate: [
              emojiData.rotation,
              emojiData.rotation + 180,
              emojiData.rotation + 360,
              emojiData.rotation + 540,
              emojiData.rotation + 720,
            ],
            opacity: [0.8, 0.9, 0.7, 0.5, 0.2, 0],
          }}
          transition={{
            duration: emojiData.duration,
            delay: emojiData.delay,
            repeat: Infinity,
            repeatDelay: 3,
            ease: [0.4, 0.6, 0.2, 0.1],
          }}
        >
          {emojiData.emoji}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 mb-2"
            whileHover={{ scale: 1.02 }}
          >
            Welcome Back!
          </motion.h1>
          <p className="text-lg text-blue-700">
            Continue your learning journey with us
          </p>
        </div>

        <motion.form
          className="bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl p-8 space-y-6 border border-white/20"
          whileHover={{ scale: 1.01 }}
        >
          <div>
            <label className="block text-blue-700 mb-2 font-medium">
              Username or Email
            </label>
            <motion.div whileHover={{ scale: 1.01 }}>
              <input
                type="text"
                className="w-full p-4 rounded-xl border-2 border-blue-100 focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all duration-300"
                placeholder="Enter your username or email"
              />
            </motion.div>
          </div>

          <div>
            <label className="block text-blue-700 mb-2 font-medium">
              Password
            </label>
            <motion.div className="relative" whileHover={{ scale: 1.01 }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full p-4 rounded-xl border-2 border-blue-100 focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all duration-300 pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-pink-500 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </motion.div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-pink-500 focus:ring-pink-300 border-blue-200 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm text-blue-700"
              >
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="text-sm text-pink-500 hover:text-pink-600 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <motion.span
              animate={{ x: isHovered ? [0, 2, -2, 0] : 0 }}
              transition={{ duration: 0.5 }}
            >
              <FaSignInAlt />
            </motion.span>
            Log In
          </motion.button>

          <p className="text-center text-blue-700">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-pink-500 font-semibold hover:text-pink-600 transition-colors"
            >
              Sign up now
            </Link>
          </p>
        </motion.form>
      </motion.div>

      <style jsx global>{`
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float 10s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float 12s ease-in-out infinite;
        }
        .animate-float-slowest {
          animation: float 14s ease-in-out infinite;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
