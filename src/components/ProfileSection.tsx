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
import { GeminiSparkle } from './common/GeminiSparkle';

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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300 pb-20">
      
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(99,102,241,0.35)] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
              <span className="text-base font-black text-white font-mono">UA</span>
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow-sm">
              <Award className="w-3 h-3" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">Олександр К.</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold shadow-[0_0_12px_rgba(168,85,247,0.25)]">
                GOLD АМБАСАДОР
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              ID: #UA-8821 · Амбасадор безпеки з січня 2026 · Регіон: Київська обл.
            </p>
          </div>
        </div>

        {/* DSNS Guide Button */}
        <button
          onClick={() => {
            onOpenGuide();
            playWebAudioSound('click');
          }}
          className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-white border border-cyan-500/30 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)] cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>Інструкція дій при тривозі (ДСНС)</span>
        </button>
      </div>

      {/* Grid: Partner Rank Career + Top-100 Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Career Ladder (Starter -> Platinum) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <GeminiSparkle className="w-2.5 h-2.5 text-blue-400" />
                КАР'ЄРНІ СХОДИНКИ
              </span>
              <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                Ранг та відсотки винагород
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-purple-300 font-bold">Ранг: {currentRank.name}</span>
              <div className="text-[10px] font-mono text-slate-400">20% L1 / 20% L2</div>
            </div>
          </div>

          {/* Progress to next tier */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Прогрес до рангу PLATINUM (25% / 25%):</span>
              <span className="text-cyan-300 font-bold">154 / 200 L1 (77%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-full" style={{ width: '77%' }} />
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              *Ранг визначається виключно активними платними партнерами 1-го рівня (L1).
            </p>
          </div>

          {/* Tiers List */}
          <div className="space-y-2">
            {AFFILIATE_RANKS.map((tier) => {
              const isCurrent = tier.id === 'GOLD';
              return (
                <div
                  key={tier.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-mono transition-all ${
                    isCurrent
                      ? 'bg-purple-500/15 border-purple-500/40 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-slate-700'}`} />
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{tier.name}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40 text-[9px] font-bold">
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
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 space-y-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-bold text-white">РЕЙТИНГ ТОП-100</h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">+12 позицій</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">ВАШЕ МІСЦЕ ЦЬОГО МІСЯЦЯ</span>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 font-mono">
                #84
              </div>
              <p className="text-xs text-slate-400">
                Серед 1,280 амбасадорів цифрової безпеки України
              </p>
            </div>
          </div>

          {/* Achievements Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 space-y-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <GeminiSparkle className="w-4 h-4 text-blue-400" />
                <span>Досягнення</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">4 з 6 відкрито</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-0.5">
                <span className="text-lg">🎯</span>
                <div className="font-bold text-white text-[11px]">Перший реферал</div>
                <span className="text-[9px] text-emerald-400 font-bold">Отримано</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-0.5">
                <span className="text-lg">🏆</span>
                <div className="font-bold text-white text-[11px]">Сотня L1</div>
                <span className="text-[9px] text-emerald-400 font-bold">Отримано</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-0.5">
                <span className="text-lg">🛡️</span>
                <div className="font-bold text-white text-[11px]">Вартовий Києва</div>
                <span className="text-[9px] text-emerald-400 font-bold">Отримано</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-0.5 opacity-60">
                <span className="text-lg">👑</span>
                <div className="font-bold text-white text-[11px]">Platinum Pro</div>
                <span className="text-[9px] text-slate-400">В процесі</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Settings & Sound Testing Row */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Налаштування звуку та режимів</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Siren Volume & Audio Check */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="font-bold">Гучність сирени</span>
              <span className="text-cyan-300 font-bold">{Math.round(settings.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(e) => onUpdateSettings({ volume: parseFloat(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <button
              onClick={onToggleTestSiren}
              className={`w-full py-2.5 rounded-full text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isSirenPlaying
                  ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse'
                  : 'bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-white border border-cyan-500/30'
              }`}
            >
              {isSirenPlaying ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSirenPlaying ? 'Зупинити тест сирени' : 'Перевірити звук сирени'}</span>
            </button>
          </div>

          {/* Voice Chime Toggle */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-white">Голосовий супровід</div>
              <p className="text-[10px] text-slate-400 mt-1">
                Озвучення типу загрози диктором («Увага, загроза балістики»)
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ voiceChime: !settings.voiceChime })}
              className={`py-2 px-3 rounded-full text-xs font-mono font-bold border transition-all cursor-pointer ${
                settings.voiceChime
                  ? 'bg-blue-600/25 text-blue-300 border-blue-400/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              {settings.voiceChime ? 'Увімкнено (Диктор)' : 'Вимкнено'}
            </button>
          </div>

          {/* Demo Mode Toggle */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-white">Джерело даних</div>
              <p className="text-[10px] text-slate-400 mt-1">
                Перемикання між реальними даними чергування та симуляційним сценарієм
              </p>
            </div>
            <button
              onClick={onToggleDemoMode}
              className={`py-2 px-3 rounded-full text-xs font-mono font-bold border transition-all cursor-pointer ${
                isDemoMode
                  ? 'bg-purple-600/25 text-purple-300 border-purple-400/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                  : 'bg-emerald-600/25 text-emerald-300 border-emerald-400/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
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
