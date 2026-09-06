import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HeroSection } from './components/HeroSection';
import { SmartMetricRail } from './components/SmartMetricRail';
import { HomeFinanceSituationRow } from './components/HomeFinanceSituationRow';
import { SirenOrbitalDeviceEcosystem } from './components/orbital/SirenOrbitalDeviceEcosystem';
import { FinanceSection } from './components/FinanceSection';
import { ProfileSection } from './components/ProfileSection';
import { AffiliateProgram } from './components/AffiliateProgram';
import { RegionInspectorModal } from './components/RegionInspectorModal';
import { SimulatorModal } from './components/SimulatorModal';
import { EmergencyGuideModal } from './components/EmergencyGuideModal';
import { SheltersSection } from './components/SheltersSection';
import { Footer } from './components/Footer';

import { INITIAL_REGIONS, INITIAL_ALERTS_FEED } from './data/ukraineMapData';
import { INITIAL_TRAJECTORIES } from './data/spatialThreatData';
import { 
  RegionData, 
  AlertEvent, 
  UserSettings, 
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

  const safeRegions = regions || INITIAL_REGIONS;
  const myRegionObj = safeRegions.find((r) => r.id === settings.myRegion) || {
    id: 'odesa',
    name: 'Одеська область',
    isAlarm: false,
    threatType: 'none',
  };

  const activeAlarmsCount = safeRegions.filter((r) => r.isAlarm).length;

  const threatSceneModel: ThreatSceneModel = {
    timestamp: '22:14',
    freshness: 'REALTIME',
    dataMode: isDemoMode ? 'DEMO_DATA' : 'LIVE',
    activeAlarmsCount,
    criticalRegions: safeRegions.filter((r) => r.isAlarm && r.threatType === 'ballistic').map((r) => r.id),
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
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      settings.theme === 'dark' ? 'bg-[#0B0F17] text-slate-100' : 'bg-[#F7F9FC] text-[#111827]'
    }`}>
      
      {/* 1. Header with Global Navigation & User Capsule */}
      <Header
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        regions={safeRegions}
        myRegionName={myRegionObj.name}
        theme={settings.theme || 'light'}
        onToggleTheme={() => {
          const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
          handleUpdateSettings({ theme: nextTheme });
        }}
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

      {/* 3. Main Workspace Container with Sidebar on Desktop */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex-1 flex flex-col lg:flex-row gap-5">
        
        {/* Left Column: Navigation Sidebar */}
        <div className="w-full lg:w-48 xl:w-52 flex-shrink-0">
          <Sidebar
            activeSection={activeSection}
            onSelectSection={(sec) => {
              setActiveSection(sec);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenNotifications={() => setIsSimulatorOpen(true)}
            onOpenSupport={() => setIsGuideOpen(true)}
            theme={settings.theme || 'light'}
          />
        </div>

        {/* Right Column: Main Content Area */}
        <main className="flex-1 min-w-0 pb-12">
          
          {/* =========================================================================
              SECTION 1: HOME (Головна) - 1:1 Matching the uploaded design screenshot
             ========================================================================= */}
          {activeSection === 'HOME' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Row 1: Top Hero Section with 3D Map of Ukraine & Threat Details */}
              <HeroSection
                regions={safeRegions}
                selectedRegionId={selectedRegion?.id}
                onSelectRegion={(reg) => setSelectedRegion(reg)}
                onOpenMap={() => setSelectedRegion(safeRegions.find(r => r.id === 'kyiv_obl') || null)}
                onOpenGuide={() => setIsGuideOpen(true)}
                onOpenThreats={() => setIsSimulatorOpen(true)}
                activeThreatsCount={3}
                theme={settings.theme || 'light'}
              />

              {/* Row 2: 4 Quick Smart Metric Cards */}
              <SmartMetricRail
                threatModel={threatSceneModel}
                myRegionName={myRegionObj.name || "Одеська область"}
                isAlarm={myRegionObj.isAlarm || false}
                activeEventsCount={3}
                lastUpdatedTime="Сьогодні, 22:14"
                onSelectRegion={() => setSelectedRegion(safeRegions.find(r => r.id === 'odesa') || null)}
                onOpenStatus={() => handleToggleTestSiren()}
                onOpenEvents={() => setIsSimulatorOpen(true)}
                theme={settings.theme || 'light'}
              />

              {/* Row 3: Фінансова інформація & Ситуація 5-Card Layout */}
              <HomeFinanceSituationRow
                regions={safeRegions}
                selectedRegion={selectedRegion}
                onSelectRegion={(reg) => setSelectedRegion(reg)}
                threatModel={threatSceneModel}
                onNavigateToFinance={() => setActiveSection('FINANCE')}
                onNavigateToNetwork={() => setActiveSection('NETWORK')}
                onNavigateToShelters={() => setIsSheltersModalOpen(true)}
                theme={settings.theme || 'light'}
              />

              {/* Row 4: SIREN UA на всіх твоїх пристроях (3D Device Ecosystem) */}
              <SirenOrbitalDeviceEcosystem
                threatModel={threatSceneModel}
                onNavigateToTab={(tabId) => {
                  if (tabId === 'shelters') setIsSheltersModalOpen(true);
                  if (tabId === 'simulator') setIsSimulatorOpen(true);
                }}
                isCriticalAlert={isSirenPlaying}
                theme={settings.theme || 'light'}
              />

            </div>
          )}

          {/* =========================================================================
              SECTION 2: NETWORK (Мережа)
             ========================================================================= */}
          {activeSection === 'NETWORK' && (
            <div className="animate-in fade-in duration-200">
              <AffiliateProgram
                onOpenMap={() => setActiveSection('HOME')}
                onOpenSimulator={() => setIsSimulatorOpen(true)}
                theme={settings.theme || 'light'}
              />
            </div>
          )}

          {/* =========================================================================
              SECTION 3: FINANCE (Фінанси)
             ========================================================================= */}
          {activeSection === 'FINANCE' && (
            <div className="animate-in fade-in duration-200">
              <FinanceSection
                onOpenWithdrawModal={() => {}}
                onOpenHistory={() => {}}
                theme={settings.theme || 'light'}
              />
            </div>
          )}

          {/* =========================================================================
              SECTION 4: PROFILE (Профіль)
             ========================================================================= */}
          {activeSection === 'PROFILE' && (
            <div className="animate-in fade-in duration-200">
              <ProfileSection
                theme={settings.theme || 'light'}
              />
            </div>
          )}

        </main>
      </div>

      {/* 4. Footer */}
      <Footer theme={settings.theme || 'light'} />

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
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
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
        regions={safeRegions}
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
