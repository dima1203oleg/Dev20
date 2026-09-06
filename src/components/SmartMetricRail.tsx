import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  Wallet, 
  TrendingUp, 
  Users, 
  Award, 
  MapPin, 
  Radio, 
  Clock, 
  Sparkles,
  ArrowRight,
  Pause,
  Play
} from 'lucide-react';
import { SmartMetric, ThreatSceneModel } from '../types';

interface SmartMetricRailProps {
  threatModel: ThreatSceneModel;
  availableBalance?: number;
  monthlyEarnings?: number;
  totalL1?: number;
  totalL2?: number;
  currentRankName?: string;
  onNavigateToFinance?: () => void;
  onNavigateToNetwork?: () => void;
  onNavigateToShelters?: () => void;
}

export const SmartMetricRail: React.FC<SmartMetricRailProps> = ({
  threatModel,
  availableBalance = 4230,
  monthlyEarnings = 18560,
  totalL1 = 154,
  totalL2 = 382,
  currentRankName = 'GOLD',
  onNavigateToFinance,
  onNavigateToNetwork,
  onNavigateToShelters,
}) => {
  const [metricContext, setMetricContext] = useState<'SAFETY' | 'PARTNER'>('SAFETY');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check reduced motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setReducedMotion(true);
      setIsPaused(true);
    }
  }, []);

  const isAlarm = threatModel.myRegionStatus.isAlarm;
  const etaMinutes = threatModel.myRegionStatus.etaMinutes || 18;
  const regionName = threatModel.myRegionStatus.name || 'Київська обл.';
  const shelterDistance = threatModel.nearestShelter?.distanceMeters || 340;
  const shelterWalkTime = threatModel.nearestShelter?.walkTimeMins || 4;

  // Build Safety Metrics
  const safetyMetrics: SmartMetric[] = [
    {
      id: 'my_region',
      label: 'МІЙ РЕГІОН',
      value: regionName,
      secondary: isAlarm ? `🔴 ТРИВОГА · Ризик: ${threatModel.myRegionStatus.riskLevel} · ETA ~${etaMinutes} хв` : '🟢 Безпечно · Загроз не виявлено',
      trend: isAlarm ? 'Підвищений ризик' : 'Нормальний стан',
      status: isAlarm ? 'CRITICAL' : 'NORMAL',
      tag: 'СЕКТОР 01',
      category: 'SAFETY',
      actionLabel: 'Деталі регіону',
    },
    {
      id: 'active_alarms',
      label: 'АКТИВНІ ТРИВОГИ В УКРАЇНІ',
      value: `${threatModel.activeAlarmsCount} ОБЛАСТЕЙ`,
      secondary: `16% території під загрозою · Оновлено: ${threatModel.timestamp}`,
      trend: 'РЛС синхронізація 24ms',
      status: threatModel.activeAlarmsCount > 0 ? 'WARNING' : 'NORMAL',
      tag: 'LIVE РАДАР',
      category: 'SAFETY',
    },
    {
      id: 'primary_threat',
      label: 'АКТИВНИЙ ВЕКТОР ЗАГРОЗИ',
      value: threatModel.primaryThreat?.name || 'БпЛА Shahed-136 (Група)',
      secondary: `Курс: ${threatModel.primaryThreat?.azimuthDirection || '315° NW'} · Швидкість: ${threatModel.primaryThreat?.speedKmh || 185} км/год`,
      trend: `ETA ~${etaMinutes} хв до рубежу`,
      status: 'WARNING',
      tag: 'ППО КУПОЛ',
      category: 'SAFETY',
    },
    {
      id: 'nearest_shelter',
      label: 'НАЙБЛИЖЧЕ УКРИТТЯ',
      value: threatModel.nearestShelter?.name || 'Станція метро «Золоті Ворота»',
      secondary: `Відстань: ${shelterDistance}м · Пішки ~${shelterWalkTime} хв · ДСНС верифіковано`,
      trend: 'Всі гермодвері відчинено',
      status: 'INFO',
      tag: 'БЕЗПЕКА',
      category: 'SAFETY',
      actionLabel: 'Маршрут',
      onAction: onNavigateToShelters,
    },
  ];

  // Build Partner Metrics
  const partnerMetrics: SmartMetric[] = [
    {
      id: 'available_balance',
      label: 'ДОСТУПНО ДО ВИВОДУ',
      value: `₴ ${availableBalance.toLocaleString('uk-UA')}`,
      secondary: `+₴320 за цей місяць · Еквівалент ~$${(availableBalance / 41.5).toFixed(1)}`,
      trend: 'Вивід від $10 (Mono / Privat / USDT)',
      status: 'INFO',
      tag: 'ГАМАНЕЦЬ',
      category: 'PARTNER',
      actionLabel: 'Вивести кошти',
      onAction: onNavigateToFinance,
    },
    {
      id: 'monthly_earnings',
      label: 'ЗАРОБЛЕНО ЦЬОГО МІСЯЦЯ',
      value: `₴ ${monthlyEarnings.toLocaleString('uk-UA')}`,
      secondary: '536 транзакцій · 100% прозорий Ledger',
      trend: '+24% порівняно з минулим місяцем',
      status: 'NORMAL',
      tag: 'ДОХІД',
      category: 'PARTNER',
      actionLabel: 'Фінанси',
      onAction: onNavigateToFinance,
    },
    {
      id: 'network_size',
      label: 'МОЯ РЕФЕРАЛЬНА МЕРЕЖА',
      value: `${totalL1 + totalL2} УЧАСНИКІВ`,
      secondary: `L1: ${totalL1} прямих · L2: ${totalL2} партнерських (2 рівні)`,
      trend: '68% конверсія у платну підписку',
      status: 'NORMAL',
      tag: 'МЕРЕЖА',
      category: 'PARTNER',
      actionLabel: 'Дерево мережі',
      onAction: onNavigateToNetwork,
    },
    {
      id: 'rank_tier',
      label: 'ПАРТНЕРСЬКИЙ РАНГ',
      value: `${currentRankName} · 20% / 20%`,
      secondary: `${totalL1} / 200 активних L1 для переходу до PLATINUM (25%)`,
      trend: 'Ще 46 L1 до Platinum',
      status: 'INFO',
      tag: 'СТАТУС',
      category: 'PARTNER',
      actionLabel: 'Умови рангу',
      onAction: onNavigateToNetwork,
    },
  ];

  const currentList = metricContext === 'SAFETY' ? safetyMetrics : partnerMetrics;

  // Auto-switch carousel every 6 seconds
  useEffect(() => {
    if (isPaused || reducedMotion) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % currentList.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused, reducedMotion, currentList.length]);

  const activeMetric = currentList[activeIndex] || currentList[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : currentList.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < currentList.length - 1 ? prev + 1 : 0));
  };

  return (
    <section 
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4"
      aria-label="Smart Metric Rail"
      onMouseEnter={() => !reducedMotion && setIsPaused(true)}
      onMouseLeave={() => !reducedMotion && setIsPaused(false)}
      onFocus={() => !reducedMotion && setIsPaused(true)}
      onBlur={() => !reducedMotion && setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800 shadow-xl backdrop-blur-xl p-4 sm:p-5 transition-all">
        
        {/* Ambient Top Glow Accent */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 ${
          activeMetric.status === 'CRITICAL' 
            ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]' 
            : activeMetric.status === 'WARNING'
            ? 'bg-amber-400 shadow-[0_0_12px_#fbbf24]'
            : 'bg-cyan-500 shadow-[0_0_12px_#06b6d4]'
        }`} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          {/* Left Context Switcher Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMetricContext('SAFETY');
                setActiveIndex(0);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all border ${
                metricContext === 'SAFETY'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              🛡️ Безпека
            </button>

            <button
              onClick={() => {
                setMetricContext('PARTNER');
                setActiveIndex(0);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all border ${
                metricContext === 'PARTNER'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              💼 Партнерство & Фінанси
            </button>
          </div>

          {/* Right Controls: Carousel Dots & Arrows */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {currentList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`transition-all rounded-full ${
                    idx === activeIndex
                      ? 'w-6 h-2 bg-cyan-400 shadow-sm'
                      : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Перейти до картки ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                aria-label="Попередня метрика"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                aria-label="Наступна метрика"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Featured Smart Metric Card Body (Smooth animated content) */}
        <div className="mt-3.5 pt-3.5 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                {activeMetric.label}
              </span>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                activeMetric.status === 'CRITICAL'
                  ? 'bg-rose-950 text-rose-400 border-rose-800'
                  : activeMetric.status === 'WARNING'
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : 'bg-cyan-950 text-cyan-300 border-cyan-800'
              }`}>
                {activeMetric.tag}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h3 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {activeMetric.value}
              </h3>
              {activeMetric.trend && (
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {activeMetric.trend}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 font-sans">
              {activeMetric.secondary}
            </p>
          </div>

          {/* Contextual Action Button if defined */}
          {activeMetric.actionLabel && (
            <div className="shrink-0 self-start md:self-center">
              <button
                onClick={activeMetric.onAction}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/50 transition-all active:scale-95"
              >
                <span>{activeMetric.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
