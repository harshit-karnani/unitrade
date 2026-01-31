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
  // 1. Initialize State from LocalStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("unitrade_isLoggedIn") === "true";
  });

  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem("unitrade_userEmail") || "";
  });

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("unitrade_activeTab") || "home";
  });

  // 2. Handlers
  const handleLogin = (email) => {
    localStorage.setItem("unitrade_isLoggedIn", "true");
    localStorage.setItem("unitrade_userEmail", email);
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clears everything
    setIsLoggedIn(false);
    setUserEmail('');
    setActiveTab('home');
  };

  const handleTabChange = (tabId) => {
    localStorage.setItem("unitrade_activeTab", tabId);
    setActiveTab(tabId);
  };

  // 3. Login Screen Check
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  // 4. Main App Layout
  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* --- DESKTOP SIDEBAR --- */}
      {/* Hidden on mobile, Flex on Medium screens+ */}
      <div className="hidden md:flex h-full border-r border-slate-200">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          userName={userEmail}
          onLogout={handleLogout}
        />
      </div>
      
      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full relative w-full">
        
        {/* MOBILE HEADER (Logo + Logout) */}
        {/* Hidden on Desktop (md:hidden) */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center sticky top-0 z-40 shadow-sm">
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

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 overflow-auto w-full">
          {/* Padding bottom 24 for mobile nav, padding 0 for desktop */}
          <div className="pb-24 md:pb-0"> 
            {activeTab === 'home' && <LandingPage />}
            {activeTab === 'carpooling' && <Carpooling />}
            {activeTab === 'lost-found' && <LostFound />}
            {activeTab === 'marketplace' && <Marketplace />}
            {activeTab === 'skills-exchange' && <SkillsExchange />}
          </div>
        </main>
      </div>

      {/* --- MOBILE BOTTOM NAV --- */}
      {/* Hidden on Desktop */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

    </div>
  );
}

export default App;