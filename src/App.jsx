import { useState, useEffect } from 'react';
import Login from './pages/Login';
import { Sidebar } from './components/Sidebar';
import MobileNav from './components/MobileNav'; 
import LandingPage from './pages/LandingPage';
import Carpooling from './pages/Carpooling';
import LostFound from './pages/LostFound';
import Marketplace from './pages/Marketplace';
import SkillsExchange from './pages/SkillsExchange';

function App() {
  // 1. INITIALIZE STATE FROM LOCAL STORAGE
  // Instead of starting at 'false', we check if we saved data previously.
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("unitrade_isLoggedIn") === "true";
  });

  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem("unitrade_userEmail") || "";
  });

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("unitrade_activeTab") || "home";
  });

  // 2. SAVE ON LOGIN
  const handleLogin = (email) => {
    localStorage.setItem("unitrade_isLoggedIn", "true");
    localStorage.setItem("unitrade_userEmail", email);
    
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  // 3. CLEAR ON LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("unitrade_isLoggedIn");
    localStorage.removeItem("unitrade_userEmail");
    localStorage.removeItem("unitrade_activeTab");

    setIsLoggedIn(false);
    setUserEmail('');
    setActiveTab('home');
  };

  // 4. SAVE TAB CHANGES
  // Whenever you switch tabs, save it so refresh keeps you there
  const handleTabChange = (tabId) => {
    localStorage.setItem("unitrade_activeTab", tabId);
    setActiveTab(tabId);
  };

  // --- RENDER ---

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex h-full">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange} // Use the new handler
          userName={userEmail}
          onLogout={handleLogout}
        />
      </div>
      
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-auto w-full relative">
        <div className="min-h-full pb-24 md:pb-0">
          {activeTab === 'home' && <LandingPage />}
          {activeTab === 'carpooling' && <Carpooling />}
          {activeTab === 'lost-found' && <LostFound />}
          {activeTab === 'marketplace' && <Marketplace />}
          {activeTab === 'skills-exchange' && <SkillsExchange />}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

    </div>
  );
}

export default App;