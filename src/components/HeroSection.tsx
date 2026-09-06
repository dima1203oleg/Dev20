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
  Sparkles,
  Shield
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
    <section className={`relative w-full rounded-3xl p-6 sm:p-8 lg:p-10 border transition-all duration-300 ${
      isDark 
        ? 'bg-[#111827] border-slate-800 text-white shadow-google-lg' 
        : 'bg-[#FFFFFF] border-slate-200/70 text-[#111827] shadow-google-card'
    }`}>
      
      {/* Background Soft Studio Ambient Glow (No aggressive neon) */}
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none -z-10 ${
        isDark ? 'bg-blue-900/10' : 'bg-blue-50/70'
      }`} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        
        {/* Left Column: Product Presentation & Clear CTAs (5 cols) */}
        <div className="lg:col-span-5 space-y-5 z-10">
          
          {/* Google-style Minimalist Badge */}
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors ${
            isDark 
              ? 'bg-slate-800/80 border border-slate-700/80 text-slate-200' 
              : 'bg-[#F1F4F9] border border-slate-200/80 text-[#2563EB]'
          }`}>
            <span className="text-sm">🇺🇦</span>
            <span>Платформа безпеки та ситуативної обізнаності</span>
          </div>

          {/* Main Headline */}
          <h1 className={`text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-[1.14] ${
            isDark ? 'text-white' : 'text-[#111827]'
          }`}>
            Розумій ситуацію.<br />
            <span className="text-[#2563EB]">Не просто отримуй тривогу.</span>
          </h1>

          {/* Subtitle description with comfortable readability */}
          <p className={`text-sm sm:text-base leading-relaxed max-w-lg ${
            isDark ? 'text-[#8B95A7]' : 'text-[#5B6472]'
          }`}>
            Актуальна інформація, реальні загрози та високоточна просторова аналітика. SIREN UA створена для швидких та усвідомлених рішень.
          </p>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => {
                onOpenMap();
                playWebAudioSound('click');
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-sm transition-all duration-200 flex items-center gap-2.5 cursor-pointer hover:shadow-md"
            >
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
              className={`px-5 py-3.5 rounded-2xl font-semibold text-sm border transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                isDark 
                  ? 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700' 
                  : 'bg-white hover:bg-[#F7F9FC] text-[#111827] border-slate-200 shadow-google-sm hover:border-slate-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                isDark ? 'bg-blue-950/80 text-blue-400' : 'bg-blue-50 text-[#2563EB]'
              }`}>
                <Play className="w-2.5 h-2.5 fill-[#2563EB] ml-0.5" />
              </div>
              <span>Дивитись демо</span>
            </button>
          </div>

          {/* Clean App Store Badges & Fast Setup Features */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            
            <div className="flex items-center gap-2.5">
              <div className={`w-13 h-13 rounded-xl p-1.5 border flex items-center justify-center ${
                isDark ? 'bg-white border-slate-700' : 'bg-white border-slate-200 shadow-google-sm'
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

              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Завантажити SirenUA з App Store');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#111827] hover:bg-black text-white flex items-center gap-2 shadow-google-sm transition-transform hover:scale-[1.02] cursor-pointer"
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

            <div className={`space-y-1 text-xs font-medium ${isDark ? 'text-[#8B95A7]' : 'text-[#5B6472]'}`}>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Швидке встановлення</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Безкоштовні оновлення</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Покриття всієї України</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: High-End Studio 3D Relief of Ukraine (7 cols) */}
        <div className="lg:col-span-7 relative flex flex-col items-center justify-center min-h-[390px]">
          
          {/* Top Right Floating Threat Status Card */}
          <div className="absolute top-0 right-0 z-30 space-y-2.5 max-w-[270px] w-full hidden sm:block">
            
            {/* Alert Card 1: Critical Threat Bar (Uses red only for threats) */}
            <div 
              onClick={onOpenThreats}
              className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                isDark 
                  ? 'bg-slate-900/95 border border-rose-900/40 text-white shadow-google-card' 
                  : 'bg-[#FFFFFF] border border-rose-100 text-[#111827] shadow-google-card'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span>Активні загрози</span>
                    <span className="w-4.5 h-4.5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {activeThreatsCount}
                    </span>
                  </div>
                  <div className={`text-[11px] font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-[#5B6472]'}`}>
                    <span>БпЛА</span>
                    <span className="text-[10px] font-normal"> · Південно-західний</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* Region Detail Box */}
            <div className={`p-3.5 rounded-2xl border transition-all duration-200 space-y-2 ${
              isDark 
                ? 'bg-slate-900/95 border-slate-800 text-white shadow-google-card' 
                : 'bg-white border-slate-200/80 text-[#111827] shadow-google-card'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Київська область</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold flex items-center gap-1">
                  <span>⚠️</span>
                  <span>Підвищена увага</span>
                </span>
              </div>

              <div className={`space-y-1 text-[11px] border-t pt-1.5 ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-[#5B6472]'}`}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Crosshair className="w-3 h-3 text-[#2563EB]" /> Тип загрози:
                  </span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>БпЛА</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3 h-3 text-[#2563EB]" /> Напрямок:
                  </span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Південно-західний</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#2563EB]" /> Оновлено:
                  </span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Сьогодні, 22:14</span>
                </div>
              </div>

              <button 
                onClick={onOpenMap}
                className="w-full text-right text-xs font-bold text-[#2563EB] hover:text-blue-700 flex items-center justify-end gap-1 pt-1 cursor-pointer"
              >
                <span>Детальніше</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

          {/* 3D Studio Holographic Map Visual (Clean transparent cutout floating on white surface) */}
          <div className="relative w-full aspect-[16/10] max-h-[410px] flex items-center justify-center group">
            
            {mapMode === 'STATIC_RENDER' ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* 3D Isolated Relief Map with transparent background & soft organic studio shadow */}
                <img
                  src="/src/assets/images/ukraine_3d_cutout.png"
                  alt="3D Карта України Siren UA"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-103 drop-shadow-[0_15px_30px_rgba(37,99,235,0.18)]"
                />

                {/* Minimalist City Beacon Nodes */}
                {/* 1. Львів (Lviv) */}
                <div 
                  onClick={() => {
                    const reg = regions?.find(r => r.id === 'lviv');
                    if (reg && onSelectRegion) onSelectRegion(reg);
                  }}
                  className="absolute top-[30%] left-[22%] flex items-center gap-1.5 cursor-pointer z-20 group/node hover:scale-110 transition-transform"
                >
                  <div className="relative flex items-center justify-center w-3.5 h-3.5">
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 border-2 border-white shadow-google-sm" />
                  </div>
                  <span className="text-[11px] font-bold text-[#111827] bg-white/95 px-1.5 py-0.5 rounded-md shadow-google-sm border border-slate-200/50">
                    Львів
                  </span>
                </div>

                {/* 2. Київ (Kyiv) */}
                <div 
                  onClick={() => {
                    const reg = regions?.find(r => r.id === 'kyiv_obl' || r.id === 'kyiv_city');
                    if (reg && onSelectRegion) onSelectRegion(reg);
                  }}
                  className="absolute top-[28%] left-[52%] flex items-center gap-1.5 cursor-pointer z-20 group/node hover:scale-110 transition-transform"
                >
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2563EB] border-2 border-white shadow-google-sm" />
                  </div>
                  <span className="text-[11px] font-bold text-[#111827] bg-white/95 px-2 py-0.5 rounded-md shadow-google-sm border border-slate-200/50">
                    Київ
                  </span>
                </div>

                {/* 3. Харків (Kharkiv) */}
                <div 
                  onClick={() => {
                    const reg = regions?.find(r => r.id === 'kharkiv');
                    if (reg && onSelectRegion) onSelectRegion(reg);
                  }}
                  className="absolute top-[35%] left-[76%] flex items-center gap-1.5 cursor-pointer z-20 group/node hover:scale-110 transition-transform"
                >
                  <div className="relative flex items-center justify-center w-4 h-4">
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border-2 border-white shadow-google-sm" />
                  </div>
                  <span className="text-[11px] font-bold text-rose-900 bg-rose-50/95 border border-rose-200 px-1.5 py-0.5 rounded-md shadow-google-sm">
                    Харків
                  </span>
                </div>

                {/* 4. Дніпро (Dnipro) */}
                <div 
                  onClick={() => {
                    const reg = regions?.find(r => r.id === 'dnipro');
                    if (reg && onSelectRegion) onSelectRegion(reg);
                  }}
                  className="absolute top-[50%] left-[68%] flex items-center gap-1.5 cursor-pointer z-20 group/node hover:scale-110 transition-transform"
                >
                  <div className="relative flex items-center justify-center w-3.5 h-3.5">
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border-2 border-white shadow-google-sm" />
                  </div>
                  <span className="text-[11px] font-bold text-[#111827] bg-white/95 px-1.5 py-0.5 rounded-md shadow-google-sm border border-slate-200/50">
                    Дніпро
                  </span>
                </div>

                {/* 5. Одеса (Odesa) */}
                <div 
                  onClick={() => {
                    const reg = regions?.find(r => r.id === 'odesa');
                    if (reg && onSelectRegion) onSelectRegion(reg);
                  }}
                  className="absolute top-[66%] left-[46%] flex items-center gap-1.5 cursor-pointer z-20 group/node hover:scale-110 transition-transform"
                >
                  <div className="relative flex items-center justify-center w-3.5 h-3.5">
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2563EB] border-2 border-white shadow-google-sm" />
                  </div>
                  <span className="text-[11px] font-bold text-[#111827] bg-white/95 px-1.5 py-0.5 rounded-md shadow-google-sm border border-slate-200/50">
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

            {/* Mode Switcher pill at top left */}
            <div className="absolute top-1 left-1 z-30">
              <button
                onClick={() => {
                  setMapMode(mapMode === 'STATIC_RENDER' ? 'WEBGL_INTERACTIVE' : 'STATIC_RENDER');
                  playWebAudioSound('click');
                }}
                className="px-3 py-1.5 rounded-full bg-white/95 hover:bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:text-[#2563EB] flex items-center gap-1.5 shadow-google-sm transition-all cursor-pointer"
                title="Перемкнути між 3D-рендером та інтерактивною 3D-моделлю"
              >
                {mapMode === 'STATIC_RENDER' ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>3D Studio Render</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>WebGL Interactive</span>
                  </>
                )}
              </button>
            </div>

            {/* Bottom Right Subtle Slogan */}
            <div className="absolute bottom-1 right-2 text-right pointer-events-none z-20 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-xl border border-slate-200/60">
              <div className={`text-[10px] font-normal ${isDark ? 'text-slate-400' : 'text-[#5B6472]'}`}>
                Технології. Люди.
              </div>
              <div className={`text-[11px] font-bold ${isDark ? 'text-slate-200' : 'text-[#111827]'}`}>
                Безпечніше завтра.
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
