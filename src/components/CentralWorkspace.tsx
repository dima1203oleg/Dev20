import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Layers, 
  Maximize2, 
  Radio, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Award, 
  Compass, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  ExternalLink,
  Shield,
  Eye,
  Sliders,
  Filter,
  Flame,
  Zap,
  Minimize2,
  X,
  Volume2,
  Sparkles
} from 'lucide-react';
import { Financial3DCardCarousel } from './finance/Financial3DCardCarousel';
import { 
  RegionData, 
  ThreatTrajectory, 
  ThreatSceneModel, 
  MainWorkspaceMode, 
  Shelter,
  AffiliatePartnerNode,
  UserSettings
} from '../types';
import { UkraineMap } from './UkraineMap';
import { INITIAL_TRAJECTORIES } from '../data/spatialThreatData';
import { SAMPLE_PARTNER_TREE, AFFILIATE_RANKS } from '../data/affiliateData';
import { playWebAudioSound } from '../utils/sirenAudio';

interface CentralWorkspaceProps {
  regions: RegionData[];
  selectedRegion: RegionData | null;
  onSelectRegion: (reg: RegionData | null) => void;
  myRegionId: string;
  onSetMyRegion: (id: string) => void;
  threatModel: ThreatSceneModel;
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onNavigateToShelters?: () => void;
  onNavigateToFinance?: () => void;
  onTestSiren?: () => void;
}

export const CentralWorkspace: React.FC<CentralWorkspaceProps> = ({
  regions,
  selectedRegion,
  onSelectRegion,
  myRegionId,
  onSetMyRegion,
  threatModel,
  settings,
  onUpdateSettings,
  onNavigateToShelters,
  onNavigateToFinance,
  onTestSiren,
}) => {
  // Main Workspace Mode: SAFETY (СИТУАЦІЯ) vs NETWORK (МОЯ МЕРЕЖА)
  const [workspaceMode, setWorkspaceMode] = useState<MainWorkspaceMode>('SAFETY');

  // Map Layers Popover State
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [layersState, setLayersState] = useState({
    threats: true,
    trajectories: true,
    risk: true,
    shelters: true,
    timeline: true,
  });

  // Timeline position index
  const [timelineIndex, setTimelineIndex] = useState(3); // 0: 18:10, 1: 18:20, 2: 18:30, 3: LIVE
  const timelineSteps = ['18:10', '18:20', '18:30', 'LIVE'];

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Network State
  const [selectedPartnerNode, setSelectedPartnerNode] = useState<AffiliatePartnerNode | null>(null);
  const [networkViewMode, setNetworkViewMode] = useState<'3D_GRAPH' | 'LIST'>('3D_GRAPH');

  // Current active region data
  const myRegionData = useMemo(() => {
    return regions.find((r) => r.id === myRegionId) || regions[0];
  }, [regions, myRegionId]);

  const activeRegion = selectedRegion || myRegionData;
  const isAlarm = activeRegion.isAlarm;

  // Toggle layer
  const toggleLayer = (key: keyof typeof layersState) => {
    setLayersState((prev) => ({ ...prev, [key]: !prev[key] }));
    playWebAudioSound('click');
  };

  return (
    <div 
      className={`w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-4 sm:my-6 transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 p-2 sm:p-4 bg-slate-950/95 overflow-y-auto' : ''
      }`}
    >
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 border-2 border-slate-800 shadow-2xl backdrop-blur-2xl">
        
        {/* Workspace Top Toolbar Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
          
          {/* Main Mode Segmented Control: [ СИТУАЦІЯ ] vs [ МОЯ МЕРЕЖА ] */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
            <button
              onClick={() => {
                setWorkspaceMode('SAFETY');
                playWebAudioSound('click');
              }}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold flex items-center gap-2 transition-all ${
                workspaceMode === 'SAFETY'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-950 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>СИТУАЦІЯ</span>
            </button>

            <button
              onClick={() => {
                setWorkspaceMode('NETWORK');
                playWebAudioSound('click');
              }}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold flex items-center gap-2 transition-all ${
                workspaceMode === 'NETWORK'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-950 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>МОЯ МЕРЕЖА</span>
            </button>
          </div>

          {/* Central Live Telemetry Badge */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-bold">LIVE СИНХРОНІЗАЦІЯ</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">Затримка РЛС: <strong>24 ms</strong></span>
          </div>

          {/* Right Compact Button Budget: [Шари] [LIVE] [⛶] */}
          <div className="flex items-center gap-2">
            
            {/* Layers Popover Button */}
            {workspaceMode === 'SAFETY' && (
              <div className="relative">
                <button
                  onClick={() => setIsLayersOpen(!isLayersOpen)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
                    isLayersOpen
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title="Налаштування шарів карти"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Шари</span>
                </button>

                {/* Compact Popover Box */}
                {isLayersOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 space-y-2 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-xs font-mono font-bold text-slate-300">
                      <span>ШАРИ КАРТИ</span>
                      <button 
                        onClick={() => setIsLayersOpen(false)}
                        className="p-1 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <label className="flex items-center justify-between text-xs font-mono text-slate-300 cursor-pointer hover:text-white">
                      <span>Загрози (БпЛА/Ракети)</span>
                      <input 
                        type="checkbox" 
                        checked={layersState.threats}
                        onChange={() => toggleLayer('threats')}
                        className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs font-mono text-slate-300 cursor-pointer hover:text-white">
                      <span>Траєкторії підльоту</span>
                      <input 
                        type="checkbox" 
                        checked={layersState.trajectories}
                        onChange={() => toggleLayer('trajectories')}
                        className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs font-mono text-slate-300 cursor-pointer hover:text-white">
                      <span>Рівень ризику (Градиент)</span>
                      <input 
                        type="checkbox" 
                        checked={layersState.risk}
                        onChange={() => toggleLayer('risk')}
                        className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs font-mono text-slate-300 cursor-pointer hover:text-white">
                      <span>Найближчі укриття</span>
                      <input 
                        type="checkbox" 
                        checked={layersState.shelters}
                        onChange={() => toggleLayer('shelters')}
                        className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs font-mono text-slate-300 cursor-pointer hover:text-white">
                      <span>Шкала часу (Timeline)</span>
                      <input 
                        type="checkbox" 
                        checked={layersState.timeline}
                        onChange={() => toggleLayer('timeline')}
                        className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                      />
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Network View Mode Toggle */}
            {workspaceMode === 'NETWORK' && (
              <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setNetworkViewMode('3D_GRAPH')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    networkViewMode === '3D_GRAPH'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  3D Граф
                </button>
                <button
                  onClick={() => setNetworkViewMode('LIST')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    networkViewMode === 'LIST'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Список
                </button>
              </div>
            )}

            {/* LIVE Status Button */}
            <div className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE</span>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
              title={isFullscreen ? 'Згорнути' : 'На весь екран'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

          </div>
        </div>

        {/* Main Workspace Body: 65-75% Left Canvas + 25-35% Right Context Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative min-h-[580px] sm:min-h-[640px]">
          
          {/* =========================================================================
              LEFT STAGE (65-75% on Desktop)
             ========================================================================= */}
          <div className="lg:col-span-8 xl:col-span-9 p-3 sm:p-5 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-slate-800/80">
            
            {/* Safety Mode: 3D Ukraine Map */}
            {workspaceMode === 'SAFETY' && (
              <div className="relative w-full h-full flex flex-col justify-between">
                <div className="relative w-full flex-1 min-h-[460px] sm:min-h-[520px]">
                  <UkraineMap
                    regions={regions}
                    selectedRegionId={activeRegion?.id || null}
                    onSelectRegion={(reg) => onSelectRegion(reg)}
                    showLabels={settings.showLabels}
                    onToggleLabels={() => onUpdateSettings({ showLabels: !settings.showLabels })}
                    myRegionId={myRegionId}
                    is3DMode={settings.viewMode === '3D'}
                    onToggle3DMode={() => onUpdateSettings({ viewMode: settings.viewMode === '3D' ? '2D' : '3D' })}
                  />
                </div>

                {/* Compact Timeline Bar Docked at Bottom of Map */}
                {layersState.timeline && (
                  <div className="mt-2 bg-slate-900/90 rounded-2xl p-2.5 border border-slate-800/80 flex items-center justify-between gap-2 shadow-lg backdrop-blur-md">
                    <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">ХРОНОЛОГІЯ:</span>
                    </div>

                    <div className="flex-1 flex items-center justify-between max-w-md mx-auto gap-2">
                      {timelineSteps.map((step, idx) => {
                        const isSelectedStep = timelineIndex === idx;
                        return (
                          <button
                            key={step}
                            onClick={() => {
                              setTimelineIndex(idx);
                              playWebAudioSound('click');
                            }}
                            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                              isSelectedStep
                                ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-950 scale-105'
                                : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                            }`}
                          >
                            {step === 'LIVE' ? '🔴 LIVE' : step}
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-[10px] font-mono text-emerald-400 font-bold hidden sm:block">
                      +0.0s РЕАЛЬНИЙ ЧАС
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Network Mode: 3D Financial Carousel -> Referral Network (YOU -> L1 -> L2) */}
            {workspaceMode === 'NETWORK' && (
              <div className="relative w-full h-full flex flex-col justify-start p-2 sm:p-4 space-y-4 overflow-y-auto">
                {/* Top Executive 3D Financial Carousel */}
                <div className="w-full shrink-0">
                  <div className="flex items-center justify-between px-2 mb-1">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      3D ФІНАНСОВИЙ ОГЛЯД · БАЛАНС → ЗАРОБІТОК → ВИПЛАТА
                    </span>
                    {onNavigateToFinance && (
                      <button
                        onClick={onNavigateToFinance}
                        className="text-[10px] font-mono text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        Детальна виписка →
                      </button>
                    )}
                  </div>
                  <Financial3DCardCarousel
                    onOpenPayout={onNavigateToFinance}
                  />
                </div>

                {/* Network Ring Header Divider */}
                <div className="flex items-center justify-between px-2 pt-2 border-t border-slate-800/80">
                  <div className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>ДЕРЕВО ПАРТНЕРСЬКОЇ МЕРЕЖІ · YOU → L1 → L2</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Орбітальна 3D структура зв'язків
                  </div>
                </div>

                {networkViewMode === '3D_GRAPH' ? (
                  <div className="relative w-full flex-1 min-h-[460px] flex items-center justify-center overflow-hidden">
                    
                    {/* Concentric Ring Canvas */}
                    <div className="relative w-[340px] sm:w-[440px] md:w-[500px] h-[340px] sm:h-[440px] md:h-[500px] flex items-center justify-center">
                      
                      {/* Outer Orbit (L2 Network Ring) */}
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/25 animate-[spin_60s_linear_infinite]" />
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-purple-800 text-[10px] font-mono font-bold text-purple-300">
                        ОРБІТА L2: 382 ПАРТНЕРИ (20%)
                      </div>

                      {/* Inner Orbit (L1 Direct Ring) */}
                      <div className="absolute inset-16 sm:inset-20 rounded-full border-2 border-dashed border-cyan-500/35 animate-[spin_40s_linear_infinite_reverse]" />
                      <div className="absolute top-18 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-cyan-800 text-[10px] font-mono font-bold text-cyan-300">
                        ОРБІТА L1: 154 ПРЯМИХ (20%)
                      </div>

                      {/* Center Hub: YOU Node */}
                      <div 
                        onClick={() => setSelectedPartnerNode(null)}
                        className="relative z-30 w-24 sm:w-28 h-24 sm:h-28 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 p-1 shadow-[0_0_40px_rgba(245,158,11,0.5)] cursor-pointer flex flex-col items-center justify-center text-slate-950 text-center select-none group"
                      >
                        <Award className="w-5 h-5 text-slate-950" />
                        <span className="font-black text-xs font-mono tracking-tight">YOU</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-950/20 px-1.5 py-0.2 rounded-full mt-0.5">
                          GOLD (20%)
                        </span>
                      </div>

                      {/* Sample Interactive L1 Nodes positioned radially */}
                      {SAMPLE_PARTNER_TREE.slice(0, 6).map((node, index) => {
                        const angle = (index * 360) / 6;
                        const radius = 130;
                        const rad = (angle * Math.PI) / 180;
                        const x = Math.cos(rad) * radius;
                        const y = Math.sin(rad) * radius;

                        const isSelected = selectedPartnerNode?.id === node.id;

                        return (
                          <div
                            key={node.id}
                            onClick={() => {
                              setSelectedPartnerNode(node);
                              playWebAudioSound('click');
                            }}
                            className={`absolute z-20 cursor-pointer p-2 rounded-2xl border transition-all duration-300 flex items-center gap-2 select-none ${
                              isSelected
                                ? 'bg-cyan-500 text-slate-950 border-white shadow-xl scale-110 font-bold'
                                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-cyan-500/40 shadow-md'
                            }`}
                            style={{
                              transform: `translate(${x}px, ${y}px)`,
                            }}
                          >
                            <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-300 flex items-center justify-center text-[10px] font-mono font-bold">
                              L1
                            </div>
                            <div className="text-left font-mono">
                              <div className="text-[10px] font-bold leading-tight truncate max-w-[80px]">
                                {node.name}
                              </div>
                              <div className="text-[8px] text-emerald-400 font-semibold">
                                +{node.l2ChildrenCount || 3} L2
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Sample L2 Outer Nodes */}
                      {[1, 2, 3, 4].map((item, idx) => {
                        const angle = idx * 90 + 45;
                        const radius = 210;
                        const rad = (angle * Math.PI) / 180;
                        const x = Math.cos(rad) * radius;
                        const y = Math.sin(rad) * radius;

                        return (
                          <div
                            key={`l2-cluster-${idx}`}
                            onClick={() => {
                              setSelectedPartnerNode({
                                id: `L2-NODE-${idx}`,
                                name: `Partner Cluster #${idx + 1}`,
                                level: 'L2',
                                joinDate: '2026-09-02',
                                plan: 'PRO 1-Month',
                                planPrice: 200,
                                status: 'ACTIVE',
                                totalEarnedFromNode: 400,
                              });
                              playWebAudioSound('click');
                            }}
                            className="absolute z-10 cursor-pointer p-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-500/40 text-[9px] font-mono shadow-md"
                            style={{
                              transform: `translate(${x}px, ${y}px)`,
                            }}
                          >
                            L2 Кластер ~95
                          </div>
                        );
                      })}

                    </div>

                  </div>
                ) : (
                  /* Accessible Table List View */
                  <div className="w-full flex-1 overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-500">
                          <th className="py-2 px-3">Партнер</th>
                          <th className="py-2 px-3">Рівень</th>
                          <th className="py-2 px-3">Статус</th>
                          <th className="py-2 px-3">Дата</th>
                          <th className="py-2 px-3">Дохід</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {SAMPLE_PARTNER_TREE.map((node) => (
                          <tr 
                            key={node.id}
                            onClick={() => setSelectedPartnerNode(node)}
                            className="hover:bg-slate-900/60 cursor-pointer"
                          >
                            <td className="py-2.5 px-3 font-bold text-white">{node.name}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                                {node.level}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="text-emerald-400 font-bold">{node.status}</span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-400">{node.joinDate}</td>
                            <td className="py-2.5 px-3 text-amber-400 font-bold">₴ {node.totalEarnedFromNode}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Bottom Rank Rule Tagline */}
                <div className="mt-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Ставки винагороди: Starter (5%/0%), Bronze (10/10), Silver (15/15), Gold (20/20), Platinum (25/25)</span>
                  <span className="text-amber-400 font-bold hidden sm:inline">Ранг визначається активними L1</span>
                </div>
              </div>
            )}

          </div>

          {/* =========================================================================
              RIGHT CONTEXT PANEL (25-35% on Desktop)
              One panel that smoothly adapts depending on current selection!
             ========================================================================= */}
          <div className="lg:col-span-4 xl:col-span-3 p-4 sm:p-6 bg-slate-950/90 flex flex-col justify-between">
            
            {/* Context Panel Content: Safety Context vs Network Context */}
            {workspaceMode === 'SAFETY' ? (
              <div className="space-y-4">
                
                {/* Header of Context Panel */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                      ОПЕРАТИВНИЙ КОНТЕКСТ
                    </span>
                    <h4 className="text-lg font-black text-white font-mono tracking-tight mt-0.5">
                      {activeRegion.name}
                    </h4>
                  </div>
                  
                  {activeRegion.id === myRegionId && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold">
                      МІЙ РЕГІОН
                    </span>
                  )}
                </div>

                {/* Threat & Alarm Status Badge */}
                <div className={`p-3 rounded-2xl border flex items-center justify-between ${
                  isAlarm 
                    ? 'bg-rose-950/60 border-rose-800 text-rose-200' 
                    : 'bg-emerald-950/50 border-emerald-800 text-emerald-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className={`w-5 h-5 ${isAlarm ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
                    <div>
                      <div className="text-xs font-mono font-black">
                        {isAlarm ? 'ПОВІТРЯНА ТРИВОГА' : 'БЕЗПЕЧНО · ВІДБІЙ'}
                      </div>
                      <div className="text-[10px] opacity-80">
                        {isAlarm ? `Тривалість: ${activeRegion.durationMinutes} хв` : 'Загроз у повітрі не виявлено'}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold">
                    {isAlarm ? `ETA ~${threatModel.myRegionStatus.etaMinutes}m` : '0 хв'}
                  </span>
                </div>

                {/* Threat Details or Live Vector */}
                {isAlarm && activeRegion.threatDetails && (
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs font-mono">
                    <span className="text-slate-400 block text-[10px]">ОПЕРАТИВНІ ДАНІ:</span>
                    <p className="text-slate-200 leading-relaxed font-sans text-xs">
                      {activeRegion.threatDetails}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                      <span>Джерело: Повітряні Сили ЗСУ</span>
                      <span className="text-emerald-400 font-bold">L4 Live</span>
                    </div>
                  </div>
                )}

                {/* Nearest Verified Shelter */}
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400 flex items-center gap-1 font-bold">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span>НАЙБЛИЖЧЕ УКРИТТЯ</span>
                    </span>
                    <span className="text-emerald-400 font-bold">ДСНС ВЕРИФІКОВАНО</span>
                  </div>

                  <div className="text-xs font-bold text-white font-mono">
                    {threatModel.nearestShelter?.name || 'Станція метро «Золоті Ворота»'}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-1 border-t border-slate-800/80">
                    <span>Відстань: {threatModel.nearestShelter?.distanceMeters || 340} м</span>
                    <span className="font-bold text-cyan-300">~{threatModel.nearestShelter?.walkTimeMins || 4} хв пішки</span>
                  </div>

                  <button
                    onClick={onNavigateToShelters}
                    className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Прокласти маршрут</span>
                  </button>
                </div>

                {/* Regional Attributes */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">НАСЕЛЕННЯ:</span>
                    <span className="text-white font-bold">{(activeRegion.population / 1000).toFixed(0)} тис.</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">РАЙОНІВ:</span>
                    <span className="text-white font-bold">{activeRegion.rayonsCount} районів</span>
                  </div>
                </div>

                {/* Button to set as My Region if not already */}
                {activeRegion.id !== myRegionId && (
                  <button
                    onClick={() => {
                      onSetMyRegion(activeRegion.id);
                      playWebAudioSound('click');
                    }}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Зробити моїм домашнім регіоном</span>
                  </button>
                )}

              </div>
            ) : (
              /* Network Context: Node Inspection / Summary */
              <div className="space-y-4">
                
                {/* Header */}
                <div className="pb-3 border-b border-slate-800">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                    {selectedPartnerNode ? 'ДЕТАЛІ ПАРТНЕРА' : 'ОГЛЯД МЕРЕЖІ'}
                  </span>
                  <h4 className="text-lg font-black text-white font-mono tracking-tight mt-0.5">
                    {selectedPartnerNode ? selectedPartnerNode.name : 'Партнерська мережа'}
                  </h4>
                </div>

                {selectedPartnerNode ? (
                  /* Single Node Details */
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-800/80 space-y-1 text-xs font-mono">
                      <div className="flex justify-between items-center text-slate-400 text-[10px]">
                        <span>РІВЕНЬ:</span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-900 text-white font-bold">
                          {selectedPartnerNode.level}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span>Статус:</span>
                        <span className="text-emerald-400 font-bold">{selectedPartnerNode.status}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span>Підписка:</span>
                        <span className="text-white font-bold">{selectedPartnerNode.plan}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span>Приєднався:</span>
                        <span className="text-slate-400">{selectedPartnerNode.joinDate}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs font-mono">
                      <span className="text-slate-400 block text-[10px]">ВИНАГОРОДА:</span>
                      <div className="text-xl font-black text-amber-400 font-mono">
                        ₴ {selectedPartnerNode.totalEarnedFromNode}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Пряма 20% комісія нарахована у повному обсязі на ваш гаманець.
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedPartnerNode(null)}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs font-mono transition-colors"
                    >
                      ← Повернутись до загального огляду
                    </button>
                  </div>
                ) : (
                  /* Overall Network Summary */
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>Прямі партнери L1:</span>
                        <span className="text-white font-bold">154 активних</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Партнери рівня L2:</span>
                        <span className="text-white font-bold">382 кваліфікованих</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Ранг:</span>
                        <span className="text-amber-400 font-bold">GOLD · 20% / 20%</span>
                      </div>
                      <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-300">
                        <span>До рангу PLATINUM:</span>
                        <span className="text-cyan-300 font-bold">ще 46 L1</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs font-mono">
                      <span className="text-slate-400 block text-[10px]">ДОХІД ЗА ЦЕЙ МІСЯЦЬ:</span>
                      <div className="text-2xl font-black text-emerald-400 font-mono">
                        ₴ 18,560
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        Доступно до миттєвого виводу: <strong>₴ 4,230</strong>
                      </span>
                    </div>

                    <button
                      onClick={onNavigateToFinance}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-950/50 transition-all"
                    >
                      <span>Перейти до виплат (Фінанси)</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* Bottom Panel Help / Sound Check */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>SirenUA Twin v2.0</span>
              <button
                onClick={onTestSiren}
                className="hover:text-cyan-300 flex items-center gap-1 transition-colors"
                title="Перевірити звук сигналу"
              >
                <Volume2 className="w-3 h-3" />
                <span>Тест звуку</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
