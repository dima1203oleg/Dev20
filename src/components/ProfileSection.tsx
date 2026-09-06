import React, { useState } from 'react';
import { 
  Award, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Bell, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  BookOpen, 
  Radio, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Shield,
  Play,
  Square
} from 'lucide-react';
import { UserSettings } from '../types';
import { AFFILIATE_RANKS } from '../data/affiliateData';
import { playWebAudioSound } from '../utils/sirenAudio';

interface ProfileSectionProps {
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  isSirenPlaying: boolean;
  onToggleTestSiren: () => void;
  onOpenGuide: () => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  settings,
  onUpdateSettings,
  isSirenPlaying,
  onToggleTestSiren,
  onOpenGuide,
  isDemoMode,
  onToggleDemoMode,
}) => {
  const currentRank = AFFILIATE_RANKS.find((r) => r.id === 'GOLD') || AFFILIATE_RANKS[3];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 p-1 flex items-center justify-center shadow-lg shadow-amber-950/50">
            <span className="text-xl font-black text-slate-950 font-mono">UA</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono">Олександр К.</h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold">
                GOLD АМБАСАДОР
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              ID: #UA-8821 · Приєднався 12 січня 2026 · Регіон: Київська обл.
            </p>
          </div>
        </div>

        {/* DSNS Guide Button */}
        <button
          onClick={() => {
            onOpenGuide();
            playWebAudioSound('click');
          }}
          className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <BookOpen className="w-4 h-4" />
          <span>Інструкція дій при тривозі (ДСНС)</span>
        </button>
      </div>

      {/* Grid: Partner Rank Career + Top-100 Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Career Ladder (Starter -> Platinum) */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                КАР'ЄРНІ СХОДИНКИ
              </span>
              <h3 className="text-base font-black text-white font-mono">
                Ранг та відсотки винагород
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-amber-400 font-bold">Ранг: {currentRank.name}</span>
              <div className="text-[10px] font-mono text-slate-400">20% L1 / 20% L2</div>
            </div>
          </div>

          {/* Progress to next tier */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Прогрес до рангу PLATINUM (25% / 25%):</span>
              <span className="text-cyan-400 font-bold">154 / 200 L1 (77%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 rounded-full" style={{ width: '77%' }} />
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              *Ранг визначається виключно активними платними рефералами 1-го рівня (L1).
            </p>
          </div>

          {/* Tiers List */}
          <div className="space-y-2">
            {AFFILIATE_RANKS.map((tier) => {
              const isCurrent = tier.id === 'GOLD';
              return (
                <div
                  key={tier.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-mono transition-all ${
                    isCurrent
                      ? 'bg-amber-950/30 border-amber-500/60 text-amber-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-amber-400' : 'bg-slate-700'}`} />
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{tier.name}</span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px] font-black">
                            ПОТОЧНИЙ
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {tier.minL1}{tier.maxL1 ? `–${tier.maxL1}` : '+'} активних L1
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-white">
                      L1: {tier.l1Percent}% · L2: {tier.l2Percent}%
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {tier.isL2Unlocked ? 'L2 розблоковано' : 'L2 закрито'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Top-100 Preview + Achievements */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Top-100 Preview Card */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-black text-white font-mono">РЕЙТИНГ ТОП-100</h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">+12 позицій</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">ВАШЕ МІСЦЕ ЦЬОГО МІСЯЦЯ</span>
              <div className="text-3xl font-black text-amber-400 font-mono">#84</div>
              <p className="text-xs text-slate-400 font-mono">
                Серед 1,280 амбасадорів цифрової безпеки України
              </p>
            </div>
          </div>

          {/* Achievements Card */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-black text-white font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Досягнення</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">4 з 6 відкрито</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-0.5">
                <span className="text-lg">🎯</span>
                <div className="font-bold text-white text-[11px]">Перший реферал</div>
                <span className="text-[9px] text-emerald-400 font-bold">Отримано</span>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-0.5">
                <span className="text-lg">🏆</span>
                <div className="font-bold text-white text-[11px]">Сотня L1</div>
                <span className="text-[9px] text-emerald-400 font-bold">Отримано</span>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-0.5">
                <span className="text-lg">🛡️</span>
                <div className="font-bold text-white text-[11px]">Вартовий Києва</div>
                <span className="text-[9px] text-emerald-400 font-bold">Отримано</span>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-0.5 opacity-60">
                <span className="text-lg">👑</span>
                <div className="font-bold text-white text-[11px]">Platinum Pro</div>
                <span className="text-[9px] text-slate-400">В процесі</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Settings & Sound Testing Row */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-black text-white font-mono flex items-center gap-2 pb-2 border-b border-slate-800">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Налаштування звуку та режимів</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Siren Volume & Audio Check */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="font-bold">Гучність сирени</span>
              <span className="text-cyan-400 font-bold">{Math.round(settings.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(e) => onUpdateSettings({ volume: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400"
            />
            <button
              onClick={onToggleTestSiren}
              className={`w-full py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                isSirenPlaying
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-950 animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700'
              }`}
            >
              {isSirenPlaying ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSirenPlaying ? 'Зупинити тест сирени' : 'Перевірити звук сирени'}</span>
            </button>
          </div>

          {/* Voice Chime Toggle */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-white">Голосовий супровід</div>
              <p className="text-[10px] text-slate-400 font-mono mt-1">
                Озвучення типу загрози диктором («Увага, загроза балістики»)
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ voiceChime: !settings.voiceChime })}
              className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all ${
                settings.voiceChime
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {settings.voiceChime ? 'Увімкнено (Диктор активний)' : 'Вимкнено'}
            </button>
          </div>

          {/* Demo Mode Toggle */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-white">Джерело даних</div>
              <p className="text-[10px] text-slate-400 font-mono mt-1">
                Перемикання між реальними даними чергування та симуляційним сценарієм
              </p>
            </div>
            <button
              onClick={onToggleDemoMode}
              className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all ${
                isDemoMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
              }`}
            >
              {isDemoMode ? 'Демо-режим (Симуляція)' : 'Реальні дані (LIVE)'}
            </button>
          </div>

        </div>
      </div>

    </section>
  );
};
