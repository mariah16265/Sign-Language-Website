import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import FloatingEmojis from '../components/FloatingEmojis';
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
  const [signupError, setSignupError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Cname: '',
    Cdob: '',
    Cstyle: '',
    Cneeds: '',
    Gname: '',
    Gemail: '',
    Gphone: '',
    Grelation: '',
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');
      console.log('User created:', data);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      console.error('Signup error:', err.message);
      setSignupError(`❌ Signup failed: ${err.message}`);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="w-full z-20">
        <Navbar hideLoginButton={true} />
      </div>

      {/* Background Container */}
      <div
        className="flex-1 relative font-[Poppins]"
        style={{
          backgroundImage: "url('/assets/signupbg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#f0f4f8',
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,0,150,0.07) 0%, rgba(0,100,255,0.05) 100%)',
            // backdropFilter: 'blur(2px)', // Optional blur effect
            // WebkitBackdropFilter: 'blur(2px)', // For Safari
          }}
        />

        {/* Main Content */}
        <div className="mt-3 flex-grow flex items-center justify-center w-full">
          <motion.div className="w-full max-w-[760px] z-10">
            <motion.div
              className="bg-white backdrop-blur-sm shadow-2xl rounded-2xl p-6 md:p-8 border border-purple-100"
              whileHover={{ scale: 1.005 }}
            >
              <div className="text-center mb-5">
                <motion.h1
                  className="font-quicksand text-[37px] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-rose-500 "
                  whileHover={{ scale: 1.02 }}
                >
                  Create Your Account
                </motion.h1>
                <p className="font-nunito text-lg text-slate-600 ">
                  Join our learning community today!
                </p>
              </div>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Child Information Section */}
                <motion.div className="space-y-3">
                  <h2 className="font-poppins text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400 mb-1 flex items-center">
                    <span className="mr-2 text-3xl">👶</span> Child Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <div className="relative">
                      <input
                        className="input-field border-rose-100 focus:border-rose-300"
                        placeholder="Child's Full Name"
                        required
                        minLength={2}
                        title="Please enter at least 2 characters"
                        name="Cname"
                        value={formData.Cname}
                        onChange={handleChange}
                      />

                      <div className="input-icon text-rose-500">
                        <span className="text-lg">👦</span>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        className="input-field"
                        type="date"
                        required
                        max={new Date().toISOString().split('T')[0]}
                        name="Cdob"
                        value={formData.Cdob}
                        onChange={handleChange}
                        onClick={(e) => e.target.showPicker()} // Add this
                      />
                      <div className="input-icon text-yellow-500">
                        {' '}
                        {/* Changed color */}
                        <span className="text-lg">📅</span>
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        className="input-field"
                        required
                        name="Cstyle"
                        value={formData.Cstyle}
                        onChange={handleChange}
                      >
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
                      <select
                        className="input-field"
                        name="Cneeds"
                        value={formData.Cneeds}
                        onChange={handleChange}
                      >
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
                <motion.div className="space-y-3">
                  <h2 className="font-poppins text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500 mb-2 flex items-center">
                    <span className="mr-2 text-2xl">👪</span> Grown-Up
                    Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <div className="relative">
                      <input
                        className="input-field border-teal-100 focus:border-teal-300"
                        placeholder="Your Name"
                        required
                        minLength={2}
                        title="Please enter at least 2 characters"
                        name="Gname"
                        value={formData.Gname}
                        onChange={handleChange}
                      />

                      <div className="input-icon text-teal-500">
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
                        name="Gemail"
                        value={formData.Gemail}
                        onChange={handleChange}
                      />

                      <div className="input-icon text-green-500">
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
                        name="Gphone"
                        value={formData.Gphone}
                        onChange={handleChange}
                      />

                      <div className="input-icon text-purple-500">
                        <MdPhone />
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        className="input-field"
                        required
                        name="Grelation"
                        value={formData.Grelation}
                        onChange={handleChange}
                      >
                        <option value="">Relationship to child</option>
                        <option>Parent</option>
                        <option>Guardian</option>
                        <option>Teacher</option>
                        <option>Therapist</option>
                      </select>
                      <div className="input-icon text-pink-500">
                        <FaChild />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Account Setup */}
                <motion.div className="pt-2">
                  <h2 className="font-poppins text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 mb-3 flex items-center">
                    <span className="mr-2 text-2xl">🔒</span> Account Setup
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="relative">
                      <input
                        className="input-field border-indigo-100 focus:border-indigo-300"
                        placeholder="Create username"
                        required
                        pattern="^[a-zA-Z0-9_]{4,16}$"
                        title="Username should be 4–16 characters and only contain letters, numbers, or underscores"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />

                      <div className="input-icon text-indigo-500">
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
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />

                      <div className="input-icon text-red-500">
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

                {signupError && (
                  <p className="text-red-600 font-medium mt-2">{signupError}</p>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 text-white py-3 px-2 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 text-base"
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
        </div>

        <style jsx global>{`
          .input-field {
            border-radius: 0.8rem;
            max-width: 320px;
            width: 100%;
            padding: 0.75rem 2.8rem;
            border: 2px solid #d9cfc5; /* violet-200 */
            background-color: #fff9fb; /* Tailwind: neutral-50 */
            color: #4c1d95; /* violet-900 */
            transition: all 0.3s ease;
            font-size: 0.875rem;
          }
          .input-field::placeholder {
            color: #9b4df0; /* Violet-600 for placeholders */
            opacity: 1; /* Ensure full visibility */
          }
          .input-field:focus {
            outline: none;
            border-color: #f9a8d4;
            box-shadow: 0 0 0 3px rgba(249, 168, 212, 0.2);
            background-color: white;
          }
          select.input-field {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='%231d4ed8' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 16px 12px;
            appearance: none;
            color: #9b4df0; /* Violet-600 for select placeholders */
          }
          input[type='date']::-webkit-datetime-edit {
            color: #9b4df0; /* Violet-600 for date placeholder */
          }

          input[type='date']:not(:focus)::-webkit-datetime-edit {
            color: #9b4df0; /* Maintain color when not focused */
          }

          input[type='date']:valid::-webkit-datetime-edit {
            color: #4c1d95; /* Violet-900 when date is selected */
          }

          /* Hide calendar icon */
          input[type='date']::-webkit-calendar-picker-indicator {
            display: none;
          }
          .input-icon {
            position: absolute;
            left: 0.8rem;
            top: 50%;
            transform: translateY(-50%);
            /* Remove color: #172554; */
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
          @media (min-width: 1024px) {
            .input-field {
              max-width: 360px; // Reduced from 400px
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SignupPage;
