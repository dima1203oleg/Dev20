import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Sliders, 
  Bell, 
  Menu, 
  X, 
  MapPin, 
  Play, 
  Square,
  Box,
  Compass,
  Radio,
  Navigation,
  Layers,
  ChevronDown,
  Sparkles,
  Users
} from 'lucide-react';
import { RegionData, UserSettings } from '../types';

interface HeaderProps {
  regions: RegionData[];
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onOpenGuide: () => void;
  onOpenSimulator: () => void;
  onOpenSpecModal?: () => void;
  onSelectMyRegion: (regionId: string) => void;
  isSirenPlaying: boolean;
  onToggleTestSiren: () => void;
  activeNavTab: 'COCKPIT' | 'WEBGL_3D' | 'MAP' | 'ECOSYSTEM' | 'SIMULATOR' | 'SHELTERS' | 'AFFILIATE';
  onSelectNavTab: (tab: 'COCKPIT' | 'WEBGL_3D' | 'MAP' | 'ECOSYSTEM' | 'SIMULATOR' | 'SHELTERS' | 'AFFILIATE') => void;
}

export const Header: React.FC<HeaderProps> = ({
  regions,
  settings,
  onUpdateSettings,
  onOpenGuide,
  onOpenSimulator,
  onOpenSpecModal,
  onSelectMyRegion,
  isSirenPlaying,
  onToggleTestSiren,
  activeNavTab,
  onSelectNavTab,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);

  const activeAlarmsCount = regions.filter((r) => r.isAlarm).length;
  const myRegionData = regions.find((r) => r.id === settings.myRegion) || regions[0];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          
          {/* Brand & Logo */}
          <div 
            onClick={() => onSelectNavTab('COCKPIT')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-600 to-rose-600 shadow-lg shadow-cyan-950/50 p-2">
              <ShieldAlert className="w-6 h-6 text-white" />
              {activeAlarmsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-slate-950"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white font-['Plus_Jakarta_Sans'] group-hover:text-cyan-300 transition-colors">
                  SirenUA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono">
                  TWIN v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Розумій ситуацію. Модель просторових загроз України
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => onSelectNavTab('COCKPIT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeNavTab === 'COCKPIT'
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Digital Twin</span>
            </button>

            <button
              onClick={() => onSelectNavTab('WEBGL_3D')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeNavTab === 'WEBGL_3D'
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-black shadow-lg shadow-cyan-500/40 scale-105'
                  : 'text-cyan-300 hover:text-white bg-cyan-500/10 border border-cyan-500/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>WebGL Студія</span>
            </button>

            <button
              onClick={() => onSelectNavTab('MAP')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeNavTab === 'MAP'
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/50 shadow-sm shadow-cyan-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Карта & Шари</span>
            </button>

            <button
              onClick={() => onSelectNavTab('ECOSYSTEM')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeNavTab === 'ECOSYSTEM'
                  ? 'bg-purple-500/20 text-purple-200 border border-purple-500/50 shadow-sm shadow-purple-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Екосистема</span>
            </button>

            <button
              onClick={() => onSelectNavTab('SIMULATOR')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeNavTab === 'SIMULATOR'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-sm shadow-amber-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>7-Кроковий Симулятор</span>
            </button>

            <button
              onClick={() => onSelectNavTab('SHELTERS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeNavTab === 'SHELTERS'
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/50 shadow-sm shadow-emerald-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Укриття</span>
            </button>

            <button
              onClick={() => onSelectNavTab('AFFILIATE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeNavTab === 'AFFILIATE'
                  ? 'bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-200 border border-amber-500/60 shadow-sm shadow-amber-950'
                  : 'text-amber-400/80 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Партнерам L1/L2</span>
            </button>
          </nav>

          {/* Quick Actions & Settings */}
          <div className="flex items-center gap-2">
            
            {/* Spec Modal Button */}
            {onOpenSpecModal && (
              <button
                onClick={onOpenSpecModal}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-xs font-bold text-cyan-300 transition-colors"
                title="Офіційне ТЗ та концепція просторової візуалізації"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Специфікація</span>
              </button>
            )}

            {/* Region Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-xs font-medium text-slate-200 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="max-w-[90px] truncate">{myRegionData.shortName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Dropdown list */}
              {isRegionDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-1.5 z-50 custom-scrollbar animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Оберіть ваш регіон
                  </div>
                  {regions.map((reg) => (
                    <button
                      key={reg.id}
                      onClick={() => {
                        onSelectMyRegion(reg.id);
                        setIsRegionDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-left transition-colors ${
                        reg.id === settings.myRegion
                          ? 'bg-amber-500/20 text-amber-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{reg.name}</span>
                      {reg.isAlarm && (
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                settings.soundEnabled
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:text-white'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
              title={settings.soundEnabled ? 'Звук увімкнено' : 'Звук вимкнено'}
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Siren Test Button */}
            <button
              onClick={onToggleTestSiren}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                isSirenPlaying
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse shadow-red-950'
                  : 'bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40'
              }`}
            >
              {isSirenPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span className="hidden sm:inline">{isSirenPlaying ? 'Стоп' : 'Сирена'}</span>
            </button>

            {/* Emergency Guide Modal Button */}
            <button
              onClick={onOpenGuide}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
              title="Пам'ятка цивільного захисту ДСНС"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-800/80 space-y-1 animate-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => {
                onSelectNavTab('COCKPIT');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
                activeNavTab === 'COCKPIT' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Radio className="w-4 h-4 text-cyan-400" /> Digital Twin (Кокпіт)
            </button>
            <button
              onClick={() => {
                onSelectNavTab('WEBGL_3D');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
                activeNavTab === 'WEBGL_3D' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" /> 3D WebGL Студія
            </button>
            <button
              onClick={() => {
                onSelectNavTab('MAP');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
                activeNavTab === 'MAP' ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Box className="w-4 h-4 text-cyan-400" /> 3D Карта & Шари
            </button>
            <button
              onClick={() => {
                onSelectNavTab('ECOSYSTEM');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
                activeNavTab === 'ECOSYSTEM' ? 'bg-purple-500/20 text-purple-200' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-purple-400" /> 3D Всі 9 Гаджетів
            </button>
            <button
              onClick={() => {
                onSelectNavTab('SIMULATOR');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
                activeNavTab === 'SIMULATOR' ? 'bg-amber-500/20 text-amber-200' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Play className="w-4 h-4 text-amber-400" /> 7-Кроковий Симулятор
            </button>
            <button
              onClick={() => {
                onSelectNavTab('SHELTERS');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
                activeNavTab === 'SHELTERS' ? 'bg-emerald-500/20 text-emerald-200' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Navigation className="w-4 h-4 text-emerald-400" /> Укриття та Навігація
            </button>
            <button
              onClick={() => {
                onSelectNavTab('AFFILIATE');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
                activeNavTab === 'AFFILIATE' ? 'bg-amber-500/30 text-amber-200' : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
              }`}
            >
              <Users className="w-4 h-4 text-amber-400" /> Партнерська програма L1 & L2
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
