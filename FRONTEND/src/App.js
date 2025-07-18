// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import StudyPlan from './pages/StudyPlan';

import LearningPage from './pages/LearningPage';
import ModulesPage from './pages/ModulesPage';
import LessonPage from './pages/LessonPage';
import SignDictionaryPage from './pages/SignDictionaryPage.jsx';
import SignVideoPage from './pages/SignVideoPage.jsx';
import QuizSelectionPage from './pages/QuizSelectionPage';
import ASLQuizPage from './pages/ASLQuizPage';
import WordQuizPage from './pages/WordQuizPage';
//import ARSLQuizPage from './pages/ARSLQuizPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import AboutUs from './pages/AboutUs.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 font-sans">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/studyplan" element={<StudyPlan />} />
          <Route path="/learn" element={<LearningPage />} />
          <Route path="/learn/subjects" element={<ModulesPage />} />
          <Route path="/lesson/:lessonId/" element={<LessonPage />} />
          <Route path="/dictionary" element={<SignDictionaryPage />} />
          <Route path="/sign/:subject/:title" element={<SignVideoPage />} />
          <Route path="/quiz" element={<QuizSelectionPage />} />
          <Route path="/Equiz" element={<ASLQuizPage />} />
          <Route path="/Wquiz" element={<WordQuizPage />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
