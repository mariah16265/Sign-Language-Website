import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Emoji options for floating background elements
  const emojis = [
    '✋',
    '👋',
    '👐',
    '🙌',
    '👏',
    '🤲',
    '👍',
    '👌',
    '✌️',
    '🤟',
    '🤘',
    '👆',
    '👇',
    '👈',
    '👉',
    '🖐️',
    '🤙',
    '🖖',
    '👋',
    '🤚',
    '🧠',
    '👀',

    '👄',
    '🦷',
    '👁️',
    '🌈',
    '✨',
    '🎈',
    '🎀',
    '🎁',
    '🧸',
    '🪀',
    '🪁',
    '🔮',
    '🪄',
    '📚',
    '📖',
    '✏️',
    '📝',
    '🔢',
    '🔤',
    '🔡',
    '📐',
    '🧮',
    '📏',
    '📌',
    '📍',
    '🎯',
    '🖍️',
    '🖌️',
    '🖊️',
    '✒️',
    '🖋️',
    '✏️',
    '📒',
    '📔',
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden bg-gradient-to-br from-blue-100 via-pink-50 to-purple-50">
      {/* Enhanced background elements - larger and more vibrant */}
      <div className="absolute top-[-50px] left-[-50px] w-[400px] h-[400px] bg-pink-200 opacity-30 blur-xl rounded-full animate-float-slow"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-[500px] h-[500px] bg-blue-300 opacity-30 blur-xl rounded-full animate-float-slower"></div>
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-200 opacity-20 blur-xl rounded-full animate-float-medium"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[350px] bg-yellow-100 opacity-20 blur-xl rounded-full animate-float-slowest"></div>

      {/* Floating gradient particles - increased quantity and size */}
      {[...Array(25)].map((_, i) => {
        const size = Math.random() * 20 + 10;
        const color = [
          'bg-pink-300',
          'bg-blue-300',
          'bg-purple-300',
          'bg-yellow-300',
        ][Math.floor(Math.random() * 4)];

        return (
          <motion.div
            key={i}
            className={`absolute rounded-full ${color} opacity-30`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, -200, -300],
              x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.5, 0.3, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'linear',
            }}
          />
        );
      })}

      {/* Floating emojis - increased quantity and variety */}
      {[...Array(35)].map((_, i) => {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const size = Math.random() * 0.8 + 0.8; // Random size between 0.8 and 1.6rem

        return (
          <motion.div
            key={`emoji-${i}`}
            className="absolute pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${size}rem`,
              opacity: 0.2 + Math.random() * 0.3, // Random opacity between 0.2 and 0.5
              filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))',
            }}
            animate={{
              y: [0, -50, -100, -150, -200],
              x: [0, Math.random() * 40 - 20, Math.random() * 40 - 20],
              rotate: [0, Math.random() * 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'linear',
            }}
          >
            {emoji}
          </motion.div>
        );
      })}

      {/* Floating subtle sparkles - more dynamic */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute text-xl opacity-70 pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            color: ['#f472b6', '#60a5fa', '#a78bfa', '#fbbf24'][
              Math.floor(Math.random() * 4)
            ],
          }}
          animate={{
            y: [0, -50, -100, -150],
            x: [0, Math.random() * 20 - 10],
            scale: [1, 1.2, 1],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        >
          {['✨', '⭐', '❄️', '⚡'][Math.floor(Math.random() * 4)]}
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
