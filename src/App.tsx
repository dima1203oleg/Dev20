import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SmartMetricRail } from './components/SmartMetricRail';
import { CentralWorkspace } from './components/CentralWorkspace';
import { Financial3DCardCarousel } from './components/finance/Financial3DCardCarousel';
import { SirenOrbitalDeviceEcosystem } from './components/orbital/SirenOrbitalDeviceEcosystem';
import { FinanceSection } from './components/FinanceSection';
import { ProfileSection } from './components/ProfileSection';
import { AffiliateProgram } from './components/AffiliateProgram';
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
import { AlertTriangle, ShieldCheck } from 'lucide-react';

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
      myRegion: 'odesa',
      soundEnabled: true,
      volume: 0.75,
      voiceChime: true,
      vibrateOnMobile: true,
      theme: 'light',
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

  const myRegionObj = regions.find((r) => r.id === settings.myRegion) || {
    id: 'odesa',
    name: 'Одеська область',
    isAlarm: false,
    threatType: 'none',
  };

  const activeAlarmsCount = regions.filter((r) => r.isAlarm).length;

  const threatSceneModel: ThreatSceneModel = {
    timestamp: '22:14',
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
      name: myRegionObj.name || 'Одеська область',
      isAlarm: myRegionObj.isAlarm || false,
      etaMinutes: 18,
      riskLevel: myRegionObj.isAlarm ? 'HIGH' : 'LOW',
    },
    partnerModeActive: activeSection === 'NETWORK' || activeSection === 'FINANCE',
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. Header (Головна, Мережа, Фінанси, Профіль) */}
      <Header
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        regions={regions}
        myRegionName={myRegionObj.name}
      />

      {/* 2. Critical Alert Banner if Active */}
      {bannerAlert && (
        <div className="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 text-white px-4 py-2 shadow-md text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300 z-40">
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
      <main className="flex-1 pb-16 md:pb-10 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        
        {/* =========================================================================
            SECTION 1: HOME (Головна) - 1:1 Matching the uploaded design
            - HeroSection (Headline, 3D Ukraine Map, 3 Threats badge)
            - SmartMetricRail (Мій регіон, Стан, Оновлено, Активні події)
            - Middle Grid (Left: Фінансова інформація / Right: Ситуація workspace)
            - SirenOrbitalDeviceEcosystem (Bottom Device Orbit)
           ========================================================================= */}
        {activeSection === 'HOME' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            {/* Top Hero Section */}
            <HeroSection
              onOpenMap={() => setSelectedRegion(regions.find(r => r.id === 'kyiv_obl') || null)}
              onOpenGuide={() => setIsGuideOpen(true)}
              onOpenThreats={() => setIsSimulatorOpen(true)}
              activeThreatsCount={3}
            />

            {/* 4 Quick Metric Cards: Мій регіон | Стан | Оновлено | Активні події */}
            <SmartMetricRail
              threatModel={threatSceneModel}
              myRegionName="Одеська область"
              isAlarm={false}
              activeEventsCount={3}
              lastUpdatedTime="Сьогодні, 22:14"
              onSelectRegion={() => setSelectedRegion(regions.find(r => r.id === 'odesa') || null)}
              onOpenStatus={() => handleToggleTestSiren()}
              onOpenEvents={() => setIsSimulatorOpen(true)}
            />

            {/* Middle 2-Panel Grid: Фінансова інформація (Left) & Ситуація Workspace (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              
              {/* Left Panel: Фінансова інформація (3D Card Stack) */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="bg-white/60 rounded-3xl p-1 flex-1">
                  <Financial3DCardCarousel
                    onOpenPayout={() => setActiveSection('FINANCE')}
                    onOpenHistory={() => setActiveSection('FINANCE')}
                  />
                </div>
              </div>

              {/* Right Panel: Interactive Situation Workspace (Ситуація / Моя мережа) */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="flex-1">
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
                    onNavigateToNetwork={() => setActiveSection('NETWORK')}
                    onTestSiren={handleToggleTestSiren}
                  />
                </div>
              </div>

            </div>

            {/* Bottom Section: SIREN UA на всіх твоїх пристроях */}
            <div className="pt-2">
              <SirenOrbitalDeviceEcosystem
                threatModel={threatSceneModel}
                onNavigateToTab={(tabId) => {
                  if (tabId === 'shelters') setIsSheltersModalOpen(true);
                  if (tabId === 'simulator') setIsSimulatorOpen(true);
                }}
                isCriticalAlert={isSirenPlaying}
              />
            </div>

          </div>
        )}

        {/* =========================================================================
            SECTION 2: NETWORK (Мережа)
           ========================================================================= */}
        {activeSection === 'NETWORK' && (
          <div className="py-2 animate-in fade-in duration-200">
            <AffiliateProgram
              onOpenMap={() => setActiveSection('HOME')}
              onOpenSimulator={() => setIsSimulatorOpen(true)}
            />
          </div>
        )}

        {/* =========================================================================
            SECTION 3: FINANCE (Фінанси)
           ========================================================================= */}
        {activeSection === 'FINANCE' && (
          <div className="py-2 animate-in fade-in duration-200">
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
           ========================================================================= */}
        {activeSection === 'PROFILE' && (
          <div className="py-2 animate-in fade-in duration-200">
            <ProfileSection
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              isSirenPlaying={isSirenPlaying}
              onToggleTestSiren={handleToggleTestSiren}
              onOpenGuide={() => setIsGuideOpen(true)}
              isDemoMode={isDemoMode}
              onToggleDemoMode={() => {
                setIsDemoMode(!isDemoMode);
              }}
            />
          </div>
        )}

      </main>

      {/* =========================================================================
          MODALS
         ========================================================================= */}
      
      {/* Shelters Modal */}
      {isSheltersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Карта укриттів та безпечні маршрути</h3>
              </div>
              <button
                onClick={() => setIsSheltersModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>
            <SheltersSection
              myRegionId={settings.myRegion}
              onClose={() => setIsSheltersModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Emergency Guide Modal */}
      <EmergencyGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Simulator Modal */}
      <SimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        regions={regions}
        onApplyScenario={() => {}}
        onToggleRegionAlarm={() => {}}
        onPlayAllClear={handlePlayAllClear}
      />

      {/* Region Inspector Modal */}
      {selectedRegion && (
        <RegionInspectorModal
          region={selectedRegion}
          onClose={() => setSelectedRegion(null)}
          isMyRegion={selectedRegion.id === settings.myRegion}
          onSetAsMyRegion={() => handleUpdateSettings({ myRegion: selectedRegion.id })}
          onNavigateToShelters={() => {
            setSelectedRegion(null);
            setIsSheltersModalOpen(true);
          }}
          nearestShelter={threatSceneModel.nearestShelter}
        />
      )}

    </div>
  );
}
