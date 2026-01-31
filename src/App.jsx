import { useState } from 'react';
import Login from './pages/Login';
import { Sidebar } from './components/Sidebar';
import MobileNav from './components/MobileNav'; // <--- New Import
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

  // 2. If logged in, show the Main App
  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* DESKTOP SIDEBAR - Hidden on mobile (hidden), visible on desktop (md:flex) */}
      <div className="hidden md:flex h-full">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          userName={userEmail}
          onLogout={handleLogout}
        />
      </div>
      
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-auto w-full relative">
        {/* We add 'pb-24' (padding-bottom) specifically for mobile 
           so the content doesn't get hidden behind the bottom navigation bar.
           On desktop (md:pb-0), we remove that padding.
        */}
        <div className="min-h-full pb-24 md:pb-0">
          {activeTab === 'home' && <LandingPage />}
          {activeTab === 'carpooling' && <Carpooling />}
          {activeTab === 'lost-found' && <LostFound />}
          {activeTab === 'marketplace' && <Marketplace />}
          {activeTab === 'skills-exchange' && <SkillsExchange />}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV - Visible on mobile (block), hidden on desktop (md:hidden) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

    </div>
  );
}

export default App;