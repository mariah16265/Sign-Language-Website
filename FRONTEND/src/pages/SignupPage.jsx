import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import {
  FaUser,
  FaChild,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaSchool,
  FaHandsHelping,
} from 'react-icons/fa';
import {
  MdEmail,
  MdPhone,
  MdBusiness,
  MdOutlineAccessibility,
} from 'react-icons/md';
import { GiTeacher } from 'react-icons/gi';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Your Information
    Fname: '',
    Forganization: '',
    Frole: '', // Changed from 'teacher' to empty string
    Femail: '',
    Fphone: '',
    Faddress: '',

    // Child Info
    Cname: '',
    Cdob: '',
    Cgender: '',
    Cdisability: '',
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

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Facilitator Information - Now First Section */}

                <motion.div className="space-y-3">
                  <h2 className="font-poppins text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500 mb-3 flex items-center">
                    <span className="mr-2 text-2xl">👤</span> Your Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-2">
                    <div className="relative">
                      <input
                        className="input-field"
                        placeholder="Full Name"
                        required
                        name="Fname"
                        value={formData.Fname}
                        onChange={handleChange}
                      />
                      <div className="input-icon text-teal-500">
                        <FaUser />
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        className="input-field"
                        placeholder="Organization Name"
                        required={
                          formData.Frole !== 'parent' &&
                          formData.Frole !== 'caregiver'
                        }
                        name="Forganization"
                        value={formData.Forganization}
                        onChange={handleChange}
                      />
                      <div className="input-icon text-blue-500">
                        <MdBusiness />
                      </div>
                    </div>
                    {/* Facilitator Role Dropdown */}
                    <div className="relative">
                      <select
                        className="input-field"
                        required
                        name="Frole"
                        value={formData.Frole}
                        onChange={handleChange}
                      >
                        <option value="" disabled className="text-gray-400">
                          Select your role
                        </option>
                        <option value="teacher">Teacher/Educator</option>
                        <option value="ngo_worker">NGO/CBO Worker</option>
                        <option value="caregiver">Caregiver</option>

                        <option value="speech_therapist">
                          Speech Therapist
                        </option>
                        <option value="parent">Parent/Guardian</option>
                      </select>
                      <div className="input-icon text-purple-500">
                        <GiTeacher />
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        className="input-field"
                        placeholder="Organization Address"
                        required={
                          formData.Frole !== 'parent' &&
                          formData.Frole !== 'caregiver'
                        }
                        name="Faddress"
                        value={formData.Faddress}
                        onChange={handleChange}
                      />
                      <div className="input-icon text-green-500">
                        <FaSchool />
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
                        name="Femail"
                        value={formData.Femail}
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
                        name="Fphone"
                        value={formData.Fphone}
                        onChange={handleChange}
                      />

                      <div className="input-icon text-purple-500">
                        <MdPhone />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Child Information Section */}
                <motion.div className="space-y-3">
                  <h2 className="font-poppins text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400 mb-3 flex items-center">
                    <span className="mr-2 text-2xl">👦</span> Child Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-2">
                    {/* Basic Info */}
                    <div className="relative">
                      <input
                        className="input-field"
                        placeholder="Child's Full Name"
                        required
                        name="Cname"
                        value={formData.Cname}
                        onChange={handleChange}
                      />
                      <div className="input-icon text-pink-500">
                        <FaChild />
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        className="input-field"
                        type="date"
                        required
                        name="Cdob"
                        value={formData.Cdob}
                        onChange={handleChange}
                      />
                      <div className="input-icon text-yellow-500">
                        <span>🎂</span>
                      </div>
                    </div>

                    {/* Gender and Disability Row */}
                    <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-2">
                      {/* Gender Selection */}
                      <div className="relative w-full">
                        <div className="input-field flex items-center space-x-6 p-3 h-full">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="male"
                              name="Cgender"
                              value="male"
                              checked={formData.Cgender === 'male'}
                              onChange={handleChange}
                              className="form-radio h-4 w-4 text-purple-600"
                              required
                            />
                            <label htmlFor="male" className="text-purple-600">
                              Male
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="female"
                              name="Cgender"
                              value="female"
                              checked={formData.Cgender === 'female'}
                              onChange={handleChange}
                              className="form-radio h-4 w-4 text-purple-600"
                            />
                            <label htmlFor="female" className="text-purple-600">
                              Female
                            </label>
                          </div>
                        </div>
                        <div className="input-icon text-blue-400">
                          <MdOutlineAccessibility />
                        </div>
                      </div>

                      {/* Disability Dropdown */}
                      <div className="relative w-full">
                        <select
                          className="input-field w-full"
                          required
                          name="Cdisability"
                          value={formData.Cdisability}
                          onChange={handleChange}
                        >
                          <option value="">Select disability type</option>
                          <option value="hearing_impairment">
                            Hearing disability
                          </option>
                          <option value="speech_disorder">
                            Speech disability
                          </option>
                          <option value="autism_verbal">Autism (verbal)</option>
                          <option value="autism_nonverbal">
                            Autism (nonverbal)
                          </option>
                          <option value="intellectual">
                            Intellectual disability
                          </option>
                          <option value="down_syndrome">Down syndrome</option>
                          <option value="cerebral_palsy">Cerebral palsy</option>
                          <option value="multiple_disabilities">
                            Multiple disabilities
                          </option>
                        </select>
                        <div className="input-icon text-green-500">
                          <FaHandsHelping />
                        </div>
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
            border: 2px solid #d9cfc5;
            background-color: #fff9fb;
            color: #4c1d95;
            transition: all 0.3s ease;
            font-size: 0.875rem;
          }
          .input-field::placeholder {
            color: #9b4df0;
            opacity: 1;
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
            color: #9b4df0;
          }
          input[type='date'] {
            color: #9b4df0;
          }
          input[type='date']:valid {
            color: #4c1d95;
          }
          .input-icon {
            position: absolute;
            left: 0.8rem;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            font-size: 0.9rem;
          }
          @media (min-width: 1024px) {
            .input-field {
              max-width: 360px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SignupPage;
