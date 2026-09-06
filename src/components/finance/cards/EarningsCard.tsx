import React from 'react';
import { TrendingUp, Award, Lock, Sparkles, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { FinancialCardViewModel } from '../../../types/finance';
import { RankBadge } from '../RankBadge';
import { EmvChip, ContactlessNfcIcon, HologramWatermark } from './EmvChip';

interface EarningsCardProps {
  data: FinancialCardViewModel;
  isActive: boolean;
}

export const EarningsCard: React.FC<EarningsCardProps> = ({ data, isActive }) => {
  const { earnings, rank } = data;
  const isStarter = rank.id === 'STARTER';

  // Calculate sparkline SVG path
  const sparklinePoints = earnings.sparklineData;
  const minVal = Math.min(...sparklinePoints);
  const maxVal = Math.max(...sparklinePoints);
  const range = maxVal - minVal || 1;

  const width = 140;
  const height = 36;
  const points = sparklinePoints.map((val, idx) => {
    const x = (idx / (sparklinePoints.length - 1)) * width;
    const y = height - ((val - minVal) / range) * (height - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;

  // Rank progress calculation
  const qualifiedL1 = rank.qualifiedL1;
  const nextThreshold = rank.nextThreshold || 200;
  const prevThreshold = rank.id === 'GOLD' ? 75 : rank.id === 'SILVER' ? 30 : rank.id === 'BRONZE' ? 10 : 0;
  const progressRatio = Math.min(
    1,
    Math.max(0, (qualifiedL1 - prevThreshold) / (nextThreshold - prevThreshold || 1))
  );

  return (
    <div className="relative w-full h-full rounded-3xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden select-none shadow-2xl">
      
      {/* 1. Tactical Titanium Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-950/98 to-slate-900/95 rounded-3xl pointer-events-none" />
      
      {/* Subtle Micro-Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none rounded-3xl"
        style={{
          backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Amber / Gold Semantic Accent Glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-yellow-600/15 rounded-full blur-3xl pointer-events-none" />
      
      {/* Edge Illumination Rim */}
      <div className="absolute inset-0 rounded-3xl border border-amber-500/40 pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_0_24px_rgba(245,158,11,0.2)]" />
      
      {/* Subtle diagonal glass reflection */}
      <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none rotate-12" />

      {/* Hologram Watermark */}
      <HologramWatermark variant="amber" />

      {/* 2. Top Header: EMV Chip + Brand + Rank Badge */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <EmvChip variant="gold" />
          <ContactlessNfcIcon className="w-4 h-4 text-amber-400/80" />
          <div className="border-l border-slate-800 pl-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
              DEV20 FINTECH · CARD 02
            </span>
            <h3 className="text-xs font-mono font-black text-slate-200 tracking-wider uppercase">
              ДИНАМІКА ДОХОДУ
            </h3>
          </div>
        </div>

        <RankBadge rank={rank} />
      </div>

      {/* 3. Main Figure + Clean Sparkline */}
      <div className="relative z-10 my-1 flex items-end justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">₴</span>
            <span className="text-3xl sm:text-4xl md:text-[42px] font-black tracking-tight text-white font-mono drop-shadow-md">
              {earnings.thisMonth.toLocaleString('uk-UA')}
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
            <span className="text-slate-300">цього місяця</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 font-bold flex items-center bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
              +{earnings.percentageChange}% ↑
            </span>
          </div>
        </div>

        {/* Small Clean Sparkline with Glow Peak */}
        <div className="hidden sm:block">
          <svg width={width} height={height} className="overflow-visible">
            <defs>
              <linearGradient id="amberSparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#amberSparkGrad)" />
            <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <circle 
              cx={width} 
              cy={height - ((earnings.thisMonth - minVal) / range) * (height - 8) - 4} 
              r="4" 
              className="fill-amber-300 stroke-slate-950 stroke-2" 
            />
            <circle 
              cx={width} 
              cy={height - ((earnings.thisMonth - minVal) / range) * (height - 8) - 4} 
              r="7" 
              className="fill-none stroke-amber-400 stroke-1 animate-ping opacity-75" 
            />
          </svg>
        </div>
      </div>

      {/* 4. Rank Progress Line with Milestones */}
      <div className="relative z-10 p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-inner">
        <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-slate-300">
          <span className="font-bold flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{rank.qualifiedL1} / {nextThreshold} L1 активних</span>
          </span>
          <span className="text-amber-300 font-bold bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/40">
            {rank.remainingToNext ? `${rank.remainingToNext} до ${rank.nextRankName}` : 'Максимальний ранг'}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-slate-700/50">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-500"
            style={{ width: `${Math.round(progressRatio * 100)}%` }}
          />
        </div>
      </div>

      {/* 5. L1 / L2 Breakdown + Lifetime Stats */}
      <div className="relative z-10 grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/70 text-[11px] font-mono">
        <div>
          <span className="text-[9px] text-slate-400 uppercase font-semibold block">Всього</span>
          <span className="font-black text-white">₴ {earnings.lifetime.toLocaleString('uk-UA')}</span>
        </div>

        <div>
          <span className="text-[9px] text-slate-400 uppercase font-semibold block">L1 дохід (20%)</span>
          <span className="font-black text-cyan-300">
            ₴ {(earnings.l1 ?? 1940).toLocaleString('uk-UA')}
          </span>
        </div>

        <div>
          <span className="text-[9px] text-slate-400 uppercase font-semibold block">L2 дохід</span>
          {isStarter ? (
            <span className="font-bold text-rose-400 flex items-center gap-1 text-[10px] bg-rose-950/50 px-1 py-0.2 rounded border border-rose-900/40" title="Потрібно 10 L1">
              <Lock className="w-2.5 h-2.5" /> БЛОК · 0%
            </span>
          ) : (
            <span className="font-black text-purple-300">
              ₴ {(earnings.l2 ?? 900).toLocaleString('uk-UA')}
            </span>
          )}
        </div>
      </div>

    </div>
  );
};
