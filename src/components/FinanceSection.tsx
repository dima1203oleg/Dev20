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
import { AffiliatePayoutRequest } from '../types';
import { SAMPLE_PAYOUT_HISTORY, SAMPLE_SIMULATED_TRANSACTIONS } from '../data/affiliateData';
import { playWebAudioSound } from '../utils/sirenAudio';

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
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-mono font-bold">{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            ФІНАНСОВИЙ ЦЕНТР
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight mt-1">
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
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm font-mono flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 active:scale-95 transition-all"
        >
          <Wallet className="w-4 h-4 text-slate-950" />
          <span>Замовити виплату</span>
        </button>
      </div>

      {/* 3 Main Hero Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Доступно до виводу */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/40 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>ДОСТУПНИЙ БАЛАНС</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
              ГОТОВО ДО ВИВОДУ
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
              ₴ {availableBalance.toLocaleString('uk-UA')}
            </div>
            <div className="text-xs font-mono text-slate-400 mt-1">
              ≈ ${(availableBalance / 41.5).toFixed(2)} USD · Комісія: 0%
            </div>
          </div>
        </div>

        {/* Card 2: В очікуванні (Pending) */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>В ОБРОБЦІ (PENDING)</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
              ХОЛД 72 ГОД.
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight">
              ₴ {pendingBalance.toLocaleString('uk-UA')}
            </div>
            <div className="text-xs font-mono text-slate-400 mt-1">
              Підтверджується платіжним шлюзом
            </div>
          </div>
        </div>

        {/* Card 3: Зароблено всього (Lifetime) */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>ЗАРОБЛЕНО ВСЬОГО</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
              LIFETIME
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
              ₴ {lifetimeEarnings.toLocaleString('uk-UA')}
            </div>
            <div className="text-xs font-mono text-emerald-400 mt-1">
              +24% порівняно з минулим періодом
            </div>
          </div>
        </div>

      </div>

      {/* Two Columns: Recent Payouts History + Transparent Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Payouts History */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-black text-white font-mono flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Історія виплат</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Всього: {payoutList.length}</span>
          </div>

          <div className="space-y-2.5">
            {payoutList.map((payout) => (
              <div 
                key={payout.id}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    payout.status === 'COMPLETED'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
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
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    payout.status === 'COMPLETED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
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
        <div className="lg:col-span-6 p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-black text-white font-mono flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Журнал винагород (Ledger)</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400">Ставка: 20% / 20%</span>
          </div>

          <div className="space-y-2.5">
            {SAMPLE_SIMULATED_TRANSACTIONS.slice(0, 5).map((tx) => (
              <div 
                key={tx.id}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      tx.level === 'L1' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-purple-950 text-purple-300 border border-purple-800'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border-2 border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black text-white font-mono">Замовити виплату</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              
              {/* Amount Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 flex justify-between">
                  <span>Сума виводу (UAH)</span>
                  <span className="text-slate-400">Мін: ₴{minPayoutUah} (~$10)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={minPayoutUah}
                    max={availableBalance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
                    placeholder="2000"
                  />
                  <button
                    type="button"
                    onClick={() => setAmount(availableBalance.toString())}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-mono font-bold"
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
                    className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                      method === 'MONOBANK'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Monobank (0%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('PRIVATBANK')}
                    className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                      method === 'PRIVATBANK'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>ПриватБанк (0%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('IBAN')}
                    className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                      method === 'IBAN'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>IBAN України</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('USDT_TRC20')}
                    className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                      method === 'USDT_TRC20'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
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
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                  placeholder={method === 'USDT_TRC20' ? 'T...' : '4441 •••• •••• 1234'}
                />
              </div>

              {/* Net Summary Box */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Комісія сервісу:</span>
                  <span className="text-emerald-400 font-bold">0% (Без комісії)</span>
                </div>
                <div className="flex justify-between text-slate-300 font-bold pt-1 border-t border-slate-800">
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
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-black text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Підтвердити заявку на виплату</span>
              </button>

            </form>

          </div>
        </div>
      )}

    </section>
  );
};
