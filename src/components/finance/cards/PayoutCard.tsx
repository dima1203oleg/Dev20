import React from 'react';
import { ArrowUpRight, ShieldCheck, CheckCircle2, AlertCircle, Coins, Zap } from 'lucide-react';
import { FinancialCardViewModel } from '../../../types/finance';
import { RankBadge } from '../RankBadge';
import { EmvChip, ContactlessNfcIcon, HologramWatermark } from './EmvChip';
import { playWebAudioSound } from '../../../utils/sirenAudio';

interface PayoutCardProps {
  data: FinancialCardViewModel;
  onOpenPayout?: () => void;
  isActive: boolean;
}

export const PayoutCard: React.FC<PayoutCardProps> = ({
  data,
  onOpenPayout,
  isActive,
}) => {
  const { payout, rank, balance } = data;
  const isEligible = payout.eligible;

  return (
    <div className="relative w-full h-full rounded-3xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden select-none shadow-2xl">
      
      {/* 1. Tactical Titanium Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-950/98 to-slate-900/95 rounded-3xl pointer-events-none" />
      
      {/* Subtle Micro-Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none rounded-3xl"
        style={{
          backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Emerald Semantic Accent Glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />
      
      {/* Edge Illumination Rim */}
      <div className="absolute inset-0 rounded-3xl border border-emerald-500/40 pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_0_24px_rgba(16,185,129,0.2)]" />
      
      {/* Subtle diagonal glass reflection */}
      <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none rotate-12" />

      {/* Hologram Watermark */}
      <HologramWatermark variant="emerald" />

      {/* 2. Top Header: EMV Chip + Brand + Rank Badge */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <EmvChip variant="emerald" />
          <ContactlessNfcIcon className="w-4 h-4 text-emerald-400/80" />
          <div className="border-l border-slate-800 pl-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
              DEV20 FINTECH · CARD 03
            </span>
            <h3 className="text-xs font-mono font-black text-slate-200 tracking-wider uppercase">
              ШЛЮЗ ВИПЛАТ
            </h3>
          </div>
        </div>

        <RankBadge rank={rank} />
      </div>

      {/* 3. Main Figure & CTA Button */}
      <div className="relative z-10 my-1">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">₴</span>
              <span className="text-3xl sm:text-4xl md:text-[42px] font-black tracking-tight text-white font-mono drop-shadow-md">
                {payout.available.toLocaleString('uk-UA')}
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center gap-2">
              <span>≈ ${(payout.available / 41.5).toFixed(2)} USD</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" />
                МИТТЄВО 0% КОМІСІЯ
              </span>
            </div>
          </div>

          {/* Primary CTA Button */}
          {isEligible ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                playWebAudioSound('click');
                if (onOpenPayout) onOpenPayout();
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm font-mono flex items-center gap-2 shadow-lg shadow-emerald-950/80 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>ВИВЕСТИ КОШТИ</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex flex-col items-end">
              <button
                disabled
                className="px-4 py-2 rounded-xl bg-slate-800/80 text-slate-500 font-bold text-xs font-mono border border-slate-700/50 cursor-not-allowed flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>ВИВЕСТИ</span>
              </button>
              <span className="text-[10px] font-mono text-amber-400/90 mt-1">
                Бракує ₴ {payout.remainingUntilMinimum?.toLocaleString('uk-UA')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Details Grid: Minimum | Pending | Lifetime Paid */}
      <div className="relative z-10 grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 backdrop-blur-md shadow-inner">
        
        {/* Min Payout */}
        <div className="text-left font-mono">
          <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Мін. поріг</div>
          <div className="text-xs sm:text-sm font-black text-slate-200 mt-0.5">
            ₴ {payout.minimum.toLocaleString('uk-UA')}
          </div>
          <div className="text-[9px] text-slate-500">екв. $10</div>
        </div>

        {/* Pending */}
        <div className="text-left font-mono border-l border-slate-800 pl-2">
          <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">В обробці</div>
          <div className="text-xs sm:text-sm font-black text-amber-400 mt-0.5">
            ₴ {balance.pending.toLocaleString('uk-UA')}
          </div>
          <div className="text-[9px] text-slate-500">холд 72 год</div>
        </div>

        {/* Lifetime Paid */}
        <div className="text-left font-mono border-l border-slate-800 pl-2">
          <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Виплачено</div>
          <div className="text-xs sm:text-sm font-black text-emerald-300 mt-0.5">
            ₴ {payout.lifetimePaid.toLocaleString('uk-UA')}
          </div>
          <div className="text-[9px] text-emerald-500/80">100% зараховано</div>
        </div>

      </div>

      {/* 5. Footer: Payout methods badge */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
        <div className="flex items-center gap-2 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700/60 text-slate-300 font-bold">Mono</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700/60 text-slate-300 font-bold">Приват</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700/60 text-slate-300 font-bold">IBAN</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950/70 border border-emerald-800/50 text-emerald-300 font-bold">USDT</span>
          </div>
        </div>
        <span className="text-emerald-400/90 font-mono font-bold">24/7 LIVE</span>
      </div>

    </div>
  );
};
