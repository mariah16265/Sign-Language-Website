import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import {
  FaBook,
  FaGlobe,
  FaLaptop,
  FaHandsHelping,
  FaStar,
  FaSignLanguage,
  FaBullseye,
  FaSearch,
  FaChartBar,
  FaUserFriends,
  FaGraduationCap,
  FaShieldAlt,
  FaExclamationCircle,
} from 'react-icons/fa';

const AboutUs = () => {
  const stats = [
    { value: '95%', label: 'Gesture Accuracy', icon: <FaStar /> },
    { value: '2', label: 'Sign Languages', icon: <FaGlobe /> },
    { value: '100+', label: 'Interactive Lessons', icon: <FaBook /> },
  ];

  const features = [
    {
      icon: <FaSignLanguage className="text-3xl" />,
      title: 'Sign Language Lessons',
      description:
        'Modular ASL and ArSL instruction covering alphabets, numbers, colors, animals, and basic phrases.',
    },
    {
      icon: <FaSearch className="text-3xl" />,
      title: 'Interactive Sign Dictionary',
      description:
        'Searchable library of signs with video demos for everyday words.',
    },
    {
      icon: <FaHandsHelping className="text-3xl" />,
      title: 'Gesture-Based Quizzes',
      description:
        'Real-time AI feedback on sign accuracy through interactive quizzes.',
    },
    {
      icon: <FaChartBar className="text-3xl" />,
      title: 'Personalized Study Plans',
      description:
        'Facilitator-generated plans based on subject, level, and weekly goals.',
    },
    {
      icon: <FaGraduationCap className="text-3xl" />,
      title: 'Visual Progress Dashboard',
      description:
        'Tracks signs learned, modules completed, and weekly streaks.',
    },
    {
      icon: <FaUserFriends className="text-3xl" />,
      title: 'Child-Friendly Interface',
      description:
        'Designed for Deaf and Hard of Hearing children aged 2–5—simple, visual, and accessible.',
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: 'Safety & Awareness Signs',
      description:
        'Includes lessons on important signs like good touch/bad touch and emergency signals.',
    },
    {
      icon: <FaUserFriends className="text-3xl" />,
      title: 'Facilitator Onboarding',
      description:
        'NGOs, educators, and caregivers can enroll and support multiple children.',
    },
  ];

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('/assets/aboutus.avif')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-indigo-900 mb-6  mt-6 font-['Fredoka']">
            Signs that
            <span className="text-purple-600"> Connect</span>
          </h1>

          <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-10"></div>
        </motion.div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-1 shadow-xl">
              <div className="bg-white rounded-2xl p-8">
                {/* The Need Section */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-rose-100 p-3 rounded-full">
                      <FaExclamationCircle className="text-2xl text-rose-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-rose-700 font-['Fredoka']">
                      The Challenge We're Solving
                    </h2>
                  </div>
                  <p className=" text-gray-700 text-[18px]">
                    Deaf and Hard of Hearing children lack accessible, sign
                    language-based early education resources, limiting their
                    communication and learning during crucial developmental
                    years.
                  </p>
                </div>

                {/* Our Mission Section */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <FaBullseye className="text-2xl text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-indigo-800 font-['Fredoka']">
                      Our Mission
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <p className="text-[18px] text-gray-700 bg-indigo-50 p-5 rounded-xl border-l-4 border-indigo-400">
                      To make early education accessible to Deaf and Hard of
                      Hearing children through structured English and Arabic
                      Sign Language learning, empowering them to communicate and
                      succeed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full w-16 h-16 flex items-center justify-center shadow-xl">
              <span className="text-3xl">✨</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-14 border-l-4 border-indigo-500 flex flex-col items-center justify-center text-center"
                >
                  <div className="text-4xl font-bold text-indigo-700 mb-2 flex items-center gap-3">
                    {stat.icon}
                    {stat.value}
                  </div>
                  <p className="text-gray-700 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-3">Our Vision</h3>
              <p className="text-white text-[18px] mb-4">
                To create an inclusive early childhood education platform where
                technology bridges communication gaps and helps every child
                unlock their full potential.
              </p>
              <div className="flex space-x-3">
                <span className="text-2xl">👋</span>
                <span className="text-2xl">🧠</span>
                <span className="text-2xl">🌐</span>
                <span className="text-2xl">❤️</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Platform Features */}
        <div className="mb-20 mt-28">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-5xl font-bold text-indigo-800 mb-6 font-['Fredoka']">
              Core Platform Features
            </h2>
            <p className="text-gray-600 text-xl">
              Comprehensive tools designed to empower Deaf and Hard of Hearing
              children
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              // Three-color alternating pattern
              const colorIndex = index % 3;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-2xl shadow-lg p-6 h-full flex flex-col ${
                    colorIndex === 0
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100'
                      : colorIndex === 1
                      ? 'bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100'
                      : 'bg-gradient-to-br from-lime-50 to-emerald-50 border border-lime-100'
                  }`}
                >
                  <div
                    className={`p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-4 ${
                      colorIndex === 0
                        ? 'bg-gradient-to-r from-rose-200 to-pink-200 text-rose-700'
                        : colorIndex === 1
                        ? 'bg-gradient-to-r from-blue-200 to-indigo-200 text-blue-700'
                        : 'bg-gradient-to-r from-green-200 to-teal-200 text-green-700'
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 flex-grow">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-20 mt-24">
          <h2 className="text-5xl font-bold text-indigo-800 mb-4 font-['Fredoka']">
            Meet The Team
          </h2>
          <p className="text-gray-600 max-w-2xl text-xl mx-auto mb-16">
            Final Year B.Tech CSE Students, Manipal University Dubai
          </p>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              {
                name: 'Mariah Abid Masoodi',
                role: 'Frontend Lead & Data Curator',
                contribution:
                  'UI/UX Design, Content Collection & Gesture Model Support',
                initials: 'MM',
              },
              {
                name: 'Syeda Kausar',
                role: 'Backend & AI Specialist',
                contribution: 'Engineered backend systems and gesture model',
                initials: 'SK',
              },
              {
                name: 'Misba Mujawar',
                role: 'UI Designer & Content Specialist',
                contribution:
                  'Created child-friendly interfaces and adapted educational content',
                initials: 'MM',
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl shadow-xl transform group-hover:scale-105 transition-all duration-300"></div>
                <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden border-0 transform transition-all duration-300 h-full flex flex-col">
                  <div className="h-52 bg-gradient-to-r from-indigo-500 to-purple-500 flex flex-col items-center justify-center relative">
                    <div className="bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full w-28 h-28 flex items-center justify-center shadow-lg z-10">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full w-24 h-24 flex items-center justify-center text-purple-700 text-4xl font-medium">
                        {member.initials}
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-white"></div>
                  </div>

                  <div className="p-6 -mt-3 flex-grow flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        {member.role}
                      </p>
                    </div>

                    <div className="flex-grow flex items-center">
                      <p className="text-gray-600 text-lg leading-relaxed mt-2">
                        {member.contribution}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="text-center py-8 bg-gradient-to-r from-indigo-800 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-4 flex justify-center">
            <span className="text-xl mr-2">✋</span>
            <span className="font-bold text-lg">
              Built with care, signs, and smiles!
            </span>
          </div>
          <p className="text-sm">
            © 2024 LittleSigns | Manipal Academy of Higher Education Dubai
          </p>
          <p className="text-indigo-200 text-sm mt-2">
            Making learning accessible for every child
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
