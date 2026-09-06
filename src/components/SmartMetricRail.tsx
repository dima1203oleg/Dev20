import React from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  ChevronRight,
  AlertTriangle,
  Clock,
  ArrowRight,
  Radio
} from 'lucide-react';
import { ThreatSceneModel } from '../types';

interface SmartMetricRailProps {
  threatModel?: ThreatSceneModel;
  myRegionName?: string;
  isAlarm?: boolean;
  activeEventsCount?: number;
  lastUpdatedTime?: string;
  onSelectRegion?: () => void;
  onOpenStatus?: () => void;
  onOpenEvents?: () => void;
  theme?: 'light' | 'dark';
}

export const SmartMetricRail: React.FC<SmartMetricRailProps> = ({
  myRegionName = 'Одеська область',
  isAlarm = false,
  activeEventsCount = 3,
  lastUpdatedTime = 'Сьогодні, 22:14',
  onSelectRegion,
  onOpenStatus,
  onOpenEvents,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 my-2">
      
      {/* Card 1: Мій регіон */}
      <div 
        onClick={onSelectRegion}
        className={`rounded-2xl p-4 flex items-center justify-between cursor-pointer group transition-all border ${
          isDark 
            ? 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 text-white shadow-lg shadow-black/30' 
            : 'bg-white hover:bg-slate-50 border-slate-200/70 text-slate-900 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform ${
            isDark ? 'bg-blue-950/80 text-blue-400 border border-blue-900/50' : 'bg-blue-50 text-blue-600'
          }`}>
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              Мій регіон
            </div>
            <div className={`text-sm font-bold leading-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {myRegionName}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
          <span>Змінити</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Card 2: Стан (Спокійно / Тривога) */}
      <div 
        onClick={onOpenStatus}
        className={`rounded-2xl p-4 flex items-center justify-between cursor-pointer group transition-all border ${
          isDark 
            ? 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 text-white shadow-lg shadow-black/30' 
            : 'bg-white hover:bg-slate-50 border-slate-200/70 text-slate-900 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform ${
            isAlarm 
              ? (isDark ? 'bg-rose-950/80 text-rose-400 border border-rose-900/50' : 'bg-rose-50 text-rose-600') 
              : (isDark ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900/50' : 'bg-emerald-50 text-emerald-600')
          }`}>
            {isAlarm ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <div className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              Стан
            </div>
            <div className={`text-sm font-bold leading-tight mt-0.5 ${
              isAlarm 
                ? (isDark ? 'text-rose-400' : 'text-rose-600') 
                : (isDark ? 'text-emerald-400' : 'text-emerald-600')
            }`}>
              {isAlarm ? 'Тривога' : 'Спокійно'}
            </div>
            <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {isAlarm ? 'Небезпека у вашому районі' : 'На даний момент загроз не виявлено'}
            </div>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 transition-all ${
          isDark ? 'text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5' : 'text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5'
        }`} />
      </div>

      {/* Card 3: Активні події */}
      <div 
        onClick={onOpenEvents}
        className={`rounded-2xl p-4 flex items-center justify-between cursor-pointer group transition-all border ${
          isDark 
            ? 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 text-white shadow-lg shadow-black/30' 
            : 'bg-white hover:bg-slate-50 border-slate-200/70 text-slate-900 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform ${
            isDark ? 'bg-rose-950/80 text-rose-400 border border-rose-900/50' : 'bg-rose-50 text-rose-500'
          }`}>
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              Активні події
            </div>
            <div className={`text-base font-black leading-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activeEventsCount}
            </div>
            <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Відстежується
            </div>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 transition-all ${
          isDark ? 'text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5' : 'text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5'
        }`} />
      </div>

      {/* Card 4: Оновлено (Live Indicator 1:1 with Screenshot) */}
      <div 
        className={`rounded-2xl p-4 flex items-center justify-between transition-all border ${
          isDark 
            ? 'bg-slate-900/90 border-slate-800 text-white shadow-lg shadow-black/30' 
            : 'bg-white border-slate-200/70 text-slate-900 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isDark ? 'bg-blue-950/80 text-blue-400 border border-blue-900/50' : 'bg-blue-50 text-blue-600'
          }`}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              Оновлено
            </div>
            <div className={`text-sm font-bold leading-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {lastUpdatedTime}
            </div>
          </div>
        </div>
        
        {/* LIVE pill badge & subtext */}
        <div className="flex flex-col items-end">
          <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
            isDark 
              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80' 
              : 'bg-emerald-50 text-emerald-600 border border-emerald-200/80'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE</span>
          </div>
          <span className={`text-[9px] font-medium mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Дані в реальному часі
          </span>
        </div>
      </div>

    </div>
  );
};
