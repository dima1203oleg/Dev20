import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Sun, 
  Moon, 
  Crown,
  ShieldAlert,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { DashboardSection, RegionData } from '../types';
import { playWebAudioSound } from '../utils/sirenAudio';

interface HeaderProps {
  activeSection: DashboardSection;
  onSelectSection: (section: DashboardSection) => void;
  regions?: RegionData[];
  myRegionName?: string;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onSelectSection,
  regions = [],
  myRegionName = 'Одеська область',
  theme = 'light',
  onToggleTheme,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const activeAlarmsCount = regions.filter((r) => r.isAlarm).length;
  const isDark = theme === 'dark';

  const handleNavClick = (sec: DashboardSection) => {
    onSelectSection(sec);
    playWebAudioSound('click');
  };

  return (
    <header className={`sticky top-0 z-50 transition-colors backdrop-blur-md ${
      isDark 
        ? 'bg-[#090D16]/90 border-b border-slate-800/80 text-white' 
        : 'bg-white/90 border-b border-slate-100 text-slate-900'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Slogan ("НА ВАШОМУ БОЦІ") */}
        <div 
          onClick={() => handleNavClick('HOME')}
          className="flex items-center gap-3 cursor-pointer select-none group flex-shrink-0"
        >
          {/* Siren Circular Signal Icon */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-10 h-10 fill-none" xmlns="http://www.w3.org/2000/svg">
              <circle 
                cx="20" 
                cy="20" 
                r="19" 
                className={isDark ? 'fill-blue-950/60 stroke-blue-800' : 'fill-blue-50/70 stroke-blue-100'} 
                strokeWidth="1.5" 
              />
              {/* Concentric Signal Arcs */}
              <path d="M12 28C10 24 10 16 12 12" stroke={isDark ? '#38BDF8' : '#2563EB'} strokeWidth="2.5" strokeLinecap="round" />
              <path d="M16 25C14.5 22 14.5 18 16 15" stroke={isDark ? '#60A5FA' : '#3B82F6'} strokeWidth="2.5" strokeLinecap="round" />
              <path d="M28 28C30 24 30 16 28 12" stroke={isDark ? '#38BDF8' : '#2563EB'} strokeWidth="2.5" strokeLinecap="round" />
              <path d="M24 25C25.5 22 25.5 18 24 15" stroke={isDark ? '#60A5FA' : '#3B82F6'} strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="20" cy="20" r="3.5" fill={isDark ? '#38BDF8' : '#2563EB'} />
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
              <span className={`text-xl font-black tracking-tight font-sans ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                SIREN
              </span>
              <span className="text-xl font-black text-blue-600 font-sans tracking-tight">
                UA
              </span>
            </div>
            <div className={`text-[9px] font-bold tracking-[0.18em] uppercase font-sans -mt-0.5 ${
              isDark ? 'text-slate-400' : 'text-slate-400'
            }`}>
              НА ВАШОМУ БОЦІ
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs (Головна, Мережа, Фінанси, Профіль) */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <button
            onClick={() => handleNavClick('HOME')}
            className={`relative py-5 text-sm font-semibold transition-colors cursor-pointer ${
              activeSection === 'HOME'
                ? (isDark ? 'text-white font-bold' : 'text-blue-600 font-bold')
                : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
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
                ? (isDark ? 'text-white font-bold' : 'text-blue-600 font-bold')
                : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
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
                ? (isDark ? 'text-white font-bold' : 'text-blue-600 font-bold')
                : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
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
                ? (isDark ? 'text-white font-bold' : 'text-blue-600 font-bold')
                : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
            }`}
          >
            <span>Профіль</span>
            {activeSection === 'PROFILE' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full" />
            )}
          </button>
        </nav>

        {/* Right: Actions (Search pill, Notifications, Profile Capsule, Theme Switcher) */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          
          {/* Prominent Search Pill (1:1 with screenshots) */}
          <div className="relative hidden lg:block">
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all ${
              isDark 
                ? 'bg-slate-900/90 border-slate-800 text-slate-300 focus-within:border-blue-500' 
                : 'bg-slate-100/80 border-slate-200/70 text-slate-700 focus-within:border-blue-500 focus-within:bg-white'
            }`}>
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Пошук..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-28 lg:w-36 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Theme Switcher Toggle (Sun / Moon) */}
          {onToggleTheme && (
            <button
              onClick={() => {
                onToggleTheme();
                playWebAudioSound('click');
              }}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                isDark 
                  ? 'text-amber-400 hover:bg-slate-800 hover:text-amber-300' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
              title={isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Notifications with red counter badge "3" */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`p-2 rounded-full transition-colors relative cursor-pointer ${
                isDark 
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Сповіщення"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs">
                3
              </span>
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                isDark 
                  ? 'bg-slate-900 border border-slate-700 text-white shadow-black/80' 
                  : 'bg-white border border-slate-100 text-slate-900 shadow-xl'
              }`}>
                <div className={`flex items-center justify-between pb-2 mb-2 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}>
                  <span className="text-xs font-bold">Сповіщення безпеки</span>
                  <span className="text-[10px] text-blue-500 font-bold cursor-pointer">Прочитати всі</span>
                </div>
                <div className="space-y-2.5">
                  <div className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                    isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-rose-50/50 border-rose-100'
                  }`}>
                    <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">Загроза БпЛА (Київщина)</div>
                      <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Зафіксовано рух у південно-західному напрямку
                      </div>
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                    isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-blue-50/50 border-blue-100'
                  }`}>
                    <TrendingUp className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">Нарахування ₴ 540</div>
                      <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Комісія з продажу від партнера L1 (Марія К.)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Capsule (Олександр | Gold Partner) */}
          <div 
            onClick={() => handleNavClick('PROFILE')}
            className={`flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-full border transition-all cursor-pointer group ${
              isDark 
                ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-white' 
                : 'bg-white hover:bg-slate-50 border-slate-200/70 text-slate-800 shadow-xs'
            }`}
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-500/40 relative flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
                alt="Олександр"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Name and Rank */}
            <div className="hidden sm:flex flex-col text-left">
              <span className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Олександр
              </span>
              <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1 leading-none mt-0.5">
                <span>👑</span>
                <span>Gold Partner</span>
              </span>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5 ${
              isDark ? 'text-slate-400' : 'text-slate-400'
            }`} />
          </div>

        </div>

      </div>
    </header>
  );
};
