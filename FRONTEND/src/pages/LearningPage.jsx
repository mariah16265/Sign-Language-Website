import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useCheckTokenValid } from '../utils/apiErrorHandler';

const LearningPage = () => {
  const navigate = useNavigate();
  const { checkTokenValid } = useCheckTokenValid();
  const [allowedSubjects, setAllowedSubjects] = useState([]);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Check for valid token on mount
  useEffect(() => {
    const isTokenValid = checkTokenValid();
    if (!isTokenValid) return;
  }, []);

  useEffect(() => {
    const fetchStudyPlan = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/studyplan/${userId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error('❌ Failed to fetch study plan');
          return;
        }

        const data = await response.json();
        const subjectKeys = Object.keys(data.startingLevels); // e.g., ['English', 'Arabic']
        setAllowedSubjects(subjectKeys);
      } catch (error) {
        console.error('Error fetching study plan:', error);
      }
    };

    fetchStudyPlan();
  }, []);

  const subjectsData = [
    {
      name: 'English Signs',
      key: 'English',
      path: '/english',
      image: '/assets/english.jpeg',
      gradient: 'from-purple-500 to-indigo-600',
      borderColor: 'border-purple-500',
      row: 1,
    },
    {
      name: 'Arabic Signs',
      key: 'Arabic',
      path: '/arabic',
      image: '/assets/arabic.jpeg',
      gradient: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-500',
      row: 1,
    },
    {
      name: 'Emergency Signs',
      key: 'Emergency',
      path: '/emergency',
      image: '/assets/life.jpeg',
      gradient: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-500',
      row: 2,
    },
    {
      name: 'Awareness Signs',
      key: 'Awareness',
      path: '/awareness',
      image: '/assets/mental.jpeg',
      gradient: 'from-pink-500 to-red-600',
      borderColor: 'border-pink-500',
      row: 2,
    },
  ];

  const filteredSubjects = subjectsData.filter(
    (subject) =>
      ['Emergency', 'Awareness'].includes(subject.key) ||
      allowedSubjects.includes(subject.key)
  );

  // Separate subjects by row
  const row1Subjects = filteredSubjects.filter((subject) => subject.row === 1);
  const row2Subjects = filteredSubjects.filter((subject) => subject.row === 2);

  const onSelectSubject = (subject) => {
    navigate('/learn/subjects', {
      state: { subject: subject.name.split(' ')[0] },
    });
  };

  return (
    <div
      style={{
        background:
          'linear-gradient(-180deg, rgba(255, 229, 202, 0.9), rgba(255, 206, 250, 0.9))',
        color: '#333',
      }}
      className="relative min-h-screen overflow-hidden"
    >
      <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />

      <div className="flex flex-col lg:flex-row min-h-screen z-10 relative">
        <Sidebar />

        <div className="flex-1 p-4 md:p-6 lg:p-8 mt-12">
          {/* First row - English and Arabic */}
          <motion.div
            className="flex flex-wrap justify-center gap-20 mb-8 mx-auto max-w-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {row1Subjects.map((subject, index) => (
              <motion.div
                key={`row1-${index}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex justify-center"
                onClick={() => onSelectSubject(subject)}
              >
                <div
                  className={`w-96 h-72 rounded-2xl shadow-lg overflow-hidden bg-gradient-to-r ${subject.gradient} flex flex-col cursor-pointer`}
                >
                  <div
                    className={`w-full h-56 bg-white border-4 ${subject.borderColor} rounded-t-2xl overflow-hidden`}
                  >
                    <img
                      src={subject.image}
                      alt={subject.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 flex items-center justify-center p-2">
                    <h3 className="text-xl font-bold text-white text-center">
                      {subject.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Second row - Emergency and Awareness */}
          <motion.div
            className="flex flex-wrap justify-center gap-20 mx-auto max-w-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {row2Subjects.map((subject, index) => (
              <motion.div
                key={`row2-${index}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex justify-center"
                onClick={() => onSelectSubject(subject)}
              >
                <div
                  className={`w-96 h-72 rounded-2xl shadow-lg overflow-hidden bg-gradient-to-r ${subject.gradient} flex flex-col cursor-pointer`}
                >
                  <div
                    className={`w-full h-56 bg-white border-4 ${subject.borderColor} rounded-t-2xl overflow-hidden`}
                  >
                    <img
                      src={subject.image}
                      alt={subject.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 flex items-center justify-center p-2">
                    <h3 className="text-xl font-bold text-white text-center">
                      {subject.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
