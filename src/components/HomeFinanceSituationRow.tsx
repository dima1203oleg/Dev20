import React from 'react';
import { 
  Wallet, 
  Database,
  Clock,
  BarChart2,
  Users,
  ArrowRight,
  TrendingUp,
  Star
} from 'lucide-react';
import { playWebAudioSound } from '../utils/sirenAudio';
import { DataFreshnessIndicator } from './DataFreshnessIndicator';
import { DataState } from '../types/dataEnvelope';

interface HomeFinanceSituationRowProps {
  onNavigateToFinance?: () => void;
  onNavigateToNetwork?: () => void;
  theme?: 'light' | 'dark';
  dataState?: DataState;
  [key: string]: any;
}

export const HomeFinanceSituationRow: React.FC<HomeFinanceSituationRowProps> = ({
  onNavigateToFinance,
  onNavigateToNetwork,
  theme = 'light',
  dataState = 'DEMO',
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="w-full my-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className={`text-xl sm:text-[22px] font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              Фінансова інформація
            </h2>
            <DataFreshnessIndicator state={dataState} theme={theme} />
          </div>
          <p className={`text-[13px] font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-[#5A6A80]'}`}>
            {dataState === 'LIVE' ? 'Ваш дохід. Ваш розвиток. Більше можливостей.' : 'Демонстраційний стан до підключення фінансового API.'}
          </p>
        </div>
        <button
          onClick={() => {
            if (onNavigateToFinance) onNavigateToFinance();
            playWebAudioSound('click');
          }}
          className={`text-[13px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
            isDark ? 'text-blue-400 hover:text-blue-300' : 'text-[#2563EB] hover:text-blue-700'
          }`}
        >
          Перейти до фінансів <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Зароблено */}
        <div className={`rounded-[22px] p-5 border flex flex-col justify-between transition-all duration-200 ${
          isDark 
            ? 'bg-[#131C2B] border-[#24344D] text-white shadow-lg' 
            : 'bg-white border-[#CBD6E2] text-[#0F172A] shadow-sm'
        }`}>
          <div>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isDark ? 'bg-[#182335] text-blue-400 border border-[#2E4160]' : 'bg-blue-50 text-[#2563EB] border border-blue-100'
              }`}>
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-[12px] font-medium ${isDark ? 'text-slate-400' : 'text-[#5A6A80]'}`}>
                  Зароблено
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    ₴ 12 460
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 text-[10px] font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +12%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={`text-[12px] font-medium mt-4 ${isDark ? 'text-slate-400' : 'text-[#5A6A80]'}`}>
            Всього за час
          </div>
        </div>

        {/* Card 2: Баланс */}
        <div className={`rounded-[22px] p-5 border flex flex-col justify-between transition-all duration-200 ${
          isDark 
            ? 'bg-[#131C2B] border-[#24344D] text-white shadow-lg' 
            : 'bg-white border-[#CBD6E2] text-[#0F172A] shadow-sm'
        }`}>
          <div>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isDark ? 'bg-[#182335] text-emerald-400 border border-[#2E4160]' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}>
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-[12px] font-medium ${isDark ? 'text-slate-400' : 'text-[#5A6A80]'}`}>
                  Баланс
                </div>
                <div className={`text-xl font-black tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  ₴ 8 460
                </div>
              </div>
            </div>
          </div>
          <div className={`text-[12px] font-medium mt-4 ${isDark ? 'text-slate-400' : 'text-[#5A6A80]'}`}>
            Доступно: <strong className={isDark ? 'text-white' : 'text-[#0F172A]'}>$450</strong>
          </div>
        </div>

        {/* Card 3: Доступно до виводу */}
        <div className={`rounded-[22px] p-5 border flex flex-col justify-between transition-all duration-200 ${
          isDark 
            ? 'bg-[#131C2B] border-[#24344D] text-white shadow-lg' 
            : 'bg-white border-[#CBD6E2] text-[#0F172A] shadow-sm'
        }`}>
          <div>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isDark ? 'bg-[#182335] text-amber-400 border border-[#2E4160]' : 'bg-amber-50 text-amber-600 border border-amber-100'
              }`}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-[12px] font-medium ${isDark ? 'text-slate-400' : 'text-[#5A6A80]'}`}>
                  Доступна до виводу
                </div>
                <div className={`text-xl font-black tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  ₴ 8 460
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if (onNavigateToFinance) onNavigateToFinance();
              playWebAudioSound('click');
            }}
            className={`w-full mt-3 py-2 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer border ${
              isDark 
                ? 'bg-[#182335] border-[#2E4160] text-blue-400 hover:bg-[#202E46]' 
                : 'bg-blue-50 border-blue-100 text-[#2563EB] hover:bg-blue-100'
            }`}
          >
            <span>Вивести кошти</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 4: Виплачено */}
        <div className={`rounded-[22px] p-5 border flex flex-col justify-between transition-all duration-200 ${
          isDark 
            ? 'bg-[#131C2B] border-[#24344D] text-white shadow-lg' 
            : 'bg-white border-[#CBD6E2] text-[#0F172A] shadow-sm'
        }`}>
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-[#182335] text-blue-400 border border-[#2E4160]' : 'bg-blue-50 text-blue-600 border border-blue-100'
                }`}>
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-[12px] font-medium ${isDark ? 'text-slate-400' : 'text-[#5A6A80]'}`}>
                    Виплачено
                  </div>
                  <div className={`text-xl font-black tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    ₴ 4 230
                  </div>
                </div>
              </div>

              {/* Mini Bar Chart */}
              <div className="flex items-end gap-1 h-7 opacity-75">
                <div className="w-1.5 bg-blue-500 h-[40%] rounded-t-sm"></div>
                <div className="w-1.5 bg-blue-500 h-[65%] rounded-t-sm"></div>
                <div className="w-1.5 bg-blue-500 h-[90%] rounded-t-sm"></div>
                <div className="w-1.5 bg-blue-500 h-[75%] rounded-t-sm"></div>
                <div className="w-1.5 bg-blue-500 h-[100%] rounded-t-sm"></div>
              </div>
            </div>
          </div>
          <div className={`text-[12px] font-medium mt-4 ${isDark ? 'text-slate-400' : 'text-[#5A6A80]'}`}>
            Всього виплат
          </div>
        </div>

        {/* Card 5: Ваша партнерська програма */}
        <button
          type="button"
          aria-label="Відкрити партнерську програму"
          onClick={() => {
            if (onNavigateToNetwork) onNavigateToNetwork();
            playWebAudioSound('click');
          }}
          className={`w-full text-left rounded-[22px] p-5 border flex flex-col justify-between cursor-pointer group transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
          isDark 
            ? 'bg-[#131C2B] border-[#24344D] text-white hover:border-[#334768] shadow-lg' 
            : 'bg-white border-[#CBD6E2] text-[#0F172A] hover:border-blue-300 shadow-sm'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                isDark ? 'bg-[#182335] text-amber-400 border border-[#2E4160]' : 'bg-amber-50 text-amber-600 border border-amber-100'
              }`}>
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-[#5A6A80]'}`}>
                  Ваша партнерська програма
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className={`text-[14px] font-black ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    Gold Partner
                  </span>
                </div>
                <div className={`text-[11px] font-medium mt-0.5 ${isDark ? 'text-slate-300' : 'text-[#334155]'}`}>
                  <strong className="font-extrabold">154</strong> кваліфікація L1
                </div>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 mt-1 transition-transform group-hover:translate-x-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          </div>
          
          <div className="mt-3">
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#2563EB] rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className={`text-[10px] font-medium mt-1.5 ${isDark ? 'text-slate-400' : 'text-[#5A6A80]'}`}>
              До Platinum: 46 / 200
            </div>
          </div>
        </button>

      </div>
    </div>
  );
};
