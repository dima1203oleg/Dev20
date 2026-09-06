import React from 'react';
import { Wallet, TrendingUp, Coins } from 'lucide-react';
import { playWebAudioSound } from '../../utils/sirenAudio';

interface CardPaginationProps {
  total: number;
  activeIndex: number;
  onChange: (index: number) => void;
  balanceTotal?: number;
  monthlyEarnings?: number;
  availablePayout?: number;
}

export const CardPagination: React.FC<CardPaginationProps> = ({
  total,
  activeIndex,
  onChange,
  balanceTotal = 8460,
  monthlyEarnings = 2840,
  availablePayout = 4230,
}) => {
  const tabs = [
    {
      label: 'БАЛАНС',
      value: `₴ ${balanceTotal.toLocaleString('uk-UA')}`,
      icon: Wallet,
      color: 'cyan',
      activeClass: 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
      dotColor: 'bg-cyan-400',
    },
    {
      label: 'ЗАРОБЛЕНО',
      value: `₴ ${monthlyEarnings.toLocaleString('uk-UA')}`,
      icon: TrendingUp,
      color: 'amber',
      activeClass: 'bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
      dotColor: 'bg-amber-400',
    },
    {
      label: 'ДО ВИВОДУ',
      value: `₴ ${availablePayout.toLocaleString('uk-UA')}`,
      icon: Coins,
      color: 'emerald',
      activeClass: 'bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
      dotColor: 'bg-emerald-400',
    },
  ];

  return (
    <div className="flex flex-col items-center gap-2.5 pt-2 select-none">
      
      {/* Tactical Quick-Selector Dock */}
      <div 
        className="flex items-center gap-1 sm:gap-2 p-1 rounded-2xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-md shadow-xl max-w-full overflow-x-auto"
        role="tablist"
      >
        {tabs.map((tab, idx) => {
          const isActive = activeIndex === idx;
          const Icon = tab.icon;

          return (
            <button
              key={`tab-${idx}`}
              onClick={() => {
                onChange(idx);
                playWebAudioSound('click');
              }}
              role="tab"
              aria-selected={isActive}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-300 border flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isActive
                  ? tab.activeClass
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? '' : 'opacity-70'}`} />
              <span className="text-[10px] sm:text-xs">{tab.label}</span>
              <span className={`text-[10px] sm:text-xs font-black ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {tab.value}
              </span>
            </button>
          );
        })}
      </div>

      {/* Micro Navigation Dots */}
      <div className="flex items-center justify-center gap-1.5">
        {tabs.map((tab, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={`dot-${idx}`}
              onClick={() => {
                onChange(idx);
                playWebAudioSound('click');
              }}
              aria-label={`Картка ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                isActive
                  ? `w-6 h-1.5 ${tab.dotColor} shadow-md`
                  : 'w-1.5 h-1.5 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          );
        })}
      </div>

    </div>
  );
};
