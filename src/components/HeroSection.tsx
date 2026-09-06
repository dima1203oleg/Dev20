import React from 'react';
import { 
  BookOpen, 
  Play, 
  ChevronRight, 
  AlertTriangle,
  ArrowRight
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
  const isDark = theme === 'dark';

  return (
    <section className="relative w-full overflow-hidden pt-2 pb-4">
      
      {/* Background Soft Blue Radial Ambient Light */}
      <div className={`absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none -z-10 ${
        isDark ? 'bg-blue-900/25' : 'bg-blue-100/50'
      }`} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        
        {/* Left Column: Headline & Call To Action */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5">
          
          {/* Top Pill Badge */}
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs ${
            isDark 
              ? 'bg-slate-900/90 border border-slate-800 text-slate-300' 
              : 'bg-blue-50/80 border border-blue-100/80 text-blue-700'
          }`}>
            <span className="text-sm">🇺🇦</span>
            <span>Україна сильна, коли ми разом</span>
          </div>

          {/* Main Headline */}
          <h1 className={`text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.12] ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Розумій ситуацію.<br />
            <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>Не просто отримуй тривогу.</span>
          </h1>

          {/* Subtitle description */}
          <p className={`text-xs sm:text-sm leading-relaxed max-w-xl ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Актуальна інформація, реальні загрози, надійна аналітика. SIREN UA — це більше, ніж сповіщення. Це безпека, технології та можливості для кожного українця.
          </p>

          {/* Action Buttons (1:1 with Screenshot 3) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                onOpenMap();
                playWebAudioSound('click');
              }}
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Відкрити карту</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={() => {
                onOpenGuide();
                playWebAudioSound('click');
              }}
              className={`px-5 py-3.5 rounded-2xl font-semibold text-sm border shadow-xs flex items-center gap-2.5 transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700' 
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                isDark ? 'bg-blue-950/80 text-blue-400' : 'bg-blue-50 text-blue-600'
              }`}>
                <Play className="w-2.5 h-2.5 fill-blue-600 ml-0.5" />
              </div>
              <span>Дивитись демо</span>
            </button>
          </div>

        </div>

        {/* Right Column: 3D Holographic Relief Map with All Oblasts & Floating Threat Badge */}
        <div className="lg:col-span-7 relative flex flex-col items-center justify-center">
          
          {/* Top Floating Badge Card: 3 активні загрози */}
          <div 
            onClick={onOpenThreats}
            className="self-end mb-1 mr-2 z-30 cursor-pointer"
          >
            <div className={`px-4 py-2 rounded-2xl backdrop-blur-md border shadow-xl flex items-center gap-3 hover:shadow-2xl transition-all group ${
              isDark 
                ? 'bg-slate-900/95 border-slate-800 text-white shadow-black/50' 
                : 'bg-white/95 border-slate-100 shadow-[0_6px_20px_rgba(0,0,0,0.06)]'
            }`}>
              <div className="w-7 h-7 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {activeThreatsCount}
                </span>
                <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Активні загрози
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 3D Volumetric Ukraine Map Canvas with City Nodes (Київ, Львів, Харків, Дніпро, Одеса) */}
          <div className="relative w-full aspect-[16/10] max-h-[420px] rounded-3xl overflow-hidden flex items-center justify-center">
            <ThreeMapUkraine
              variant="hero"
              theme={theme}
              regions={regions}
              selectedRegionId={selectedRegionId}
              onSelectRegion={onSelectRegion}
              activeThreatCount={activeThreatsCount}
              enableControls={true}
            />

            {/* Bottom Right Slogan (1:1 with Screenshot 3) */}
            <div className="absolute bottom-2 right-3 text-right pointer-events-none z-20">
              <div className={`text-[11px] font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Технології.
              </div>
              <div className={`text-[11px] font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Люди.
              </div>
              <div className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Безпечніше завтра.
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
