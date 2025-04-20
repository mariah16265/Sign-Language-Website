import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaChild,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
} from 'react-icons/fa';
import { MdEmail, MdPhone, MdDateRange } from 'react-icons/md';

const SignupPage = () => {
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
    '👂',
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
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden bg-gradient-to-br from-blue-100 via-pink-50 to-purple-50">
      {/* Background elements matching login page */}
      <div className="absolute top-[-50px] left-[-50px] w-[300px] h-[300px] bg-pink-200 opacity-30 blur-xl rounded-full animate-float-slow"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] bg-blue-300 opacity-30 blur-xl rounded-full animate-float-slower"></div>
      <div className="absolute top-1/3 left-1/4 w-[250px] h-[250px] bg-purple-200 opacity-20 blur-xl rounded-full animate-float-medium"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-yellow-100 opacity-20 blur-xl rounded-full animate-float-slowest"></div>

      {/* Floating gradient particles */}
      {[...Array(15)].map((_, i) => {
        const size = Math.random() * 15 + 8;
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
              left: `${50 + Math.random() * 60 - 30}%`,
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
      {[...Array(30)].map((_, i) => {
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

      {/* Floating subtle sparkles */}
      {[...Array(12)].map((_, i) => (
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
            opacity: [0.2, 0.7, 0.2],
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
        className="w-full max-w-3xl z-10"
      >
        <motion.div
          className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-6 md:p-8 border border-white/20"
          whileHover={{ scale: 1.005 }}
        >
          <div className="text-center mb-6">
            <motion.h1
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 mb-2"
              whileHover={{ scale: 1.02 }}
            >
              Create Your Account
            </motion.h1>
            <p className="text-md text-blue-700">
              Join our learning community today!
            </p>
          </div>
          <form className="space-y-8">
            {/* Child Information Section */}
            <motion.div
              className="space-y-5"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4 flex items-center">
                <span className="mr-2 text-3xl">👶</span> Child Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input
                    className="input-field"
                    placeholder="Child's Full Name"
                    required
                  />
                  <div className="input-icon">
                    <span className="text-lg">👦</span>
                  </div>
                </div>

                <div className="relative">
                  <input
                    className="input-field"
                    type="date"
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <div className="input-icon">
                    <span className="text-lg">📅</span>
                  </div>
                </div>

                <div className="relative">
                  <select className="input-field" required>
                    <option value="">Current Communication Style</option>
                    <option>Mostly verbal/speaking</option>
                    <option>Uses some sign language</option>
                    <option>Primarily uses sign language</option>
                    <option>Uses gestures/other communication</option>
                    <option>Not yet communicating verbally</option>
                  </select>
                  <div className="input-icon">
                    <span className="text-lg">💬</span>
                  </div>
                </div>

                <div className="relative">
                  <select className="input-field">
                    <option value="">Communication Needs</option>
                    <option>Deaf or hard of hearing</option>
                    <option>Non-verbal / Speech challenges</option>
                    <option>Autism spectrum</option>
                    <option>Down syndrome</option>
                    <option>Other communication difference</option>
                    <option>Typically developing</option>
                  </select>
                  <div className="input-icon">
                    <span className="text-lg">🦻</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Parent/Guardian Information */}
            <motion.div
              className="space-y-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 mb-3 flex items-center">
                <span className="mr-2 text-2xl">👪</span>Grown-Up Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input
                    className="input-field"
                    placeholder="Your Name"
                    required
                  />
                  <div className="input-icon">
                    <FaUser />
                  </div>
                </div>

                <div className="relative">
                  <input
                    className="input-field"
                    placeholder="Email"
                    type="email"
                    required
                  />
                  <div className="input-icon">
                    <MdEmail />
                  </div>
                </div>

                <div className="relative">
                  <input
                    className="input-field"
                    placeholder="Phone Number"
                    type="tel"
                    required
                  />
                  <div className="input-icon">
                    <MdPhone />
                  </div>
                </div>

                <div className="relative">
                  <select className="input-field" required>
                    <option value="">Relationship to child</option>
                    <option>Parent</option>
                    <option>Guardian</option>
                    <option>Teacher</option>
                    <option>Therapist</option>
                  </select>
                  <div className="input-icon">
                    <FaChild />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Account Setup */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="pt-2"
            >
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-400 mb-3 flex items-center">
                <span className="mr-2 text-2xl">🔒</span> Account Setup
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input
                    className="input-field"
                    placeholder="Create username"
                    required
                  />
                  <div className="input-icon">
                    <span className="text-lg">👑</span>
                  </div>
                </div>

                <div className="relative">
                  <input
                    className="input-field"
                    placeholder="Create password"
                    type={showPassword ? 'text' : 'password'}
                    required
                  />
                  <div className="input-icon">
                    <FaLock />
                  </div>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-pink-500 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash size={16} />
                    ) : (
                      <FaEye size={16} />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mt-6 text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaSignInAlt size={18} />
              Create Account
            </motion.button>

            <p className="text-center text-blue-700 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-pink-500 font-semibold hover:text-pink-600 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </form>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        .input-field {
          width: 100%;
          padding: 0.8rem 0.8rem 0.8rem 2.8rem;
          border-radius: 0.75rem;
          border: 2px solid #bfdbfe;
          background-color: #f8fafc;
          transition: all 0.3s ease;
          font-size: 0.93rem;
        }
        .input-field:focus {
          outline: none;
          border-color: #f9a8d4;
          box-shadow: 0 0 0 3px rgba(249, 168, 212, 0.2);
          background-color: white;
        }
        .input-icon {
          position: absolute;
          left: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          color: #93c5fd;
          pointer-events: none;
          font-size: 0.9rem;
        }
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

export default SignupPage;
