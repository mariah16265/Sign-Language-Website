import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import Navbar from '../components/Navbar';
// import FloatingEmojis from '../components/FloatingEmojis';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loginError, setLoginError] = useState('');

  //sending login database
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  // Check if user already logged in-token exists and is valid on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('tokenExpiry');
    if (token && expiry && Date.now() < expiry) {
      const isNewUser = localStorage.getItem('isNewUser');
      if (isNewUser === 'true') {
        navigate('/studyplan'); // Redirect to study plan if not a new user
      } else {
        navigate('/dashboard'); // Redirect to dashboard if the user is new
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      //login successfull
      console.log('Logged IN:', data);
      localStorage.setItem('token', data.token); //Store the token in localStorage
      localStorage.setItem('userName', data.user.username);
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('isNewUser', data.isNewUser);

      // Decode the token to get the expiry time (exp is in seconds, so multiply by 1000 for milliseconds)
      const decodedToken = jwtDecode(data.token);
      const tokenExpiry = decodedToken.exp * 1000; // Convert from seconds to milliseconds
      localStorage.setItem('tokenExpiry', tokenExpiry); // Store expiry time in localStorage
      //direct to page
      if (data.isNewUser) {
        navigate('/studyplan'); // Redirect new users to the study plan page
      } else {
        navigate('/dashboard'); // Redirect existing users to their dashboard
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError(`❌ Login failed: ${err.message}`);
    }
  };

  // // Updated emoji options to match signup page
  // const emojis = [
  //   '🌈',
  //   '⭐',
  //   '🌟',
  //   '✨',
  //   '🎈',
  //   '🎀',
  //   '🎁',
  //   '🧸',
  //   '🦄',
  //   '🐝',
  //   '🦋',
  //   '🐞',
  //   '🐶',
  //   '🐱',
  //   '🦁',
  //   '🐯',
  //   '🦊',
  //   '🐻',
  //   '🐧',
  //   '🦉',
  //   '🐙',
  //   '🦕',
  //   '🚀',
  //   '🎠',
  //   '🎪',
  //   '🎨',
  //   '🧩',
  //   '🎯',
  //   '🍎',
  //   '🍭',
  //   '🍪',
  //   '🧁',
  //   '👋',
  //   '✋',
  //   '🤚',
  //   '📚',
  //   '✏️',
  //   '🎨',
  //   '🖍️',
  //   '🎮',
  //   '🧩',
  //   '🎲',
  //   '🏆',
  //   '🎵',
  //   '🎶',
  //   '🎤',
  //   '🎧',
  //   '🎭',
  //   '🤹',
  //   '🎪',
  // ];

  // const colors = [
  //   '#a78bfa',
  //   '#f9a8d4',
  //   '#93c5fd',
  //   '#86efac',
  //   '#fde047',
  //   '#fca5a5',
  //   '#7dd3fc',
  //   '#c4b5fd',
  //   '#bef264',
  //   '#fda4af',
  // ];

  // // Memoize the emoji data to prevent recreation on re-renders
  // const floatingEmojis = useMemo(() => {
  //   return [...Array(60)].map((_, i) => {
  //     const row = Math.floor(i / 10);
  //     const col = i % 10;
  //     const startX = col * 10 + Math.random() * 5;
  //     const startYOffset = row * 12;
  //     const driftAmount = (Math.random() * 60 - 30) * (1 + row * 0.1);
  //     const rotation = Math.random() * 360;
  //     const size = `${Math.random() * 16 + 16}px`;
  //     const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  //     const duration = 15 + row * 1.5;
  //     const delay = col * 0.03;

  //     return {
  //       id: i,
  //       startX,
  //       startYOffset,
  //       driftAmount,
  //       rotation,
  //       size,
  //       emoji,
  //       duration,
  //       delay,
  //       color: colors[i % colors.length],
  //     };
  //   });
  // }, []); // Empty dependency array means this only runs once

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="w-full z-50">
        <Navbar hideLoginButton={true} />
      </div>

      {/* Background Container */}
      <div
        className="flex-1 relative flex items-center justify-center"
        style={{
          backgroundImage: "url('/assets/login.webp')",
          backgroundSize: 'cover', // This ensures the image covers the entire container
          backgroundPosition: 'center center', // Center the image
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed', // Optional: makes the background fixed during scrolling
        }}
      >
        {/* Semi-transparent overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              'linear-gradient(to right, rgba(255,241,204,0.3), rgba(255,224,130,0.2))',
            backdropFilter: 'blur(2px)',
          }}
        ></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md z-10"
        >
          <motion.form
            onSubmit={handleLogin}
            className="bg-[#fff9cc] backdrop-blur-sm shadow-xl rounded-3xl p-8 space-y-6 border border-white/20"
            whileHover={{ scale: 1.01 }}
          >
            {/* Welcome Section */}
            <div className="text-center">
              <motion.h1
                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800 mb-2"
                whileHover={{ scale: 1.02 }}
              >
                Welcome Back!
              </motion.h1>
              <p className="text-lg text-amber-800">
                Continue your learning journey with us
              </p>
            </div>

            {/* Input Fields */}
            <div>
              <label className="block text-amber-800 mb-2 font-medium">
                Username or Email
              </label>
              <motion.div whileHover={{ scale: 1.01 }}>
                <input
                  type="text"
                  className="w-full p-4 rounded-xl border-2 border-amber-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all duration-300 text-amber-900 placeholder-amber-400"
                  placeholder="Enter your username or email"
                  name="username"
                  value={loginData.username}
                  onChange={handleChange}
                />
              </motion.div>
            </div>

            <div>
              <label className="block text-amber-800 mb-2 font-medium">
                Password
              </label>
              <motion.div className="relative" whileHover={{ scale: 1.01 }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full p-4 rounded-xl border-2 border-amber-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all duration-300 pr-12 text-amber-900 placeholder-amber-400"
                  placeholder="Enter your password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </motion.div>
            </div>

            {loginError && (
              <p className="text-red-700 font-medium mt-2">{loginError}</p>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-300 border-amber-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-amber-800"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-amber-600 hover:text-amber-800 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
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

            {/* Sign Up Link */}
            <p className="text-center text-amber-800">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-amber-600 font-semibold hover:text-amber-800 transition-colors"
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
    </div>
  );
};

export default LoginPage;
