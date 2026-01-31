import { Button } from './ui/button';
import { Home, Search, Car, ShoppingBag, Handshake, LogOut } from 'lucide-react';

export function Sidebar({ activeTab, onTabChange, onLogout, userName }) {
  const navigation = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'lost-found', label: 'Lost & Found', icon: Search },
    { id: 'carpooling', label: 'Carpooling', icon: Car },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'skills-exchange', label: 'Skills Exchange', icon: Handshake },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen font-sans border-r border-slate-800">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="font-bold text-2xl text-emerald-400">UniTrade</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 h-10 ${isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-slate-700">
        <div className="mb-4 px-2">
          <p className="text-sm text-slate-400">Signed in as:</p>
          <p className="font-medium truncate">{userName}</p>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-slate-800" onClick={onLogout}>
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}