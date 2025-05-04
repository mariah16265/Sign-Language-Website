import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';


function LessonPage() {
  const { lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [playedSigns, setPlayedSigns] = useState(new Set());
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLesson() {
      try {
        const response = await fetch(`http://localhost:5000/api/lesson/${lessonId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch');
        setLessonData(data);
      } catch (error) {
        console.error('Error fetching lesson:', error.message);
      }
    }

    fetchLesson();
    fetchProgress();
  }, [lessonId]);

  const fetchProgress = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !lessonId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/progress/user/${userId}/lesson/${lessonId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not fetch progress');
      setPlayedSigns(new Set(data.map((progress) => progress.signId)));
    } catch (err) {
      console.error('Error fetching progress:', err.message);
    }
  };

  useEffect(() => {
    if (lessonData) {
      const currentSignId = lessonData.signs[currentSignIndex]._id;
      setHasPlayed(playedSigns.has(currentSignId));
    }
  }, [currentSignIndex, playedSigns, lessonData]);

  const handlePlay = async () => {
    const currentSign = lessonData.signs[currentSignIndex];
    const signId = currentSign._id;
  
    if (!playedSigns.has(signId)) {
      console.log('Saving progress for signId:', signId);
      const newPlayed = new Set(playedSigns);
      newPlayed.add(signId);
      setPlayedSigns(newPlayed);
      setHasPlayed(true);
  
      try {
        const response = await fetch('http://localhost:5000/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: localStorage.getItem('userId'),
            lessonId: lessonData._id,
            signId: signId,
            module: lessonData.module,
            subject: lessonData.subject,
            status: 'watched',
          }),
        });
  
        const data = await response.json();
        console.log('Tracking', data);
  
        if (!response.ok) {
          throw new Error(data.message || 'Failed to save progress');
        }
  
        fetchProgress();
      } catch (err) {
        console.error('Error saving progress:', err.message);
      }
    } else {
      console.log('Already played this sign:', signId);
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
    
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-100 via-blue-100 to-pink-100">
      <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />
  
      <main className="flex flex-col items-center flex-grow mt-10 w-full px-6">
        <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-4xl">
  
          {/* Back Button */}
          <div className="flex items-center justify-start mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-purple-100 text-purple-800 hover:bg-purple-300 hover:text-white hover:shadow-md font-semibold py-2 px-4 rounded-full transition duration-300"
              >
              <span className="text-xl">←</span>
              <span>Back to Lessons</span>
            </button>
          </div>
  
          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-4 text-purple-700">
            Lesson {lessonData.lessonNumber}: {lessonData.module}
          </h2>
  
          {/* Video Player */}
          <video
            ref={videoRef}
            key={currentSign._id}
            src={currentSign.videoUrl}
            controls
            loop
            onPlay={handlePlay}
            className="rounded-2xl w-full h-[400px] md:h-[400px] lg:h-[500px] object-cover shadow-md"
          />
  
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrev}
              disabled={currentSignIndex === 0}
              className="bg-pink-500 text-white py-2 px-4 rounded-xl disabled:opacity-50"
            >
              Previous
            </button>
  
            <div className="text-lg font-semibold flex items-center gap-2">
              {currentSign.title}
            </div>
  
            <button
              onClick={handleNext}
              disabled={!hasPlayed || currentSignIndex === lessonData.signs.length - 1}
              className="bg-emerald-500 text-white py-2 px-4 rounded-xl disabled:opacity-50"
            >
              Next
            </button>
          </div>
  
          {/* Progress */}
          <div className="mt-4 text-center text-gray-600">
            {playedSigns.size} / {lessonData.signs.length} signs watched
          </div>
  
          <progress
            value={playedSigns.size}
            max={lessonData.signs.length}
            className="w-full mt-2 h-4 rounded-xl accent-emerald-500"
          />
        </div>
      </main>
    </div>
  );
}

export default  LessonPage;