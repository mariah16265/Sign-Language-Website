import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import StudyPlan from './pages/StudyPlan';
// import LearnPage from "./pages/LearnPage";
// import QuizPage from "./pages/QuizPage";
// import ProgressPage from "./pages/ProgressPage";
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 font-sans">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/studyplan" element={<StudyPlan />} />

          {/* <Route path="/learn/:language" element={<LearnPage />} />
          <Route path="/quiz/:language" element={<QuizPage />} />
          <Route path="/progress" element={<ProgressPage />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
