import { Home, Search, Car, ShoppingBag, Handshake } from 'lucide-react';

export default function MobileNav({ activeTab, onTabChange }) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'marketplace', icon: ShoppingBag, label: 'Shop' },
    { id: 'lost-found', icon: Search, label: 'Lost' },
    { id: 'carpooling', icon: Car, label: 'Ride' },
    { id: 'skills-exchange', icon: Handshake, label: 'Skills' },
  ];

  return (
    <div className="bg-white border-t border-slate-200 flex justify-around items-center h-16 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
              isActive ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {/* If active, fill the icon, otherwise outline */}
            <Icon className={`w-5 h-5 ${isActive ? "fill-current" : ""}`} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}