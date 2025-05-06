import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const SignVideoPage = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Static lesson data (or fetch from API)
    const staticLessonData = {
      _id: "lesson123",
      lessonNumber: 1,
      module: "Introduction to Sign Language",
      subject: "Basics",
      signs: [
        { _id: "sign1", title: "Hello", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
        { _id: "sign2", title: "Thank You", videoUrl: "https://www.w3schools.com/html/movie.mp4" },
        { _id: "sign3", title: "Please", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
      ],
    };
    setLessonData(staticLessonData);
  }, [lessonId]);

  if (!lessonData) return <div className="p-6 text-center text-lg">Loading lesson...</div>;

  // We'll just display the **first sign** (or change logic as needed)
  const currentSign = lessonData.signs[0];

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
              Word from {lessonData.lessonNumber}: {lessonData.module}
            </h2>

            {/* Video Player */}
            <div className="w-full flex justify-center mb-6 md:mb-8">
              <video
                ref={videoRef}
                src={currentSign.videoUrl}
                controls
                loop
                className="rounded-2xl w-full max-h-[400px] md:max-h-[450px] lg:max-h-[500px] object-cover shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignVideoPage;
