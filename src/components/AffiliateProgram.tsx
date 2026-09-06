import React, { useState, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  Sparkles, 
  Lock, 
  Unlock, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  Share2, 
  Award, 
  Layers, 
  HelpCircle, 
  Zap, 
  Coins, 
  ChevronRight, 
  ChevronDown,
  Info,
  Sliders,
  Check,
  Percent,
  Network,
  QrCode,
  Download,
  Send,
  CreditCard,
  Building2,
  Wallet,
  ArrowUpRight,
  Filter,
  Search,
  ExternalLink,
  Code2
} from 'lucide-react';
import { 
  AFFILIATE_RANKS, 
  getRankByL1Count, 
  getNextRank, 
  calculateAffiliateEarnings, 
  SAMPLE_SIMULATED_TRANSACTIONS, 
  SAMPLE_PARTNER_TREE,
  SAMPLE_PAYOUT_HISTORY,
  AFFILIATE_PROMO_TEMPLATES,
  FAQ_AFFILIATE 
} from '../data/affiliateData';
import { 
  AffiliateRankId, 
  AffiliatePartnerNode, 
  AffiliatePayoutRequest,
  AffiliatePromoTemplate 
} from '../types';

interface AffiliateProgramProps {
  onOpenMap?: () => void;
  onOpenSimulator?: () => void;
}

type AffiliateTab = 'CALCULATOR' | 'NETWORK' | 'PROMO' | 'PAYOUTS' | 'MATRIX';

export const AffiliateProgram: React.FC<AffiliateProgramProps> = ({
  onOpenMap,
  onOpenSimulator
}) => {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<AffiliateTab>('CALCULATOR');

  // Calculator inputs
  const [l1Count, setL1Count] = useState<number>(15); // Default to Bronze tier to demonstrate L1 and L2
  const [avgL2PerL1, setAvgL2PerL1] = useState<number>(3); // 3 referrals on average per L1
  const [subscriptionPrice, setSubscriptionPrice] = useState<number>(200); // 200 UAH (~$5)
  const [currency, setCurrency] = useState<'UAH' | 'USD'>('UAH');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedPromoId, setCopiedPromoId] = useState<string | null>(null);
  
  // Custom Transaction Simulator
  const [simTxAmount, setSimTxAmount] = useState<number>(200);

  // Network Search & Filters
  const [networkSearch, setNetworkSearch] = useState<string>('');
  const [networkLevelFilter, setNetworkLevelFilter] = useState<'ALL' | 'L1' | 'L2'>('ALL');
  const [expandedL1Ids, setExpandedL1Ids] = useState<Record<string, boolean>>({
    'USR-L1-01': true,
    'USR-L1-02': true
  });

  // Promo Link Builder
  const [customRefSlug, setCustomRefSlug] = useState<string>('partner_pro');
  const [utmSource, setUtmSource] = useState<string>('telegram');

  // Payout Request Form State
  const [payoutAmount, setPayoutAmount] = useState<string>('2000');
  const [payoutMethod, setPayoutMethod] = useState<'MONOBANK' | 'PRIVATBANK' | 'IBAN' | 'USDT_TRC20'>('MONOBANK');
  const [payoutAccount, setPayoutAccount] = useState<string>('');
  const [payoutSuccessMessage, setPayoutSuccessMessage] = useState<string | null>(null);

  // Derived calculations
  const calc = useMemo(() => {
    return calculateAffiliateEarnings(l1Count, avgL2PerL1, subscriptionPrice);
  }, [l1Count, avgL2PerL1, subscriptionPrice]);

  const currencySymbol = currency === 'UAH' ? '₴' : '$';

  const fullCustomRefUrl = useMemo(() => {
    const base = `https://sirenua.com/ref/${customRefSlug.trim() || 'partner'}`;
    return utmSource ? `${base}?utm_source=${utmSource}` : base;
  }, [customRefSlug, utmSource]);

  const handleCopyLink = (textToCopy: string, isPromoId?: string) => {
    navigator.clipboard.writeText(textToCopy);
    if (isPromoId) {
      setCopiedPromoId(isPromoId);
      setTimeout(() => setCopiedPromoId(null), 2500);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const toggleL1Expand = (id: string) => {
    setExpandedL1Ids(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRequestPayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payoutAmount);
    if (isNaN(amountNum) || amountNum < 500) {
      alert('Мінімальна сума виведення коштів становить 500 ₴');
      return;
    }
    if (!payoutAccount.trim()) {
      alert('Будь ласка, вкажіть реквізити або номер картки/гаманця');
      return;
    }

    setPayoutSuccessMessage(`Заявку на виплату ${amountNum} ₴ через ${payoutMethod} успішно створено! Обробка займає до 24 годин.`);
    setTimeout(() => setPayoutSuccessMessage(null), 6000);
  };

  // Filtered partners
  const filteredPartners = useMemo(() => {
    return SAMPLE_PARTNER_TREE.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(networkSearch.toLowerCase()) || 
                            p.id.toLowerCase().includes(networkSearch.toLowerCase());
      const matchesLevel = networkLevelFilter === 'ALL' || p.level === networkLevelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [networkSearch, networkLevelFilter]);

  // Grouped L1 and L2 for tree view
  const l1Partners = useMemo(() => {
    return SAMPLE_PARTNER_TREE.filter(p => p.level === 'L1');
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ПАРТНЕРСЬКА ПРОГРАМА SIRENUA PRO · ДВОРІВНЕВА СИСТЕМА</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Оновлена дворівнева модель винагород <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-cyan-300">L1 & L2</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Прозора, математично збалансована партнерська програма. Отримуйте винагороду з особистих платних передплат (L1), 
            а від 10 активних L1 переходьте у <strong className="text-amber-400 font-bold">Bronze</strong> та відкривайте другий рівень (L2) 
            для зростання вашого пасивного доходу.
          </p>

          {/* Key Business Rules Pill Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 mt-0.5 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-200 text-xs">Ранг = тільки L1</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Ранг визначається виключно кількістю власних активних платних L1. L2 не підвищує ранг.
                </div>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 mt-0.5 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-200 text-xs">Розблокування L2</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Starter має 0% з L2. Починаючи з Bronze (10+ L1) автоматично відкривається 10% L2.
                </div>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-200 text-xs">50% Max Cap</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Максимальна сумарна виплата з 1 транзакції: 25% L1 + 25% L2 на рівні Platinum.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'CALCULATOR' as AffiliateTab, label: 'Калькулятор та Ранги', icon: Sliders },
          { id: 'NETWORK' as AffiliateTab, label: 'Дерево Мережі (L1/L2)', icon: Network },
          { id: 'PROMO' as AffiliateTab, label: 'Промо-Матеріали та QR', icon: QrCode },
          { id: 'PAYOUTS' as AffiliateTab, label: 'Кабінет Виплат', icon: Wallet },
          { id: 'MATRIX' as AffiliateTab, label: 'Порівняльна Таблиця', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-950/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CALCULATOR & TIERS */}
      {activeTab === 'CALCULATOR' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Interactive Tier Matrix Table / Cards */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>Таблиця рангів та умов винагород</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Натисніть на картку будь-якого рангу для швидкого перегляду умов або тесту в калькуляторі
                </p>
              </div>

              <div className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/60">
                Поточний розрахунковий ранг: <strong className="text-cyan-200 uppercase">{calc.currentRank.name}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {AFFILIATE_RANKS.map((tier) => {
                const isCurrentActive = calc.currentRank.id === tier.id;
                const isStarter = tier.id === 'STARTER';

                return (
                  <div
                    key={tier.id}
                    onClick={() => {
                      setL1Count(tier.minL1);
                    }}
                    className={`relative rounded-2xl p-4 transition-all cursor-pointer border flex flex-col justify-between ${
                      isCurrentActive
                        ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-500/30 shadow-xl shadow-amber-950/50'
                        : 'bg-slate-950/80 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    {/* Active Badge */}
                    {isCurrentActive && (
                      <div className="absolute -top-2.5 right-3 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-md">
                        ВАШ РАНГ
                      </div>
                    )}

                    <div>
                      {/* Rank Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-sm text-slate-100">{tier.name}</span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${tier.badgeColor}`}>
                          {tier.minL1}{tier.maxL1 ? `–${tier.maxL1}` : '+'} L1
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 mb-4 line-clamp-2">
                        {tier.description}
                      </div>

                      {/* Percentages Box */}
                      <div className="space-y-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 font-mono text-xs mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-[11px]">Рівень 1 (L1):</span>
                          <span className="font-black text-amber-300">{tier.l1Percent}%</span>
                        </div>

                        <div className="flex justify-between items-center pt-1.5 border-t border-slate-800">
                          <span className="text-slate-400 text-[11px]">Рівень 2 (L2):</span>
                          {isStarter ? (
                            <span className="font-bold text-slate-500 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-slate-600" />
                              0%
                            </span>
                          ) : (
                            <span className="font-black text-emerald-400 flex items-center gap-1">
                              <Unlock className="w-3 h-3 text-emerald-400" />
                              {tier.l2Percent}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Summary of Total Potential */}
                      <div className="text-[11px] text-slate-400 flex items-center justify-between mb-3 px-1">
                        <span>Разом L1+L2:</span>
                        <span className="font-bold text-slate-200">
                          {tier.l1Percent + tier.l2Percent}% {tier.id === 'PLATINUM' ? '(Max)' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Requirements / Status Footer */}
                    <div className="pt-2 border-t border-slate-800/80 text-[11px]">
                      {isStarter ? (
                        <span className="text-slate-400">Тільки особисті запрошення</span>
                      ) : (
                        <span className="text-amber-400/90 font-medium">L2 розблоковано</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Live Earnings Calculator */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                    Інтерактивний калькулятор партнерського прибутку
                  </h2>
                  <p className="text-xs text-slate-400">
                    Змінюйте параметри та спостерігайте за автоматичною зміною рангу та нарахувань
                  </p>
                </div>
              </div>

              {/* Currency Toggle */}
              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => {
                    setCurrency('UAH');
                    setSubscriptionPrice(200);
                  }}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    currency === 'UAH' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ₴ Гривня (200 грн)
                </button>
                <button
                  onClick={() => {
                    setCurrency('USD');
                    setSubscriptionPrice(5);
                  }}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    currency === 'USD' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  $ Долар ($5)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Controls & Sliders (7 Cols on LG) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Slider 1: L1 Count */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-400" />
                        <span>Кількість ваших активних платних L1</span>
                      </label>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Визначає ваш ранг та відсоток комісії
                      </span>
                    </div>
                    <span className="font-mono text-lg font-black text-amber-300 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-800">
                      {l1Count} L1
                    </span>
                  </div>

                  <input
                    type="range"
                    min={1}
                    max={250}
                    value={l1Count}
                    onChange={(e) => setL1Count(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="text-slate-500 text-[11px]">Швидкі пресети:</span>
                    {[
                      { label: 'Starter (5)', val: 5 },
                      { label: 'Bronze (15)', val: 15 },
                      { label: 'Silver (45)', val: 45 },
                      { label: 'Gold (100)', val: 100 },
                      { label: 'Platinum (210)', val: 210 },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        onClick={() => setL1Count(preset.val)}
                        className={`px-2 py-0.5 rounded-lg border font-mono text-[11px] transition-all ${
                          l1Count === preset.val
                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider 2: Average L2 per L1 */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <Network className="w-4 h-4 text-emerald-400" />
                        <span>Середня кількість L2 на одного вашого L1</span>
                      </label>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Скільки платних підписників у середньому залучає кожен ваш партнер
                      </span>
                    </div>
                    <span className="font-mono text-lg font-black text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800">
                      {avgL2PerL1} L2/партнер
                    </span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={1}
                    value={avgL2PerL1}
                    onChange={(e) => setAvgL2PerL1(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Загалом рефералів 2-го рівня (L2):</span>
                    <span className="font-mono font-bold text-slate-200">
                      {calc.totalL2Count} користувачів
                    </span>
                  </div>
                </div>

                {/* Price Input & Rank Progress Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Price card */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>Вартість підписки Pro</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={subscriptionPrice}
                        onChange={(e) => setSubscriptionPrice(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                      <span className="font-mono font-bold text-slate-400 text-sm">{currencySymbol}</span>
                    </div>
                  </div>

                  {/* Next rank status */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">Прогрес до рангу:</span>
                      <span className="font-mono text-amber-400 font-bold">
                        {calc.nextRank ? calc.nextRank.name : 'Максимальний'}
                      </span>
                    </div>
                    
                    {calc.nextRank ? (
                      <>
                        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300"
                            style={{ width: `${calc.progressToNextRankPercent}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-slate-400 flex justify-between">
                          <span>Ще {calc.l1NeededForNextRank} L1 для {calc.nextRank.name}</span>
                          <span>{calc.progressToNextRankPercent}%</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-emerald-400 font-medium flex items-center gap-1 pt-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Ви досягли найвищого рангу Platinum!</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Status notice for L2 Lock / Unlock */}
                {!calc.isL2Unlocked ? (
                  <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3">
                    <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold block">Рівень L2 заблоковано (Ранг Starter: 1–9 L1)</span>
                      <p className="text-amber-300/80 text-[11px]">
                        Ви зараз отримуєте 5% з L1. Щоб відкрити нарахування 10% з другого рівня (L2), 
                        досягніть 10 активних платних L1 для переходу в ранг <strong>Bronze</strong>.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-3">
                    <Unlock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold block">Рівень L2 активовано ({calc.currentRank.l2Percent}% винагороди)</span>
                      <p className="text-emerald-300/80 text-[11px]">
                        Завдяки наявності {l1Count} активних L1 ви перебуваєте на ранзі {calc.currentRank.name} і 
                        щомісяця заробляєте з усієї глибини 2-го рівня!
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Results Column (5 Cols on LG) */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Total Income Highlight Box */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 shadow-xl space-y-5">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      РОЗРАХУНКОВИЙ ДОХІД ПАРТНЕРА
                    </span>
                    <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md border ${calc.currentRank.badgeColor}`}>
                      {calc.currentRank.name} ({calc.currentRank.l1Percent}% / {calc.currentRank.l2Percent}%)
                    </span>
                  </div>

                  {/* Main Monthly Total */}
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Щомісячний пасивний дохід:</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-mono text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">
                        {Math.round(calc.totalMonthlyIncome).toLocaleString()} {currencySymbol}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">/ місяць</span>
                    </div>
                  </div>

                  {/* Annual Total */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/90 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Річний прогноз:</span>
                      <span className="font-mono text-lg font-bold text-amber-300">
                        {Math.round(calc.totalAnnualIncome).toLocaleString()} {currencySymbol}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-800 font-mono">
                      12 МІСЯЦІВ
                    </span>
                  </div>

                  {/* Detailed Breakdown L1 and L2 */}
                  <div className="space-y-3 pt-2">
                    
                    {/* L1 item */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-200 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          Рівень 1 (Ваші {l1Count} L1 · {calc.currentRank.l1Percent}%):
                        </span>
                        <span className="font-mono font-bold text-amber-300">
                          +{Math.round(calc.l1MonthlyIncome).toLocaleString()} {currencySymbol}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 pl-3.5">
                        Формула: {l1Count} × {subscriptionPrice}{currencySymbol} × {calc.currentRank.l1Percent}%
                      </div>
                    </div>

                    {/* L2 item */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-200 flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${calc.isL2Unlocked ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                          Рівень 2 ({calc.totalL2Count} партнерських L2 · {calc.currentRank.l2Percent}%):
                        </span>
                        <span className={`font-mono font-bold ${calc.isL2Unlocked ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {calc.isL2Unlocked 
                            ? `+${Math.round(calc.l2MonthlyIncome).toLocaleString()} ${currencySymbol}`
                            : '0 (Заблоковано)'}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 pl-3.5">
                        {calc.isL2Unlocked 
                          ? `Формула: ${calc.totalL2Count} × ${subscriptionPrice}${currencySymbol} × ${calc.currentRank.l2Percent}%`
                          : 'Потрібно 10 L1 для розблокування 10% L2 у Bronze'}
                      </div>
                    </div>

                  </div>

                  {/* Total network size stats */}
                  <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between font-mono">
                    <span>Загальний розмір мережі:</span>
                    <span className="text-slate-200 font-bold">{calc.totalNetworkSize} платних підписників</span>
                  </div>

                </div>

                {/* Quick Link Card */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <span className="text-xs font-bold text-slate-300 block">Ваше партнерське посилання:</span>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value="https://sirenua.com/ref/partner_active"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-amber-300 focus:outline-none"
                    />
                    <button
                      onClick={() => handleCopyLink('https://sirenua.com/ref/partner_active')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                        copiedLink
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      }`}
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Скопійовано' : 'Копіювати'}</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Visual Multi-Tier Network Structure & Single Transaction Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Interactive Single Transaction Simulator (6 Cols) */}
            <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-slate-200">
                    Симулятор розподілу однієї транзакції
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  50% MAX CAP
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Перевірте, скільки система виплачує прямим спонсорам L1 та L2 з будь-якого чеку передплати.
              </p>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 shrink-0">Сума транзакції:</span>
                {[
                  { label: '200 грн (1 міс)', amount: 200 },
                  { label: '600 грн (3 міс)', amount: 600 },
                  { label: '2400 грн (Рік)', amount: 2400 },
                ].map((p) => (
                  <button
                    key={p.amount}
                    onClick={() => setSimTxAmount(p.amount)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all border ${
                      simTxAmount === p.amount
                        ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Transaction Distribution Visualizer */}
              <div className="space-y-2.5 pt-2">
                
                {/* L1 direct commission */}
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200">1. Прямий партнер L1 ({calc.currentRank.l1Percent}%):</span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      {simTxAmount} грн × {calc.currentRank.l1Percent}%
                    </span>
                  </div>
                  <span className="font-mono text-base font-black text-amber-300">
                    {(simTxAmount * calc.currentRank.l1Rate).toFixed(1)} грн
                  </span>
                </div>

                {/* L2 sponsor commission */}
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200">2. Спонсор 2-го рівня L2 ({calc.currentRank.l2Percent}%):</span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      {calc.isL2Unlocked 
                        ? `${simTxAmount} грн × ${calc.currentRank.l2Percent}%`
                        : 'Заблоковано на Starter (0%)'}
                    </span>
                  </div>
                  <span className={`font-mono text-base font-black ${calc.isL2Unlocked ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {calc.isL2Unlocked ? `${(simTxAmount * calc.currentRank.l2Rate).toFixed(1)} грн` : '0 грн'}
                  </span>
                </div>

                {/* System remaining */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">3. Серверна інфраструктура SirenUA:</span>
                  <span className="font-mono font-bold text-slate-300">
                    {(simTxAmount - (simTxAmount * calc.currentRank.l1Rate) - (calc.isL2Unlocked ? simTxAmount * calc.currentRank.l2Rate : 0)).toFixed(1)} грн
                  </span>
                </div>

              </div>

              <div className="text-[11px] text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60 font-mono">
                ℹ️ На максимальному ранзі <strong>Platinum</strong> система виплачує рівно 50% (25% L1 + 25% L2 = {(simTxAmount * 0.5).toFixed(0)} грн).
              </div>
            </div>

            {/* Right: Simulated Real-time Transactions Feed (6 Cols) */}
            <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-200">
                    Останні нарахування за підписками
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  LIVE
                </span>
              </div>

              <div className="space-y-2.5">
                {SAMPLE_SIMULATED_TRANSACTIONS.map((tx) => {
                  const isL1 = tx.level === 'L1';
                  const rate = isL1 ? calc.currentRank.l1Rate : (calc.isL2Unlocked ? calc.currentRank.l2Rate : 0);
                  const earning = tx.amount * rate;

                  return (
                    <div 
                      key={tx.id}
                      className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isL1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            {tx.level}
                          </span>
                          <span className="text-xs font-bold text-slate-200">{tx.user}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {tx.plan} ({tx.amount} грн) · <span className="text-slate-500">{tx.date}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-sm font-black text-emerald-400 block">
                          +{earning.toFixed(0)} грн
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {isL1 ? `${calc.currentRank.l1Percent}%` : (calc.isL2Unlocked ? `${calc.currentRank.l2Percent}%` : '0%')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* FAQ Accordion Section */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-slate-100">
                Часті запитання щодо партнерської програми (FAQ)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {FAQ_AFFILIATE.map((faq, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 space-y-1.5"
                >
                  <div className="text-xs font-bold text-slate-200 flex items-start gap-2">
                    <span className="text-amber-400 font-mono">Q:</span>
                    <span>{faq.q}</span>
                  </div>
                  <p className="text-[12px] text-slate-400 leading-relaxed pl-5">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: NETWORK TREE (L1 / L2) */}
      {activeTab === 'NETWORK' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header & Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
                <Network className="w-5 h-5 text-amber-400" />
                <span>Ієрархія та структура партнерської мережі</span>
              </h2>
              <p className="text-xs text-slate-400">
                Переглядайте ваших прямих рефералів 1-го рівня (L1) та створені ними гілки 2-го рівня (L2)
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                Активних L1: <strong className="text-amber-300">{l1Partners.length}</strong>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                Загалом у базі: <strong className="text-emerald-300">{SAMPLE_PARTNER_TREE.length}</strong>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Пошук за ім'ям чи ID..."
                value={networkSearch}
                onChange={(e) => setNetworkSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2">
              {(['ALL', 'L1', 'L2'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setNetworkLevelFilter(lvl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                    networkLevelFilter === lvl
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {lvl === 'ALL' ? 'Всі рівні' : lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Tree List */}
          <div className="space-y-3">
            {l1Partners.map((l1) => {
              const isExpanded = expandedL1Ids[l1.id];
              const children = SAMPLE_PARTNER_TREE.filter(p => p.parentId === l1.id);
              
              // Skip if search filter hides both parent and children
              const parentMatches = l1.name.toLowerCase().includes(networkSearch.toLowerCase()) || l1.id.toLowerCase().includes(networkSearch.toLowerCase());
              const hasMatchingChildren = children.some(c => c.name.toLowerCase().includes(networkSearch.toLowerCase()) || c.id.toLowerCase().includes(networkSearch.toLowerCase()));

              if (networkSearch && !parentMatches && !hasMatchingChildren) {
                return null;
              }

              return (
                <div key={l1.id} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                  
                  {/* L1 Header Row */}
                  <div className="p-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleL1Expand(l1.id)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>

                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-black text-amber-300 text-xs font-mono">
                        L1
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-100">{l1.name}</span>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            {l1.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{l1.plan} ({l1.planPrice} ₴)</span>
                          <span>•</span>
                          <span>Приєднався: {l1.joinDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">Команда L2:</span>
                        <span className="font-bold text-slate-200">{l1.l2ChildrenCount || 0} партнерів</span>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">Прибуток з гілки:</span>
                        <span className="font-black text-emerald-400">+{l1.totalEarnedFromNode} ₴</span>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                        ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* Children (L2) Container */}
                  {isExpanded && children.length > 0 && (
                    <div className="p-4 pl-12 space-y-2 bg-slate-950/90">
                      <div className="text-[11px] text-slate-500 font-mono mb-2 flex items-center gap-1.5">
                        <Network className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Підключені реферали 2-го рівня (L2) від {l1.name}:</span>
                      </div>

                      {children.map((l2) => (
                        <div 
                          key={l2.id}
                          className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-300 text-[10px] font-mono">
                              L2
                            </div>
                            <div>
                              <span className="font-bold text-slate-200">{l2.name}</span>
                              <span className="text-[10px] font-mono text-slate-500 ml-2">ID: {l2.id}</span>
                              <div className="text-[11px] text-slate-400">
                                {l2.plan} ({l2.planPrice} ₴) · {l2.joinDate}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 font-mono text-right">
                            <div>
                              <span className="text-[10px] text-slate-500 block">Ваш дохід L2:</span>
                              <span className="font-bold text-emerald-400">+{l2.totalEarnedFromNode} ₴</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800 text-[10px]">
                              ACTIVE
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {isExpanded && children.length === 0 && (
                    <div className="p-4 pl-12 text-xs text-slate-500 font-mono italic">
                      Цей партнер ще не залучив користувачів L2.
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 3: PROMO & QR CODE GENERATOR */}
      {activeTab === 'PROMO' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Custom Link & UTM Builder */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-400" />
                <span>Генератор персональних реферальних посилань та QR-кодів</span>
              </h2>
              <p className="text-xs text-slate-400">
                Створюйте власні посилання з UTM-мітками для точного відстеження джерел переходів (Telegram, YouTube, TikTok тощо)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Ваш реферальний псевдонім (Slug):</label>
                <input
                  type="text"
                  value={customRefSlug}
                  onChange={(e) => setCustomRefSlug(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Джерело трафіку (utm_source):</label>
                <select
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="telegram">Telegram канал / група</option>
                  <option value="instagram">Instagram Stories / Bio</option>
                  <option value="youtube">YouTube Опис відео</option>
                  <option value="tiktok">TikTok Профіль</option>
                  <option value="website">Власний сайт / Блог</option>
                  <option value="friends">Пряма рекомендація друзям</option>
                </select>
              </div>
            </div>

            {/* Generated Link Result Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-3">
              <span className="text-xs font-bold text-slate-300 block">Ваше згенероване посилання:</span>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <input
                  readOnly
                  value={fullCustomRefUrl}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-amber-300 focus:outline-none"
                />
                <button
                  onClick={() => handleCopyLink(fullCustomRefUrl)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Скопійовано!' : 'Копіювати'}</span>
                </button>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(fullCustomRefUrl)}&text=${encodeURIComponent('🚨 Перевірте інтерактивну карту повітряних загроз SirenUA Pro')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>В Telegram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Ready-to-use Promo Templates */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Готові рекламні тексти для публікацій</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {AFFILIATE_PROMO_TEMPLATES.map((tmpl) => (
                <div 
                  key={tmpl.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-amber-400">{tmpl.platform}</span>
                      <span className="text-[10px] font-mono text-slate-500">{tmpl.id}</span>
                    </div>
                    <div className="font-bold text-sm text-slate-200">{tmpl.title}</div>
                    <p className="text-xs text-slate-400 whitespace-pre-line leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 font-sans">
                      {tmpl.text.replace('https://sirenua.com/ref/partner_link', fullCustomRefUrl)}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1 text-[10px] text-slate-500 font-mono">
                      {tmpl.tags.map((t, idx) => <span key={idx}>{t}</span>)}
                    </div>

                    <button
                      onClick={() => handleCopyLink(tmpl.text.replace('https://sirenua.com/ref/partner_link', fullCustomRefUrl), tmpl.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1 transition-all"
                    >
                      {copiedPromoId === tmpl.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPromoId === tmpl.id ? 'Скопійовано' : 'Копіювати'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Embed Widget Snippet */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-slate-200">HTML Віджет для вставки на ваш сайт</h3>
            </div>
            <p className="text-xs text-slate-400">
              Вставте цей код у бічну панель або шапку сайту для показу статусу тривог з вашим партнерським посиланням:
            </p>
            <div className="relative">
              <pre className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
{`<a href="${fullCustomRefUrl}" target="_blank" style="display:inline-flex;align-items:center;padding:8px 14px;background:#0f172a;color:#f59e0b;border:1px solid #f59e0b;border-radius:12px;text-decoration:none;font-weight:bold;font-size:13px;">
  🚨 Карта тривог SirenUA Pro
</a>`}
              </pre>
              <button
                onClick={() => handleCopyLink(`<a href="${fullCustomRefUrl}" target="_blank" style="display:inline-flex;align-items:center;padding:8px 14px;background:#0f172a;color:#f59e0b;border:1px solid #f59e0b;border-radius:12px;text-decoration:none;font-weight:bold;font-size:13px;">\n  🚨 Карта тривог SirenUA Pro\n</a>`)}
                className="absolute right-3 top-3 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-mono font-bold hover:bg-slate-700 transition-colors"
              >
                Копіювати код
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: PAYOUTS & WALLET */}
      {activeTab === 'PAYOUTS' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-1">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Доступно до виведення:</span>
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                4 820 ₴
              </div>
              <span className="text-[11px] text-slate-500 block">Готово до миттєвої виплати</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-1">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>В обробці (Hold 7 днів):</span>
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
                1 200 ₴
              </div>
              <span className="text-[11px] text-slate-500 block">Очікує підтвердження білінгу</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-1">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Всього виплачено за весь час:</span>
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-100">
                26 450 ₴
              </div>
              <span className="text-[11px] text-slate-500 block">3 успішні транзакції</span>
            </div>

          </div>

          {/* Payout Request Form */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                <span>Замовити виведення партнерської винагороди</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                Мін. сума: 500 ₴ / $15
              </span>
            </div>

            {payoutSuccessMessage && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{payoutSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleRequestPayoutSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Method */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Платіжний метод:</label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="MONOBANK">Monobank (UAH Картка / Банка)</option>
                    <option value="PRIVATBANK">ПриватБанк (UAH Картка)</option>
                    <option value="IBAN">Розрахунковий рахунок IBAN (ФОП / ТОВ)</option>
                    <option value="USDT_TRC20">USDT TRC-20 (Crypto)</option>
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Сума виведення (₴):</label>
                  <input
                    type="number"
                    min="500"
                    max="4820"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="Наприклад: 2000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

              </div>

              {/* Account / IBAN / Wallet */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  {payoutMethod === 'USDT_TRC20' ? 'Адреса USDT TRC-20 гаманця:' : 'Номер картки / IBAN рахунок:'}
                </label>
                <input
                  type="text"
                  value={payoutAccount}
                  onChange={(e) => setPayoutAccount(e.target.value)}
                  placeholder={payoutMethod === 'USDT_TRC20' ? 'TX...' : '4441 1144 ... або UA89...'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-amber-950/50"
                >
                  Підтвердити заявку на виплату
                </button>
              </div>
            </form>
          </div>

          {/* Payout History Table */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <span>Історія попередніх виплат</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="pb-2">ID Транзакції</th>
                    <th className="pb-2">Метод</th>
                    <th className="pb-2">Реквізити</th>
                    <th className="pb-2">Дата</th>
                    <th className="pb-2">Сума</th>
                    <th className="pb-2 text-right">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {SAMPLE_PAYOUT_HISTORY.map((p) => (
                    <tr key={p.id} className="text-slate-300">
                      <td className="py-3 text-amber-400 font-bold">{p.id}</td>
                      <td className="py-3">{p.method}</td>
                      <td className="py-3 text-slate-400">{p.targetAccount}</td>
                      <td className="py-3 text-slate-500">{p.date}</td>
                      <td className="py-3 font-bold text-slate-100">
                        {p.amount} {p.currency === 'UAH' ? '₴' : 'USDT'}
                      </td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: SIDE-BY-SIDE MATRIX COMPARISON */}
      {activeTab === 'MATRIX' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1 border-b border-slate-800 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Детальна порівняльна матриця рангів</span>
            </h2>
            <p className="text-xs text-slate-400">
              Повний огляд умов, відсоткових ставок та привілеїв кожного партнерського рівня
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 font-mono text-slate-400">
                  <th className="p-3">Параметр / Ранг</th>
                  {AFFILIATE_RANKS.map((r) => (
                    <th key={r.id} className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-md border text-[11px] font-bold ${r.badgeColor}`}>
                        {r.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 font-mono">
                
                <tr>
                  <td className="p-3 text-slate-300 font-bold font-sans">Власні платні L1 (Кваліфікація)</td>
                  {AFFILIATE_RANKS.map((r) => (
                    <td key={r.id} className="p-3 text-center text-slate-200 font-bold">
                      {r.minL1}{r.maxL1 ? `–${r.maxL1}` : '+'} L1
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 text-slate-300 font-bold font-sans">Комісія з 1-го рівня (L1)</td>
                  {AFFILIATE_RANKS.map((r) => (
                    <td key={r.id} className="p-3 text-center text-amber-300 font-black text-sm">
                      {r.l1Percent}%
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 text-slate-300 font-bold font-sans">Комісія з 2-го рівня (L2)</td>
                  {AFFILIATE_RANKS.map((r) => (
                    <td key={r.id} className="p-3 text-center">
                      {r.isL2Unlocked ? (
                        <span className="text-emerald-400 font-black text-sm">{r.l2Percent}%</span>
                      ) : (
                        <span className="text-slate-600 font-bold flex items-center justify-center gap-1">
                          <Lock className="w-3 h-3" /> 0%
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 text-slate-300 font-bold font-sans">Сумарний % виплати (L1 + L2)</td>
                  {AFFILIATE_RANKS.map((r) => (
                    <td key={r.id} className="p-3 text-center text-slate-100 font-black">
                      {r.l1Percent + r.l2Percent}% {r.id === 'PLATINUM' ? '(Max Cap)' : ''}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 text-slate-300 font-bold font-sans">Частота виплат</td>
                  <td className="p-3 text-center text-slate-400">Щотижня</td>
                  <td className="p-3 text-center text-slate-400">Щотижня</td>
                  <td className="p-3 text-center text-slate-400">Щотижня</td>
                  <td className="p-3 text-center text-amber-300 font-bold">Щоденно</td>
                  <td className="p-3 text-center text-cyan-300 font-bold">Миттєво</td>
                </tr>

                <tr>
                  <td className="p-3 text-slate-300 font-bold font-sans">Персональний менеджер</td>
                  <td className="p-3 text-center text-slate-600">—</td>
                  <td className="p-3 text-center text-slate-600">—</td>
                  <td className="p-3 text-center text-emerald-400">Пріоритетний чат</td>
                  <td className="p-3 text-center text-amber-300">Виділений 1-on-1</td>
                  <td className="p-3 text-center text-cyan-300">VIP 24/7 + Co-Marketing</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
