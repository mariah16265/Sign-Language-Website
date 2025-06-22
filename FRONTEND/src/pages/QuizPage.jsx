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
  const [feedbackType, setFeedbackType] = useState(''); // 'correct' or 'incorrect'
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [attemptedQuestions, setAttemptedQuestions] = useState(new Set());
  const [steps, setSteps] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);

  // ----- FEEDBACK MESSAGES -----
  const correctFeedbacks = [
    'Perfect! That was spot on!',
    'Excellent! You got it right!',
    'Great job! You nailed it!',
    "Awesome! You're a pro!",
    "Brilliant! That's correct!",
  ];

  const incorrectFeedbacks = [
    'The correct sign was: ',
    "That wasn't quite right. The correct sign was: ",
    'Oops! The correct answer was: ',
    'Almost! The correct sign was: ',
    'Not this time. The correct sign was: ',
  ];

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
        if (!res.ok)
          throw new Error(data.message || 'Failed to load questions');
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

      if (
        results.multiHandLandmarks?.length &&
        results.multiHandedness?.length
      ) {
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

        // Random feedback selection
        if (data.answer === 'correct') {
          const randomIndex = Math.floor(
            Math.random() * correctFeedbacks.length
          );
          setFeedback(correctFeedbacks[randomIndex]);
          setFeedbackType('correct');
        } else {
          const randomIndex = Math.floor(
            Math.random() * incorrectFeedbacks.length
          );
          setFeedback(
            `${incorrectFeedbacks[randomIndex]}${question.correctLabel}`
          );
          setFeedbackType('incorrect');
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
        const correctLabel = question.options.find(
          (opt) => opt.isCorrect
        )?.label;

        // Random feedback selection
        if (selected.isCorrect) {
          const randomIndex = Math.floor(
            Math.random() * correctFeedbacks.length
          );
          setFeedback(correctFeedbacks[randomIndex]);
          setFeedbackType('correct');
        } else {
          const randomIndex = Math.floor(
            Math.random() * incorrectFeedbacks.length
          );
          setFeedback(`${incorrectFeedbacks[randomIndex]}${correctLabel}`);
          setFeedbackType('incorrect');
        }

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
              signTitle: correctLabel,
              isCorrect: selected.isCorrect,
            }),
          });
        } catch (err) {
          console.error('Error saving static quiz progress:', err.message);
        }
      }
    } catch (err) {
      console.error('Prediction error:', err.message);
      setFeedback('Error during prediction.');
      setFeedbackType('error');
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
    if (!isDynamic || hasSubmitted) return;

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
  }, [landmarksData, isDynamic, hasSubmitted]);

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
  }, [isDynamic, hasSubmitted]);

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
    setFeedbackType('');
    setCountdown(0);
  };

  if (questions.length === 0)
    return (
      <div className="flex justify-center items-center min-h-screen bg-pink-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-400"></div>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 to-white overflow-hidden">
      <Navbar userName="Michael Bob" userAvatar="/images/avatar.jpg" />
      <div className="flex flex-col lg:flex-row min-h-screen z-10 relative">
        <Sidebar />
        <div className="flex-1 pt-6 px-4 md:pt-8 md:px-6 lg:pt-10 lg:px-12 flex flex-col items-center pb-16">
          {' '}
          <div className="w-full max-w-7xl mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-pink-700 mb-6">
              {module} Quiz
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border-4 border-pink-200 w-full max-w-[80rem] min-h-[550px] flex flex-col gap-8 justify-between"
          >
            <div className="w-full">
              <StepProgressBar steps={steps} />
            </div>

            {!isDynamic ? (
              <div className="flex flex-col md:flex-row w-full gap-8 md:gap-10 items-center">
                <div className="flex flex-col items-center w-full md:w-1/2">
                  <div className="text-center px-4">
                    <h3 className="text-3xl font-medium text-pink-800 font-sans leading-tight mb-2">
                      What does this sign represent?
                    </h3>
                  </div>

                  <div className="flex justify-center items-center bg-white rounded-2xl shadow-sm mt-8 w-[320px] h-[240px] md:w-[380px] md:h-[280px] border-2 border-pink-200 overflow-hidden">
                    <img
                      src={question.signUrl}
                      alt="Sign language demonstration"
                      className="object-contain w-full h-full p-4"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center w-full md:w-1/2 gap-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-lg mt-28">
                    {question.options.map((opt, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (!hasSubmitted) setSelectedOption(index);
                        }}
                        className={`cursor-pointer rounded-xl overflow-hidden transition-all ${
                          selectedOption === index
                            ? hasSubmitted
                              ? question.options[index]?.isCorrect
                                ? 'bg-green-100 border-4 border-green-500'
                                : 'bg-red-100 border-4 border-red-500'
                              : 'bg-pink-200 border-4 border-pink-500'
                            : 'bg-pink-50 border-4 border-pink-300 hover:border-pink-500'
                        }`}
                      >
                        {/* CHANGED: Reduced padding and font size */}
                        <div className="py-4 px-5 text-center font-bold text-pink-800 text-xl">
                          {opt.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex flex-col items-center gap-5 w-full">
                    <div className="flex flex-col sm:flex-row gap-5 w-full max-w-lg justify-center">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        disabled={hasSubmitted || selectedOption === null}
                        className={`${
                          hasSubmitted || selectedOption === null
                            ? 'bg-gray-200 cursor-not-allowed'
                            : 'bg-pink-500 hover:bg-pink-600 text-white'
                        } font-bold py-4 px-6 rounded-full text-md w-full flex items-center justify-center gap-2 transition-colors`}
                      >
                        {selectedOption === null ? 'Submit' : 'Submit'}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNext}
                        disabled={!hasSubmitted}
                        className={`${
                          !hasSubmitted
                            ? 'bg-gray-200 cursor-not-allowed'
                            : 'bg-purple-500 hover:bg-purple-600 text-white'
                        } font-bold py-4 px-6 rounded-full text-md w-full flex items-center justify-center gap-2 transition-colors`}
                      >
                        Next Question
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.button>
                    </div>

                    {/* Static Quiz Feedback */}
                    <div className="min-h-[3rem] flex items-center justify-center w-full">
                      {feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex justify-center text-lg font-bold ${
                            feedbackType === 'correct'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {feedbackType === 'correct' ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-green-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-red-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            <span>{feedback}</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row w-full gap-6 md:gap-8 items-center">
                <div className="flex flex-col items-center w-full md:w-2/5">
                  <div className="relative bg-pink-100 rounded-2xl px-8 py-4 text-center border-2 border-pink-300 ">
                    <h3 className="text-2xl font-bold text-pink-800">
                      {question.prompt}
                    </h3>
                  </div>
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                    className="flex justify-center items-center bg-gradient-to-r from-pink-400 to-pink-600 rounded-full w-40 h-40 shadow-xl mt-8"
                  >
                    <p className="text-6xl font-extrabold text-white">
                      {question.correctLabel}
                    </p>
                  </motion.div>
                </div>

                <div className="flex flex-col items-center w-full md:w-3/5">
                  <p className="text-pink-700 text-center font-bold mb-4 text-xl mt-5">
                    Show the sign in front of the camera
                  </p>
                  <div className="relative rounded-2xl border-4 border-pink-300 shadow-lg overflow-hidden mb-6 w-full max-w-[540px] h-[280px]">
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
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col items-center gap-3 w-full max-w-lg">
                    <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={hasSubmitted || isCountingDown}
                        onClick={handleSubmit}
                        className={`${
                          hasSubmitted || isCountingDown
                            ? 'bg-pink-300 cursor-not-allowed'
                            : 'bg-pink-500 hover:bg-pink-600 text-white'
                        } font-bold py-4 px-6 rounded-full text-md w-full sm:w-auto flex items-center justify-center gap-2 transition-colors`}
                      >
                        {isCountingDown
                          ? `Submitting in ${countdown}...`
                          : hasSubmitted
                          ? 'Checking...'
                          : 'No Sign Detected'}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNext}
                        disabled={!feedback}
                        className={`${
                          !feedback
                            ? 'bg-gray-200 cursor-not-allowed'
                            : 'bg-purple-500 hover:bg-purple-600 text-white'
                        } font-bold py-4 px-6 rounded-full text-md w-full sm:w-auto flex items-center justify-center gap-2 transition-colors`}
                      >
                        Next
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.button>
                    </div>

                    {/* Dynamic Quiz Feedback */}
                    <div className="min-h-[2rem] flex items-center justify-center w-full mt-1">
                      {feedback && (
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className={`flex justify-center text-lg font-bold ${
                            feedbackType === 'correct'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {feedbackType === 'correct' ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-green-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-red-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            <span>{feedback}</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
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
