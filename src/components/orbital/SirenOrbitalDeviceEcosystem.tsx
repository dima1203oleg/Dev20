import React, { useState } from 'react';
import { 
  ArrowRight, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ThreatSceneModel } from '../../types';
import { playWebAudioSound } from '../../utils/sirenAudio';

interface SirenOrbitalDeviceEcosystemProps {
  threatModel?: ThreatSceneModel;
  onNavigateToTab?: (tabId: string) => void;
  isCriticalAlert?: boolean;
  theme?: 'light' | 'dark';
}

export const SirenOrbitalDeviceEcosystem: React.FC<SirenOrbitalDeviceEcosystemProps> = ({
  theme = 'light',
}) => {
  const [activeDeviceIndex, setActiveDeviceIndex] = useState(2);
  const isDark = theme === 'dark';

  const devices = [
    { id: 'tv', name: 'Телевізор', sub: 'Smart TV', leftPct: '12%' },
    { id: 'laptop', name: 'Ноутбук', sub: 'Windows · Mac', leftPct: '26%' },
    { id: 'desktop', name: 'Десктоп', sub: 'Повний функціонал', leftPct: '40%' },
    { id: 'tablet', name: 'Планшет', sub: 'iPad · Android', leftPct: '54%' },
    { id: 'smartphone', name: 'Смартфон', sub: 'iOS · Android', leftPct: '66%' },
    { id: 'car', name: 'Автомобіль', sub: 'CarPlay · Android Auto', leftPct: '78%' },
    { id: 'ar_vr', name: 'AR / VR', sub: 'Майбутнє вже поруч', leftPct: '90%' },
  ];

  const handleNext = () => {
    setActiveDeviceIndex((prev) => (prev + 1) % devices.length);
    playWebAudioSound('click');
  };

  const handlePrev = () => {
    setActiveDeviceIndex((prev) => (prev - 1 + devices.length) % devices.length);
    playWebAudioSound('click');
  };

  return (
    <div className={`w-full rounded-3xl p-6 sm:p-7 border relative overflow-hidden my-4 ${
      isDark 
        ? 'bg-slate-900/95 border-slate-800 text-white shadow-2xl' 
        : 'bg-white border-slate-200/80 text-slate-900 shadow-2xs'
    }`}>
      
      {/* Background Soft Blue Flare */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] rounded-full blur-3xl pointer-events-none -z-10 ${
        isDark ? 'bg-blue-900/15' : 'bg-blue-50/70'
      }`} />

      {/* Top Left Header & Call to Action */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
        
        {/* Left Headline */}
        <div className="space-y-1 max-w-md">
          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight leading-none ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            SIREN UA
          </h2>
          <h3 className={`text-lg sm:text-xl font-bold tracking-tight ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            на всіх твоїх пристроях
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Вдома, в дорозі, на роботі — завжди на зв&apos;язку. Більше безпеки, більше можливостей.
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                alert('Завантаження застосунку SIREN UA');
                playWebAudioSound('click');
              }}
              className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Завантажити застосунок</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 3D Panoramic Multi-Device Ecosystem */}
      <div className="relative w-full aspect-[21/9] min-h-[260px] max-h-[380px] my-3 rounded-2xl overflow-hidden flex items-center justify-center group">
        
        {/* Realistic 3D Ecosystem Render Image */}
        <img
          src="/src/assets/images/devices_ecosystem_3d_1788736328904.jpg"
          alt="SIREN UA на всіх твоїх пристроях"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-2xl"
        />

        {/* Dynamic Device Labels matching reference screenshot */}
        <div className="absolute top-2 inset-x-0 flex justify-around px-2 text-center pointer-events-none hidden sm:flex">
          {devices.map((device, idx) => (
            <div 
              key={device.id} 
              className={`flex flex-col items-center transition-all duration-300 pointer-events-auto cursor-pointer hover:scale-110 ${
                activeDeviceIndex === idx ? 'scale-105' : 'opacity-85'
              }`}
              onClick={() => {
                setActiveDeviceIndex(idx);
                playWebAudioSound('click');
              }}
            >
              <div className="text-[11px] font-black text-slate-900 bg-white/90 px-2 py-0.5 rounded-full shadow-2xs">
                {device.name}
              </div>
              <div className="text-[9px] font-medium text-slate-600 bg-white/70 px-1.5 py-0.5 rounded-full mt-0.5">
                {device.sub}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Row: Slogan on right & Pagination controls */}
      <div className="flex items-center justify-between pt-1 relative z-10">
        
        {/* Left empty for balance */}
        <div className="flex items-center gap-1.5">
          {devices.map((_, idx) => (
            <div
              key={idx}
              onClick={() => {
                setActiveDeviceIndex(idx);
                playWebAudioSound('click');
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeDeviceIndex === idx 
                  ? 'w-6 bg-blue-600' 
                  : (isDark ? 'w-1.5 bg-slate-800' : 'w-1.5 bg-slate-200 hover:bg-slate-300')
              }`}
            />
          ))}
        </div>

        {/* Right: Slogan & Carousel buttons */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Одна платформа. <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Безмежні можливості.</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
