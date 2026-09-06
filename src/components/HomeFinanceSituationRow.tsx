import React, { useState } from 'react';
import { 
  BarChart2, 
  Wallet, 
  ArrowRight, 
  ChevronDown, 
  Maximize2,
  AlertTriangle,
  Crosshair,
  Compass,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { ThreeMapUkraine } from './ThreeMapUkraine';
import { RegionData, ThreatSceneModel } from '../types';
import { playWebAudioSound } from '../utils/sirenAudio';

interface HomeFinanceSituationRowProps {
  regions?: RegionData[];
  selectedRegion?: RegionData | null;
  onSelectRegion?: (region: RegionData | null) => void;
  threatModel?: ThreatSceneModel;
  onNavigateToFinance?: () => void;
  onNavigateToNetwork?: () => void;
  onNavigateToShelters?: () => void;
  theme?: 'light' | 'dark';
}

export const HomeFinanceSituationRow: React.FC<HomeFinanceSituationRowProps> = ({
  regions,
  selectedRegion,
  onSelectRegion,
  onNavigateToFinance,
  onNavigateToNetwork,
  onNavigateToShelters,
  theme = 'light',
}) => {
  const [activeTab, setActiveTab] = useState<'SITUATION' | 'NETWORK' | 'ANALYTICS' | 'HISTORY'>('SITUATION');
  const [period, setPeriod] = useState('Цей місяць');
  const [miniMapMode, setMiniMapMode] = useState<'RENDER' | 'WEBGL'>('RENDER');
  const isDark = theme === 'dark';

  return (
    <div className="w-full my-5 space-y-4">
      
      {/* Section Header with Title on Left and Clean Tabs on Right */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'}`}>
            Фінансова інформація
          </h2>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-[#5B6472]'}`}>
            Ваш дохід. Ваш розвиток. Більше можливостей.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Tab Switcher Pills */}
          <div className={`p-1 rounded-full inline-flex items-center gap-1 border ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-[#F1F4F9] border-slate-200/80'
          }`}>
            <button
              onClick={() => {
                setActiveTab('SITUATION');
                playWebAudioSound('click');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'SITUATION'
                  ? (isDark ? 'bg-[#2563EB] text-white shadow-google-sm' : 'bg-white text-[#2563EB] shadow-google-sm')
                  : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-[#5B6472] hover:text-[#111827]')
              }`}
            >
              Ситуація
            </button>

            <button
              onClick={() => {
                setActiveTab('NETWORK');
                if (onNavigateToNetwork) onNavigateToNetwork();
                playWebAudioSound('click');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'NETWORK'
                  ? (isDark ? 'bg-[#2563EB] text-white shadow-google-sm' : 'bg-white text-[#2563EB] shadow-google-sm')
                  : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-[#5B6472] hover:text-[#111827]')
              }`}
            >
              Моя мережа
            </button>

            <button
              onClick={() => {
                setActiveTab('ANALYTICS');
                playWebAudioSound('click');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'ANALYTICS'
                  ? (isDark ? 'bg-[#2563EB] text-white shadow-google-sm' : 'bg-white text-[#2563EB] shadow-google-sm')
                  : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-[#5B6472] hover:text-[#111827]')
              }`}
            >
              Аналітика
            </button>

            <button
              onClick={() => {
                setActiveTab('HISTORY');
                if (onNavigateToFinance) onNavigateToFinance();
                playWebAudioSound('click');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'HISTORY'
                  ? (isDark ? 'bg-[#2563EB] text-white shadow-google-sm' : 'bg-white text-[#2563EB] shadow-google-sm')
                  : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-[#5B6472] hover:text-[#111827]')
              }`}
            >
              Історія
            </button>
          </div>

          {/* Period dropdown pill */}
          <button 
            onClick={() => {
              setPeriod(period === 'Цей місяць' ? 'Цей рік' : 'Цей місяць');
              playWebAudioSound('click');
            }}
            className={`px-3.5 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark 
                ? 'bg-[#111827] border-slate-800 text-slate-300 hover:bg-slate-800' 
                : 'bg-white border-slate-200/80 text-[#111827] hover:bg-[#F7F9FC] shadow-google-sm'
            }`}
          >
            <span>{period}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 5-Card Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        
        {/* Card 1: Зароблено (3 cols) */}
        <div className={`lg:col-span-3 rounded-2xl p-5 border flex flex-col justify-between transition-all duration-200 ${
          isDark 
            ? 'bg-[#111827] border-slate-800 text-white shadow-google-card' 
            : 'bg-[#FFFFFF] border-slate-200/70 text-[#111827] shadow-google-card'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-[#8B95A7]'}`}>
                Зароблено
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-blue-950/80 text-blue-400' : 'bg-blue-50 text-[#2563EB]'
              }`}>
                <BarChart2 className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-2xl sm:text-[26px] font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                ₴ 12 460
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/70 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>+12%</span>
              </span>
            </div>
            <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-[#8B95A7]'}`}>
              Цього місяця
            </div>
          </div>

          {/* Clean Mini Bar Dynamics */}
          <div className="py-2 mt-2">
            <div className="flex items-end justify-between gap-1.5 h-10 pt-1">
              {[30, 45, 40, 55, 50, 70, 60, 85, 75, 100].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div 
                    style={{ height: `${height}%` }}
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      idx >= 8 
                        ? 'bg-[#2563EB]' 
                        : (isDark ? 'bg-slate-800' : 'bg-blue-100/90 hover:bg-blue-200')
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Баланс & Виведення (3 cols) with 3D Gold Coins Cutout */}
        <div className={`lg:col-span-3 rounded-2xl p-5 border flex flex-col justify-between transition-all duration-200 ${
          isDark 
            ? 'bg-[#111827] border-slate-800 text-white shadow-google-card' 
            : 'bg-[#FFFFFF] border-slate-200/70 text-[#111827] shadow-google-card'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-[#8B95A7]'}`}>
                Баланс
              </span>
              {/* Studio 3D Gold Coins Cutout */}
              <div className="w-9 h-9 flex items-center justify-center">
                <img 
                  src="/src/assets/images/gold_coins_3d_cutout.png" 
                  alt="3D Gold Coins" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>
            </div>

            <div className={`text-2xl sm:text-[26px] font-extrabold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-[#111827]'}`}>
              ₴ 8 460
            </div>

            {/* Structured Breakdown lines */}
            <div className={`space-y-1 my-2.5 text-xs border-y py-2 ${
              isDark ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-[#5B6472]'
            }`}>
              <div className="flex items-center justify-between">
                <span>Доступно:</span>
                <span className="font-bold text-[#111827] dark:text-white">₴ 4 230</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Очікує:</span>
                <span className="font-bold text-[#111827] dark:text-white">₴ 3 850</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Утримано:</span>
                <span className="font-bold text-[#111827] dark:text-white">₴ 580</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (onNavigateToFinance) onNavigateToFinance();
              playWebAudioSound('click');
            }}
            className="w-full mt-1 py-2.5 px-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-google-sm transition-all cursor-pointer"
          >
            <span>Вивести кошти</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Доступно до виводу (2 cols) */}
        <div className={`lg:col-span-2 rounded-2xl p-5 border flex flex-col justify-between transition-all duration-200 ${
          isDark 
            ? 'bg-[#111827] border-slate-800 text-white shadow-google-card' 
            : 'bg-[#FFFFFF] border-slate-200/70 text-[#111827] shadow-google-card'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-[#8B95A7]'}`}>
                Доступно до виводу
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-blue-950/80 text-blue-400' : 'bg-blue-50 text-[#2563EB]'
              }`}>
                <Wallet className="w-4 h-4" />
              </div>
            </div>

            <div className={`text-2xl font-extrabold tracking-tight mt-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>
              ₴ 4 230
            </div>

            <div className="mt-3">
              <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-[#8B95A7]'}`}>
                Мінімальна сума:
              </div>
              <div className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-[#111827]'}`}>
                ₴ 1 000
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (onNavigateToFinance) onNavigateToFinance();
              playWebAudioSound('click');
            }}
            className="mt-3 text-left text-xs font-semibold text-[#2563EB] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Історія виплат</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 4: Карта ситуації (2 cols) Studio 3D Cutout */}
        <div className={`lg:col-span-2 rounded-2xl p-4 border flex flex-col justify-between relative overflow-hidden group transition-all duration-200 ${
          isDark 
            ? 'bg-[#111827] border-slate-800 text-white shadow-google-card' 
            : 'bg-[#FFFFFF] border-slate-200/70 text-[#111827] shadow-google-card'
        }`}>
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold text-[#111827] dark:text-white">Карта ситуації</span>
            <button 
              onClick={() => {
                if (onNavigateToShelters) onNavigateToShelters();
                playWebAudioSound('click');
              }}
              className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-[#F7F9FC] border-slate-200 text-slate-600'
              }`}
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

          {/* 3D Map mini preview (Studio cutout on card surface) */}
          <div className="relative w-full h-24 my-1 flex items-center justify-center overflow-hidden">
            {miniMapMode === 'RENDER' ? (
              <img 
                src="/src/assets/images/mini_map_3d_cutout.png" 
                alt="3D Карта Ситуації" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain drop-shadow-[0_6px_12px_rgba(37,99,235,0.15)]"
              />
            ) : (
              <ThreeMapUkraine
                variant="workspace"
                theme={theme}
                regions={regions}
                selectedRegionId={selectedRegion?.id || 'kyiv_obl'}
                onSelectRegion={(reg) => {
                  if (onSelectRegion) onSelectRegion(reg);
                }}
                enableControls={false}
              />
            )}
          </div>

          <div className="flex items-center justify-between z-10 pt-1">
            <button
              onClick={() => setMiniMapMode(miniMapMode === 'RENDER' ? 'WEBGL' : 'RENDER')}
              className="text-[10px] text-[#2563EB] font-bold hover:underline cursor-pointer"
            >
              {miniMapMode === 'RENDER' ? '3D Render' : 'WebGL'}
            </button>
            <button 
              onClick={() => {
                if (onNavigateToShelters) onNavigateToShelters();
                playWebAudioSound('click');
              }}
              className="text-[10px] font-semibold text-[#5B6472] hover:text-[#111827] cursor-pointer"
            >
              Укриття
            </button>
          </div>
        </div>

        {/* Card 5: Київська область Threat Details (2 cols) */}
        <div className={`lg:col-span-2 rounded-2xl p-4 border flex flex-col justify-between transition-all duration-200 ${
          isDark 
            ? 'bg-[#111827] border-slate-800 text-white shadow-google-card' 
            : 'bg-[#FFFFFF] border-slate-200/70 text-[#111827] shadow-google-card'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111827] dark:text-white">Київська область</span>
            </div>

            <div className="mt-1.5">
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold flex items-center gap-1 inline-flex">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>Підвищена увага</span>
              </span>
            </div>

            <div className={`space-y-1.5 mt-2.5 text-[11px] border-t pt-2 ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-[#5B6472]'
            }`}>
              <div className="flex items-center gap-1.5">
                <Crosshair className="w-3 h-3 text-[#2563EB] flex-shrink-0" />
                <span>Тип: <strong className={isDark ? 'text-white' : 'text-[#111827]'}>БпЛА</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Compass className="w-3 h-3 text-[#2563EB] flex-shrink-0" />
                <span>Напрямок: <strong className={isDark ? 'text-white' : 'text-[#111827]'}>Півд.-зах.</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#2563EB] flex-shrink-0" />
                <span>Оновлено: <strong className={isDark ? 'text-white' : 'text-[#111827]'}>22:14</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (onNavigateToShelters) onNavigateToShelters();
              playWebAudioSound('click');
            }}
            className="mt-3 text-left text-xs font-semibold text-[#2563EB] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Детальніше</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

    </div>
  );
};
