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
  Layers,
  Sparkles
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
    <div className="w-full my-4 space-y-3">
      
      {/* Section Header with Title on Left and Tabs + Period Filter on Right */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Фінансова інформація
          </h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Ваш дохід. Ваш розвиток. Більше можливостей.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Tab Switcher Pills */}
          <div className={`p-1 rounded-full inline-flex items-center gap-1 border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/90 border-slate-200/70'
          }`}>
            <button
              onClick={() => {
                setActiveTab('SITUATION');
                playWebAudioSound('click');
              }}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'SITUATION'
                  ? (isDark ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-blue-600 shadow-xs')
                  : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800')
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
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'NETWORK'
                  ? (isDark ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-blue-600 shadow-xs')
                  : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800')
              }`}
            >
              Моя мережа
            </button>

            <button
              onClick={() => {
                setActiveTab('ANALYTICS');
                playWebAudioSound('click');
              }}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ANALYTICS'
                  ? (isDark ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-blue-600 shadow-xs')
                  : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800')
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
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'HISTORY'
                  ? (isDark ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-blue-600 shadow-xs')
                  : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800')
              }`}
            >
              Історія
            </button>
          </div>

          {/* Period selector dropdown pill */}
          <button 
            onClick={() => {
              setPeriod(period === 'Цей місяць' ? 'Цей рік' : 'Цей місяць');
              playWebAudioSound('click');
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark 
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' 
                : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50 shadow-2xs'
            }`}
          >
            <span>{period}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 5-Card Layout Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-4">
        
        {/* Card 1: Зароблено (3 cols) */}
        <div className={`lg:col-span-3 rounded-2xl p-4 sm:p-5 border flex flex-col justify-between transition-all ${
          isDark 
            ? 'bg-slate-900/90 border-slate-800 text-white shadow-md' 
            : 'bg-white border-slate-200/70 text-slate-900 shadow-2xs'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Зароблено
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDark ? 'bg-blue-950/80 text-blue-400' : 'bg-blue-50 text-blue-600'
              }`}>
                <BarChart2 className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                ₴ 12 460
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-200 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>+12%</span>
              </span>
            </div>
          </div>

          {/* Mini Bar Chart visualization */}
          <div className="py-3">
            <div className="flex items-end justify-between gap-1.5 h-12 pt-2">
              {[25, 40, 35, 50, 45, 65, 55, 80, 70, 95].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    style={{ height: `${height}%` }}
                    className={`w-full rounded-t-sm transition-all duration-500 ${
                      idx >= 8 
                        ? 'bg-blue-600 shadow-xs' 
                        : (isDark ? 'bg-slate-800 hover:bg-blue-900' : 'bg-blue-100 hover:bg-blue-200')
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className={`text-[10px] font-medium text-center mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              Динаміка за місяць
            </div>
          </div>
        </div>

        {/* Card 2: Баланс & Виведення with 3D Gold Coins (3 cols) */}
        <div className={`lg:col-span-3 rounded-2xl p-4 sm:p-5 border flex flex-col justify-between transition-all ${
          isDark 
            ? 'bg-slate-900/90 border-slate-800 text-white shadow-md' 
            : 'bg-white border-slate-200/70 text-slate-900 shadow-2xs'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Баланс
              </span>
              {/* 3D Realistic Gold Coins Graphic */}
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shadow-xs">
                <img 
                  src="/src/assets/images/gold_coins_3d_1788736344781.jpg" 
                  alt="3D Gold Coins" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className={`text-2xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              ₴ 8 460
            </div>

            {/* Breakdown lines */}
            <div className={`space-y-1 my-2 text-[11px] border-y py-1.5 ${
              isDark ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-600'
            }`}>
              <div className="flex items-center justify-between">
                <span>Доступно</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₴ 4 230</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Очікує</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₴ 3 850</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Утримано</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">₴ 580</span>
              </div>
            </div>

            {/* Status badge */}
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-1">
                <span>⚠️</span>
                <span>Gold - 20%</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (onNavigateToFinance) onNavigateToFinance();
              playWebAudioSound('click');
            }}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <span>Вивести кошти</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Доступно до виводу (2 cols) */}
        <div className={`lg:col-span-2 rounded-2xl p-4 sm:p-5 border flex flex-col justify-between transition-all ${
          isDark 
            ? 'bg-slate-900/90 border-slate-800 text-white shadow-md' 
            : 'bg-white border-slate-200/70 text-slate-900 shadow-2xs'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Доступно до виводу
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDark ? 'bg-blue-950/80 text-blue-400' : 'bg-blue-50 text-blue-600'
              }`}>
                <Wallet className="w-4 h-4" />
              </div>
            </div>

            <div className={`text-2xl font-black mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              ₴ 4 230
            </div>

            <div className="mt-3">
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                Мінімальна сума:
              </div>
              <div className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                ₴ 1 000
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (onNavigateToFinance) onNavigateToFinance();
              playWebAudioSound('click');
            }}
            className="mt-3 text-left text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Історія виплат</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 4: Карта ситуації Mini 3D Preview (2 cols) */}
        <div className={`lg:col-span-2 rounded-2xl p-3 border flex flex-col justify-between relative overflow-hidden group ${
          isDark 
            ? 'bg-slate-900/90 border-slate-800 text-white shadow-md' 
            : 'bg-white border-slate-200/70 text-slate-900 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold">Карта ситуації</span>
            <button 
              onClick={() => {
                if (onNavigateToShelters) onNavigateToShelters();
                playWebAudioSound('click');
              }}
              className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

          {/* 3D Map mini preview */}
          <div className="relative w-full h-28 my-1 flex items-center justify-center rounded-xl overflow-hidden">
            {miniMapMode === 'RENDER' ? (
              <img 
                src="/src/assets/images/ukraine_situation_mini_1788736359899.jpg" 
                alt="3D Карта Ситуації" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
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

          <div className="flex items-center justify-between z-10">
            <button
              onClick={() => setMiniMapMode(miniMapMode === 'RENDER' ? 'WEBGL' : 'RENDER')}
              className="text-[9px] text-blue-600 font-bold hover:underline cursor-pointer"
            >
              {miniMapMode === 'RENDER' ? '3D Render' : 'WebGL'}
            </button>
            <button 
              onClick={() => {
                if (onNavigateToShelters) onNavigateToShelters();
                playWebAudioSound('click');
              }}
              className={`p-1 rounded-md text-[10px] font-mono border cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <Maximize2 className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {/* Card 5: Київська область Threat Details (2 cols) */}
        <div className={`lg:col-span-2 rounded-2xl p-4 border flex flex-col justify-between transition-all ${
          isDark 
            ? 'bg-slate-900/90 border-slate-800 text-white shadow-md' 
            : 'bg-white border-slate-200/70 text-slate-900 shadow-2xs'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">Київська область</span>
            </div>

            <div className="mt-1.5">
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-1 inline-flex">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>Підвищена увага</span>
              </span>
            </div>

            <div className={`space-y-1.5 mt-2.5 text-[11px] border-t pt-2 ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}>
              <div className="flex items-center gap-1.5">
                <Crosshair className="w-3 h-3 text-blue-500 flex-shrink-0" />
                <span>Тип загрози: <strong className={isDark ? 'text-white' : 'text-slate-800'}>БпЛА</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Compass className="w-3 h-3 text-blue-500 flex-shrink-0" />
                <span>Напрямок: <strong className={isDark ? 'text-white' : 'text-slate-800'}>Південно-зах.</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-blue-500 flex-shrink-0" />
                <span>Оновлено: <strong className={isDark ? 'text-white' : 'text-slate-800'}>22:14</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (onNavigateToShelters) onNavigateToShelters();
              playWebAudioSound('click');
            }}
            className="mt-3 text-left text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Детальніше</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

    </div>
  );
};
