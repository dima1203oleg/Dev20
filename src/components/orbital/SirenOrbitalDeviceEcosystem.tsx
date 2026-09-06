import React, { useState } from 'react';
import { 
  ArrowRight, 
  Globe,
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
  onNavigateToTab,
  theme = 'light',
}) => {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const isDark = theme === 'dark';

  const handleDeviceClick = (deviceKey: string) => {
    setSelectedDevice(deviceKey);
    playWebAudioSound('click');
  };

  return (
    <div className={`w-full rounded-3xl p-6 sm:p-8 border relative overflow-hidden my-4 ${
      isDark 
        ? 'bg-slate-900/95 border-slate-800 text-white shadow-2xl shadow-black/60' 
        : 'bg-white border-slate-100 text-slate-900 shadow-[0_4px_24px_rgba(0,0,0,0.03)]'
    }`}>
      
      {/* Background Soft Blue Radial Flare */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-3xl pointer-events-none -z-10 ${
        isDark ? 'bg-blue-900/20' : 'bg-blue-50/50'
      }`} />

      {/* Top Left Header & Call to Action */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left Info Block */}
        <div className="space-y-2 max-w-md">
          <div>
            <h2 className={`text-2xl sm:text-3xl font-black tracking-tight leading-none ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              SIREN UA
            </h2>
            <h3 className={`text-lg sm:text-xl font-extrabold tracking-tight mt-1 ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}>
              на всіх твоїх пристроях
            </h3>
          </div>

          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            Єдина екосистема. Більше безпеки. Більше можливостей.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={() => {
                alert('Завантаження SirenUA для вашої платформи розпочато!');
                playWebAudioSound('click');
              }}
              className={`px-5 py-2.5 rounded-full border text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer ${
                isDark 
                  ? 'border-blue-500/40 bg-blue-950/60 hover:bg-blue-900/80 text-blue-300' 
                  : 'border-blue-500/30 bg-blue-50/40 hover:bg-blue-50 text-blue-600'
              }`}
            >
              <span>Завантажити застосунок</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Platform Icons Row */}
            <div className={`flex items-center gap-3 pl-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {/* Apple */}
              <svg className={`w-4 h-4 fill-current transition-colors cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`} viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.12.65-2.8 1.44-.6.69-.99 1.76-.94 2.82 1.07.08 2.12-.55 2.73-1.39z"/>
              </svg>

              {/* Google Play / Android */}
              <svg className={`w-4 h-4 fill-current transition-colors cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`} viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.793 12 3.61 22.186c-.347-.282-.56-.708-.56-1.186V3c0-.478.213-.904.56-1.186zM15.207 13.414l2.586 2.586-13.42 7.747 10.834-10.333zM15.207 10.586L4.373.253 17.793 8l-2.586 2.586zM16.621 12l2.879-1.662c.983-.568.983-1.492 0-2.06L16.621 12z"/>
              </svg>

              {/* Windows */}
              <svg className={`w-4 h-4 fill-current transition-colors cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`} viewBox="0 0 24 24">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.949-1.799"/>
              </svg>

              {/* Web Globe */}
              <Globe className={`w-4 h-4 transition-colors cursor-pointer ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`} />
            </div>
          </div>
        </div>

      </div>

      {/* Orbit Visual Ring & Realistic Devices Placement */}
      <div className="relative w-full h-[320px] sm:h-[340px] flex items-center justify-center my-2 select-none">
        
        {/* Orbital Ellipse Ring Paths */}
        <div className={`absolute w-[85%] max-w-[850px] h-[210px] rounded-[100%] border -rotate-3 pointer-events-none ${
          isDark ? 'border-blue-500/20' : 'border-blue-200/50'
        }`} />
        <div className={`absolute w-[98%] max-w-[980px] h-[260px] rounded-[100%] border -rotate-3 pointer-events-none ${
          isDark ? 'border-slate-800/80' : 'border-slate-200/60'
        }`} />

        {/* Central Core: Hologram Sphere Node */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-1 shadow-[0_8px_30px_rgba(37,99,235,0.45)] flex items-center justify-center">
            {/* Pulsing Ripple Waves */}
            <div className="absolute -inset-4 rounded-full border border-cyan-400/30 animate-ping opacity-50 pointer-events-none" />
            <div className="absolute -inset-8 rounded-full border border-blue-400/20 pointer-events-none" />
            
            {/* Core Ukraine Emblem & Siren Soundwaves */}
            <div className={`w-full h-full rounded-full flex flex-col items-center justify-center p-2 shadow-inner ${
              isDark ? 'bg-slate-950' : 'bg-white'
            }`}>
              <svg viewBox="0 0 40 40" className="w-10 h-10 fill-none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" className={isDark ? 'fill-blue-950/60 stroke-blue-800' : 'fill-blue-50 stroke-blue-100'} />
                <path d="M12 28C10 24 10 16 12 12" stroke={isDark ? '#38BDF8' : '#2563EB'} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M16 25C14.5 22 14.5 18 16 15" stroke={isDark ? '#60A5FA' : '#3B82F6'} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M28 28C30 24 30 16 28 12" stroke={isDark ? '#38BDF8' : '#2563EB'} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M24 25C25.5 22 25.5 18 24 15" stroke={isDark ? '#60A5FA' : '#3B82F6'} strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="20" cy="20" r="3.5" fill={isDark ? '#38BDF8' : '#2563EB'} />
              </svg>
            </div>
          </div>
        </div>

        {/* Device 1: Телевізор (Smart TV) - Top Left */}
        <div 
          onClick={() => handleDeviceClick('tv')}
          className="absolute top-2 left-[18%] sm:left-[22%] flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform z-20"
        >
          <div className={`text-[11px] font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Телевізор</div>
          <div className={`text-[9px] -mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Smart TV</div>
          {/* TV Mockup */}
          <div className="mt-1 w-20 h-12 bg-slate-900 rounded-sm border-2 border-slate-700 shadow-md flex items-center justify-center p-1 relative">
            <div className="w-full h-full bg-blue-950/80 rounded-xs flex items-center justify-center">
              <span className="text-[7px] text-cyan-300 font-bold">SIREN UA</span>
            </div>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-slate-700 rounded-b-xs" />
          </div>
        </div>

        {/* Device 2: Desktop (Windows / Mac) - Top Center */}
        <div 
          onClick={() => handleDeviceClick('desktop')}
          className="absolute top-1 left-[42%] sm:left-[44%] flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform z-20"
        >
          <div className={`text-[11px] font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Desktop</div>
          <div className={`text-[9px] -mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Windows / Mac</div>
          {/* iMac Mockup */}
          <div className={`mt-1 w-18 h-14 rounded-md border shadow-md flex flex-col items-center p-0.5 relative ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
          }`}>
            <div className="w-full h-10 bg-slate-950 rounded-xs flex items-center justify-center">
              <div className="w-3 h-3 rounded-full border border-cyan-400/50 bg-cyan-950 flex items-center justify-center">
                <div className="w-1 h-1 bg-cyan-400 rounded-full" />
              </div>
            </div>
            <div className={`w-full h-2.5 flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            <div className={`w-5 h-2 rounded-b-sm ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />
          </div>
        </div>

        {/* Device 3: Ноутбук (MacBook) - Top Right */}
        <div 
          onClick={() => handleDeviceClick('laptop')}
          className="absolute top-2 right-[20%] sm:right-[24%] flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform z-20"
        >
          <div className={`text-[11px] font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Ноутбук</div>
          <div className={`text-[9px] -mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Усі платформи</div>
          {/* MacBook Mockup */}
          <div className="mt-1 flex flex-col items-center">
            <div className="w-16 h-11 bg-slate-900 rounded-t-xs border border-slate-700 shadow-sm flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div className="w-20 h-1 bg-slate-600 rounded-b-xs shadow-xs" />
          </div>
        </div>

        {/* Device 4: Планшет (iPad) - Far Right */}
        <div 
          onClick={() => handleDeviceClick('tablet')}
          className="absolute top-10 right-[4%] sm:right-[7%] flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform z-20"
        >
          <div className={`text-[11px] font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Планшет</div>
          <div className={`text-[9px] -mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>iPad / Android</div>
          {/* iPad Mockup */}
          <div className="mt-1 w-11 h-16 bg-slate-950 rounded-lg border-2 border-slate-700 shadow-md p-1 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-sm flex flex-col items-center justify-center p-0.5">
              <div className="w-4 h-4 rounded-full border border-blue-400 flex items-center justify-center">
                <span className="text-[5px] text-cyan-300">UA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Device 5: AR / VR Headset - Bottom Right */}
        <div 
          onClick={() => handleDeviceClick('ar_vr')}
          className="absolute bottom-3 right-[14%] sm:right-[18%] flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform z-20"
        >
          {/* Vision Pro / VR Headset Mockup */}
          <div className="w-16 h-9 bg-slate-950 rounded-2xl border-2 border-slate-700 shadow-md p-1 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/40 via-blue-900/40 to-purple-900/40 opacity-80" />
            <div className="w-4 h-4 rounded-full bg-cyan-400/30 blur-xs" />
          </div>
          <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>AR / VR</div>
          <div className={`text-[9px] -mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Майбутнє вже поруч</div>
        </div>

        {/* Device 6: Автомобіль (CarPlay) - Bottom Center */}
        <div 
          onClick={() => handleDeviceClick('car')}
          className="absolute bottom-2 left-[44%] sm:left-[46%] flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform z-20"
        >
          {/* Car Dash Screen Mockup */}
          <div className="w-18 h-9 bg-slate-950 rounded-md border border-slate-700 shadow-md p-0.5 flex items-center justify-between">
            <div className="w-2 h-full bg-slate-800 rounded-xs flex flex-col justify-around p-0.5">
              <div className="w-1 h-1 bg-slate-400 rounded-full" />
              <div className="w-1 h-1 bg-slate-400 rounded-full" />
            </div>
            <div className="flex-1 h-full bg-blue-950/90 rounded-xs flex items-center justify-center">
              <span className="text-[6px] text-cyan-300 font-bold">CARPLAY</span>
            </div>
          </div>
          <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Автомобіль</div>
          <div className={`text-[9px] -mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>CarPlay / Android Auto</div>
        </div>

        {/* Device 7: Смарт-годинник (Apple Watch) - Bottom Left */}
        <div 
          onClick={() => handleDeviceClick('watch')}
          className="absolute bottom-3 left-[26%] sm:left-[30%] flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform z-20"
        >
          {/* Apple Watch Mockup */}
          <div className="flex flex-col items-center">
            <div className="w-4 h-1.5 bg-slate-700 rounded-t-xs" />
            <div className="w-9 h-11 bg-slate-950 rounded-lg border border-slate-700 shadow-md p-1 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-md flex flex-col items-center justify-center">
                <span className="text-[6px] text-rose-400 font-bold">22:14</span>
                <span className="text-[5px] text-emerald-400">SAFE</span>
              </div>
            </div>
            <div className="w-4 h-1.5 bg-slate-700 rounded-b-xs" />
          </div>
          <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Смарт-годинник</div>
          <div className={`text-[9px] -mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Wear OS / watchOS</div>
        </div>

        {/* Device 8: Смартфон (iPhone) - Far Left */}
        <div 
          onClick={() => handleDeviceClick('smartphone')}
          className="absolute top-18 left-[4%] sm:left-[8%] flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform z-20"
        >
          <div className={`text-[11px] font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Смартфон</div>
          <div className={`text-[9px] -mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>iOS / Android</div>
          {/* iPhone Mockup */}
          <div className="mt-1 w-8 h-15 bg-slate-950 rounded-lg border-2 border-slate-700 shadow-md p-0.5 flex flex-col justify-between items-center">
            <div className="w-2.5 h-0.5 bg-black rounded-full mt-0.5" />
            <div className="w-full h-10 bg-slate-900 rounded-xs flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
            </div>
            <div className="w-3 h-0.5 bg-slate-600 rounded-full mb-0.5" />
          </div>
        </div>

      </div>

      {/* Bottom Right Slogan & Indicator Line */}
      <div className="flex items-center justify-end pt-2">
        <div className="text-right">
          <div className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Одна платформа. <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Безмежні можливості.</span>
          </div>
          <div className="w-24 h-1 bg-blue-600 rounded-full mt-1 ml-auto" />
        </div>
      </div>

    </div>
  );
};
