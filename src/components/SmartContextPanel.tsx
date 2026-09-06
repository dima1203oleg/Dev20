import React from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Radio, 
  TrendingUp, 
  Award, 
  Zap, 
  CheckCircle2, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { ThreatSceneModel } from '../types';

interface SmartContextPanelProps {
  threatModel: ThreatSceneModel;
  onNavigateToShelters?: () => void;
  onNavigateToFinance?: () => void;
  onNavigateToNetwork?: () => void;
}

export const SmartContextPanel: React.FC<SmartContextPanelProps> = ({
  threatModel,
  onNavigateToShelters,
  onNavigateToFinance,
  onNavigateToNetwork,
}) => {
  const isAlarm = threatModel.myRegionStatus.isAlarm;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Card 1: Оперативний статус */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md backdrop-blur-md flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            isAlarm ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
          }`}>
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
              ОПЕРАТИВНИЙ СТАН КАНАЛІВ
            </div>
            <div className="text-xs font-mono font-bold text-white truncate">
              {isAlarm ? '🔴 Активна тривога в секторі' : '🟢 Усі сенсори в нормі'}
            </div>
            <div className="text-[10px] text-slate-400">
              Синхронізація: ДСНС + ПС ЗСУ + РЛС
            </div>
          </div>
        </div>

        {/* Card 2: Найближче укриття */}
        <div 
          onClick={onNavigateToShelters}
          className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 shadow-md backdrop-blur-md flex items-center gap-3 cursor-pointer transition-all group"
        >
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 group-hover:scale-105 transition-transform">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold">
              <span className="text-slate-400 uppercase">НАЙБЛИЖЧЕ УКРИТТЯ</span>
              <span className="text-cyan-400">Маршрут →</span>
            </div>
            <div className="text-xs font-mono font-bold text-white truncate">
              {threatModel.nearestShelter?.name || 'Станція метро «Золоті Ворота»'}
            </div>
            <div className="text-[10px] text-slate-400">
              340 м · ~4 хв пішки · Генератор / Wi-Fi
            </div>
          </div>
        </div>

        {/* Card 3: Партнерський баланс & статус */}
        <div 
          onClick={onNavigateToFinance}
          className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/40 shadow-md backdrop-blur-md flex items-center gap-3 cursor-pointer transition-all group"
        >
          <div className="p-2.5 rounded-xl bg-purple-950 text-purple-400 border border-purple-800 group-hover:scale-105 transition-transform">
            <Award className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold">
              <span className="text-slate-400 uppercase">ПАРТНЕРСЬКИЙ БАЛАНС</span>
              <span className="text-purple-400">Вивід →</span>
            </div>
            <div className="text-xs font-mono font-bold text-white truncate">
              ₴ 4,230 доступно · Ранг GOLD (20%)
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">
              +₴18,560 зароблено цього місяця
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
