import React from 'react';
import { Wallet, ArrowUpRight, ShieldCheck, CheckCircle2, Cpu } from 'lucide-react';
import { FinancialCardViewModel } from '../../../types/finance';
import { RankBadge } from '../RankBadge';
import { EmvChip, ContactlessNfcIcon, HologramWatermark } from './EmvChip';
import { playWebAudioSound } from '../../../utils/sirenAudio';

interface BalanceCardProps {
  data: FinancialCardViewModel;
  onOpenPayout?: () => void;
  isActive: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  data,
  onOpenPayout,
  isActive,
}) => {
  const { balance, rank, payout, updatedAt } = data;

  return (
    <div className="relative w-full h-full rounded-3xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden select-none shadow-2xl">
      
      {/* 1. Tactical Titanium Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-950/98 to-slate-900/95 rounded-3xl pointer-events-none" />
      
      {/* Subtle Micro-Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none rounded-3xl"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Cyan / Electric Blue Semantic Accent Glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />
      
      {/* Edge Illumination Rim with metallic bezel */}
      <div className="absolute inset-0 rounded-3xl border border-cyan-400/40 pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_0_24px_rgba(6,182,212,0.2)]" />
      
      {/* Dynamic diagonal glass light reflection */}
      <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none rotate-12" />

      {/* Hologram Protocol Watermark */}
      <HologramWatermark variant="cyan" />

      {/* 2. Top Header Row: EMV Chip + Card Brand + Rank Badge */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <EmvChip variant="gold" />
          <ContactlessNfcIcon className="w-4 h-4 text-cyan-400/80" />
          <div className="border-l border-slate-800 pl-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
              DEV20 FINTECH · CARD 01
            </span>
            <h3 className="text-xs font-mono font-black text-slate-200 tracking-wider uppercase">
              БАЛАНС ОБЛІКУ
            </h3>
          </div>
        </div>

        <RankBadge rank={rank} />
      </div>

      {/* 3. Main Big Figure & Quick Action */}
      <div className="relative z-10 my-1">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">₴</span>
              <span className="text-3xl sm:text-4xl md:text-[42px] font-black tracking-tight text-white font-mono drop-shadow-md">
                {balance.total.toLocaleString('uk-UA')}
              </span>
            </div>
            {/* Tactile Virtual Card ID */}
            <div className="text-[10px] font-mono tracking-widest text-slate-500 mt-0.5 flex items-center gap-2">
              <span>DEV20</span>
              <span>••••</span>
              <span>8492</span>
              <span>4230</span>
              <span className="text-cyan-500/80 text-[9px] px-1 rounded bg-cyan-950/60 border border-cyan-800/40">SMART LEDGER</span>
            </div>
          </div>

          {/* Quick Payout Button (active only if eligible) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playWebAudioSound('click');
              if (payout.eligible && onOpenPayout) {
                onOpenPayout();
              }
            }}
            disabled={!payout.eligible}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg ${
              payout.eligible
                ? 'bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-black shadow-cyan-950/60 active:scale-95 cursor-pointer hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed'
            }`}
          >
            <span>Вивести кошти</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Financial Breakdown Row (Доступно | Очікує | Утримано) */}
      <div className="relative z-10 grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 backdrop-blur-md shadow-inner">
        
        {/* Доступно */}
        <div className="text-left font-mono">
          <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Доступно
          </div>
          <div className="text-xs sm:text-sm font-black text-emerald-400 mt-0.5">
            ₴ {balance.available.toLocaleString('uk-UA')}
          </div>
        </div>

        {/* Очікує */}
        <div className="text-left font-mono border-l border-slate-800 pl-2">
          <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            Очікує
          </div>
          <div className="text-xs sm:text-sm font-black text-amber-400 mt-0.5">
            ₴ {balance.pending.toLocaleString('uk-UA')}
          </div>
        </div>

        {/* Утримано */}
        <div className="text-left font-mono border-l border-slate-800 pl-2">
          <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block" />
            Утримано
          </div>
          <div className="text-xs sm:text-sm font-black text-slate-300 mt-0.5">
            ₴ {balance.held.toLocaleString('uk-UA')}
          </div>
        </div>

      </div>

      {/* 5. Footer: Timestamp & Security Guarantee */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400">Оновлено {updatedAt}</span>
        </div>
        <div className="flex items-center gap-1 text-cyan-400/90">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>L1/L2 Smart Ledger · SHA256</span>
        </div>
      </div>

    </div>
  );
};
