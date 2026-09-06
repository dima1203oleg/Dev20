import React from 'react';
import { 
  AlertOctagon, 
  MapPin, 
  ShieldCheck, 
  Flame, 
  Radio, 
  Zap, 
  Clock, 
  Volume2, 
  VolumeX, 
  ArrowUpRight,
  Plane
} from 'lucide-react';
import { RegionData } from '../types';

interface SirenaDashboardStatsProps {
  regions: RegionData[];
  myRegionId: string;
  onSelectRegion: (region: RegionData) => void;
  isSirenPlaying: boolean;
  onToggleSiren: () => void;
  onOpenSimulator: () => void;
}

export const SirenaDashboardStats: React.FC<SirenaDashboardStatsProps> = ({
  regions,
  myRegionId,
  onSelectRegion,
  isSirenPlaying,
  onToggleSiren,
  onOpenSimulator,
}) => {
  const activeRegions = regions.filter((r) => r.isAlarm);
  const activeCount = activeRegions.length;
  const totalCount = regions.length;
  const percentAlarm = Math.round((activeCount / totalCount) * 100);

  const myRegion = regions.find((r) => r.id === myRegionId);
  const myRegionAlarm = myRegion?.isAlarm || false;

  // Calculate threats count
  const droneCount = regions.filter((r) => r.isAlarm && r.threatType === 'drone').length;
  const ballisticCount = regions.filter((r) => r.isAlarm && r.threatType === 'ballistic').length;
  const aviationCount = regions.filter((r) => r.isAlarm && r.threatType === 'aviation').length;
  const artilleryCount = regions.filter((r) => r.isAlarm && r.threatType === 'artillery').length;

  // Find longest alarm
  const longestAlarmRegion = [...activeRegions].sort((a, b) => b.durationMinutes - a.durationMinutes)[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      
      {/* Card 1: Overall Ukraine Alarm State */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Загальна ситуація
          </span>
          <div className={`p-1.5 rounded-lg ${activeCount > 0 ? 'bg-red-950/60 text-red-400' : 'bg-emerald-950/60 text-emerald-400'}`}>
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-mono">
            {activeCount}
          </span>
          <span className="text-sm font-medium text-slate-400">
            / {totalCount} областей ({percentAlarm}%)
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              activeCount > 10 ? 'bg-red-500' : activeCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${percentAlarm}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
          <span>{activeCount > 0 ? 'Тривають повітряні тривоги' : 'Небезпеки наразі немає'}</span>
          <button 
            onClick={onOpenSimulator} 
            className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-0.5"
          >
            Змінити <ArrowUpRight className="w-3 h-3" />
          </button>
        </p>
      </div>

      {/* Card 2: My Region Status & Instant Safety Alert */}
      <div className={`border rounded-2xl p-4 shadow-lg backdrop-blur-sm relative overflow-hidden transition-all ${
        myRegionAlarm
          ? 'bg-red-950/40 border-red-800/80 shadow-red-950/50'
          : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            Моя область
          </span>
          {myRegionAlarm ? (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-red-600 text-white animate-pulse">
              Укриття!
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
              Спокійно
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-slate-100 truncate max-w-[150px]">
              {myRegion?.shortName || 'Не обрано'}
            </h4>
            <p className="text-xs text-slate-400">
              {myRegionAlarm 
                ? `Тривога триває ${myRegion?.durationMinutes} хв` 
                : 'Повітряна тривога відсутня'}
            </p>
          </div>

          <button
            onClick={onToggleSiren}
            title={isSirenPlaying ? 'Зупинити звук' : 'Тест сирени'}
            className={`p-2.5 rounded-xl border transition-all ${
              isSirenPlaying
                ? 'bg-red-600 text-white border-red-500 animate-bounce'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
            }`}
          >
            {isSirenPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>

        {myRegionAlarm && myRegion?.threatDetails && (
          <p className="text-[11px] text-red-200/90 mt-2 bg-red-900/40 p-1.5 rounded border border-red-800/60 line-clamp-1">
            {myRegion.threatDetails}
          </p>
        )}
      </div>

      {/* Card 3: Active Threats Composition */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Типи загроз
          </span>
          <span className="text-xs font-mono text-amber-400 font-bold">
            {activeCount} загроз
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <Radio className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs text-slate-300">БпЛА:</span>
            <span className="text-xs font-bold text-slate-100 font-mono ml-auto">{droneCount}</span>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs text-slate-300">Балістика:</span>
            <span className="text-xs font-bold text-slate-100 font-mono ml-auto">{ballisticCount}</span>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <Plane className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-slate-300">Авіація:</span>
            <span className="text-xs font-bold text-slate-100 font-mono ml-auto">{aviationCount}</span>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs text-slate-300">Арт:</span>
            <span className="text-xs font-bold text-slate-100 font-mono ml-auto">{artilleryCount}</span>
          </div>
        </div>
      </div>

      {/* Card 4: Longest Active Alarm */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Найдовша тривога
          </span>
          <Clock className="w-4 h-4 text-slate-400" />
        </div>

        {longestAlarmRegion ? (
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-slate-100 truncate">
                {longestAlarmRegion.name}
              </span>
            </div>
            <p className="text-xs font-mono font-semibold text-red-400 mt-0.5">
              {longestAlarmRegion.durationMinutes > 1000
                ? `${Math.floor(longestAlarmRegion.durationMinutes / 1440)} дн+`
                : `${Math.floor(longestAlarmRegion.durationMinutes / 60)} год ${longestAlarmRegion.durationMinutes % 60} хв`}
            </p>
          </div>
        ) : (
          <div className="text-xs text-slate-400">Активних тривог немає</div>
        )}

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Сили Оборони</span>
          <span className="text-emerald-400 font-medium">ППО напоготові</span>
        </div>
      </div>

    </div>
  );
};
