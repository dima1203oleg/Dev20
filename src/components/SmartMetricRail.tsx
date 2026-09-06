import React from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Radio, 
  ChevronRight,
  AlertTriangle
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
}

export const SmartMetricRail: React.FC<SmartMetricRailProps> = ({
  threatModel,
  myRegionName = 'Одеська область',
  isAlarm = false,
  activeEventsCount = 3,
  lastUpdatedTime = 'Сьогодні, 22:14',
  onSelectRegion,
  onOpenStatus,
  onOpenEvents,
}) => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 my-2">
      
      {/* Card 1: Мій регіон */}
      <div 
        onClick={onSelectRegion}
        className="siren-card siren-card-hover rounded-2xl p-4 flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Мій регіон</div>
            <div className="text-sm font-bold text-slate-900 leading-tight mt-0.5">{myRegionName}</div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
      </div>

      {/* Card 2: Стан (Спокійно / Тривога) */}
      <div 
        onClick={onOpenStatus}
        className="siren-card siren-card-hover rounded-2xl p-4 flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform ${
            isAlarm ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {isAlarm ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Стан</div>
            <div className={`text-sm font-bold leading-tight mt-0.5 ${
              isAlarm ? 'text-rose-600' : 'text-emerald-600'
            }`}>
              {isAlarm ? 'Тривога' : 'Спокійно'}
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
      </div>

      {/* Card 3: Оновлено */}
      <div 
        className="siren-card siren-card-hover rounded-2xl p-4 flex items-center justify-between group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Оновлено</div>
            <div className="text-sm font-bold text-slate-900 leading-tight mt-0.5">{lastUpdatedTime}</div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
      </div>

      {/* Card 4: Активні події */}
      <div 
        onClick={onOpenEvents}
        className="siren-card siren-card-hover rounded-2xl p-4 flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Активні події</div>
            <div className="text-sm font-bold text-slate-900 leading-tight mt-0.5">{activeEventsCount}</div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
      </div>

    </div>
  );
};
