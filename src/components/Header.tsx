import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Home, 
  Users, 
  Wallet, 
  User, 
  Bell, 
  Sparkles,
  Award
} from 'lucide-react';
import { DashboardSection, RegionData } from '../types';
import { playWebAudioSound } from '../utils/sirenAudio';

interface HeaderProps {
  activeSection: DashboardSection;
  onSelectSection: (section: DashboardSection) => void;
  regions: RegionData[];
  myRegionName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onSelectSection,
  regions,
  myRegionName = 'Київська обл.',
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const activeAlarmsCount = regions.filter((r) => r.isAlarm).length;

  const handleNavClick = (sec: DashboardSection) => {
    onSelectSection(sec);
    playWebAudioSound('click');
  };

  return (
    <>
      {/* Top Fixed Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Brand / Logo */}
            <div 
              onClick={() => handleNavClick('HOME')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-600 to-rose-600 shadow-lg shadow-cyan-950/50 p-2 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 text-white" />
                {activeAlarmsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-slate-950" />
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black tracking-tight text-white font-mono group-hover:text-cyan-300 transition-colors">
                    SIREN UA
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono">
                    DEV20 v2
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                  Просторовий Digital Twin & Мережа безпеки
                </p>
              </div>
            </div>

            {/* Desktop Navigation: Exactly 4 Items (Home, Network, Finance, Profile) */}
            <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => handleNavClick('HOME')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                  activeSection === 'HOME'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Головна</span>
              </button>

              <button
                onClick={() => handleNavClick('NETWORK')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                  activeSection === 'NETWORK'
                    ? 'bg-purple-600 text-white font-black shadow-md shadow-purple-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Мережа</span>
              </button>

              <button
                onClick={() => handleNavClick('FINANCE')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                  activeSection === 'FINANCE'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Фінанси</span>
              </button>

              <button
                onClick={() => handleNavClick('PROFILE')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                  activeSection === 'PROFILE'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Профіль</span>
              </button>
            </nav>

            {/* Right Controls: Notification Bell + Avatar */}
            <div className="flex items-center gap-2">
              
              {/* Notifications Button */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors relative"
                  aria-label="Сповіщення"
                >
                  <Bell className="w-4 h-4" />
                  {activeAlarmsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white font-mono">
                      {activeAlarmsCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono font-bold text-slate-300">
                      <span>ОПЕРАТИВНІ СПОВІЩЕННЯ</span>
                      <span className="text-[10px] text-cyan-400">{activeAlarmsCount} активні</span>
                    </div>
                    <div className="mt-2 space-y-2 max-h-56 overflow-y-auto text-xs font-mono">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                        <div className="font-bold text-rose-400">🔴 {myRegionName}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Повітряна тривога. Зафіксовано рух БпЛА.
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                        <div className="font-bold text-emerald-400">💰 Партнерська виплата</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Зараховано +₴320 від L1 реферала.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar Button */}
              <button
                onClick={() => handleNavClick('PROFILE')}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all select-none group"
              >
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 font-mono font-black text-xs">
                  UA
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[10px] font-mono font-bold text-white leading-tight">
                    Олександр
                  </div>
                  <div className="text-[9px] font-mono text-amber-400 font-bold">
                    GOLD (20%)
                  </div>
                </div>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Fixed 4 Items) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl"
        aria-label="Mobile Navigation"
      >
        <button
          onClick={() => handleNavClick('HOME')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            activeSection === 'HOME'
              ? 'text-cyan-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] font-mono">Головна</span>
        </button>

        <button
          onClick={() => handleNavClick('NETWORK')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            activeSection === 'NETWORK'
              ? 'text-purple-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="text-[10px] font-mono">Мережа</span>
        </button>

        <button
          onClick={() => handleNavClick('FINANCE')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            activeSection === 'FINANCE'
              ? 'text-emerald-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span className="text-[10px] font-mono">Фінанси</span>
        </button>

        <button
          onClick={() => handleNavClick('PROFILE')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            activeSection === 'PROFILE'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[10px] font-mono">Профіль</span>
        </button>
      </nav>
    </>
  );
};
