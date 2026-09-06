import React, { useState } from 'react';
import { 
  Play, 
  ChevronRight, 
  AlertTriangle,
  ArrowRight,
  Crosshair,
  Compass,
  Clock,
  Zap,
  RotateCw,
  MapPin,
  Layers,
  Sparkles
} from 'lucide-react';
import { playWebAudioSound } from '../utils/sirenAudio';
import { ThreeMapUkraine } from './ThreeMapUkraine';
import { RegionData } from '../types';

interface HeroSectionProps {
  onOpenMap: () => void;
  onOpenGuide: () => void;
  onOpenThreats: () => void;
  activeThreatsCount?: number;
  regions?: RegionData[];
  selectedRegionId?: string | null;
  onSelectRegion?: (region: RegionData) => void;
  theme?: 'light' | 'dark';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenMap,
  onOpenGuide,
  onOpenThreats,
  activeThreatsCount = 3,
  regions,
  selectedRegionId,
  onSelectRegion,
  theme = 'light',
}) => {
  const [mapMode, setMapMode] = useState<'STATIC_RENDER' | 'WEBGL_INTERACTIVE'>('STATIC_RENDER');
  const isDark = theme === 'dark';

  return (
    <section className={`relative w-full rounded-3xl p-5 sm:p-7 lg:p-8 border shadow-xs overflow-hidden transition-colors ${
      isDark 
        ? 'bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-blue-950/40 border-slate-800 text-white' 
        : 'bg-gradient-to-r from-blue-50/70 via-slate-50/50 to-blue-50/40 border-slate-200/70 text-slate-900'
    }`}>
      
      {/* Background Soft Ambient Light */}
      <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10 ${
        isDark ? 'bg-blue-600/15' : 'bg-blue-200/40'
      }`} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 items-center">
        
        {/* Left Column: Headline & Call To Action (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Top Pill Badge */}
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs ${
            isDark 
              ? 'bg-slate-900/90 border border-slate-800 text-slate-300' 
              : 'bg-blue-50/90 border border-blue-100 text-blue-700'
          }`}>
            <span className="text-sm">🇺🇦</span>
            <span>Україна сильна, коли ми разом</span>
          </div>

          {/* Main Headline */}
          <h1 className={`text-2xl sm:text-3xl lg:text-[38px] font-black tracking-tight leading-[1.15] ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Розумій ситуацію.<br />
            <span className="text-blue-600">Не просто отримуй тривогу.</span>
          </h1>

          {/* Subtitle description */}
          <p className={`text-xs sm:text-sm leading-relaxed max-w-lg ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Актуальна інформація, реальні загрози, надійна аналітика. SIREN UA — це більше, ніж сповіщення. Це безпека, технології та можливості для кожного українця.
          </p>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => {
                onOpenMap();
                playWebAudioSound('click');
              }}
              className="px-5 sm:px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              {/* Apple Icon */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.12.65-2.8 1.44-.6.69-.99 1.76-.94 2.82 1.07.08 2.12-.55 2.73-1.39z"/>
              </svg>
              <span>Завантажити для iPhone</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={() => {
                onOpenGuide();
                playWebAudioSound('click');
              }}
              className={`px-4 sm:px-5 py-3 rounded-2xl font-semibold text-xs sm:text-sm border shadow-2xs flex items-center gap-2 transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700' 
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                isDark ? 'bg-blue-950/80 text-blue-400' : 'bg-blue-50 text-blue-600'
              }`}>
                <Play className="w-2.5 h-2.5 fill-blue-600 ml-0.5" />
              </div>
              <span>Дивитись демо</span>
            </button>
          </div>

          {/* QR Code & Features Row (1:1 with Reference Design) */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            
            {/* QR box and App Store button */}
            <div className="flex items-center gap-2">
              {/* QR Code */}
              <div className={`w-14 h-14 rounded-xl p-1.5 border flex items-center justify-center ${
                isDark ? 'bg-white border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
              }`}>
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                  <rect width="30" height="30" rx="3" />
                  <rect x="8" y="8" width="14" height="14" fill="white" />
                  <rect x="11" y="11" width="8" height="8" />
                  
                  <rect x="70" width="30" height="30" rx="3" />
                  <rect x="78" y="8" width="14" height="14" fill="white" />
                  <rect x="81" y="11" width="8" height="8" />
                  
                  <rect y="70" width="30" height="30" rx="3" />
                  <rect x="8" y="78" width="14" height="14" fill="white" />
                  <rect x="11" y="81" width="8" height="8" />
                  
                  <rect x="36" y="10" width="8" height="8" />
                  <rect x="48" y="20" width="8" height="8" />
                  <rect x="36" y="36" width="28" height="28" />
                  <rect x="42" y="42" width="16" height="16" fill="white" />
                  <rect x="70" y="40" width="8" height="8" />
                  <rect x="85" y="55" width="8" height="8" />
                  <rect x="40" y="75" width="12" height="8" />
                  <rect x="60" y="70" width="10" height="10" />
                  <rect x="75" y="80" width="15" height="10" />
                </svg>
              </div>

              {/* App Store button badge */}
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Завантажити SirenUA з App Store');
                }}
                className="px-3 py-2 rounded-xl bg-black hover:bg-slate-900 text-white flex items-center gap-2 shadow-xs transition-transform hover:scale-102"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.12.65-2.8 1.44-.6.69-.99 1.76-.94 2.82 1.07.08 2.12-.55 2.73-1.39z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[8px] uppercase tracking-wider text-slate-400 leading-none">Завантажити в</div>
                  <div className="text-xs font-bold tracking-tight leading-tight">App Store</div>
                </div>
              </a>
            </div>

            {/* Feature bullets */}
            <div className={`space-y-1 text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-500" />
                <span>Швидке встановлення</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-blue-500" />
                <span>Безкоштовне оновлення</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>Працює по всій Україні</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: 3D Holographic Relief Map of Ukraine with City Beacon Nodes & Threat Cards (7 cols) */}
        <div className="lg:col-span-7 relative flex flex-col items-center justify-center min-h-[380px]">
          
          {/* Top Right Floating Threat Badges Stack */}
          <div className="absolute top-0 right-0 z-30 space-y-2 max-w-[280px] w-full hidden sm:block">
            
            {/* Card 1: Red Alert Bar */}
            <div 
              onClick={onOpenThreats}
              className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer shadow-lg hover:scale-102 transition-all ${
                isDark 
                  ? 'bg-slate-900 border border-rose-900/60 text-white' 
                  : 'bg-[#1E293B] text-white shadow-xl'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span>Активні загрози</span>
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center">
                      {activeThreatsCount}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1 mt-0.5">
                    <span>БпЛА</span>
                    <span className="text-[10px] text-slate-400 font-normal">· Південно-західний напрямок</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* Card 2: Kyiv Region Detail Box */}
            <div className={`p-3.5 rounded-2xl border shadow-lg space-y-2 ${
              isDark 
                ? 'bg-slate-900/95 border-slate-800 text-white' 
                : 'bg-white/95 backdrop-blur-md border-slate-200/80 text-slate-900'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Київська область</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-1">
                  <span>⚠️</span>
                  <span>Підвищена увага</span>
                </span>
              </div>

              <div className={`space-y-1 text-[11px] border-t pt-1.5 ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Crosshair className="w-3 h-3 text-blue-500" /> Тип загрози:
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>БпЛА</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3 h-3 text-blue-500" /> Напрямок:
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Південно-західний</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-500" /> Оновлено:
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Сьогодні, 22:14</span>
                </div>
              </div>

              <button 
                onClick={onOpenMap}
                className="w-full text-right text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-end gap-1 pt-1 cursor-pointer"
              >
                <span>Детальніше</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

          {/* 3D Volumetric Ukraine Map Canvas or Static High-Res 3D Render */}
          <div className="relative w-full aspect-[16/10] max-h-[400px] rounded-3xl overflow-hidden flex items-center justify-center group">
            
            {mapMode === 'STATIC_RENDER' ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* 3D Static Render Image */}
                <img
                  src="/src/assets/images/ukraine_3d_map_hero_1788736310705.jpg"
                  alt="3D Карта України Siren UA"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-102"
                />

                {/* Interactive Overlay Nodes for Major Cities matching screenshot */}
                {/* 1. Львів (Lviv) - Golden node */}
                <div 
                  onClick={() => {
                    const reg = regions?.find(r => r.id === 'lviv');
                    if (reg && onSelectRegion) onSelectRegion(reg);
                  }}
                  className="absolute top-[28%] left-[24%] flex items-center gap-1.5 cursor-pointer z-20 group/node hover:scale-115 transition-transform"
                >
                  <div className="relative flex items-center justify-center w-4 h-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 border-2 border-white shadow-md" />
                  </div>
                  <span className="text-xs font-black text-slate-900 bg-white/90 px-1.5 py-0.5 rounded-md shadow-xs drop-shadow-sm">
                    Львів
                  </span>
                </div>

                {/* 2. Київ (Kyiv) - Main Cyan/Blue concentric pulse rings */}
                <div 
                  onClick={() => {
                    const reg = regions?.find(r => r.id === 'kyiv_obl' || r.id === 'kyiv_city');
                    if (reg && onSelectRegion) onSelectRegion(reg);
                  }}
                  className="absolute top-[30%] left-[54%] flex items-center gap-2 cursor-pointer z-20 group/node hover:scale-115 transition-transform"
                >
                  <div className="relative flex items-center justify-center w-7 h-7">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
                    <span className="absolute inline-flex h-5 w-5 rounded-full border border-cyan-400/60" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-white shadow-lg" />
                  </div>
                  <span className="text-xs font-black text-slate-900 bg-white/95 px-2 py-0.5 rounded-md shadow-sm drop-shadow-sm">
                    Київ
                  </span>
                </div>

                {/* 3. Харків (Kharkiv) - Red/Orange node */}
                <div 
                  onClick={() => {
                    const reg = regions?.find(r => r.id === 'kharkiv');
                    if (reg && onSelectRegion) onSelectRegion(reg);
                  }}
                  className="absolute top-[36%] left-[78%] flex items-center gap-1.5 cursor-pointer z-20 group/node hover:scale-115 transition-transform"
                >
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-80" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600 border-2 border-white shadow-md" />
                  </div>
                  <span className="text-xs font-black text-rose-950 bg-rose-50/95 border border-rose-200 px-1.5 py-0.5 rounded-md shadow-xs">
                    Харків
                  </span>
                </div>

                {/* 4. Дніпро (Dnipro) - Orange node with drone icon */}
                <div 
                  onClick={() => {
                    const reg = regions?.find(r => r.id === 'dnipro');
                    if (reg && onSelectRegion) onSelectRegion(reg);
                  }}
                  className="absolute top-[52%] left-[69%] flex items-center gap-1.5 cursor-pointer z-20 group/node hover:scale-115 transition-transform"
                >
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-80" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white shadow-md" />
                  </div>
                  <span className="text-xs font-black text-slate-900 bg-white/90 px-1.5 py-0.5 rounded-md shadow-xs">
                    Дніпро
                  </span>
                </div>

                {/* 5. Одеса (Odesa) - Blue node */}
                <div 
                  onClick={() => {
                    const reg = regions?.find(r => r.id === 'odesa');
                    if (reg && onSelectRegion) onSelectRegion(reg);
                  }}
                  className="absolute top-[68%] left-[48%] flex items-center gap-1.5 cursor-pointer z-20 group/node hover:scale-115 transition-transform"
                >
                  <div className="relative flex items-center justify-center w-4 h-4">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600 border-2 border-white shadow-md" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 bg-white/90 px-1.5 py-0.5 rounded-md shadow-xs">
                    Одеса
                  </span>
                </div>

              </div>
            ) : (
              <ThreeMapUkraine
                variant="hero"
                theme={theme}
                regions={regions}
                selectedRegionId={selectedRegionId}
                onSelectRegion={onSelectRegion}
                activeThreatCount={activeThreatsCount}
                enableControls={true}
              />
            )}

            {/* Mode Toggle button at top left of map */}
            <div className="absolute top-2.5 left-2.5 z-30">
              <button
                onClick={() => {
                  setMapMode(mapMode === 'STATIC_RENDER' ? 'WEBGL_INTERACTIVE' : 'STATIC_RENDER');
                  playWebAudioSound('click');
                }}
                className="px-2.5 py-1 rounded-xl bg-white/90 hover:bg-white backdrop-blur-md border border-slate-200/80 text-[10px] font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Перемкнути між 3D-рендером та інтерактивною 3D-моделлю"
              >
                {mapMode === 'STATIC_RENDER' ? (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>3D HD Render</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-3 h-3 text-blue-500" />
                    <span>WebGL 3D Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Bottom Right Slogan (1:1 with Reference Design) */}
            <div className="absolute bottom-2 right-3 text-right pointer-events-none z-20 bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-slate-200/50">
              <div className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Технології. Люди.
              </div>
              <div className={`text-[10px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                Безпечніше завтра.
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
