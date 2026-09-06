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
    { id: 'tv', name: 'Телевізор', sub: 'Smart TV' },
    { id: 'laptop', name: 'Ноутбук', sub: 'macOS · Windows' },
    { id: 'desktop', name: 'Десктоп', sub: 'Повний контроль' },
    { id: 'tablet', name: 'Планшет', sub: 'iPad · Android' },
    { id: 'smartphone', name: 'Смартфон', sub: 'iOS · Android' },
    { id: 'car', name: 'Автомобіль', sub: 'CarPlay · Auto' },
    { id: 'ar_vr', name: 'AR / VR', sub: 'Просторова візія' },
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
    <div className={`w-full rounded-3xl p-6 sm:p-8 border relative overflow-hidden my-4 transition-all duration-300 ${
      isDark 
        ? 'bg-[#111827] border-slate-800 text-white shadow-google-card' 
        : 'bg-[#FFFFFF] border-slate-200/70 text-[#111827] shadow-google-card'
    }`}>
      
      {/* Background Soft Ambient Light */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full blur-[100px] pointer-events-none -z-10 ${
        isDark ? 'bg-blue-900/10' : 'bg-blue-50/70'
      }`} />

      {/* Top Left Header & Call to Action */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
        
        {/* Left Headline */}
        <div className="space-y-1.5 max-w-lg">
          <div className="flex items-center gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'}`}>
              SIREN UA
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2563EB]">
              на всіх пристроях
            </span>
          </div>
          
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#5B6472]'}`}>
            Вдома, в дорозі або на роботі — єдина інтелектуальна екосистема сповіщень та безпеки.
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                alert('Завантаження застосунку SIREN UA');
                playWebAudioSound('click');
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-google-sm flex items-center gap-2 transition-all cursor-pointer hover:shadow-md"
            >
              <span>Завантажити застосунок</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 3D Panoramic Multi-Device Ecosystem */}
      <div className="relative w-full aspect-[21/9] min-h-[260px] max-h-[380px] my-3 flex items-center justify-center group">
        
        {/* Realistic 3D Ecosystem Render Image without background */}
        <img
          src="/src/assets/images/devices_3d_cutout.png"
          alt="SIREN UA на всіх твоїх пристроях"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(37,99,235,0.16)]"
        />

        {/* Dynamic Device Labels */}
        <div className="absolute top-1 inset-x-0 flex justify-around px-2 text-center pointer-events-none hidden sm:flex">
          {devices.map((device, idx) => (
            <div 
              key={device.id} 
              className={`flex flex-col items-center transition-all duration-300 pointer-events-auto cursor-pointer hover:scale-105 ${
                activeDeviceIndex === idx ? 'scale-105 opacity-100' : 'opacity-75 hover:opacity-100'
              }`}
              onClick={() => {
                setActiveDeviceIndex(idx);
                playWebAudioSound('click');
              }}
            >
              <div className="text-[11px] font-bold text-[#111827] bg-white/95 px-3 py-1 rounded-full shadow-google-sm border border-slate-200/60">
                {device.name}
              </div>
              <div className="text-[9px] font-medium text-[#5B6472] bg-[#F7F9FC]/90 px-2 py-0.5 rounded-full mt-1 border border-slate-200/50">
                {device.sub}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Row: Slogan on right & Pagination controls */}
      <div className="flex items-center justify-between pt-1 relative z-10">
        
        {/* Left pagination indicators */}
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
                  ? 'w-6 bg-[#2563EB]' 
                  : (isDark ? 'w-1.5 bg-slate-800' : 'w-1.5 bg-slate-200 hover:bg-slate-300')
              }`}
            />
          ))}
        </div>

        {/* Right: Slogan & Carousel buttons */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-[#5B6472]'}`}>
              Одна платформа. <span className={`font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Безмежні можливості.</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-[#5B6472] hover:bg-[#F7F9FC] shadow-google-sm'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-[#5B6472] hover:bg-[#F7F9FC] shadow-google-sm'
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
