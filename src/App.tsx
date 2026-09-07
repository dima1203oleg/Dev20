import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { HomeFeaturesGrid } from './components/HomeFeaturesGrid';
import { HomeFinanceSituationRow } from './components/HomeFinanceSituationRow';
import { AnalyticsSection } from './components/AnalyticsSection';
import { SirenOrbitalDeviceEcosystem } from './components/orbital/SirenOrbitalDeviceEcosystem';
import { FinanceSection } from './components/FinanceSection';
import { ProfileSection } from './components/ProfileSection';
import { AffiliateProgram } from './components/AffiliateProgram';
import { RegionInspectorModal } from './components/RegionInspectorModal';
import { SimulatorModal } from './components/SimulatorModal';
import { EmergencyGuideModal } from './components/EmergencyGuideModal';
import { SheltersSection } from './components/SheltersSection';
import { Footer } from './components/Footer';
import { OnboardingFlow } from './components/OnboardingFlow';

import { INITIAL_REGIONS, INITIAL_ALERTS_FEED } from './data/ukraineMapData';
import { INITIAL_TRAJECTORIES } from './data/spatialThreatData';
import { 
  RegionData, 
  AlertEvent, 
  ThreatType,
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

export default function App() {
  // Navigation: HOME | NETWORK | FINANCE | PROFILE | ANALYTICS | AFFILIATE
  const [activeSection, setActiveSection] = useState<DashboardSection>('HOME');

  // Onboarding remains available in the codebase, but it must not block the
  // production landing surface on a fresh browser visit.
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleCompleteOnboarding = () => {
    try {
      localStorage.setItem('sirenua_onboarding_completed', 'true');
    } catch {
      // ignore
    }
    setShowOnboarding(false);
  };

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

  const handleToggleRegionAlarm = (regionId: string, threatType: ThreatType = 'air') => {
    setIsDemoMode(true);
    setRegions((current) => current.map((region) => {
      if (region.id !== regionId) return region;
      const nextIsAlarm = !region.isAlarm;
      return {
        ...region,
        isAlarm: nextIsAlarm,
        threatType: nextIsAlarm ? threatType : 'none',
        startedAt: nextIsAlarm ? new Date().toISOString() : null,
        durationMinutes: 0,
      };
    }));
  };

  const handleApplyScenario = (
    scenario: 'massive_drone' | 'ballistic_all' | 'eastern_front' | 'all_clear' | 'central_ukraine'
  ) => {
    const droneRegions = new Set(['kyiv_obl', 'kyiv_city', 'chernihiv', 'sumy', 'poltava', 'cherkasy', 'odesa']);
    const easternRegions = new Set(['sumy', 'kharkiv', 'luhansk', 'donetsk', 'dnipro', 'zaporizhzhia', 'kherson']);
    const centralRegions = new Set(['kyiv_obl', 'kyiv_city', 'zhytomyr', 'vinnytsia', 'cherkasy', 'poltava', 'kirovohrad']);

    setIsDemoMode(true);
    setRegions((current) => current.map((region) => {
      let isAlarm = false;
      let nextThreatType: ThreatType = 'none';

      if (scenario === 'ballistic_all') {
        isAlarm = true;
        nextThreatType = 'ballistic';
      } else if (scenario === 'massive_drone' && droneRegions.has(region.id)) {
        isAlarm = true;
        nextThreatType = 'drone';
      } else if (scenario === 'eastern_front' && easternRegions.has(region.id)) {
        isAlarm = true;
        nextThreatType = 'ballistic';
      } else if (scenario === 'central_ukraine' && centralRegions.has(region.id)) {
        isAlarm = true;
        nextThreatType = 'air';
      }

      return {
        ...region,
        isAlarm,
        threatType: nextThreatType,
        startedAt: isAlarm ? new Date().toISOString() : null,
        durationMinutes: 0,
      };
    }));

    const labels = {
      massive_drone: 'Масований сценарій БпЛА',
      ballistic_all: 'Масований балістичний сценарій',
      eastern_front: 'Сценарій східного та південного напрямку',
      all_clear: 'Демонстраційний повний відбій',
      central_ukraine: 'Демонстраційний сценарій центрального регіону',
    };
    setBannerAlert(`ДЕМО-РЕЖИМ: ${labels[scenario]}`);
    setTimeout(() => setBannerAlert(null), 4500);
  };

  const safeRegions = regions || INITIAL_REGIONS;
  const myRegionObj = safeRegions.find((r) => r.id === settings.myRegion) || {
    id: 'odesa',
    name: 'Одеська область',
    isAlarm: false,
    threatType: 'none',
  };

  const activeAlarmsCount = safeRegions.filter((r) => r.isAlarm).length;
  const currentTimestamp = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

  const threatSceneModel: ThreatSceneModel = {
    timestamp: isDemoMode ? currentTimestamp : '—',
    freshness: isDemoMode ? 'STABLE' : 'DEGRADED',
    dataMode: isDemoMode ? 'DEMO_DATA' : 'NOT_CONNECTED',
    activeAlarmsCount,
    criticalRegions: safeRegions.filter((r) => r.isAlarm && r.threatType === 'ballistic').map((r) => r.id),
    primaryThreat: isDemoMode ? (INITIAL_TRAJECTORIES[0] || null) : null,
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
        etaMinutes: myRegionObj.isAlarm && isDemoMode ? 18 : 0,
      riskLevel: myRegionObj.isAlarm ? 'HIGH' : 'LOW',
    },
    partnerModeActive: activeSection === 'NETWORK' || activeSection === 'FINANCE',
  };

  return (
    <div className={`siren-app ${settings.theme === 'dark' ? 'siren-app--dark' : 'siren-app--light'} min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      settings.theme === 'dark' ? 'bg-[#0E1520] text-slate-100' : 'bg-[#EAEFF5] text-[#111827]'
    }`}>
      
      {/* 1. Header with Navigation */}
      <Header
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenGuide={() => setIsGuideOpen(true)}
        onToggleTheme={() => {
          const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
          handleUpdateSettings({ theme: nextTheme });
        }}
        theme={settings.theme || 'light'}
      />

      {/* 2. Critical Alert Banner if Active */}
      {bannerAlert && (
        <div className="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 text-white px-4 py-2 shadow-md text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300 z-40">
          <span>{bannerAlert}</span>
          <button
            onClick={() => setBannerAlert(null)}
            className="ml-3 px-2 py-0.5 rounded bg-black/20 hover:bg-black/40 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. Main Container */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex-1 flex flex-col gap-2">
        
        <main className="flex-1 min-w-0 pb-12 w-full">
          {/* =========================================================================
              SECTION 1: HOME (Головна) - 1:1 Premium Design as in Mockup
             ========================================================================= */}
          {activeSection === 'HOME' && (
            <div className="space-y-2 animate-in fade-in duration-200">
              
              {/* Row 1: Hero Section with 3D Map of Ukraine & Floating Threat Info */}
              <HeroSection
                regions={safeRegions}
                selectedRegion={selectedRegion}
                onSelectRegion={(reg) => setSelectedRegion(reg)}
                threatModel={threatSceneModel}
                onNavigateToShelters={() => setIsSheltersModalOpen(true)}
                theme={settings.theme || 'light'}
              />

              {/* Row 2: 4 Feature Navigation Cards (Мережа, Фінанси, Аналітика, Партнерська програма) */}
              <HomeFeaturesGrid 
                onNavigateToTab={(tab) => setActiveSection(tab)}
                theme={settings.theme || 'light'}
              />

              {/* Row 3: Financial Information Block (Фінансова інформація) */}
              <HomeFinanceSituationRow
                onNavigateToFinance={() => setActiveSection('FINANCE')}
                onNavigateToNetwork={() => setActiveSection('NETWORK')}
                theme={settings.theme || 'light'}
              />

              {/* Row 4: SIREN UA на всіх пристроях (3D Device Ecosystem) */}
              <SirenOrbitalDeviceEcosystem
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
              <ProfileSection theme={settings.theme || 'light'} />
            </div>
          )}

          {/* =========================================================================
              SECTION 5: ANALYTICS (Аналітика)
             ========================================================================= */}
          {activeSection === 'ANALYTICS' && (
            <AnalyticsSection theme={settings.theme || 'light'} />
          )}

          {/* =========================================================================
              SECTION 6: AFFILIATE (Партнерська програма)
             ========================================================================= */}
          {activeSection === 'AFFILIATE' && (
            <div className="animate-in fade-in duration-200">
              <AffiliateProgram
                onOpenMap={() => setActiveSection('HOME')}
                onOpenSimulator={() => setIsSimulatorOpen(true)}
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
          <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-4 sm:p-6 ${
            settings.theme === 'dark'
              ? 'bg-[#0B171F] border border-[#2D4A55]'
              : 'bg-white border border-slate-200'
          }`}>
            <div className={`flex items-center justify-between pb-3 mb-4 border-b ${settings.theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2">
                <h3 className={`text-lg font-bold ${settings.theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Карта укриттів та безпечні маршрути</h3>
              </div>
              <button
                onClick={() => setIsSheltersModalOpen(false)}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${settings.theme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'}`}
              >
                ✕
              </button>
            </div>
            <SheltersSection
              myRegionId={settings.myRegion}
              regions={safeRegions}
              dataState={isDemoMode ? 'DEMO' : 'NOT_CONNECTED'}
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
        onApplyScenario={handleApplyScenario}
        onToggleRegionAlarm={handleToggleRegionAlarm}
        onPlayAllClear={handlePlayAllClear}
      />

      {/* Region Inspector Modal */}
      {selectedRegion && (
        <RegionInspectorModal
          region={selectedRegion}
          onClose={() => setSelectedRegion(null)}
          isMyRegion={selectedRegion.id === settings.myRegion}
          onSetMyRegion={(regionId) => handleUpdateSettings({ myRegion: regionId })}
          onTestSiren={handleToggleTestSiren}
          isSirenPlaying={isSirenPlaying}
        />
      )}

      {/* Onboarding Flow */}
      {showOnboarding && (
        <OnboardingFlow 
          onComplete={handleCompleteOnboarding}
        />
      )}

    </div>
  );
}
