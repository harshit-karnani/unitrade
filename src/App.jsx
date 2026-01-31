import { useState } from 'react';
import Login from './pages/Login';
import { Sidebar } from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Carpooling from './pages/Carpooling';
import LostFound from './pages/LostFound';
import Marketplace from './pages/Marketplace';
import SkillsExchange from './pages/SkillsExchange';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const handleLogin = (email) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setActiveTab('home');
  };

  // 1. If NOT logged in, show the Login Screen
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  // 2. If logged in, show the Main App (Sidebar + Page Content)
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        userName={userEmail}
        onLogout={handleLogout}
      />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-slate-50">
        {activeTab === 'home' && <LandingPage />}
        {activeTab === 'carpooling' && <Carpooling />}
        {activeTab === 'lost-found' && <LostFound />}
        {activeTab === 'marketplace' && <Marketplace />}
        {activeTab === 'skills-exchange' && <SkillsExchange />}
      </main>
    </div>
  );
}

export default App;