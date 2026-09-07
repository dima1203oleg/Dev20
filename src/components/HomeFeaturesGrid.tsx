import React from 'react';
import { 
  Users, 
  Wallet, 
  BarChart2, 
  Award,
  ArrowRight
} from 'lucide-react';
import { playWebAudioSound } from '../utils/sirenAudio';
import { DashboardSection } from '../types';

interface HomeFeaturesGridProps {
  onNavigateToTab?: (tab: DashboardSection) => void;
  theme?: 'light' | 'dark';
}

export const HomeFeaturesGrid: React.FC<HomeFeaturesGridProps> = ({
  onNavigateToTab,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';

  const cards = [
    {
      id: 'NETWORK',
      title: 'Мережа',
      icon: <Users className="w-5 h-5 text-blue-500" />,
      features: [
        ['Управління інформацією', 'L1/L2 структура'],
        ['Структура L1', 'Запрошення']
      ]
    },
    {
      id: 'FINANCE',
      title: 'Фінанси',
      icon: <Wallet className="w-5 h-5 text-blue-500" />,
      features: [
        ['₴ 8 460', 'Виплати/доступність'],
        ['Дохід', 'Історія']
      ]
    },
    {
      id: 'ANALYTICS',
      title: 'Аналітика',
      icon: <BarChart2 className="w-5 h-5 text-blue-500" />,
      features: [
        ['Конверсії', 'Активність'],
        ['Рост мережі', 'Ефективність']
      ]
    },
    {
      id: 'AFFILIATE',
      title: 'Партнерська програма',
      icon: <Award className="w-5 h-5 text-blue-500" />,
      features: [
        ['Ранги Gold Partner', 'Статус'],
        ['Прогрес', 'Запрошення амбасадорів']
      ]
    }
  ];

  return (
    <div className="w-full my-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => (
          <button
            type="button"
            key={card.id}
            aria-label={`Відкрити розділ ${card.title}`}
            onClick={() => {
              if (onNavigateToTab) onNavigateToTab(card.id as DashboardSection);
              playWebAudioSound('click');
            }}
            className={`w-full text-left rounded-[22px] p-4 lg:p-3 border flex flex-col lg:h-[78px] lg:justify-center cursor-pointer group transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
              isDark 
                ? 'bg-[#131C2B] border-[#24344D] text-white hover:border-[#334768] shadow-lg' 
                : 'bg-white border-[#CBD6E2] text-[#0F172A] hover:border-blue-300 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="lg:flex lg:items-center lg:gap-3">
              <div className="flex items-center justify-between mb-3 lg:mb-0 lg:w-9 lg:shrink-0">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                  isDark ? 'bg-[#1B293F] border border-[#2E4160]' : 'bg-blue-50 border border-blue-100'
                }`}>
                  {card.icon}
                </div>
                <ArrowRight className={`w-4 h-4 lg:hidden transition-transform group-hover:translate-x-1 ${
                  isDark ? 'text-slate-500 group-hover:text-blue-400' : 'text-slate-400 group-hover:text-blue-600'
                }`} />
              </div>
              
              <h3 className={`text-[15px] font-extrabold tracking-tight mb-1.5 lg:mb-1 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                {card.title}
              </h3>

              <div className="space-y-0.5 text-[11px]">
                {card.features.map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2">
                    <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-[#334155]'}`}>
                      {row[0]}
                    </span>
                    <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-[#5A6A80]'}`}>
                      {row[1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
