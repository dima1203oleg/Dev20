import React from 'react';
import { 
  ArrowRight, 
  Play, 
  ChevronRight, 
  AlertTriangle,
} from 'lucide-react';
import { playWebAudioSound } from '../utils/sirenAudio';
import { ThreeMapUkraine } from './ThreeMapUkraine';

interface HeroSectionProps {
  onOpenMap: () => void;
  onOpenGuide: () => void;
  onOpenThreats: () => void;
  activeThreatsCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenMap,
  onOpenGuide,
  onOpenThreats,
  activeThreatsCount = 3,
}) => {
  return (
    <section className="relative w-full overflow-hidden pt-2 pb-4">
      
      {/* Background Soft Blue Radial Ambient Light */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[350px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        
        {/* Left Column: Headline & Call To Action */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100/80 text-blue-700 text-xs font-semibold shadow-xs">
            <span className="text-sm">🇺🇦</span>
            <span>Україна сильна, коли ми разом</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-slate-900 tracking-tight leading-[1.12]">
            Розумій ситуацію.<br />
            Не просто отримуй тривогу.
          </h1>

          {/* Subtitle description */}
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl">
            Актуальна інформація, реальні загрози, надійна спільнота. SIREN UA — це більше, ніж сповіщення. Це безпека, технології та можливості.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                onOpenMap();
                playWebAudioSound('click');
              }}
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Відкрити карту</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onOpenGuide();
                playWebAudioSound('click');
              }}
              className="px-5 py-3.5 rounded-2xl bg-white/90 hover:bg-white text-slate-800 font-semibold text-sm border border-slate-200/80 shadow-sm flex items-center gap-2.5 transition-all hover:border-slate-300 cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Play className="w-2.5 h-2.5 fill-blue-600 ml-0.5" />
              </div>
              <span>Дізнатися більше</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

        </div>

        {/* Right Column: 3D Holographic Relief Map & Floating Threat Badge */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
          
          {/* Top Floating Badge Card: 3 активні загрози */}
          <div 
            onClick={onOpenThreats}
            className="self-end mb-1 mr-2 z-30 cursor-pointer"
          >
            <div className="px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-[0_6px_20px_rgba(0,0,0,0.06)] flex items-center gap-3 hover:shadow-md transition-all group">
              <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-black text-slate-900 text-sm">{activeThreatsCount}</span>
                <span className="text-slate-500 font-medium">активні загрози</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* 3D Volumetric Ukraine Map Canvas */}
          <div className="relative w-full aspect-[16/10] max-h-[380px] rounded-3xl overflow-hidden flex items-center justify-center">
            <ThreeMapUkraine
              variant="hero"
              activeThreatCount={activeThreatsCount}
              onSelectCity={(city) => {
                onOpenMap();
                playWebAudioSound('click');
              }}
            />

            {/* Bottom Right Slogan */}
            <div className="absolute bottom-1 right-2 text-right pointer-events-none z-20">
              <div className="text-[11px] font-semibold text-slate-400">Технології.</div>
              <div className="text-[11px] font-semibold text-slate-400">Люди.</div>
              <div className="text-[11px] font-bold text-slate-600">Безпечне завтра.</div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
