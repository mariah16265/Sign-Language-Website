import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StepProgressBar from '../components/StepProgress';
import { useLocation } from 'react-router-dom';

const QuizPage = () => {
  const location = useLocation();
  const module = location.state?.moduleName || 'Module 1- Alphabets';

  // ----- REFS -----
  const webcamRef = useRef(null);  
  const cameraRef = useRef(null);
  const countdownRef = useRef(0);
  const intervalRef = useRef(null);
  const hasStartedCountdownRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const landmarksDataRef = useRef(null);
  const handleSubmitRef = useRef(null);

  // ----- STATE -----
  const [landmarksData, setLandmarksData] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [attemptedQuestions, setAttemptedQuestions] = useState(new Set());
  const [steps, setSteps] = useState([]);
  const [autoChecking, setAutoChecking] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);

  // ----- INFO -----
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const question = questions[questionIndex];
  const isDynamic = question?.type === 'dynamic';

  // ----- FETCH QUESTIONS -----
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/quiz-questions/module/${module}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load questions');
        setQuestions(data);
      } catch (err) {
        console.error('Quiz fetch error:', err.message);
      }
    };

    fetchQuestions();
  }, [token, userId, module]);

  // ----- UPDATE STEPS PROGRESS -----
  useEffect(() => {
    if (questions.length > 0) {
      const newSteps = questions.map((q, idx) => {
        const signLabel =
          q.correctLabel || q.options?.find((opt) => opt.isCorrect)?.label;
        return {
          label: `Q${idx + 1}`,
          completed: attemptedQuestions.has(signLabel),
          current: idx === questionIndex,
        };
      });
      setSteps(newSteps);
    }
  }, [questions, attemptedQuestions, questionIndex]);

  // ----- SETUP MEDIA PIPE AND CAMERA -----
  useEffect(() => {
    if (!isDynamic) {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
      return;
    }

    let isMounted = true;
    const onResults = (results) => {
      if (!isMounted) return;

      if (results.multiHandLandmarks?.length && results.multiHandedness?.length) {
        const landmarks = results.multiHandLandmarks[0];
        const handLabel = results.multiHandedness[0].label;
        setLandmarksData({ points: landmarks, hand: handLabel });
      } else {
        setLandmarksData(null);
      }
    };

    const setupMediaPipe = async () => {
      if (!isDynamic) return;
      const hands = new window.Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });
      hands.onResults(onResults);
      const waitForVideo = () =>
        new Promise((resolve) => {
          const check = () => {
            if (webcamRef.current?.video?.readyState === 4) resolve();
            else requestAnimationFrame(check);
          };
          check();
        });

      await waitForVideo();
      cameraRef.current = new window.Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (webcamRef.current?.video) {
            await hands.send({ image: webcamRef.current.video });
          }
        },
        width: 640,
        height: 480,
      });

      cameraRef.current.start();
    };
    setupMediaPipe();
    return () => {
      isMounted = false;
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
    };
  }, [isDynamic]);

  // ----- HANDLE SUBMIT -----
  const handleSubmit = useCallback(async () => {
    if (!question || hasSubmitted || isSubmittingRef.current) return;

    isSubmittingRef.current = true;

    try {
      if (isDynamic) {
        if (!landmarksData) {
          alert('No hand detected!');
          isSubmittingRef.current = false;
          return;
        }

        const points = landmarksData.points;
        const baseX = points[0].x;
        const baseY = points[0].y;

        const squaredDistances = points.map(
          (lm) => (lm.x - baseX) ** 2 + (lm.y - baseY) ** 2
        );

        const maxDist = Math.max(...squaredDistances, 1e-6);
        const sqrtMaxDist = Math.sqrt(maxDist);

        const normalized = points.flatMap((lm) => [
          (lm.x - baseX) / sqrtMaxDist,
          (lm.y - baseY) / sqrtMaxDist,
        ]);

        setHasSubmitted(true);
        setAttemptedQuestions((prev) =>
          new Set(prev).add(question.correctLabel || question.signTitle)
        );

        const res = await fetch(`http://localhost:5000/api/predict/infer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            features: normalized,
            question: question.correctLabel,
            hand: landmarksData.hand || 'Left',
            module,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Prediction failed');

        if (data.answer === 'correct') {
          setFeedback('✅ Correct! Great job!');
        } else {
          setFeedback(`❌ Try again! Expected: ${question.correctLabel}`);
        }
      } else {
        if (selectedOption === null) {
          isSubmittingRef.current = false;
          return;
        }

        setHasSubmitted(true);
        setAttemptedQuestions((prev) =>
          new Set(prev).add(question.correctLabel || question.signTitle)
        );

        const selected = question.options[selectedOption];
        setFeedback(selected.isCorrect ? '✅ Correct!' : '❌ Wrong!');

        try {
          await fetch(`http://localhost:5000/api/quiz-static/save/${userId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId,
              module,
              signTitle: question.options.find((opt) => opt.isCorrect)?.label,
              isCorrect: selected.isCorrect,
            }),
          });
        } catch (err) {
          console.error('❌ Error saving static quiz progress:', err.message);
        }
      }
    } catch (err) {
      console.error('Prediction error:', err.message);
      setFeedback('❌ Error during prediction.');
    } finally {
      isSubmittingRef.current = false;
    }
  }, [
    hasSubmitted,
    isDynamic,
    landmarksData,
    module,
    question,
    selectedOption,
    token,
    userId,
  ]);

  // ----- UPDATE REFS -----
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  useEffect(() => {
    landmarksDataRef.current = landmarksData;
  }, [landmarksData]);

  // ----- COUNTDOWN EFFECT -----
  useEffect(() => {
    if (!isDynamic || !autoChecking || hasSubmitted) return;

    if (!landmarksData) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      hasStartedCountdownRef.current = false;
      setIsCountingDown(false);
      setCountdown(0);
      countdownRef.current = 0;
      return;
    }

    if (landmarksData && !hasStartedCountdownRef.current) {
      hasStartedCountdownRef.current = true;
      setIsCountingDown(true);

      countdownRef.current = 3;
      setCountdown(3);

      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            hasStartedCountdownRef.current = false;
            setIsCountingDown(false);
            handleSubmitRef.current();
            return 0;
          }
          countdownRef.current = prev - 1;
          return prev - 1;
        });
      }, 1000);
    }

    // No cleanup here to avoid clearing interval on every landmarksData change
  }, [landmarksData, isDynamic, autoChecking, hasSubmitted]);

  // ----- CLEANUP ON UNMOUNT OR KEY STATE CHANGE -----
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      hasStartedCountdownRef.current = false;
      setIsCountingDown(false);
      setCountdown(0);
      countdownRef.current = 0;
    };
  }, [isDynamic, autoChecking, hasSubmitted]);

  // ----- NEXT QUESTION -----
  const handleNext = () => {
    if (!hasSubmitted) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsCountingDown(false);
    setCountdown(0);

    setHasSubmitted(false);
    setQuestionIndex((prev) => (prev + 1) % questions.length);
    setSelectedOption(null);
    setFeedback('');
    setCountdown(0);
  };

  if (questions.length === 0) return <div>Loading quiz...</div>;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 overflow-hidden">
      <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />
      <div className="flex flex-col lg:flex-row min-h-screen z-10 relative">
        <Sidebar />
        <div className="flex-1 pt-4 px-4 md:pt-4 md:px-6 lg:pt-5 lg:px-12 flex flex-col items-center">
          <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-7xl mb-4 px-6">
            <h2 className="text-3xl md:text-3xl font-extrabold text-pink-700 drop-shadow-md">
              🎉 Quiz Time!
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-8 border-pink-300 w-full max-w-[80rem] min-h-[500px] flex flex-col gap-6 justify-between"
          >
            <div className="w-full">
              <StepProgressBar steps={steps} />
            </div>

            {!isDynamic ? (
              <div className="flex flex-col md:flex-row w-full gap-8 items-center">
                <div className="flex flex-col items-center w-full md:w-1/2 min-h-[280px]">
                  <div className="relative bg-pink-50 rounded-2xl px-8 py-6 text-center shadow-inner border-4 border-pink-400 -mt-10 ml-9">
                    <h3 className="text-2xl font-bold text-pink-700">
                      {(() => {
                        const category =
                          module.split('-')[1]?.trim().toLowerCase() || 'item';
                        return `This sign represents which ${category}?`;
                      })()}
                    </h3>
                  </div>

                  <div className="flex justify-center items-center bg-purple-100 rounded-2xl shadow-xl mt-8 w-[300px] h-[220px] border-4 border-purple-400 overflow-hidden">
                    <img
                      src={question.signUrl}
                      alt="Sign"
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center w-full md:w-1/2 gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
                    {question.options.map((opt, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          if (!hasSubmitted) setSelectedOption(index);
                        }}
                        className={`cursor-pointer border-4 rounded-2xl overflow-hidden shadow-md transition-all ${
                          selectedOption === index
                            ? hasSubmitted
                              ? question.options[index]?.isCorrect
                                ? 'border-green-500 bg-green-100'
                                : 'border-red-500 bg-red-100'
                              : 'border-purple-500 scale-105'
                            : 'border-gray-300'
                        }`}
                      >
                        <div className="bg-white py-4 text-center font-bold text-purple-600 text-xl">
                          {opt.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col items-center gap-3 mt-6">
                    <div className="flex gap-6">
                      <button
                        onClick={handleSubmit}
                        disabled={
                          hasSubmitted ||
                          (!isDynamic && selectedOption === null)
                        }
                        className={`${
                          hasSubmitted ||
                          (!isDynamic && selectedOption === null)
                            ? 'bg-gray-400 cursor-not-allowed opacity-50'
                            : 'bg-pink-500 hover:bg-pink-600 transition transform hover:scale-105'
                        } text-white font-extrabold py-4 px-10 rounded-full shadow-lg text-xl`}
                      >
                        ✅ Submit Answer
                      </button>
                      <button
                        onClick={handleNext}
                        className={`${
                          !hasSubmitted
                            ? 'bg-gray-300 cursor-not-allowed opacity-50'
                            : 'bg-blue-500 hover:bg-blue-600 transition transform hover:scale-105'
                        } text-white font-bold py-4 px-10 rounded-full shadow-lg text-xl`}
                      >
                        ➡️ Next Question
                      </button>
                    </div>

                    {feedback && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`text-xl font-bold px-6 py-3 rounded-xl shadow-md transition-all ${
                          feedback.includes('Correct')
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {feedback}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row w-full gap-12 items-center">
                <div className="flex flex-col items-center w-full md:w-1/3 min-h-[280px]">
                  <div className="relative bg-pink-50 rounded-2xl px-8 py-6 text-center shadow-inner border-4 border-pink-400 -mt-10 ml-6">
                    <h3 className="text-2xl font-bold text-pink-700">
                      {question.prompt}
                    </h3>
                  </div>
                  <div className="flex justify-center items-center bg-pink-500 rounded-full w-36 h-36 shadow-lg mt-6">
                    <p className="text-5xl font-extrabold text-white animate-bounce">
                      {question.correctLabel}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center w-full md:w-2/3">
                  <p className="text-purple-600 text-lg font-semibold mb-6 text-center">
                    Try your best and show the sign in front of the camera!
                  </p>
                  <div className="rounded-3xl border-8 border-yellow-300 shadow-2xl overflow-hidden mb-6 w-full max-w-[550px] h-[220px]">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      mirrored={true}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{
                        width: 1280,
                        height: 720,
                        facingMode: 'user',
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>

                  {/* Auto-detection countdown */}
                  {isCountingDown && (
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full mb-4 animate-pulse">
                      ✅ Detected! Auto-submitting in {countdown}...
                    </div>
                  )}


                  <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-2 mt-2">
                      <button
                        disabled={true}
                        className={`flex items-center justify-center gap-2
                          ${
                            hasSubmitted && !feedback
                              ? 'bg-pink-500' // submitted but feedback not shown yet → show pink
                              : 'bg-gray-400 cursor-not-allowed opacity-50' // otherwise gray
                          }
                          text-white font-extrabold py-4 px-10 rounded-full shadow-lg text-xl`}
                      >
                        {/* Spinner only during "submission in progress" */}
                        {hasSubmitted && !feedback && (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        <span>Checking Sign</span>
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={!feedback}
                        className={`${
                          !feedback
                            ? 'bg-gray-300 cursor-not-allowed opacity-50'
                            : 'bg-blue-500 hover:bg-blue-600 transition transform hover:scale-105'
                        } text-white font-bold py-4 px-10 rounded-full shadow-lg text-xl`}
                      >
                        ➡️ Next Question
                      </button>
                    </div>

                    {/* Auto-check toggle */}
                    <div className="flex items-center gap-2 mt-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoChecking}
                          onChange={() => setAutoChecking(!autoChecking)}
                          className="mr-2 h-5 w-5 text-pink-600"
                        />
                        Auto-detect
                      </label>
                    </div>

                    {/* Improved feedback display */}
                    {feedback && (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={`text-2xl font-bold px-8 py-4 rounded-2xl shadow-lg ${
                          feedback.includes('Correct')
                            ? 'bg-green-100 text-green-800 border-4 border-green-500'
                            : 'bg-red-100 text-red-800 border-4 border-red-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {feedback.includes('Correct') ? (
                            <>
                              <span className="text-3xl">🎉</span>
                              <span>Perfect! Great job!</span>
                            </>
                          ) : (
                            <>
                              <span className="text-3xl">🤔</span>
                              <div>
                                <div>Almost! Try again</div>
                                <div className="text-lg font-normal">
                                  Expected:{' '}
                                  <strong>{question.correctLabel}</strong>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
