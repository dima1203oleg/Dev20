import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { SmartMetricRail } from './components/SmartMetricRail';
import { CentralWorkspace } from './components/CentralWorkspace';
import { SmartContextPanel } from './components/SmartContextPanel';
import { FinanceSection } from './components/FinanceSection';
import { ProfileSection } from './components/ProfileSection';
import { AffiliateProgram } from './components/AffiliateProgram';
import { SirenOrbitalDeviceEcosystem } from './components/orbital/SirenOrbitalDeviceEcosystem';
import { RegionInspectorModal } from './components/RegionInspectorModal';
import { SimulatorModal } from './components/SimulatorModal';
import { EmergencyGuideModal } from './components/EmergencyGuideModal';
import { SheltersSection } from './components/SheltersSection';

import { INITIAL_REGIONS, INITIAL_ALERTS_FEED } from './data/ukraineMapData';
import { INITIAL_TRAJECTORIES } from './data/spatialThreatData';
import { 
  RegionData, 
  AlertEvent, 
  UserSettings, 
  ThreatType, 
  ThreatSceneModel,
  DashboardSection 
} from './types';
import { 
  startSirenSound, 
  stopSirenSound, 
  playAllClearSound, 
  speakAlertNotification 
} from './utils/sirenAudio';
import { 
  AlertTriangle, 
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Navigation,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function App() {
  // Navigation: HOME | NETWORK | FINANCE | PROFILE
  const [activeSection, setActiveSection] = useState<DashboardSection>('HOME');

  // Regions & Alert Data
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
      volume: 0.75,
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

  // Active selections & Modals
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isSheltersModalOpen, setIsSheltersModalOpen] = useState(false);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [bannerAlert, setBannerAlert] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Sync to LocalStorage
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

  // Timer for active alarms duration
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

  // Siren Controls
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

  // My Region alarm notification check
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
        setBannerAlert(`🟢 Відбій тривоги у ${currentMyRegion?.name}. Загроза минула.`);
        setTimeout(() => setBannerAlert(null), 5000);
      }
      prevMyRegionAlarmRef.current = isNowAlarm;
    }
  }, [regions, settings.myRegion, settings.soundEnabled, settings.volume, settings.voiceChime, isSirenPlaying]);

  // Apply Simulation Scenarios
  const handleApplyScenario = (scenario: string) => {
    const nowIso = new Date().toISOString();

    if (scenario === 'clear_all') {
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

  // Build ThreatSceneModel for components
  const myRegionObj = regions.find((r) => r.id === settings.myRegion);
  const activeAlarmsCount = regions.filter((r) => r.isAlarm).length;

  const threatSceneModel: ThreatSceneModel = {
    timestamp: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    freshness: 'REALTIME',
    dataMode: isDemoMode ? 'DEMO_DATA' : 'LIVE',
    activeAlarmsCount,
    criticalRegions: regions.filter((r) => r.isAlarm && r.threatType === 'ballistic').map((r) => r.id),
    primaryThreat: INITIAL_TRAJECTORIES[0] || null,
    nearestShelter: {
      id: 'sh-1',
      name: 'Станція метро «Золоті Ворота»',
      type: 'metro',
      address: 'вул. Володимирська, 44',
      regionId: settings.myRegion,
      capacity: 2500,
      features: {
        powerGenerator: true,
        wifi: true,
        ventilation: true,
        waterSupply: true,
        wheelchairAccessible: true,
        allDayOpen: true,
      },
      distanceMeters: 340,
      walkTimeMins: 4,
      verifiedStatus: 'VERIFIED_DSNS',
    },
    myRegionStatus: {
      id: settings.myRegion,
      name: myRegionObj?.name || 'м. Київ',
      isAlarm: myRegionObj?.isAlarm || false,
      etaMinutes: 18,
      riskLevel: myRegionObj?.isAlarm ? 'HIGH' : 'LOW',
    },
    partnerModeActive: activeSection === 'NETWORK' || activeSection === 'FINANCE',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. Header (Minimal 4 tabs on desktop / bottom nav on mobile) */}
      <Header
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        regions={regions}
        myRegionName={myRegionObj?.name}
      />

      {/* 2. Critical Alert Banner (Appears when active threat or siren) */}
      {bannerAlert && (
        <div className="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 text-white px-4 py-2.5 shadow-xl text-center text-xs sm:text-sm font-mono font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300 z-40">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          <span>{bannerAlert}</span>
          <button
            onClick={() => setBannerAlert(null)}
            className="ml-3 px-2 py-0.5 rounded bg-black/20 hover:bg-black/40 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. Main Body */}
      <main className="flex-1 pb-16 md:pb-8">
        
        {/* =========================================================================
            SECTION 1: HOME (Головна)
            Layout:
            - SmartMetricRail (KPI carousel)
            - CentralWorkspace (СИТУАЦІЯ vs МОЯ МЕРЕЖА)
            - SmartContextPanel
            - 3D Device Ecosystem (Single bottom instance with full 3D volumetric models)
           ========================================================================= */}
        {activeSection === 'HOME' && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
            
            {/* Smart KPI Rail Carousel */}
            <SmartMetricRail
              threatModel={threatSceneModel}
              availableBalance={4230}
              monthlyEarnings={18560}
              totalL1={154}
              totalL2={382}
              currentRankName="GOLD"
              onNavigateToFinance={() => setActiveSection('FINANCE')}
              onNavigateToNetwork={() => setActiveSection('NETWORK')}
              onNavigateToShelters={() => setIsSheltersModalOpen(true)}
            />

            {/* Central Workspace (The Core Crown Jewel) */}
            <CentralWorkspace
              regions={regions}
              selectedRegion={selectedRegion}
              onSelectRegion={(reg) => setSelectedRegion(reg)}
              myRegionId={settings.myRegion}
              onSetMyRegion={(id) => handleUpdateSettings({ myRegion: id })}
              threatModel={threatSceneModel}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onNavigateToShelters={() => setIsSheltersModalOpen(true)}
              onNavigateToFinance={() => setActiveSection('FINANCE')}
              onTestSiren={handleToggleTestSiren}
            />

            {/* Smart Context Horizontal Strip */}
            <SmartContextPanel
              threatModel={threatSceneModel}
              onNavigateToShelters={() => setIsSheltersModalOpen(true)}
              onNavigateToFinance={() => setActiveSection('FINANCE')}
              onNavigateToNetwork={() => setActiveSection('NETWORK')}
            />

            {/* Signature SIREN 3D Orbital Device Ecosystem (Only one instance, positioned at bottom) */}
            <div id="orbital-device-ecosystem-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <SirenOrbitalDeviceEcosystem
                threatModel={threatSceneModel}
                onNavigateToTab={(tabId) => {
                  if (tabId === 'shelters') setIsSheltersModalOpen(true);
                  if (tabId === 'simulator') setIsSimulatorOpen(true);
                }}
                isCriticalAlert={isSirenPlaying}
              />
            </div>

            {/* Quick Emergency DSNS Guide Launcher Strip */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-white font-bold block">Офіційний довідник правил безпеки ДСНС</span>
                    <span className="text-slate-400 text-[11px]">Що робити при ракетному обстрілі, атаці БпЛА або загрозі балістики</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs font-mono transition-colors"
                >
                  Відкрити пам'ятку дій
                </button>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            SECTION 2: NETWORK (Мережа)
            Full dedicated 2-Level partner system & referral analytics
           ========================================================================= */}
        {activeSection === 'NETWORK' && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-in fade-in duration-200">
            <AffiliateProgram
              onOpenMap={() => setActiveSection('HOME')}
              onOpenSimulator={() => setIsSimulatorOpen(true)}
            />
          </div>
        )}

        {/* =========================================================================
            SECTION 3: FINANCE (Фінанси)
            Dedicated balance, payouts (min $10 ~ ₴415), transaction ledger
           ========================================================================= */}
        {activeSection === 'FINANCE' && (
          <div className="animate-in fade-in duration-200">
            <FinanceSection
              availableBalance={4230}
              pendingBalance={1450}
              lifetimeEarnings={18560}
              onNavigateToHome={() => setActiveSection('HOME')}
            />
          </div>
        )}

        {/* =========================================================================
            SECTION 4: PROFILE (Профіль)
            Ambassador ranking (Starter -> Platinum), Top-100, Achievements, Audio test
           ========================================================================= */}
        {activeSection === 'PROFILE' && (
          <div className="animate-in fade-in duration-200">
            <ProfileSection
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              isSirenPlaying={isSirenPlaying}
              onToggleTestSiren={handleToggleTestSiren}
              onOpenGuide={() => setIsGuideOpen(true)}
              isDemoMode={isDemoMode}
              onToggleDemoMode={() => {
                setIsDemoMode(!isDemoMode);
                if (!isDemoMode) {
                  handleApplyScenario('massive_drone');
                } else {
                  handleApplyScenario('clear_all');
                }
              }}
            />
          </div>
        )}

      </main>

      {/* =========================================================================
          MODALS & DRAWERS
         ========================================================================= */}
      
      {/* Shelters Modal if opened via quick route */}
      {isSheltersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border-2 border-slate-800 shadow-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black text-white font-mono">Карта укриттів та безпечні маршрути</h3>
              </div>
              <button
                onClick={() => setIsSheltersModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <SheltersSection
              myRegionId={settings.myRegion}
              regions={regions}
            />
          </div>
        </div>
      )}

      {/* Region Inspector Drill-down Modal (if explicitly requested) */}
      {selectedRegion && (
        <RegionInspectorModal
          region={selectedRegion}
          onClose={() => setSelectedRegion(null)}
          onSetMyRegion={(id) => handleUpdateSettings({ myRegion: id })}
          isMyRegion={selectedRegion?.id === settings.myRegion}
          onTestSiren={handleToggleTestSiren}
          isSirenPlaying={isSirenPlaying}
        />
      )}

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

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 mt-10 py-6 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">SirenUA DEV20 v2</span>
            <span>•</span>
            <span>Digital Twin просторової безпеки та партнерська мережа України</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <button
              onClick={() => {
                setActiveSection('HOME');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-cyan-400 transition-colors"
            >
              Головна
            </button>
            <button
              onClick={() => {
                setActiveSection('NETWORK');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-purple-400 transition-colors"
            >
              Мережа
            </button>
            <button
              onClick={() => {
                setActiveSection('FINANCE');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-emerald-400 transition-colors"
            >
              Фінанси
            </button>
            <button
              onClick={() => {
                setActiveSection('PROFILE');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-amber-400 transition-colors"
            >
              Профіль
            </button>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-amber-300 transition-colors"
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
