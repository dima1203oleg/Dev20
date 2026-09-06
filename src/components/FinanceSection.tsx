import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  CreditCard, 
  Building2, 
  Coins, 
  Filter, 
  DollarSign, 
  ShieldCheck, 
  Sparkles,
  X,
  Send
} from 'lucide-react';
import { AffiliatePayoutRequest, PartnerFinancialSummary } from '../types';
import { SAMPLE_PAYOUT_HISTORY, SAMPLE_SIMULATED_TRANSACTIONS } from '../data/affiliateData';
import { playWebAudioSound } from '../utils/sirenAudio';
import { Financial3DCardCarousel } from './finance/Financial3DCardCarousel';
import { GeminiSparkle } from './common/GeminiSparkle';

interface FinanceSectionProps {
  availableBalance?: number;
  pendingBalance?: number;
  lifetimeEarnings?: number;
  onNavigateToHome?: () => void;
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({
  availableBalance = 4230,
  pendingBalance = 1450,
  lifetimeEarnings = 18560,
  onNavigateToHome,
}) => {
  const [payoutList, setPayoutList] = useState<AffiliatePayoutRequest[]>(SAMPLE_PAYOUT_HISTORY);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Payout Form States
  const [amount, setAmount] = useState<string>('2000');
  const [method, setMethod] = useState<'MONOBANK' | 'PRIVATBANK' | 'IBAN' | 'USDT_TRC20'>('MONOBANK');
  const [account, setAccount] = useState<string>('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Minimum payout threshold: $10 equivalent in UAH (~415 UAH)
  const minPayoutUah = 415;
  const numAmount = parseFloat(amount) || 0;
  const isAmountValid = numAmount >= minPayoutUah && numAmount <= availableBalance;

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAmountValid || !account.trim()) return;

    const newReq: AffiliatePayoutRequest = {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      amount: numAmount,
      currency: method === 'USDT_TRC20' ? 'USDT' : 'UAH',
      method,
      targetAccount: account,
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING',
    };

    setPayoutList([newReq, ...payoutList]);
    setSuccessNotice(`Запит на виплату ₴${numAmount.toLocaleString('uk-UA')} успішно надіслано!`);
    setIsModalOpen(false);
    setAccount('');
    playWebAudioSound('click');

    setTimeout(() => {
      setSuccessNotice(null);
    }, 6000);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Success Notification */}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 flex items-center justify-between animate-in fade-in backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-mono font-bold">{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice(null)} className="p-1 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <GeminiSparkle className="w-3 h-3 text-blue-400" />
            ФІНАНСОВИЙ ЦЕНТР
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Баланс та виплати винагороди
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Прозорі нарахування від 2-рівневої партнерської мережі (L1 20% / L2 20%). Мінімальний вивід — еквівалент $10 (₴415).
          </p>
        </div>

        {/* CTA: Request Payout */}
        <button
          onClick={() => {
            setIsModalOpen(true);
            playWebAudioSound('click');
          }}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-black text-sm font-mono flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(99,102,241,0.35)] active:scale-95 transition-all cursor-pointer"
        >
          <Wallet className="w-4 h-4 text-white" />
          <span>Замовити виплату</span>
        </button>
      </div>

      {/* 3D Financial Cards Carousel: БАЛАНС → ЗАРОБЛЕНО → ДОСТУПНО ДО ВИВОДУ */}
      <div className="w-full">
        <Financial3DCardCarousel
          initialSummary={{
            totalBalance: availableBalance + pendingBalance,
            availableBalance: availableBalance,
            pendingBalance: pendingBalance,
            heldBalance: 580,
            earnedThisMonth: 2840,
            earnedLastMonth: 2310,
            lifetimeEarnings: lifetimeEarnings,
            lifetimePaid: 14330,
            minimumPayout: minPayoutUah,
            amountUntilMinimum: availableBalance < minPayoutUah ? minPayoutUah - availableBalance : 0,
            l1Earnings: 1940,
            l2Earnings: 900,
            sparkline: [1350, 1520, 1780, 2100, 1950, 2310, 2840],
            qualifiedL1: 154,
            updatedAt: '22:14',
            status: 'SUCCESS',
          }}
          onOpenPayout={() => {
            setIsModalOpen(true);
            playWebAudioSound('click');
          }}
          isPayoutModalOpen={isModalOpen}
        />
      </div>

      {/* Two Columns: Recent Payouts History + Transparent Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Payouts History */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Історія виплат</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Всього: {payoutList.length}</span>
          </div>

          <div className="space-y-2.5">
            {payoutList.map((payout) => (
              <div 
                key={payout.id}
                className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${
                    payout.status === 'COMPLETED'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}>
                    {payout.method === 'USDT_TRC20' ? <Coins className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-bold text-white">
                      ₴ {payout.amount.toLocaleString('uk-UA')} {payout.currency}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {payout.method} · {payout.targetAccount}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    payout.status === 'COMPLETED'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  }`}>
                    {payout.status === 'COMPLETED' ? 'ВИКОНАНО' : 'В ОБРОБЦІ'}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">{payout.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Transparent Ledger (Журнал нарахувань) */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Журнал винагород (Ledger)</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">Ставка: 20% / 20%</span>
          </div>

          <div className="space-y-2.5">
            {SAMPLE_SIMULATED_TRANSACTIONS.slice(0, 5).map((tx) => (
              <div 
                key={tx.id}
                className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3 text-xs font-mono"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      tx.level === 'L1' ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                    }`}>
                      {tx.level}
                    </span>
                    <span>{tx.user}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {tx.plan} (₴{tx.amount}) · Комісія: 20%
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-emerald-400 text-sm">
                    +₴ {Math.round(tx.amount * 0.2)}
                  </div>
                  <div className="text-[10px] text-slate-500">{tx.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* =========================================================================
          PAYOUT REQUEST MODAL (Повний flow виплати)
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-950/90 border border-white/15 shadow-[0_16px_48px_rgba(0,0,0,0.7)] p-6 sm:p-7 space-y-4 backdrop-blur-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <GeminiSparkle className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-black text-white tracking-tight">Замовити виплату</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              
              {/* Amount Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 flex justify-between">
                  <span>Сума виводу (UAH)</span>
                  <span className="text-slate-400 font-normal">Мін: ₴{minPayoutUah} (~$10)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={minPayoutUah}
                    max={availableBalance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono font-bold focus:border-blue-500 focus:outline-none"
                    placeholder="2000"
                  />
                  <button
                    type="button"
                    onClick={() => setAmount(availableBalance.toString())}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-cyan-300 text-xs font-mono font-bold cursor-pointer"
                  >
                    Все (₴{availableBalance})
                  </button>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">
                  Платіжний метод
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('MONOBANK')}
                    className={`p-2.5 rounded-2xl border text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      method === 'MONOBANK'
                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                        : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-slate-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Monobank (0%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('PRIVATBANK')}
                    className={`p-2.5 rounded-2xl border text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      method === 'PRIVATBANK'
                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                        : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>ПриватБанк (0%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('IBAN')}
                    className={`p-2.5 rounded-2xl border text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      method === 'IBAN'
                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                        : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>IBAN України</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('USDT_TRC20')}
                    className={`p-2.5 rounded-2xl border text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      method === 'USDT_TRC20'
                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                        : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-slate-200'
                    }`}
                  >
                    <Coins className="w-4 h-4" />
                    <span>USDT TRC-20</span>
                  </button>
                </div>
              </div>

              {/* Target Account / Card */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">
                  {method === 'USDT_TRC20' ? 'Адреса USDT (TRC-20)' : 'Номер картки / рахунку IBAN'}
                </label>
                <input
                  type="text"
                  required
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                  placeholder={method === 'USDT_TRC20' ? 'T...' : '4441 •••• •••• 1234'}
                />
              </div>

              {/* Net Summary Box */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Комісія сервісу:</span>
                  <span className="text-emerald-400 font-bold">0% (Без комісії)</span>
                </div>
                <div className="flex justify-between text-slate-300 font-bold pt-1.5 border-t border-white/5">
                  <span>До отримання:</span>
                  <span className="text-white text-sm">
                    {method === 'USDT_TRC20' ? `~${(numAmount / 41.5).toFixed(1)} USDT` : `₴ ${numAmount.toLocaleString('uk-UA')}`}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isAmountValid || !account.trim()}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-40 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(99,102,241,0.35)] transition-all cursor-pointer"
              >
                <GeminiSparkle className="w-4 h-4 text-white" />
                <span>Підтвердити заявку на виплату</span>
              </button>

            </form>

          </div>
        </div>
      )}

    </section>
  );
};
