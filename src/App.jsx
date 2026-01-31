import { useState, useEffect } from 'react';
import Login from './pages/Login';
import { Sidebar } from './components/Sidebar';
import MobileNav from './components/MobileNav'; 
import LandingPage from './pages/LandingPage';
import Carpooling from './pages/Carpooling';
import LostFound from './pages/LostFound';
import Marketplace from './pages/Marketplace';
import SkillsExchange from './pages/SkillsExchange';
import { LogOut } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("unitrade_isLoggedIn") === "true";
  });

  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem("unitrade_userEmail") || "";
  });

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("unitrade_activeTab") || "home";
  });

  const handleLogin = (email) => {
    localStorage.setItem("unitrade_isLoggedIn", "true");
    localStorage.setItem("unitrade_userEmail", email);
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("unitrade_isLoggedIn");
    localStorage.removeItem("unitrade_userEmail");
    localStorage.removeItem("unitrade_activeTab");
    setIsLoggedIn(false);
    setUserEmail('');
    setActiveTab('home');
  };

  const handleTabChange = (tabId) => {
    localStorage.setItem("unitrade_activeTab", tabId);
    setActiveTab(tabId);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* DESKTOP SIDEBAR (Hidden on Mobile) */}
      <div className="hidden md:flex h-full">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          userName={userEmail}
          onLogout={handleLogout}
        />
      </div>
      
      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* --- MOBILE TOP BAR (Updated with "Logout" text) --- */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            UniTrade
          </h1>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
          >
            <span className="text-xs font-bold uppercase tracking-wide">Logout</span>
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto pb-24 md:pb-0">
          <div className="p-4 md:p-0">
            {activeTab === 'home' && <LandingPage />}
            {activeTab === 'carpooling' && <Carpooling />}
            {activeTab === 'lost-found' && <LostFound />}
            {activeTab === 'marketplace' && <Marketplace />}
            {activeTab === 'skills-exchange' && <SkillsExchange />}
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

    </div>
  );
}

export default App;