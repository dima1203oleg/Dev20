import React, { useState } from 'react';
import { 
  Maximize2, 
  Crosshair, 
  Compass, 
  Clock, 
  ArrowRight, 
  AlertTriangle, 
  Award,
} from 'lucide-react';
import { RegionData, ThreatSceneModel, UserSettings } from '../types';
import { playWebAudioSound } from '../utils/sirenAudio';
import { ThreeMapUkraine } from './ThreeMapUkraine';

interface CentralWorkspaceProps {
  regions: RegionData[];
  selectedRegion: RegionData | null;
  onSelectRegion: (reg: RegionData | null) => void;
  myRegionId: string;
  onSetMyRegion: (id: string) => void;
  threatModel?: ThreatSceneModel;
  settings?: UserSettings;
  onUpdateSettings?: (settings: Partial<UserSettings>) => void;
  onNavigateToShelters?: () => void;
  onNavigateToFinance?: () => void;
  onNavigateToNetwork?: () => void;
  onTestSiren?: () => void;
}

export const CentralWorkspace: React.FC<CentralWorkspaceProps> = ({
  regions,
  selectedRegion,
  onSelectRegion,
  myRegionId,
  onSetMyRegion,
  threatModel,
  onNavigateToShelters,
  onNavigateToFinance,
  onNavigateToNetwork,
  onTestSiren,
}) => {
  const [activeTab, setActiveTab] = useState<'SITUATION' | 'NETWORK'>('SITUATION');
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  return (
    <div className="w-full flex flex-col h-full justify-between">
      
      {/* Top Header with Pill Switcher: "Ситуація" vs "Моя мережа" */}
      <div className="flex items-center justify-start mb-3">
        <div className="bg-slate-100 p-1 rounded-full inline-flex items-center gap-1 border border-slate-200/60 shadow-inner">
          <button
            onClick={() => {
              setActiveTab('SITUATION');
              playWebAudioSound('click');
            }}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'SITUATION'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Ситуація
          </button>

          <button
            onClick={() => {
              setActiveTab('NETWORK');
              playWebAudioSound('click');
            }}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'NETWORK'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Моя мережа
          </button>
        </div>
      </div>

      {/* Main Workspace Card Container */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex-1 flex flex-col justify-center">
        
        {activeTab === 'SITUATION' ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left 60%: 3D Ukraine Map Viewport */}
            <div className="md:col-span-7 relative aspect-[16/11] bg-slate-50/50 rounded-2xl border border-slate-100 p-2 flex items-center justify-center overflow-hidden group">
              
              {/* Expand button at top right */}
              <button
                onClick={() => setIsMapExpanded(!isMapExpanded)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-500 hover:text-slate-800 shadow-sm border border-slate-200/80 transition-all z-20 cursor-pointer"
                title="Розгорнути карту"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {/* 3D Map Viewport */}
              <ThreeMapUkraine
                variant="workspace"
                highlightedCity="kyiv"
                className="w-full h-full"
              />

              {/* Bottom right zoom control hint */}
              <div className="absolute bottom-2.5 right-2.5 p-1 rounded-md bg-white/90 border border-slate-200/80 text-[10px] text-slate-500 font-mono shadow-xs z-20">
                <Maximize2 className="w-3 h-3" />
              </div>

            </div>

            {/* Right 40%: Operational Threat Card */}
            <div className="md:col-span-5 space-y-4">
              
              <div>
                <h4 className="text-xl font-bold text-slate-900 tracking-tight">
                  Київська область
                </h4>
                
                {/* Amber Warning Pill Badge */}
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-bold shadow-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Підвищена увага</span>
                </div>
              </div>

              {/* Threat Attributes List */}
              <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                
                {/* Attribute 1: Тип загрози */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Crosshair className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Тип загрози</div>
                    <div className="text-slate-900 font-bold text-sm mt-0.5">БпЛА</div>
                  </div>
                </div>

                {/* Attribute 2: Напрямок */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Напрямок</div>
                    <div className="text-slate-900 font-bold text-sm mt-0.5">Південно-західний</div>
                  </div>
                </div>

                {/* Attribute 3: Оновлено */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Оновлено</div>
                    <div className="text-slate-900 font-bold text-sm mt-0.5">Сьогодні, 22:14</div>
                  </div>
                </div>

              </div>

              {/* Detail Action Link */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (onNavigateToShelters) onNavigateToShelters();
                    playWebAudioSound('click');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer group"
                >
                  <span>Детальніше</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

          </div>
        ) : (
          /* Network Quick View when "Моя мережа" tab is selected */
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Партнерська мережа L1/L2</h4>
                <p className="text-xs text-slate-400">Ваша реферальна структура та статистика нарахувань</p>
              </div>
              <button
                onClick={onNavigateToNetwork}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Повна мережа</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-400 font-medium">Партнери L1 (15%)</div>
                <div className="text-2xl font-black text-slate-900 mt-1">154</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">+18 цього тижня</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-400 font-medium">Партнери L2 (5%)</div>
                <div className="text-2xl font-black text-slate-900 mt-1">382</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">+42 цього тижня</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-400 font-medium">Поточний статус</div>
                <div className="text-2xl font-black text-amber-600 mt-1 flex items-center gap-1">
                  <Award className="w-5 h-5" /> Gold
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-1">До Platinum: 18 рефералів</div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
