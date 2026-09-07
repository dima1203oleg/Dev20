import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon,
  ChevronDown,
  ShieldAlert,
  Star
} from 'lucide-react';
import { DashboardSection } from '../types';
import { playWebAudioSound } from '../utils/sirenAudio';

interface HeaderProps {
  activeSection: DashboardSection;
  onSelectSection: (section: DashboardSection) => void;
  onToggleTheme?: () => void;
  theme?: 'light' | 'dark';
}

export const Header: React.FC<HeaderProps> = ({ 
  activeSection, 
  onSelectSection,
  onToggleTheme,
  theme = 'light'
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'features' | 'how' | 'pricing' | 'about'>('home');
  const [lang, setLang] = useState('UK');
  
  const isDark = theme === 'dark';

  const handleNavClick = (section: DashboardSection) => {
    onSelectSection(section);
    playWebAudioSound('click');
  };

  return (
    <header className={`sticky top-0 z-40 w-full transition-colors duration-200 border-b backdrop-blur-xl ${
      isDark 
        ? 'bg-[#0D131F]/90 border-[#1B273D] text-white' 
        : 'bg-[#EAEFF5]/90 border-[#D1DCE5] text-[#0F172A]'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Logo with double signal wave */}
        <div 
          className="flex items-center gap-3 cursor-pointer flex-shrink-0" 
          onClick={() => handleNavClick('HOME')}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-colors ${
            isDark 
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
              : 'bg-blue-600/10 text-blue-600 border border-blue-200'
          }`}>
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.93 19.07A10 10 0 0 1 4.93 4.93" />
              <path d="M7.76 16.24a6 6 0 0 1 0-8.48" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <path d="M16.24 7.76a6 6 0 0 1 0 8.48" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className={`text-base font-black tracking-wider leading-none ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              SIREN UA
            </span>
            <span className={`text-[9px] font-extrabold tracking-widest mt-0.5 uppercase ${isDark ? 'text-slate-400' : 'text-[#5A6A80]'}`}>
              НА КРОК ПОПЕРЕДУ
            </span>
          </div>
        </div>

        {/* Center: Main Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { id: 'home', label: 'Головна', section: 'HOME' },
            { id: 'features', label: 'Можливості', section: 'NETWORK' },
            { id: 'how', label: 'Як це працює', section: 'HOME' },
            { id: 'pricing', label: 'Тарифи', section: 'FINANCE' },
            { id: 'about', label: 'Про нас', section: 'AFFILIATE' },
          ].map((item) => {
            const isActive = activeTab === item.id || (item.id === 'home' && activeSection === 'HOME');
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  handleNavClick(item.section as DashboardSection);
                }}
                className={`text-[13.5px] font-semibold transition-colors cursor-pointer py-1 relative ${
                  isActive
                    ? (isDark ? 'text-white font-bold' : 'text-[#0F172A] font-bold')
                    : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-[#5A6A80] hover:text-[#0F172A]')
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#2563EB] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Search, Theme, Notifications, Lang, Profile Capsule */}
        <div className="flex items-center gap-3">
          
          {/* Search Bar (Capsule) */}
          <div className="relative hidden lg:flex items-center">
            <Search className={`w-3.5 h-3.5 absolute left-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Пошук..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-3 py-1.5 rounded-full text-[12px] font-medium outline-none transition-all w-36 focus:w-48 ${
                isDark 
                  ? 'bg-[#182335] text-white placeholder-slate-400 border border-[#24344D]' 
                  : 'bg-white/80 text-[#0F172A] placeholder-slate-500 border border-[#CBD6E2]'
              }`}
            />
          </div>

          {/* Theme Switcher Button */}
          {onToggleTheme && (
            <button
              onClick={() => {
                onToggleTheme();
                playWebAudioSound('click');
              }}
              title="Переключити тему"
              className={`p-2 rounded-full transition-colors cursor-pointer border ${
                isDark 
                  ? 'bg-[#182335] text-amber-400 border-[#24344D] hover:bg-[#202E46]' 
                  : 'bg-white/80 text-slate-700 border-[#CBD6E2] hover:bg-white'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          )}

          {/* Notifications Icon with Red Badge */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`p-2 rounded-full relative transition-colors cursor-pointer border ${
                isDark 
                  ? 'bg-[#182335] text-slate-300 border-[#24344D] hover:bg-[#202E46]' 
                  : 'bg-white/80 text-slate-700 border-[#CBD6E2] hover:bg-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[8.5px] font-black flex items-center justify-center border border-white dark:border-[#0D131F]">
                3
              </span>
            </button>

            {notificationsOpen && (
              <div className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-xl p-3 z-50 ${
                isDark ? 'bg-[#131C2B] border border-[#24344D] text-white' : 'bg-white border border-[#CBD6E2] text-[#0F172A]'
              }`}>
                <div className="text-[11px] font-bold mb-2 px-1">Сповіщення системи</div>
                <div className="space-y-1">
                  <div className={`p-2 rounded-xl flex items-start gap-2.5 ${isDark ? 'hover:bg-[#1C293E]' : 'hover:bg-slate-50'}`}>
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[12px] font-semibold">Київська область</div>
                      <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Відбій загроз о 22:14</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Language Selector Dropdown */}
          <button className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[12px] font-bold cursor-pointer transition-colors border ${
            isDark 
              ? 'bg-[#182335] text-slate-300 border-[#24344D] hover:bg-[#202E46]' 
              : 'bg-white/80 text-slate-700 border-[#CBD6E2] hover:bg-white'
          }`}>
            <span>{lang}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Profile Capsule (Matches screenshots: Photo + Олександр + Gold Partner badge) */}
          <button
            type="button"
            onClick={() => handleNavClick('PROFILE')}
            aria-label="Відкрити профіль Олександра"
            className={`hidden sm:flex items-center gap-2.5 pl-1.5 pr-3.5 py-1 rounded-full cursor-pointer border transition-all ${
              isDark 
                ? 'bg-[#182335] border-[#24344D] hover:bg-[#202E46] text-white' 
                : 'bg-white/90 border-[#CBD6E2] hover:bg-white text-[#0F172A] shadow-sm'
            }`}
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-blue-500 flex-shrink-0 border border-amber-400/60">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
                alt="Олександр"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className={`text-[11.5px] font-bold leading-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                Олександр
              </span>
              <span className="text-[9px] font-extrabold text-amber-500 flex items-center gap-0.5 leading-none mt-0.5">
                <Star className="w-2.5 h-2.5 fill-amber-500" /> Gold Partner
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

        </div>
      </div>
    </header>
  );
};
