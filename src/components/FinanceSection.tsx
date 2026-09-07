import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  Plus, 
  HelpCircle, 
  Sparkles, 
  DollarSign, 
  FileText, 
  ArrowRight,
  Gift,
  ExternalLink,
  Lock,
  Zap,
  MoreVertical,
  Check,
  Loader2,
  Info
} from 'lucide-react';
import { playWebAudioSound } from '../utils/sirenAudio';
import { 
  financialService, 
  mapSummaryToViewModel,
  DEFAULT_FINANCIAL_SUMMARY 
} from '../services/financialService';
import { 
  PartnerFinancialSummary, 
  LedgerTransaction, 
  PayoutMethodConfig, 
  PayoutTransaction,
  PayoutLifecycleStatus 
} from '../types/finance';
import { calculateRankByL1, getNextTierInfo } from '../services/referralEngine';
import { DataFreshnessIndicator } from './DataFreshnessIndicator';
import { ContextDrawer } from './ContextDrawer';
import { InfoTooltip } from './InfoTooltip';

interface FinanceSectionProps {
  onOpenWithdrawModal?: () => void;
  onOpenHistory?: () => void;
  theme?: 'light' | 'dark';
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({
  onOpenWithdrawModal,
  onOpenHistory,
  theme = 'light',
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('8months');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showFaqDrawer, setShowFaqDrawer] = useState(false);
  const [summary, setSummary] = useState<PartnerFinancialSummary>(DEFAULT_FINANCIAL_SUMMARY);
  const [ledger, setLedger] = useState<LedgerTransaction[]>(() => financialService.getLedgerTransactions());
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethodConfig[]>(() => financialService.getPayoutMethods());
  const [selectedMethodId, setSelectedMethodId] = useState<string>(() => financialService.getPayoutMethods()[0]?.id || 'pm-1');
  const [withdrawAmount, setWithdrawAmount] = useState('4230');
  
  // Withdrawal Lifecycle state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepName, setCurrentStepName] = useState<string>('');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedTransaction, setCompletedTransaction] = useState<PayoutTransaction | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    financialService.getPartnerFinancialSummary().then((res) => {
      if (res.data) {
        setSummary(res.data);
        setWithdrawAmount(String(res.data.availableBalance));
      }
    });
    setLedger(financialService.getLedgerTransactions());
    setPayoutMethods(financialService.getPayoutMethods());
  }, []);

  const selectedMethod = payoutMethods.find(m => m.id === selectedMethodId) || payoutMethods[0];
  const calculatedFee = selectedMethod?.feePercent > 0 
    ? Math.round((Number(withdrawAmount || 0) * selectedMethod.feePercent) / 100)
    : (selectedMethod?.fixedFeeUah || 0);
  const netWithdraw = Math.max(0, Number(withdrawAmount || 0) - calculatedFee);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsProcessing(true);
    setWithdrawError(null);
    playWebAudioSound('click');

    const result = await financialService.executeWithdrawal(amount, selectedMethodId, (stepName, status, stepIdx) => {
      setCurrentStepName(stepName);
      setCurrentStepIndex(stepIdx);
    });

    setIsProcessing(false);

    if (result.success && result.transaction) {
      setCompletedTransaction(result.transaction);
      setSummary(prev => ({
        ...prev,
        availableBalance: prev.availableBalance - amount,
        totalBalance: prev.totalBalance - amount,
        lifetimePaid: prev.lifetimePaid + amount,
      }));
      setLedger(financialService.getLedgerTransactions());
      setWithdrawSuccess(true);
      playWebAudioSound('ping');
    } else {
      setWithdrawError(result.error || 'Не вдалося виконати виведення коштів');
      playWebAudioSound('alert');
    }
  };

  const closeWithdrawModal = () => {
    setShowWithdrawModal(false);
    setCompletedTransaction(null);
    setCurrentStepName('');
    setCurrentStepIndex(0);
    setWithdrawError(null);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* 1. Top Hero Finance Banner with 3D Holographic Wallet & Gold Hryvnia Coins (1:1 with Screenshot 4) */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border-slate-800 text-white' 
          : 'bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-blue-50/80 border-slate-100 text-slate-900 shadow-xs'
      }`}>
        
        {/* Left Headline & Content */}
        <div className="space-y-3.5 max-w-xl z-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
            isDark ? 'bg-slate-900 border border-slate-800 text-slate-300' : 'bg-blue-100/70 border border-blue-200/60 text-blue-700'
          }`}>
            <span>🇺🇦</span>
            <span>Прозорі виплати. Реальні можливості.</span>
          </div>

          <h1 className={`text-3xl sm:text-4xl font-black tracking-tight leading-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Твій дохід <br className="hidden sm:inline" />
            <span className="text-blue-600">робить Україну безпечнішою.</span>
          </h1>

          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Заробляй, розвивай мережу та підтримуй важливу справу. Прозора статистика, автоматичні виплати, повний контроль.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button 
              onClick={() => setShowFaqDrawer(true)}
              className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Як працюють фінанси?</span>
            </button>

            <div className={`hidden sm:flex px-3 py-1.5 rounded-full text-xs font-semibold items-center gap-1.5 border ${
              isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700'
            }`}>
              <span>🖤</span>
              <span>Твій внесок у безпеку</span>
            </div>
          </div>
        </div>

        {/* Right: 3D Holographic Leather Wallet + Gold Coin Stack + Ukraine Shield Graphic (1:1 with Screenshot 4) */}
        <div className="relative w-72 h-52 flex items-center justify-center flex-shrink-0 select-none">
          
          <div className="absolute -top-4 -right-4 hidden lg:block z-20">
            <DataFreshnessIndicator state="synced" theme={theme} />
          </div>

          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* 3D Wallet SVG Illustration with Hryvnia Coin */}
          <svg viewBox="0 0 240 180" className="w-full h-full transform drop-shadow-2xl">
            <defs>
              <linearGradient id="walletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>
              <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>

            {/* Background 3D Gold Coins */}
            <g transform="translate(120, 20)">
              <ellipse cx="25" cy="35" rx="30" ry="24" fill="url(#goldGrad)" />
              <ellipse cx="25" cy="32" rx="27" ry="21" fill="#FACC15" />
              <text x="25" y="38" fontSize="20" fontWeight="900" textAnchor="middle" fill="#854D0E">₴</text>
            </g>

            {/* 3D Leather Wallet Front */}
            <g transform="translate(30, 45)">
              {/* Back flap */}
              <rect x="10" y="5" width="160" height="110" rx="18" fill="#1E40AF" />
              {/* Front flap */}
              <rect x="15" y="20" width="155" height="95" rx="16" fill="url(#walletGrad)" stroke="#60A5FA" strokeWidth="1.5" />
              {/* Card slot lines */}
              <path d="M 25 45 Q 90 60 160 45" stroke="#93C5FD" strokeWidth="1.5" fill="none" opacity="0.6" />
              <path d="M 25 65 Q 90 80 160 65" stroke="#93C5FD" strokeWidth="1.5" fill="none" opacity="0.6" />
              
              {/* Emblem Trident on Wallet */}
              <circle cx="95" cy="55" r="14" fill="#1E3A8A" opacity="0.6" />
              <path d="M91 58 L91 48 M99 58 L99 48 M95 46 L95 62 M88 51 L95 62 L102 51" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Siren UA Text on Wallet */}
              <text x="95" y="85" fontSize="10" fontWeight="900" textAnchor="middle" fill="#FFFFFF" letterSpacing="0.1em">SIREN UA</text>
            </g>

            {/* Ukraine Security Shield on Left */}
            <g transform="translate(10, 80)">
              <path d="M 25 5 Q 5 15 5 40 Q 5 65 25 80 Q 45 65 45 40 Q 45 15 25 5 Z" fill="url(#shieldGrad)" stroke="#DBEAFE" strokeWidth="1.5" />
              {/* Ukraine Map Silhouette */}
              <path d="M15 35 Q25 30 35 34 Q32 45 25 48 Q18 45 15 35 Z" fill="#FEF08A" opacity="0.9" />
            </g>
          </svg>

          {/* Slogan pill under graphic */}
          <div className="absolute bottom-1 right-2 text-right pointer-events-none">
            <span className={`text-xs font-bold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
              Разом сильніші 💙💛
            </span>
          </div>

        </div>

      </div>

      {/* 2. Top 4 Metric Cards (1:1 with Screenshot 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Зароблено всього */}
        <div className={`p-5 rounded-3xl border transition-all ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-emerald-950/80 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +{summary.totalBalance > 0 ? '12%' : '0%'}
            </span>
          </div>
          <div className={`text-xs font-medium mt-3 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Зароблено всього</div>
          <div className="text-2xl sm:text-3xl font-black mt-0.5">₴ {summary.totalBalance.toLocaleString()}</div>
          <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>З моменту реєстрації</div>
        </div>

        {/* Card 2: Баланс */}
        <div className={`p-5 rounded-3xl border transition-all ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-blue-950/80 text-blue-400' : 'bg-blue-50 text-blue-600'
            }`}>
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-xs font-medium mt-3 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Баланс</div>
          <div className="text-2xl sm:text-3xl font-black mt-0.5 text-blue-600">₴ {summary.availableBalance.toLocaleString()}</div>
          <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Доступно до виводу</div>
        </div>

        {/* Card 3: Виведено */}
        <div className={`p-5 rounded-3xl border transition-all ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-purple-950/80 text-purple-400' : 'bg-purple-50 text-purple-600'
            }`}>
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-xs font-medium mt-3 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Виведено</div>
          <div className="text-2xl sm:text-3xl font-black mt-0.5">₴ {summary.lifetimePaid.toLocaleString()}</div>
          <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Успішних виплат: {ledger.filter(l => l.type === 'PAYOUT' && l.status === 'COMPLETED').length}</div>
        </div>

        {/* Card 4: Очікується */}
        <div className={`p-5 rounded-3xl border transition-all ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-amber-950/80 text-amber-400' : 'bg-amber-50 text-amber-600'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-xs font-medium mt-3 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Очікується</div>
          <div className="text-2xl sm:text-3xl font-black mt-0.5">₴ {summary.pendingBalance.toLocaleString()}</div>
          <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>У процесі обробки</div>
        </div>

      </div>

      {/* 3. Middle Grid: Income Bar Chart | Structure Donut Chart | Dynamic Line Chart | Withdrawal & Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left (8 cols): 3 Analytical Charts */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Chart 1: Дохід за період (Vertical Bar Chart for 8 months: Січ, Лют, Бер, Кві, Тра, Чер, Лип, Сер) */}
          <div className={`p-5 rounded-3xl border ${
            isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-xs'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Дохід за період</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black">₴ 12 460</span>
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +28%
                  </span>
                </div>
              </div>

              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <option value="8months">Останні 8 місяців</option>
                <option value="6months">Останні 6 місяців</option>
                <option value="year">Цей рік</option>
              </select>
            </div>

            {/* 8-Month Vertical Bars */}
            <div className="h-36 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
              {[
                { month: 'Січ', val: 15 },
                { month: 'Лют', val: 25 },
                { month: 'Бер', val: 32 },
                { month: 'Кві', val: 45 },
                { month: 'Тра', val: 60 },
                { month: 'Чер', val: 75 },
                { month: 'Лип', val: 85 },
                { month: 'Сер', val: 100 },
              ].map((b, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl transition-all group-hover:brightness-110"
                    style={{ height: `${b.val}%`, opacity: 0.35 + (i * 0.09) }}
                  />
                  <span className="text-[11px] font-medium text-slate-400">{b.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2 Bottom Charts in 2-Columns: Структура доходу (Donut) & Динаміка мережі (Line) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Структура доходу (Donut) */}
            <div className={`p-5 rounded-3xl border ${
              isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-xs'
            }`}>
              <h3 className="text-sm font-bold mb-2">Структура доходу</h3>

              <div className="flex items-center justify-center my-3 relative">
                <svg viewBox="0 0 100 100" className="w-28 h-28 transform -rotate-90">
                  {/* Рівень 1 (10%): ₴8 460 ~ 68% */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#2563EB" strokeWidth="12" strokeDasharray={`${(summary.totalL1Income / Math.max(1, summary.totalBalance)) * 238.7} 238.7`} strokeDashoffset="0" />
                  {/* Рівень 2 (5%): ₴3 250 ~ 26% */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#8B5CF6" strokeWidth="12" strokeDasharray={`${(summary.totalL2Income / Math.max(1, summary.totalBalance)) * 238.7} 238.7`} strokeDashoffset={`-${(summary.totalL1Income / Math.max(1, summary.totalBalance)) * 238.7}`} />
                  {/* Бонуси: ₴750 ~ 6% */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="12" strokeDasharray={`${(summary.totalBonusIncome / Math.max(1, summary.totalBalance)) * 238.7} 238.7`} strokeDashoffset={`-${((summary.totalL1Income + summary.totalL2Income) / Math.max(1, summary.totalBalance)) * 238.7}`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-sm font-black leading-tight">₴ {summary.totalBalance.toLocaleString()}</span>
                  <span className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Всього</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>Рівень 1 (20%)</span>
                  </span>
                  <span className="font-bold">₴ {summary.totalL1Income.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span>Рівень 2 (20%)</span>
                  </span>
                  <span className="font-bold">₴ {summary.totalL2Income.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Бонуси</span>
                  </span>
                  <span className="font-bold">₴ {summary.totalBonusIncome.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Динаміка мережі (Line chart) */}
            <div className={`p-5 rounded-3xl border ${
              isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-xs'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold">Динаміка мережі</h3>
                <span className="text-xs font-bold text-emerald-500">+490%</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>482</span>
                <span className="font-bold text-slate-900 dark:text-white">2 847</span>
              </div>

              {/* Line chart svg */}
              <div className="h-28 flex items-center justify-center my-2">
                <svg viewBox="0 0 200 80" className="w-full h-full">
                  <path
                    d="M 10 70 Q 50 65 90 45 T 190 10"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="10" cy="70" r="4" fill="#2563EB" />
                  <circle cx="90" cy="45" r="4" fill="#2563EB" />
                  <circle cx="190" cy="10" r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Січ</span>
                <span>Сер</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right (4 cols): Rank & Withdraw Action & Payment Methods */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          
          {/* Card 1: Партнерський рівень */}
          <div className={`p-5 rounded-3xl border ${
            isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-xs'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Партнерський рівень</div>
                <div className="text-base font-black text-amber-500 flex items-center gap-1.5 mt-0.5">
                  <Award className="w-4 h-4" />
                  <span>{summary.currentRank}</span>
                </div>
              </div>
              <button className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-1">
              {(() => {
                const currentRankTier = calculateRankByL1(summary.qualifiedL1);
                const nextTierData = getNextTierInfo(currentRankTier, summary.qualifiedL1);
                const nextTierName = nextTierData.nextTier ? nextTierData.nextTier.name : 'Максимальний';
                const targetMinL1 = nextTierData.nextTier ? nextTierData.nextTier.minL1 : summary.qualifiedL1;
                return (
                  <>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                        До наступного рівня ({nextTierName}): <span className="font-bold text-slate-800 dark:text-slate-200">{nextTierData.remainingL1} L1</span>
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${nextTierData.progressPercent}%` }} />
                    </div>
                    <div className="text-right text-[10px] font-mono text-slate-400">{summary.qualifiedL1} / {targetMinL1}</div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Card 2: Вивести кошти (1:1 with Screenshot 4) */}
          <div className={`p-5 rounded-3xl border flex flex-col justify-between ${
            isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-xs'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold">Вивести кошти</h3>
                <button className="w-7 h-7 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Доступно до виводу</div>
              <div className="text-3xl font-black mt-1 text-slate-900 dark:text-white">
                ₴ {summary.availableBalance.toLocaleString()}
              </div>

              <button
                onClick={() => {
                  setShowWithdrawModal(true);
                  playWebAudioSound('click');
                }}
                className="w-full mt-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Вивести кошти</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Perks breakdown */}
            <div className={`space-y-2 pt-4 mt-4 border-t text-xs ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <Zap className="w-3 h-3" />
                </div>
                <div>
                  <div className="font-bold leading-tight">Автоматичні виплати</div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Швидко та безпечно</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                  <Clock className="w-3 h-3" />
                </div>
                <div>
                  <div className="font-bold leading-tight">Підтримка 24/7</div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Допомога у будь-який час</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                  <ShieldCheck className="w-3 h-3" />
                </div>
                <div>
                  <div className="font-bold leading-tight">Повна прозорість</div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Усі транзакції у вашому кабінеті</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Способи виплати */}
          <div className={`p-5 rounded-3xl border ${
            isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold">Способи виплати</h3>
              <button 
                onClick={() => setShowAddCardModal(true)}
                className="text-xs text-blue-500 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Додати</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {payoutMethods.map((method, idx) => (
                <div key={method.id} className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <CreditCard className={`w-4 h-4 ${idx === 0 ? 'text-blue-600' : 'text-purple-600'}`} />
                    <div>
                      <div className="font-bold leading-tight">{method.type === 'CARD_UAH' ? 'Картка' : 'IBAN (UAH)'}</div>
                      <div className="text-[10px] text-slate-400">
                        {method.type === 'CARD_UAH' ? `**** ${method.details.slice(-4)}` : `${method.details.substring(0, 15)}...`}
                      </div>
                    </div>
                  </div>
                  {method.isDefault ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      Основна
                    </span>
                  ) : (
                    <MoreVertical className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
                  )}
                </div>
              ))}

              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-sky-500" />
                  <div>
                    <div className="font-bold leading-tight">PayPal</div>
                    <div className="text-[10px] text-slate-400">example@email.com</div>
                  </div>
                </div>
                <MoreVertical className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Bottom Grid: Останні транзакції (Left) | Цілі та досягнення (Center) | Запроси ще друзів Promo (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Card 1: Останні транзакції (6 cols) */}
        <div className={`lg:col-span-6 p-5 rounded-3xl border flex flex-col justify-between ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-xs'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold">Останні транзакції</h3>
              <button 
                onClick={onOpenHistory}
                className="text-xs text-blue-500 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Всі транзакції</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs h-[240px] overflow-y-auto pr-2 custom-scrollbar">
              {ledger.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/50 last:border-none">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      tx.type === 'COMMISSION_L1' || tx.type === 'COMMISSION_L2'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' 
                        : tx.type === 'BONUS'
                        ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400'
                        : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                    }`}>
                      {tx.type === 'PAYOUT' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : tx.type === 'BONUS' ? <Gift className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="font-semibold">{tx.description}</div>
                      <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{new Date(tx.date).toLocaleDateString('uk-UA')}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-black ${tx.type === 'PAYOUT' ? 'text-slate-800 dark:text-slate-200' : 'text-emerald-500'}`}>
                      {tx.type === 'PAYOUT' ? `-${tx.amountUah}` : `+${tx.amountUah}`} ₴
                    </div>
                    <div className={`text-[10px] font-semibold flex items-center justify-end gap-1 ${
                      tx.status === 'COMPLETED' ? 'text-emerald-500' : 
                      tx.status === 'PENDING' ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        tx.status === 'COMPLETED' ? 'bg-emerald-500' : 
                        tx.status === 'PENDING' ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      <span>{
                        tx.status === 'COMPLETED' ? 'Зараховано' : 
                        tx.status === 'PENDING' ? 'В обробці' : 'Відхилено'
                      }</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Цілі та досягнення (3 cols) */}
        <div className={`lg:col-span-3 p-5 rounded-3xl border flex flex-col justify-between ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-xs'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold">Цілі та досягнення</h3>
              <button className="text-xs text-blue-500 font-semibold flex items-center gap-1 hover:underline cursor-pointer">
                <span>Всі цілі</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Target 1: Платина */}
            <div className="space-y-3 text-xs">
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-amber-50/50 border-amber-100'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏆</span>
                  <div>
                    <div className="font-bold">Платина</div>
                    <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Залишилось 2 153 балів</div>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 mt-2 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '57%' }} />
                </div>
                <div className="text-right text-[10px] font-mono mt-1 text-slate-400">2 847 / 5 000</div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <Award className="w-3.5 h-3.5 text-blue-500" />
                    <span>10 прямих партнерів</span>
                  </span>
                  <span className="font-bold">8 / 10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-purple-500" />
                    <span>Загальний дохід</span>
                  </span>
                  <span className="font-bold">12 460 / 50 000 ₴</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Активність</span>
                  </span>
                  <span className="font-bold">28 / 30 днів</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Запроси ще друзів і отримуй більше! (3 cols, 3D Gift Promo 1:1 with Screenshot 4) */}
        <div className="lg:col-span-3 p-5 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
          
          {/* 3D Gift Box SVG on Bottom Right */}
          <div className="absolute -bottom-2 -right-2 w-28 h-28 opacity-90 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Gift box base */}
              <rect x="20" y="35" width="60" height="50" rx="8" fill="#818CF8" />
              <rect x="15" y="30" width="70" height="15" rx="4" fill="#6366F1" />
              {/* Ribbon */}
              <rect x="44" y="30" width="12" height="55" fill="#FDE047" />
              <rect x="20" y="55" width="60" height="10" fill="#FDE047" />
              {/* Bow */}
              <ellipse cx="40" cy="24" rx="10" ry="6" fill="#FDE047" transform="rotate(-20 40 24)" />
              <ellipse cx="60" cy="24" rx="10" ry="6" fill="#FDE047" transform="rotate(20 60 24)" />
              <circle cx="50" cy="25" r="4" fill="#EAB308" />
            </svg>
          </div>

          <div>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-black leading-tight max-w-[180px]">
              Запроси ще друзів і отримуй більше!
            </h3>
            <p className="text-xs text-blue-100 mt-2 max-w-[180px] leading-relaxed">
              <span className="font-bold text-amber-300">+10%</span> з перших 3 місяців
            </p>
          </div>

          <div className="pt-4 z-10">
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Дізнатись деталі</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Instant Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className={`relative w-full max-w-md rounded-3xl p-6 border shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-900'
          }`}>
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              ✕
            </button>

            <h3 className="text-lg font-black mb-1">Виведення коштів</h3>
            <p className="text-xs text-slate-400 mb-4">Доступно до виводу: ₴ 8 460</p>

            {withdrawSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-base font-black">Заявку успішно створено!</h4>
                <p className="text-xs text-slate-400">Кошти будуть зараховані на вашу картку протягом 15 хвилин.</p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label className="text-xs font-bold block mb-1">Сума виводу (₴)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max="8460"
                    min="1000"
                    className={`w-full px-4 py-2.5 rounded-2xl border text-base font-bold outline-none ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Мінімальна сума: ₴ 1 000</div>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">Оберіть рахунок для виплати</label>
                  <div className={`p-3 rounded-2xl border flex items-center justify-between ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-blue-50/50 border-blue-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold">Картка **** 4242 (Основна)</span>
                    </div>
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  <span>Підтвердити виведення ₴ {withdrawAmount}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className={`relative w-full max-w-md rounded-3xl p-6 border shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-900'
          }`}>
            <button
              onClick={() => setShowAddCardModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              ✕
            </button>
            <h3 className="text-lg font-black mb-1">Додати платіжний метод</h3>
            <p className="text-xs text-slate-400 mb-4">Підтримуються будь-які українські банківські картки (Visa, Mastercard, PROSTIR) та IBAN.</p>
            
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Номер картки (16 цифр)"
                className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                }`} 
              />
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="ММ / РР"
                  className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`} 
                />
                <input 
                  type="text" 
                  placeholder="CVV"
                  className={`w-full px-4 py-2.5 rounded-2xl border text-xs outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`} 
                />
              </div>
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                isDark ? 'bg-blue-950/20 border-blue-900/50 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-700'
              }`}>
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong>Важливо:</strong><br/>
                  Якщо у вас виникли проблеми з додаванням картки, будь ласка, переконайтесь, що вона відкрита для інтернет-платежів.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Drawer */}
      <ContextDrawer
        isOpen={showFaqDrawer}
        onClose={() => setShowFaqDrawer(false)}
        title="Як формується мій дохід?"
        icon={<HelpCircle className="w-5 h-5" />}
        theme={theme}
      >
        <div className="space-y-6 text-sm">
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Твій дохід у SIREN UA формується з двох рівнів партнерської мережі та бонусів за ранги.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold mb-1">1. Комісії Першого Рівня (L1)</h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Ти отримуєш <strong>20%</strong> (або відсоток, відповідний твоєму рангу) від кожної оплати підписки людьми, яких ти особисто запросив. Це твої найпряміші партнери. Чим вище твій ранг, тим більший відсоток комісії ти отримуєш.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-1">2. Комісії Другого Рівня (L2)</h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Ти також отримуєш <strong>20%</strong> комісійних з оплат людей, яких запросили твої партнери з L1. Вони формують твій пасивний дохід, але <strong>НЕ</strong> враховуються для підвищення твого рангу.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-1">3. Бонуси (Bonuses)</h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Одноразові винагороди, які нараховуються за досягнення нових рангів (наприклад, перехід на Platinum) або участь у спеціальних акціях.
              </p>
            </div>
            
            <div className={`p-4 rounded-xl border mt-4 ${
              isDark ? 'bg-amber-950/20 border-amber-900/50' : 'bg-amber-50 border-amber-200'
            }`}>
              <h4 className="font-bold mb-2 flex items-center gap-1.5 text-amber-600">
                <Clock className="w-4 h-4" />
                Статуси балансу
              </h4>
              <ul className={`text-xs space-y-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <li><strong>Очікується (Pending):</strong> Кошти надійшли, але проходять 7-денний період перевірки.</li>
                <li><strong>Доступно (Available):</strong> Кошти перевірені та готові до виводу на вашу картку.</li>
              </ul>
            </div>
          </div>
        </div>
      </ContextDrawer>

    </div>
  );
};
