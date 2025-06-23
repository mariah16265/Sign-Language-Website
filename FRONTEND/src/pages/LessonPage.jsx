import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import {
  useApiErrorHandler,
  useCheckTokenValid,
} from '../utils/apiErrorHandler';
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
  const [showQuizPopup, setShowQuizPopup] = useState(false);
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

        const lessonRes = await fetch(
          `http://localhost:5000/api/lessons/${lessonId}/user/${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const lesson = await lessonRes.json();
        if (!lessonRes.ok)
          throw new Error(lesson.message || 'Failed to fetch lesson');

        const progressRes = await fetch(
          `http://localhost:5000/api/progress/user/${userId}/lesson/${lessonId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const progress = await progressRes.json();
        if (!progressRes.ok)
          throw new Error(progress.message || 'Failed to fetch progress');

        const watchedSet = new Set(progress.map((p) => p.signId));
        const signs = lesson.signs;
        const firstUnwatchedIndex = signs.findIndex(
          (sign) => !watchedSet.has(sign._id)
        );
        setLessonData(lesson);
        setPlayedSigns(watchedSet);
        setCurrentSignIndex(
          firstUnwatchedIndex !== -1 ? firstUnwatchedIndex : 0
        );
      } catch (error) {
        handleApiError(error);
      }
    }
    fetchLessonAndProgress();
  }, [lessonId]);

  useEffect(() => {
    const fetchNextLesson = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/lessons/next/${lessonId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const nextdata = await res.json();

        if (!res.ok)
          throw new Error(nextdata.message || 'Failed to fetch next lesson');
        if (nextdata.message === 'End of Module') {
          setEndOfModule(true);
        } else {
          setNextLessonId(nextdata._id);
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
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
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
        if (!response.ok)
          throw new Error(data.message || 'Failed to save progress');
        const isLastSign = currentSignIndex === lessonData.signs.length - 1;
        if (isLastSign && endOfModule) {
          setShowQuizPopup(true);
        }
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

  const handleStartQuiz = (module, subject) => {
    let path = '';

    if (subject.toLowerCase() === 'arabic') {
      path = 'Aquiz';
    } else if (module === 'Module 1- Alphabets') {
      path = 'Equiz';
    } else {
      path = 'Wquiz';
    }

    navigate(`/${path}`, {
      state: {
        subjectName: subject,
        moduleName: module,
      },
    });
  };

  if (!lessonData)
    return <div className="p-4 text-center text-base">Loading lesson...</div>;

  const currentSign = lessonData.signs[currentSignIndex];

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/lessonbg.jpg')" }}
    >
      <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar className="h-full" />
        <div className="flex-1 px-2 py-2 md:px-4 md:py-4 lg:px-6 lg:py-6 flex flex-col justify-start items-center">
          <div className="bg-white mt-8 bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-5 lg:p-6 w-full max-w-5xl">
            {/* Back Button - Made more compact */}
            <div className="flex items-center justify-start mb-3">
              <button
                onClick={() =>
                  navigate('/learn/subjects', {
                    state: {
                      subject: lessonData.subject,
                      module: lessonData.module,
                    },
                  })
                }
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold hover:from-purple-700 hover:to-indigo-600 shadow text-sm py-3 px-4 rounded-full transition duration-300"
              >
                <FaArrowLeft className="text-sm" />
                Back to Modules
              </button>
            </div>

            {/* Title - Made more compact */}
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-center mb-7 text-purple-700">
              {lessonData.module.split('-')[1]?.trim()} - Lesson{' '}
              {lessonData.lessonNumber}
            </h2>

            {/* Video Player - Adjusted spacing */}
            <div className="w-full flex justify-center items-center mb-4 min-h-[270px]">
              <video
                ref={videoRef}
                key={currentSign._id}
                src={currentSign.videoUrl}
                controls
                loop
                onPlay={handlePlay}
                className="rounded-xl max-w-full max-h-[400px] object-contain shadow-lg"
              />
            </div>

            {/* Navigation Buttons - Made more compact */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 mt-3">
              <button
                onClick={handlePrev}
                disabled={currentSignIndex === 0}
                className={`flex items-center gap-1 ${
                  currentSignIndex === 0
                    ? 'bg-gray-300 text-gray-100 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-400 to-red-400 hover:from-pink-500 hover:to-red-500 text-white'
                } text-base py-2 px-5 rounded-full transition-all duration-300 w-full md:w-auto`}
              >
                <FaChevronLeft className="text-xs" />
                Previous
              </button>

              <div className="text-xl font-medium text-gray-700">
                {currentSign.title}
              </div>

              {currentSignIndex === lessonData.signs.length - 1 && hasPlayed ? (
                endOfModule ? (
                  <button
                    disabled
                    className="flex items-center gap-1 bg-gray-300 text-gray-100 cursor-not-allowed text-sm py-2 px-4 rounded-full transition-all duration-300 w-full md:w-auto"
                  >
                    End of Module
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/lesson/${nextLessonId}`)}
                    className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm py-2 px-4 rounded-full transition-all duration-300 w-full md:w-auto"
                  >
                    Next Lesson
                    <FaChevronRight className="text-xs" />
                  </button>
                )
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!hasPlayed}
                  className={`flex items-center gap-1 ${
                    !hasPlayed
                      ? 'bg-gray-300 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-300 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white'
                  } text-base py-2 px-6 rounded-full transition-all duration-300 w-full md:w-auto`}
                >
                  Next
                  <FaChevronRight className="text-xs" />
                </button>
              )}
            </div>

            {/* Progress - Made more compact */}
            <div className="mt-6 text-center text-base text-gray-800 mb-3">
              {playedSigns.size} / {lessonData.signs.length} signs watched
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1.5 overflow-hidden">
              <div
                style={{
                  width: `${
                    (playedSigns.size / lessonData.signs.length) * 100
                  }%`,
                }}
                className="h-full bg-green-400 transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>
      </div>
      {showQuizPopup && (
        <div className="fixed top-20 right-4 z-50 bg-white border border-green-400 text-green-900 px-4 py-2 rounded-xl shadow-md max-w-xs text-sm flex flex-col items-center justify-center space-y-2">
          <div className="font-semibold text-center">
            You've unlocked your quiz!
          </div>
          <button
            onClick={() =>
              handleStartQuiz(lessonData.module, lessonData.subject)
            }
            className="text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-6 rounded-full shadow hover:from-purple-700 hover:to-indigo-700 transition"
          >
            Start Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonPage;
