import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  ShieldAlert, 
  Home, 
  Users, 
  Wallet, 
  User, 
  Radio, 
  Clock,
  Sparkles
} from 'lucide-react';
import { DashboardSection, RegionData } from '../types';
import { playWebAudioSound } from '../utils/sirenAudio';

interface HeaderProps {
  activeSection: DashboardSection;
  onSelectSection: (section: DashboardSection) => void;
  regions?: RegionData[];
  myRegionName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onSelectSection,
  regions = [],
  myRegionName = 'Одеська область',
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const activeAlarmsCount = regions.filter((r) => r.isAlarm).length;

  const handleNavClick = (sec: DashboardSection) => {
    onSelectSection(sec);
    playWebAudioSound('click');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Left: Brand Logo & Slogan */}
        <div 
          onClick={() => handleNavClick('HOME')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          {/* Siren Circular Signal Icon */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-10 h-10 fill-none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="19" className="fill-blue-50/50 stroke-blue-100" strokeWidth="1" />
              {/* Concentric Signal Arcs */}
              <path d="M12 28C10 24 10 16 12 12" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M16 25C14.5 22 14.5 18 16 15" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M28 28C30 24 30 16 28 12" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M24 25C25.5 22 25.5 18 24 15" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="20" cy="20" r="3.5" fill="#2563EB" />
            </svg>
            {activeAlarmsCount > 0 && (
              <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900 font-sans">
                SIREN
              </span>
              <span className="text-xl font-black text-blue-600 font-sans tracking-tight">
                UA
              </span>
            </div>
            <div className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase font-sans -mt-0.5">
              БЕЗПЕКА ОБ'ЄДНУЄ
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs (Головна, Мережа, Фінанси, Профіль) */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNavClick('HOME')}
            className={`relative py-5 text-sm font-semibold transition-colors cursor-pointer ${
              activeSection === 'HOME'
                ? 'text-slate-900 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Головна</span>
            {activeSection === 'HOME' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('NETWORK')}
            className={`relative py-5 text-sm font-semibold transition-colors cursor-pointer ${
              activeSection === 'NETWORK'
                ? 'text-slate-900 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Мережа</span>
            {activeSection === 'NETWORK' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('FINANCE')}
            className={`relative py-5 text-sm font-semibold transition-colors cursor-pointer ${
              activeSection === 'FINANCE'
                ? 'text-slate-900 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Фінанси</span>
            {activeSection === 'FINANCE' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('PROFILE')}
            className={`relative py-5 text-sm font-semibold transition-colors cursor-pointer ${
              activeSection === 'PROFILE'
                ? 'text-slate-900 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Профіль</span>
            {activeSection === 'PROFILE' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full" />
            )}
          </button>
        </nav>

        {/* Right: Actions (Search, Notifications, Profile Capsule) */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            title="Пошук по системі"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications with red counter badge */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors relative cursor-pointer"
              title="Сповіщення безпеки"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-sm">
                1
              </span>
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="font-bold text-xs text-slate-900">Останні сповіщення</span>
                  <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">Прочитано</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">БпЛА в напрямку Київської обл.</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Черговий ПС ЗСУ оновив дані 2 хв тому</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">+₴850 реферальної винагороди L1</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Користувач #UA-9042 активував тариф</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill Capsule */}
          <div 
            onClick={() => handleNavClick('PROFILE')}
            className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 border border-slate-100 cursor-pointer transition-all select-none"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-blue-500 to-indigo-600 p-0.5 flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                alt="Олександр"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">Олександр</div>
              <div className="text-[10px] text-slate-400 font-medium leading-tight">Gold Partner</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 mr-1" />
          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation Bar for Small Screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 px-6 py-2 flex items-center justify-around z-50">
        <button
          onClick={() => handleNavClick('HOME')}
          className={`flex flex-col items-center gap-1 ${
            activeSection === 'HOME' ? 'text-blue-600 font-bold' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Головна</span>
        </button>

        <button
          onClick={() => handleNavClick('NETWORK')}
          className={`flex flex-col items-center gap-1 ${
            activeSection === 'NETWORK' ? 'text-blue-600 font-bold' : 'text-slate-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">Мережа</span>
        </button>

        <button
          onClick={() => handleNavClick('FINANCE')}
          className={`flex flex-col items-center gap-1 ${
            activeSection === 'FINANCE' ? 'text-blue-600 font-bold' : 'text-slate-400'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px]">Фінанси</span>
        </button>

        <button
          onClick={() => handleNavClick('PROFILE')}
          className={`flex flex-col items-center gap-1 ${
            activeSection === 'PROFILE' ? 'text-blue-600 font-bold' : 'text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Профіль</span>
        </button>
      </div>
    </header>
  );
};
