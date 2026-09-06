import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { DigitalTwinHero } from './components/DigitalTwinHero';
import { DigitalTwinCockpit } from './components/DigitalTwinCockpit';
import { ThreeDAllGadgetsShowcase } from './components/ThreeDAllGadgetsShowcase';
import { ThreeDWebGLStudio } from './components/ThreeDWebGLStudio';
import { ThreeDSpecModal } from './components/ThreeDSpecModal';
import { UkraineMap } from './components/UkraineMap';
import { SirenaDashboardStats } from './components/SirenaDashboardStats';
import { InteractiveThreatSimulator } from './components/InteractiveThreatSimulator';
import { SheltersSection } from './components/SheltersSection';
import { AlertsFeed } from './components/AlertsFeed';
import { RegionInspectorModal } from './components/RegionInspectorModal';
import { SimulatorModal } from './components/SimulatorModal';
import { EmergencyGuideModal } from './components/EmergencyGuideModal';
import { AudioSettingsBar } from './components/AudioSettingsBar';
import { AffiliateProgram } from './components/AffiliateProgram';
import { INITIAL_REGIONS, INITIAL_ALERTS_FEED } from './data/ukraineMapData';
import { INITIAL_TRAJECTORIES } from './data/spatialThreatData';
import { RegionData, AlertEvent, UserSettings, ThreatType } from './types';
import { 
  startSirenSound, 
  stopSirenSound, 
  playAllClearSound, 
  speakAlertNotification 
} from './utils/sirenAudio';
import { 
  Radio, 
  ShieldAlert, 
  Info, 
  Bell, 
  Volume2, 
  Flame, 
  ExternalLink,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Box,
  Compass,
  Navigation,
  Sparkles,
  Smartphone,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  const [regions, setRegions] = useState<RegionData[]>(() => {
    try {
      const saved = localStorage.getItem('sirenua_regions_state');
      return saved ? JSON.parse(saved) : INITIAL_REGIONS;
    } catch {
      return INITIAL_REGIONS;
    }
  });

  const [alerts, setAlerts] = useState<AlertEvent[]>(() => {
    try {
      const saved = localStorage.getItem('sirenua_alerts_state');
      return saved ? JSON.parse(saved) : INITIAL_ALERTS_FEED;
    } catch {
      return INITIAL_ALERTS_FEED;
    }
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const defaultSettings: UserSettings = {
      myRegion: 'kyiv_city',
      soundEnabled: true,
      volume: 75,
      voiceChime: true,
      vibrateOnMobile: true,
      theme: 'dark',
      showLabels: true,
      showThreatIcons: true,
      show3DDepth: true,
      showTrajectories: true,
      showRadarBeams: true,
      viewMode: '3D',
      autoRefreshInterval: 5,
    };
    try {
      const saved = localStorage.getItem('sirenua_user_settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [activeNavTab, setActiveNavTab] = useState<'COCKPIT' | 'WEBGL_3D' | 'MAP' | 'ECOSYSTEM' | 'SIMULATOR' | 'SHELTERS' | 'AFFILIATE'>('COCKPIT');
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [bannerAlert, setBannerAlert] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('sirenua_regions_state', JSON.stringify(regions));
    } catch {
      // ignore
    }
  }, [regions]);

  useEffect(() => {
    try {
      localStorage.setItem('sirenua_alerts_state', JSON.stringify(alerts));
    } catch {
      // ignore
    }
  }, [alerts]);

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('sirenua_user_settings', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Timer to increment duration of active alarms
  useEffect(() => {
    const interval = setInterval(() => {
      setRegions((prev) =>
        prev.map((r) => {
          if (r.isAlarm && r.startedAt) {
            const diffMins = Math.max(
              1,
              Math.floor((Date.now() - new Date(r.startedAt).getTime()) / (1000 * 60))
            );
            return { ...r, durationMinutes: diffMins };
          }
          return r;
        })
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle Siren Toggle
  const handleToggleTestSiren = () => {
    if (isSirenPlaying) {
      stopSirenSound();
      setIsSirenPlaying(false);
    } else {
      startSirenSound(settings.volume);
      setIsSirenPlaying(true);
      if (settings.voiceChime) {
        speakAlertNotification('Увага! Повітряна тривога! Пройдіть в укриття!');
      }
    }
  };

  const handlePlayAllClear = () => {
    if (isSirenPlaying) {
      stopSirenSound();
      setIsSirenPlaying(false);
    }
    playAllClearSound(settings.volume);
    if (settings.voiceChime) {
      speakAlertNotification('Відбій повітряної тривоги!');
    }
    setBannerAlert('🟢 Відбій загрози. Звуковий сигнал відбою активовано.');
    setTimeout(() => setBannerAlert(null), 4000);
  };

  // Check if user's region status changes
  const prevMyRegionAlarmRef = useRef<boolean>(
    regions.find((r) => r.id === settings.myRegion)?.isAlarm || false
  );

  useEffect(() => {
    const currentMyRegion = regions.find((r) => r.id === settings.myRegion);
    const isNowAlarm = currentMyRegion?.isAlarm || false;

    if (prevMyRegionAlarmRef.current !== isNowAlarm) {
      if (isNowAlarm) {
        if (settings.soundEnabled) {
          startSirenSound(settings.volume);
          setIsSirenPlaying(true);
        }
        if (settings.voiceChime) {
          speakAlertNotification(`Увага! Повітряна тривога у ${currentMyRegion?.name}! Пройдіть в укриття!`);
        }
        setBannerAlert(`🚨 УВАГА! Повітряна тривога у вашому регіоні: ${currentMyRegion?.name}!`);
      } else {
        if (isSirenPlaying) {
          stopSirenSound();
          setIsSirenPlaying(false);
        }
        if (settings.soundEnabled) {
          playAllClearSound(settings.volume);
        }
        if (settings.voiceChime) {
          speakAlertNotification(`Відбій повітряної тривоги у ${currentMyRegion?.name}`);
        }
        setBannerAlert(`🟢 Відбій повітряної тривоги: ${currentMyRegion?.name}`);
      }
      prevMyRegionAlarmRef.current = isNowAlarm;
    }
  }, [regions, settings.myRegion, settings.soundEnabled, settings.voiceChime, settings.volume, isSirenPlaying]);

  // Apply predefined simulation scenario
  const handleApplyScenario = (
    scenario: 'massive_drone' | 'ballistic_all' | 'eastern_front' | 'all_clear' | 'central_ukraine'
  ) => {
    const nowIso = new Date().toISOString();

    if (scenario === 'all_clear') {
      setRegions((prev) =>
        prev.map((r) => ({
          ...r,
          isAlarm: false,
          threatType: 'none',
          startedAt: null,
          durationMinutes: 0,
          threatDetails: undefined,
        }))
      );

      const clearEvent: AlertEvent = {
        id: `evt-${Date.now()}`,
        regionId: 'all',
        regionName: 'Вся Україна',
        type: 'end',
        threatType: 'none',
        timestamp: nowIso,
        description: '🟢 Повний відбій загрози по всій території України. Небезпека минула.',
        source: 'Повітряні Сили ЗСУ',
      };
      setAlerts((prev) => [clearEvent, ...prev.slice(0, 30)]);
      handlePlayAllClear();
      return;
    }

    if (scenario === 'ballistic_all') {
      setRegions((prev) =>
        prev.map((r) => ({
          ...r,
          isAlarm: true,
          threatType: 'ballistic',
          startedAt: nowIso,
          durationMinutes: 1,
          threatDetails: 'Масована ракетна та балістична небезпека по всій країні!',
        }))
      );

      const ballisticEvent: AlertEvent = {
        id: `evt-${Date.now()}`,
        regionId: 'all',
        regionName: 'Вся Україна',
        type: 'start',
        threatType: 'ballistic',
        timestamp: nowIso,
        description: '🔴 УВАГА! Масований пуск балістичних ракет! Терміново пройдіть в укриття!',
        source: 'Повітряні Сили ЗСУ',
      };
      setAlerts((prev) => [ballisticEvent, ...prev.slice(0, 30)]);
      if (settings.soundEnabled && !isSirenPlaying) {
        startSirenSound(settings.volume);
        setIsSirenPlaying(true);
      }
      return;
    }

    if (scenario === 'massive_drone') {
      const droneIds = [
        'kyiv_obl',
        'kyiv_city',
        'chernihiv',
        'sumy',
        'poltava',
        'cherkasy',
        'zhytomyr',
        'vinnytsia',
        'odesa',
        'mykolaiv',
      ];
      setRegions((prev) =>
        prev.map((r) => {
          if (droneIds.includes(r.id)) {
            return {
              ...r,
              isAlarm: true,
              threatType: 'drone',
              startedAt: nowIso,
              durationMinutes: 5,
              threatDetails: 'Групи ударних БпЛА типу Shahed рухаються курсом на захід',
            };
          }
          return {
            ...r,
            isAlarm: false,
            threatType: 'none',
            startedAt: null,
            durationMinutes: 0,
            threatDetails: undefined,
          };
        })
      );

      const droneEvent: AlertEvent = {
        id: `evt-${Date.now()}`,
        regionId: 'kyiv_obl',
        regionName: 'Північ та Центр України',
        type: 'start',
        threatType: 'drone',
        timestamp: nowIso,
        description: '🔴 Масована атака ударних БпЛА. Працюють підрозділи ППО та мобільні вогневі групи.',
        source: 'Повітряні Сили ЗСУ',
      };
      setAlerts((prev) => [droneEvent, ...prev.slice(0, 30)]);
      return;
    }

    if (scenario === 'eastern_front') {
      const eastIds = ['kharkiv', 'sumy', 'dnipro', 'zaporizhzhia', 'donetsk', 'luhansk', 'kherson'];
      setRegions((prev) =>
        prev.map((r) => {
          if (eastIds.includes(r.id)) {
            return {
              ...r,
              isAlarm: true,
              threatType: r.id === 'kharkiv' ? 'ballistic' : r.id === 'donetsk' ? 'artillery' : 'aviation',
              startedAt: nowIso,
              durationMinutes: 12,
              threatDetails: 'Загроза тактичної авіації, КАБів та артобстрілів вздовж фронту',
            };
          }
          return {
            ...r,
            isAlarm: false,
            threatType: 'none',
            startedAt: null,
            durationMinutes: 0,
            threatDetails: undefined,
          };
        })
      );
    }
  };

  // Toggle single region
  const handleToggleRegionAlarm = (regionId: string, threatType?: ThreatType) => {
    setRegions((prev) =>
      prev.map((r) => {
        if (r.id === regionId) {
          const nextAlarm = !r.isAlarm;
          const nextThreat = nextAlarm ? (threatType || 'air') : 'none';
          const nowIso = new Date().toISOString();

          const newEvt: AlertEvent = {
            id: `evt-${Date.now()}-${r.id}`,
            regionId: r.id,
            regionName: r.name,
            type: nextAlarm ? 'start' : 'end',
            threatType: nextThreat,
            timestamp: nowIso,
            description: nextAlarm
              ? `🔴 Оголошено повітряну тривогу в ${r.name}. Пройдіть в укриття!`
              : `🟢 Відбій повітряної тривоги в ${r.name}. Небезпека минула.`,
            source: 'Оперативне чергування SirenUA',
          };
          setAlerts((al) => [newEvt, ...al.slice(0, 30)]);

          return {
            ...r,
            isAlarm: nextAlarm,
            threatType: nextThreat,
            startedAt: nextAlarm ? nowIso : null,
            durationMinutes: nextAlarm ? 1 : 0,
            threatDetails: nextAlarm ? 'Повітряна тривога оголошена черговим' : undefined,
          };
        }
        return r;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header */}
      <Header
        regions={regions}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenSpecModal={() => setIsSpecModalOpen(true)}
        onSelectMyRegion={(id) => handleUpdateSettings({ myRegion: id })}
        isSirenPlaying={isSirenPlaying}
        onToggleTestSiren={handleToggleTestSiren}
        activeNavTab={activeNavTab}
        onSelectNavTab={setActiveNavTab}
      />

      {/* Dynamic Alert Banner */}
      {bannerAlert && (
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white px-4 py-2.5 shadow-xl text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          <span>{bannerAlert}</span>
          <button
            onClick={() => setBannerAlert(null)}
            className="ml-3 p-1 rounded hover:bg-black/20 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        
        {/* Tab 1: Flagship 3D Digital Twin & Cockpit */}
        {activeNavTab === 'COCKPIT' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Hero Section with 3D Holographic Layer Stack & Earnings Focus */}
            <DigitalTwinHero
              regions={regions}
              trajectories={INITIAL_TRAJECTORIES}
              settings={settings}
              onOpenCockpit={() => {
                const cockpitElem = document.getElementById('cockpit-view');
                cockpitElem?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenMap={() => setActiveNavTab('MAP')}
              onOpenSimulator={() => setActiveNavTab('SIMULATOR')}
              onOpenShelters={() => setActiveNavTab('SHELTERS')}
              onOpenSpecModal={() => setIsSpecModalOpen(true)}
              onOpenAffiliate={() => setActiveNavTab('AFFILIATE')}
              onOpenWebGL3D={() => setActiveNavTab('WEBGL_3D')}
            />

            {/* Curved Command Cockpit HUD */}
            <div id="cockpit-view">
              <DigitalTwinCockpit
                regions={regions}
                trajectories={INITIAL_TRAJECTORIES}
                settings={settings}
                onSelectRegion={(reg) => setSelectedRegion(reg)}
                onNavigateToSimulator={() => setActiveNavTab('SIMULATOR')}
                onNavigateToShelters={() => setActiveNavTab('SHELTERS')}
                onNavigateToWebGL3D={() => setActiveNavTab('WEBGL_3D')}
              />
            </div>

            {/* Key Live Metrics & Active Feeds below Cockpit */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8">
                <SirenaDashboardStats
                  regions={regions}
                  myRegionId={settings.myRegion}
                  onSelectRegion={(reg) => setSelectedRegion(reg)}
                  isSirenPlaying={isSirenPlaying}
                  onToggleSiren={handleToggleTestSiren}
                  onOpenSimulator={() => setIsSimulatorOpen(true)}
                />
              </div>
              <div className="lg:col-span-4">
                <AlertsFeed
                  alerts={alerts}
                  onSelectRegionById={(id) => {
                    const reg = regions.find((r) => r.id === id);
                    if (reg) setSelectedRegion(reg);
                  }}
                />
              </div>
            </div>

            {/* 3D Multi-Device & All 9 Gadgets Live 3D Showcase */}
            <div id="all-gadgets-3d-ecosystem">
              <ThreeDAllGadgetsShowcase
                regions={regions}
                trajectories={INITIAL_TRAJECTORIES}
                settings={settings}
                onNavigateToMap={() => setActiveNavTab('MAP')}
                onNavigateToSimulator={() => setActiveNavTab('SIMULATOR')}
                onNavigateToShelters={() => setActiveNavTab('SHELTERS')}
                onNavigateToWebGL={() => setActiveNavTab('WEBGL_3D')}
              />
            </div>
          </div>
        )}

        {/* Tab: Real WebGL 3D Airspace Studio (Three.js) */}
        {activeNavTab === 'WEBGL_3D' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ThreeDWebGLStudio
              regions={regions}
              onSelectRegion={(reg) => setSelectedRegion(reg)}
              myRegionId={settings.myRegion}
              onNavigateToShelters={() => setActiveNavTab('SHELTERS')}
              onNavigateToSimulator={() => setActiveNavTab('SIMULATOR')}
            />

            {/* Quick Live Stats & Alerts under 3D WebGL Studio */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8">
                <SirenaDashboardStats
                  regions={regions}
                  myRegionId={settings.myRegion}
                  onSelectRegion={(reg) => setSelectedRegion(reg)}
                  isSirenPlaying={isSirenPlaying}
                  onToggleSiren={handleToggleTestSiren}
                  onOpenSimulator={() => setIsSimulatorOpen(true)}
                />
              </div>
              <div className="lg:col-span-4">
                <AlertsFeed
                  alerts={alerts}
                  onSelectRegionById={(id) => {
                    const reg = regions.find((r) => r.id === id);
                    if (reg) setSelectedRegion(reg);
                  }}
                />
              </div>
            </div>

            {/* 3D Gadgets Showcase at bottom of 3D Studio */}
            <ThreeDAllGadgetsShowcase
              regions={regions}
              trajectories={INITIAL_TRAJECTORIES}
              settings={settings}
              onNavigateToMap={() => setActiveNavTab('MAP')}
              onNavigateToSimulator={() => setActiveNavTab('SIMULATOR')}
              onNavigateToShelters={() => setActiveNavTab('SHELTERS')}
            />
          </div>
        )}

        {/* Tab 2: 3D Isometric / 2D Tactical Map View */}
        {activeNavTab === 'MAP' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left / Center: Interactive 3D/2D Map */}
              <div className="lg:col-span-8 space-y-4">
                <UkraineMap
                  regions={regions}
                  selectedRegionId={selectedRegion?.id || null}
                  onSelectRegion={(reg) => setSelectedRegion(reg)}
                  showLabels={settings.showLabels}
                  onToggleLabels={() => handleUpdateSettings({ showLabels: !settings.showLabels })}
                  myRegionId={settings.myRegion}
                  is3DMode={settings.viewMode === '3D'}
                  onToggle3DMode={() => handleUpdateSettings({ viewMode: settings.viewMode === '3D' ? '2D' : '3D' })}
                  onNavigateToWebGL3D={() => setActiveNavTab('WEBGL_3D')}
                />

                {/* Audio Settings Bar below Map */}
                <AudioSettingsBar
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  isSirenPlaying={isSirenPlaying}
                  onToggleTestSiren={handleToggleTestSiren}
                  onPlayAllClear={handlePlayAllClear}
                />
              </div>

              {/* Right: Live Alerts Stream */}
              <div className="lg:col-span-4">
                <AlertsFeed
                  alerts={alerts}
                  onSelectRegionById={(id) => {
                    const reg = regions.find((r) => r.id === id);
                    if (reg) setSelectedRegion(reg);
                  }}
                />
              </div>
            </div>

            {/* 3D Gadgets Showcase at bottom of Map */}
            <ThreeDAllGadgetsShowcase
              regions={regions}
              trajectories={INITIAL_TRAJECTORIES}
              settings={settings}
              onNavigateToMap={() => setActiveNavTab('MAP')}
              onNavigateToSimulator={() => setActiveNavTab('SIMULATOR')}
              onNavigateToShelters={() => setActiveNavTab('SHELTERS')}
              onNavigateToWebGL={() => setActiveNavTab('WEBGL_3D')}
            />
          </div>
        )}

        {/* Tab 3: 3D Multi-Device Ecosystem */}
        {activeNavTab === 'ECOSYSTEM' && (
          <div className="animate-in fade-in duration-200 space-y-6">
            <ThreeDAllGadgetsShowcase
              regions={regions}
              trajectories={INITIAL_TRAJECTORIES}
              settings={settings}
              onNavigateToMap={() => setActiveNavTab('MAP')}
              onNavigateToSimulator={() => setActiveNavTab('SIMULATOR')}
              onNavigateToShelters={() => setActiveNavTab('SHELTERS')}
              onNavigateToWebGL={() => setActiveNavTab('WEBGL_3D')}
            />
          </div>
        )}

        {/* Tab 4: 7-Step Interactive Threat Simulator */}
        {activeNavTab === 'SIMULATOR' && (
          <div className="animate-in fade-in duration-200 space-y-6">
            <InteractiveThreatSimulator
              onNavigateToShelters={() => setActiveNavTab('SHELTERS')}
            />
            <ThreeDAllGadgetsShowcase
              regions={regions}
              trajectories={INITIAL_TRAJECTORIES}
              settings={settings}
              onNavigateToMap={() => setActiveNavTab('MAP')}
              onNavigateToSimulator={() => setActiveNavTab('SIMULATOR')}
              onNavigateToShelters={() => setActiveNavTab('SHELTERS')}
              onNavigateToWebGL={() => setActiveNavTab('WEBGL_3D')}
            />
          </div>
        )}

        {/* Tab 5: Shelters & Tactical Routing */}
        {activeNavTab === 'SHELTERS' && (
          <div className="animate-in fade-in duration-200 space-y-6">
            <SheltersSection
              myRegionId={settings.myRegion}
              regions={regions}
            />
            <ThreeDAllGadgetsShowcase
              regions={regions}
              trajectories={INITIAL_TRAJECTORIES}
              settings={settings}
              onNavigateToMap={() => setActiveNavTab('MAP')}
              onNavigateToSimulator={() => setActiveNavTab('SIMULATOR')}
              onNavigateToShelters={() => setActiveNavTab('SHELTERS')}
              onNavigateToWebGL={() => setActiveNavTab('WEBGL_3D')}
            />
          </div>
        )}

        {/* Tab 6: 2-Level Partner / Affiliate Program L1 & L2 */}
        {activeNavTab === 'AFFILIATE' && (
          <div className="animate-in fade-in duration-200 space-y-6">
            <AffiliateProgram
              onOpenMap={() => setActiveNavTab('MAP')}
              onOpenSimulator={() => setActiveNavTab('SIMULATOR')}
            />
            <ThreeDAllGadgetsShowcase
              regions={regions}
              trajectories={INITIAL_TRAJECTORIES}
              settings={settings}
              onNavigateToMap={() => setActiveNavTab('MAP')}
              onNavigateToSimulator={() => setActiveNavTab('SIMULATOR')}
              onNavigateToShelters={() => setActiveNavTab('SHELTERS')}
              onNavigateToWebGL={() => setActiveNavTab('WEBGL_3D')}
            />
          </div>
        )}

      </main>

      {/* Region Inspector Drill-down Modal */}
      <RegionInspectorModal
        region={selectedRegion}
        onClose={() => setSelectedRegion(null)}
        onSetMyRegion={(id) => handleUpdateSettings({ myRegion: id })}
        isMyRegion={selectedRegion?.id === settings.myRegion}
        onTestSiren={handleToggleTestSiren}
        isSirenPlaying={isSirenPlaying}
      />

      {/* Threat Simulator Drawer / Modal */}
      <SimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        regions={regions}
        onApplyScenario={handleApplyScenario}
        onToggleRegionAlarm={handleToggleRegionAlarm}
      />

      {/* Emergency & DSNS Guide Modal */}
      <EmergencyGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* 3D Specification Modal */}
      <ThreeDSpecModal
        isOpen={isSpecModalOpen}
        onClose={() => setIsSpecModalOpen(false)}
      />

      {/* Mobile Sticky Quick-Dock Bar (For smooth touch navigation on smartphones & tablets) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => {
            setActiveNavTab('COCKPIT');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center p-1.5 rounded-xl text-[10px] font-bold transition-all ${
            activeNavTab === 'COCKPIT' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'
          }`}
        >
          <Radio className="w-4 h-4 mb-0.5" />
          <span>Головна</span>
        </button>

        <button
          onClick={() => {
            setActiveNavTab('WEBGL_3D');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center p-1.5 rounded-xl text-[10px] font-bold transition-all ${
            activeNavTab === 'WEBGL_3D' ? 'text-cyan-300 bg-cyan-500/20' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5 text-cyan-300" />
          <span>3D Студія</span>
        </button>

        <button
          onClick={() => {
            setActiveNavTab('MAP');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center p-1.5 rounded-xl text-[10px] font-bold transition-all ${
            activeNavTab === 'MAP' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'
          }`}
        >
          <Box className="w-4 h-4 mb-0.5" />
          <span>Карта</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('all-gadgets-3d-showcase');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              setActiveNavTab('ECOSYSTEM');
            }
          }}
          className="flex flex-col items-center p-1.5 rounded-xl text-[10px] font-bold text-purple-300 transition-all hover:bg-purple-500/10"
        >
          <Smartphone className="w-4 h-4 mb-0.5 text-purple-400 animate-pulse" />
          <span>3D Гаджети</span>
        </button>

        <button
          onClick={() => {
            setActiveNavTab('SIMULATOR');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center p-1.5 rounded-xl text-[10px] font-bold transition-all ${
            activeNavTab === 'SIMULATOR' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
          }`}
        >
          <Zap className="w-4 h-4 mb-0.5" />
          <span>Симулятор</span>
        </button>

        <button
          onClick={() => {
            setActiveNavTab('SHELTERS');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center p-1.5 rounded-xl text-[10px] font-bold transition-all ${
            activeNavTab === 'SHELTERS' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          <ShieldCheck className="w-4 h-4 mb-0.5" />
          <span>Укриття</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 mt-12 py-6 pb-20 lg:pb-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">SirenUA</span>
            <span>•</span>
            <span>Живий Digital Twin та система просторового моніторингу України</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveNavTab('COCKPIT')}
              className="hover:text-cyan-400 transition-colors"
            >
              Digital Twin
            </button>
            <button
              onClick={() => setActiveNavTab('MAP')}
              className="hover:text-cyan-400 transition-colors"
            >
              Карта
            </button>
            <button
              onClick={() => setActiveNavTab('ECOSYSTEM')}
              className="hover:text-purple-400 transition-colors"
            >
              Екосистема
            </button>
            <button
              onClick={() => setActiveNavTab('SIMULATOR')}
              className="hover:text-amber-400 transition-colors"
            >
              7-Кроковий Симулятор
            </button>
            <button
              onClick={() => setActiveNavTab('SHELTERS')}
              className="hover:text-emerald-400 transition-colors"
            >
              Укриття
            </button>
            <button
              onClick={() => setActiveNavTab('AFFILIATE')}
              className="hover:text-amber-300 font-semibold transition-colors"
            >
              Партнерам (L1/L2)
            </button>
            <button
              onClick={() => setIsSpecModalOpen(true)}
              className="hover:text-cyan-400 transition-colors"
            >
              ТЗ 3D
            </button>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              Пам'ятка ДСНС
            </button>
            <a
              href="https://t.me/kpszsu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
            >
              Повітряні Сили ЗСУ <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}
