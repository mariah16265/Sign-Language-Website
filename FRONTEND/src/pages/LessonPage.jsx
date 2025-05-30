import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useApiErrorHandler, useCheckTokenValid } from '../utils/apiErrorHandler';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const LessonPage = () => {
  const { lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);
  const [nextLessonId, setNextLessonId] = useState(null);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [playedSigns, setPlayedSigns] = useState(new Set());
  const [endOfModule, setEndOfModule] = useState(false);
  const { checkTokenValid } = useCheckTokenValid();
  const { handleApiError } = useApiErrorHandler();
  
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); 

// Check for valid token on mount
  useEffect(() => {
    const isTokenValid = checkTokenValid();
    if (!isTokenValid) return;
  }, []);

  useEffect(() => {
    async function fetchLessonAndProgress() {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const lessonRes = await fetch(`http://localhost:5000/api/lessons/${lessonId}/user/${userId}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const lesson = await lessonRes.json();
        if (!lessonRes.ok) throw new Error(lesson.message || 'Failed to fetch lesson');

        const progressRes = await fetch(`http://localhost:5000/api/progress/user/${userId}/lesson/${lessonId}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const progress = await progressRes.json();
        if (!progressRes.ok) throw new Error(progress.message || 'Failed to fetch progress');

        const watchedSet = new Set(progress.map(p => p.signId));
        console.log("progress:",watchedSet);

        const signs = lesson.signs;
        const firstUnwatchedIndex = signs.findIndex(sign => !watchedSet.has(sign._id));
        setLessonData(lesson);
        setPlayedSigns(watchedSet);
        setCurrentSignIndex(firstUnwatchedIndex !== -1 ? firstUnwatchedIndex : 0);
      } catch (error) {
        handleApiError(error);
      }
    }
    fetchLessonAndProgress();
  }, [lessonId]);

  useEffect(() => {
    const fetchNextLesson = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/lessons/next/${lessonId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    
    const nextdata = await res.json();
    
    if (!res.ok) throw new Error(nextdata.message || 'Failed to fetch next lesson');
     if (nextdata.message === 'End of Module') {
        setEndOfModule(true);
      } else {
        setNextLessonId(nextdata._id); // Store next lesson ID
      }    
    } catch (err) {
      console.error('Error fetching next lesson:', err.message);
    }
    };
    
    if (lessonData) fetchNextLesson();
    }, [lessonId, lessonData]);
  
  useEffect(() => {
    if (lessonData && lessonData.signs.length > 0) {
      const currentSignId = lessonData.signs[currentSignIndex]?._id;
      setHasPlayed(playedSigns.has(currentSignId));
    }
  }, [currentSignIndex, playedSigns, lessonData]);

  const handlePlay = async () => {
    const currentSign = lessonData.signs[currentSignIndex];
    const signId = currentSign._id;

    if (!playedSigns.has(signId)) {
      const newPlayed = new Set(playedSigns);
      newPlayed.add(signId);
      setPlayedSigns(newPlayed);
      setHasPlayed(true);

      try {
        const response = await fetch('http://localhost:5000/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
          body: JSON.stringify({
            userId: localStorage.getItem('userId'),
            lessonId: lessonData._id,
            signId: signId,
            signTitle: currentSign.title,
            level: lessonData.level,
            module: lessonData.module,
            subject: lessonData.subject,
            status: 'watched',
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to save progress');
      } catch (err) {
        console.error('Error saving progress:', err.message);
      }
    }
  };

  const handleNext = () => {
    if (currentSignIndex < lessonData.signs.length - 1) {
      setCurrentSignIndex(currentSignIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSignIndex > 0) {
      setCurrentSignIndex(currentSignIndex - 1);
    }
  };

  if (!lessonData) return <div className="p-6 text-center text-lg">Loading lesson...</div>;

  const currentSign = lessonData.signs[currentSignIndex];

  return ( 
    <div className="relative w-full min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/assets/lessonbg.jpg')" }}>
    <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar className="h-full" /> {/* Sidebar should take full height */}
      <div className="flex-1 px-2 py-4 md:px-4 md:py-6 lg:px-8 lg:py-8 flex flex-col justify-start items-center">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 w-full max-w-6xl">
          {/* Back Button */}
          <div className="flex items-center justify-start mb-4">
          <button
            onClick={() =>
              navigate('/learn/subjects', {
                state: {
                  subject: lessonData.subject,
                  module: lessonData.module,
                },
              })
            }
            className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold hover:from-purple-700 hover:to-indigo-600 shadow-lg text-lg py-3 px-6 rounded-full transition duration-300"
          >
            <FaArrowLeft />
            Back to Modules
          </button>
          </div>
  
          {/* Title */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 text-purple-700 drop-shadow-lg">
        {lessonData.module.split('-')[1]?.trim()} - Lesson {lessonData.lessonNumber}
        </h2>
  
          {/* Video Player */}
          <div className="w-full flex justify-center items-center mb-6 md:mb-8 min-h-[300px]">
          <video
            ref={videoRef}
            key={currentSign._id}
            src={currentSign.videoUrl}
            controls
            loop
            onPlay={handlePlay}
            className="rounded-2xl max-w-full max-h-[500px] object-contain shadow-xl"
            />
          </div>
  
          {/* Navigation Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-4">
          <button
              onClick={handlePrev}
              disabled={currentSignIndex === 0}
              className={`flex items-center gap-2 ${
              currentSignIndex === 0
                ? 'bg-gray-300 text-gray-100 font-bold cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-400 to-red-400 font-bold hover:from-pink-500 hover:to-red-500 text-white shadow-xl'
            } text-lg py-3 px-7 rounded-full transition-all duration-300 w-full md:w-auto`}
          >
            <FaChevronLeft />
            Previous
          </button>
  
          <div className="text-lg md:text-xl font-semibold text-gray-700">
          {currentSign.title}
        </div>

        {/* Next Button */}
        {currentSignIndex === lessonData.signs.length - 1 && hasPlayed ? ( endOfModule ? (
            <button
      disabled
      className="flex items-center gap-2 bg-gray-300 text-gray-100 font-bold cursor-not-allowed text-lg py-3 px-7 rounded-full transition-all duration-300 w-full md:w-auto"
    >
      End of Module
    </button>
  )  : (
    <button
      onClick={() => navigate(`/lesson/${nextLessonId}`)}
      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 font-bold hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl text-lg py-3 px-7 rounded-full transition-all duration-300 w-full md:w-auto"
    >
      Next Lesson
      <FaChevronRight />
    </button>
  )
): (
          <button
            onClick={handleNext}
            disabled={!hasPlayed}
            className={`flex items-center gap-2 ${
              !hasPlayed
                ? 'bg-gray-300 text-gray-100 font-bold cursor-not-allowed'
                : 'bg-gradient-to-r from-green-300 to-teal-500 font-bold hover:from-green-500 hover:to-teal-600 text-white shadow-xl'
            } text-lg py-3 px-7 rounded-full transition-all duration-300 w-full md:w-auto`}
          >
            Next
            <FaChevronRight />
          </button>

        )}
        </div>
  
        {/* Progress */}
        <div className="mt-6 text-center text-gray-700 font-medium">
          {playedSigns.size} / {lessonData.signs.length} signs watched
        </div>
  
        <div className="w-full bg-gray-200 rounded-full h-4 mt-2 overflow-hidden">
          <div
            style={{ width: `${(playedSigns.size / lessonData.signs.length) * 100}%` }}
            className="h-full bg-green-400 transition-all duration-500"
          ></div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default  LessonPage;