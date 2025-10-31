import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import CreatorDashboard from "./components/CreatorDashboard";
import PromoterDashboard from "./components/PromoterDashboard";
import AdminPanel from "./components/AdminPanel";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";

type View = 'landing' | 'creator' | 'promoter' | 'admin' | 'login' | 'signup' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('landing');

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    // Add navigation logic based on the view
    switch (view) {
      case 'login':
        window.location.href = '/login';
        break;
      case 'creator':
        window.location.href = '/creator';
        break;
      case 'promoter':
        window.location.href = '/promoter';
        break;
      case 'admin':
        window.location.href = '/admin';
        break;
      case 'signup':
        window.location.href = '/signup';
        break;
      default:
        window.location.href = '/';
    }
  };

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage onNavigate={handleNavigate} />} />
          <Route path="/login" element={<LoginPage onNavigate={handleNavigate} />} />
          <Route path="/creator" element={<CreatorDashboard onNavigate={handleNavigate} />} />
          <Route path="/promoter" element={<PromoterDashboard onNavigate={handleNavigate} />} />
          <Route path="/admin" element={<AdminPanel onNavigate={handleNavigate} />} />
          <Route path="/signup" element={<SignupPage onNavigate={handleNavigate} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
