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
        const response = await fetch(`http://localhost:5000/api/studyplan/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

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
    },
    {
      name: 'Arabic Signs',
      key: 'Arabic',
      path: '/arabic',
      image: '/assets/arabic.jpeg',
      gradient: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-500',
    },
    {
      name: 'Emergency Signs',
      key: 'Emergency',
      path: '/emergency',
      image: '/assets/life.jpeg',
      gradient: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-500',
    },
    {
      name: 'Awareness Signs',
      key: 'Awareness',
      path: '/awareness',
      image: '/assets/mental.jpeg',
      gradient: 'from-pink-500 to-red-600',
      borderColor: 'border-pink-500',
    },
  ];

  const filteredSubjects = subjectsData.filter(subject => 
    ['Emergency', 'Awareness'].includes(subject.key) || allowedSubjects.includes(subject.key)
  );

  const onSelectSubject = (subject) => {
    navigate('/learn/subjects', { state: { subject: subject.name.split(" ")[0] } });
  };
  
  return (
    <div
      style={{
        background: 'linear-gradient(-180deg, rgba(255, 229, 202, 0.9), rgba(255, 206, 250, 0.9))',
        color: '#333',
      }}
      className="relative min-h-screen overflow-hidden"
    >
      <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />

      <div className="flex flex-col lg:flex-row min-h-screen z-10 relative">
        <Sidebar />

        <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-center items-center mb-20 gap-4">
          <h2 className="text-4xl md:text-5xl font-bold text-purple-700 text-center">Get Ready to Explore!</h2>
        </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16 mb-8 mx-auto max-w-5xl"  // Changed gap-x-4 to gap-x-12 and max-w-4xl to max-w-5xl
            //className="flex flex-wrap justify-center gap-12 mb-8 mx-auto max-w-6xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {filteredSubjects.map((subject, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    className="flex justify-center"
                    onClick={() => onSelectSubject(subject)}
                  >
                      <div 
                        className={`min-h-[320px] rounded-2xl shadow-md overflow-hidden bg-gradient-to-r ${subject.gradient}`}
                      >
                        <div 
                          className={`w-full h-60 bg-white border-8 ${subject.borderColor} rounded-2xl overflow-hidden`}
                        >
                          <img
                            src={subject.image}
                            alt={subject.name}
                            className="w-full h-full object-cover rounded-t-2xl"
                          />
                        </div>
                        <div className="flex justify-center items-center h-[80px]">
                          <h3 className="text-2xl font-bold text-white tracking-wide">
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