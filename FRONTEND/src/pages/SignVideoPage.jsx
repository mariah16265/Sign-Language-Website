import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';


const SignVideoPage = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const { subject, title } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

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
        const subjectData = data.find((d) => d.subject === subject);
        const sign = subjectData?.signs.find((s) => s.title === decodeURIComponent(title));
        setVideoUrl(sign?.videoUrl || '');
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    fetchVideo();
  }, [subject, title]);

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/lessonbg.jpg')" }}
    >
      <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar className="h-full" />
        <div className="flex-1 px-2 py-4 md:px-4 md:py-6 lg:px-8 lg:py-8 flex flex-col justify-start items-center">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 w-full max-w-6xl">
            {/* Back Button */}
            <div className="flex items-center justify-start mb-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold hover:from-purple-700 hover:to-indigo-600 shadow-lg text-lg py-3 px-6 rounded-full transition duration-300"
              >
                <FaArrowLeft />
              Back to Sign Dictionary
              </button>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 text-purple-700 drop-shadow-lg">
              {decodeURIComponent(title)}
            </h2>

            {/* Video Player */}
            <div className="w-full flex justify-center mb-6 md:mb-8">
              {videoUrl ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  loop
                  className="rounded-2xl w-full max-h-[400px] md:max-h-[450px] lg:max-h-[500px] object-cover shadow-xl"
                  />
              ) : (
                <p className="text-center text-red-600 font-semibold">Video not found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignVideoPage;
