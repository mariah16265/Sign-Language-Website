import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';



const SignVideoPage = () => {
    const [videoUrl, setVideoUrl] = useState('');

  const { subject, title } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/signs/dictionary`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        const subjectData = data.find(d => d.subject === subject);
        const sign = subjectData?.signs.find(s => s.title === decodeURIComponent(title));
        setVideoUrl(sign?.videoUrl);
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };
  
    fetchVideo();
  }, [subject, title]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />
      <div className="flex flex-col lg:flex-row min-h-screen z-10 relative">
        <Sidebar />

        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-6 max-w-3xl mx-auto"
          >
            <h1 className="text-3xl font-bold text-purple-700 mb-4">{decodeURIComponent(title)}</h1>
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                className="rounded-xl w-full max-h-[400px] mx-auto mb-6 shadow-md"
              />
            ) : (
              <p className="text-red-600 font-semibold">Video not found.</p>
            )}
                <motion.button
                    onClick={() => navigate(-1)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-lg font-semibold rounded-full shadow-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-300"
                >
                    <FaArrowLeft className="text-white" />
                    Back to Dictionary
                </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignVideoPage;
