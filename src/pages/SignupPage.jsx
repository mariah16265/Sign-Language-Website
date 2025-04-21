import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

import {
  FaUser,
  FaChild,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
} from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const [] = useState(false);

  // Updated emoji options with fewer hands and more fun elements
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

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8 pt-24 overflow-hidden bg-gradient-to-br from-blue-100 via-pink-50 to-purple-50">
      <div className="absolute top-0 left-0 w-full z-20">
        <Navbar hideLoginButton={true} />
      </div>

      {/* Background elements */}
      <div className="absolute top-[-50px] left-[-50px] w-[300px] h-[300px] bg-pink-200 opacity-30 blur-xl rounded-full animate-float-slow"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] bg-blue-300 opacity-30 blur-xl rounded-full animate-float-slower"></div>
      <div className="absolute top-1/3 left-1/4 w-[250px] h-[250px] bg-purple-200 opacity-20 blur-xl rounded-full animate-float-medium"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-yellow-100 opacity-20 blur-xl rounded-full animate-float-slowest"></div>

      {/* Floating emojis - enhanced version */}
      {[...Array(60)].map((_, i) => {
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

        // Vibrant colors
        const colors = [
          '#a78bfa', // purple
          '#f9a8d4', // pink
          '#93c5fd', // blue
          '#86efac', // green
          '#fde047', // yellow
          '#fca5a5', // red
          '#7dd3fc', // light blue
          '#c4b5fd', // light purple
          '#bef264', // lime
          '#fda4af', // rose
        ];

        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none select-none will-change-transform"
            style={{
              left: `${startX}vw`,
              top: `${80 + startYOffset}vh`,
              fontSize: size,
              color: colors[i % colors.length],
              zIndex: 0,
              filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.1))',
            }}
            initial={{ y: 0, opacity: 0.8 }}
            animate={{
              y: [-100, -400, -700, -1000, -1300],
              x: [
                0,
                driftAmount * 0.3,
                driftAmount * 0.7,
                driftAmount,
                driftAmount * 0.5,
              ],
              rotate: [
                rotation,
                rotation + 180,
                rotation + 360,
                rotation + 540,
                rotation + 720,
              ],
              opacity: [0.8, 0.9, 0.7, 0.5, 0.2, 0],
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              repeatDelay: 3,
              ease: [0.4, 0.6, 0.2, 0.1],
            }}
          >
            {emoji}
          </motion.div>
        );
      })}
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
                    minLength={2}
                    title="Please enter at least 2 characters"
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
                    minLength={2}
                    title="Please enter at least 2 characters"
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
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    title="Please enter a valid email address (e.g., name@example.com)"
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
                    pattern="^[0-9]{10,15}$"
                    title="Phone number should be 10 to 15 digits"
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
                    pattern="^[a-zA-Z0-9_]{4,16}$"
                    title="Username should be 4–16 characters and only contain letters, numbers, or underscores"
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
                    minLength={6}
                    title="Password must be at least 6 characters"
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
