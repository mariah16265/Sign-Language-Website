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
import QuizPage from './pages/QuizPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

import './App.css';

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
          <Route path="/lesson" element={<LessonPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
