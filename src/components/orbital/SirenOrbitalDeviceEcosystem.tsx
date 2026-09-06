import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Monitor, 
  Laptop, 
  Tablet, 
  Smartphone, 
  Tv, 
  Watch, 
  Car, 
  Glasses, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Layers, 
  Eye, 
  Volume2, 
  ShieldAlert, 
  Radio, 
  Sliders, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { OrbitalDeviceType, ThreatSceneModel } from '../../types';
import { SpatialCoreUkraine } from './SpatialCoreUkraine';
import { OrbitalDeviceModel } from './OrbitalDeviceModels';
import { FloatingCards } from './FloatingCards';
import { DeviceFocusDetail, DEVICE_CONFIGS_DICT } from './DeviceFocusDetail';
import { playWebAudioSound } from '../../utils/sirenAudio';

interface SirenOrbitalDeviceEcosystemProps {
  threatModel?: ThreatSceneModel;
  onNavigateToTab?: (tabId: string) => void;
  isCriticalAlert?: boolean;
}

const ALL_ORBITAL_DEVICES: OrbitalDeviceType[] = [
  'tv',
  'desktop',
  'laptop',
  'tablet',
  'smartphone',
  'watch',
  'car',
  'ar_vr',
];

type RenderTier = 'ULTRA' | 'HIGH' | 'MEDIUM' | 'LOW' | 'STATIC';

export const SirenOrbitalDeviceEcosystem: React.FC<SirenOrbitalDeviceEcosystemProps> = ({
  threatModel: externalThreatModel,
  onNavigateToTab,
  isCriticalAlert = false,
}) => {
  // Shared Threat Scene Model
  const threatModel: ThreatSceneModel = useMemo(() => {
    if (externalThreatModel) return externalThreatModel;
    return {
      timestamp: new Date().toLocaleTimeString('uk-UA'),
      freshness: 'REALTIME',
      dataMode: 'LIVE',
      activeAlarmsCount: 4,
      criticalRegions: ['kyiv', 'kharkiv', 'dnipro', 'odesa'],
      primaryThreat: {
        id: 'thr-1',
        threatType: 'drone',
        name: 'Shahed-136 (Група 4 шт)',
        altitudeMeters: 450,
        speedKmh: 185,
        azimuthDeg: 315,
        azimuthDirection: '315° NW',
        pathD: '',
        currentPoint: { x: 550, y: 280, z: 10 },
        origin: 'Курськ / Брянськ',
        targetRegion: 'Київ / Північ',
        etaMinutes: 18,
        status: 'ACTIVE',
        altitudeLevel: 'LOW',
      },
      nearestShelter: {
        id: 'sh-1',
        name: 'Станція метро «Золоті Ворота»',
        type: 'metro',
        address: 'вул. Володимирська, 44',
        regionId: 'kyiv',
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
        id: 'kyiv',
        name: 'м. Київ & Область',
        isAlarm: true,
        etaMinutes: 18,
        riskLevel: 'HIGH',
      },
      partnerModeActive: false,
    };
  }, [externalThreatModel]);

  // Ecosystem state
  const [selectedDevice, setSelectedDevice] = useState<OrbitalDeviceType | null>(null);
  const [hoveredDevice, setHoveredDevice] = useState<OrbitalDeviceType | null>(null);
  const [partnerMode, setPartnerMode] = useState(false);
  const [isPaused, setIsPaused] = useState(isCriticalAlert);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [renderTier, setRenderTier] = useState<RenderTier>('ULTRA');
  const [activeMobileDeviceIndex, setActiveMobileDeviceIndex] = useState(0);

  // Mouse Parallax
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation time for smooth orbital tick
  const [orbitTime, setOrbitTime] = useState(0);

  // Handle system reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setReducedMotion(true);
      setIsPaused(true);
    }
  }, []);

  // Intersection Observer to stop RAF when element is out of viewport (0% background lag)
  const [isInViewport, setIsInViewport] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);

    const handleVisibility = () => {
      if (document.hidden) {
        setIsInViewport(false);
      } else if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setIsInViewport(rect.top < window.innerHeight && rect.bottom > 0);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Update pause if critical alert changes
  useEffect(() => {
    if (isCriticalAlert) {
      setIsPaused(true);
    }
  }, [isCriticalAlert]);

  // Smooth orbital motion tick (pure lightweight RAF without heavy state re-renders)
  useEffect(() => {
    if (isPaused || reducedMotion || !isInViewport || renderTier === 'STATIC') return;
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      setOrbitTime((prev) => prev + delta);
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, reducedMotion, isInViewport, renderTier]);

  // Mouse Parallax Listener
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6; // max ±3 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    setMouseParallax({ x, y });
  }, [reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setMouseParallax({ x: 0, y: 0 });
  }, []);

  // Compute 3D Spatial positions for each of the 8 devices
  const devicePositions = useMemo(() => {
    // Width and height bounding multipliers
    const xSpread = 380;
    const ySpread = 220;

    return ALL_ORBITAL_DEVICES.map((type, index) => {
      const config = DEVICE_CONFIGS_DICT[type];
      // Calculate angle with smooth orbital speed
      const baseAngleRad = (config.orbitAngle * Math.PI) / 180;
      const currentAngleRad = reducedMotion 
        ? baseAngleRad 
        : baseAngleRad + orbitTime * config.orbitSpeed;

      // Elliptical coordinates around center core
      let x = Math.cos(currentAngleRad) * (xSpread * (config.orbitRadius / 3.0));
      let y = Math.sin(currentAngleRad) * (ySpread * (config.orbitRadius / 3.0)) + config.verticalOffset * 0.4;
      
      // Floating sinusoidal bobbing
      const bobOffset = reducedMotion
        ? 0
        : Math.sin(orbitTime * config.bobFrequency + index) * config.bobAmplitude;
      y += bobOffset;

      // Z-depth index based on depthZone
      let z = config.depthZone === 'FOREGROUND' ? 80 : config.depthZone === 'MIDGROUND' ? 0 : -90;

      // If hovered or selected
      const isThisHovered = hoveredDevice === type;
      if (isThisHovered) {
        z += 40;
      }

      return {
        type,
        config,
        x,
        y,
        z,
        scale: config.scale * (isThisHovered ? 1.06 : 1.0),
        tilt: config.tilt,
      };
    });
  }, [orbitTime, reducedMotion, hoveredDevice]);

  // Filter devices if in Partner Mode (show 4 key workstations)
  const visibleDevices = useMemo(() => {
    if (!partnerMode) return devicePositions;
    return devicePositions.filter((d) => ['desktop', 'laptop', 'tablet', 'smartphone'].includes(d.type));
  }, [devicePositions, partnerMode]);

  // Handle Device Click Focus Mode
  const handleDeviceClick = (type: OrbitalDeviceType) => {
    setSelectedDevice(type);
    playWebAudioSound('click');
  };

  const handleCloseFocus = () => {
    setSelectedDevice(null);
    playWebAudioSound('click');
  };

  const handleTriggerSyncTest = () => {
    playWebAudioSound('alert');
    // Momentarily highlight all
    setHoveredDevice(null);
  };

  return (
    <section 
      id="siren-orbital-ecosystem-section"
      className="relative w-full my-8 sm:my-12 px-3 sm:px-6 max-w-7xl mx-auto"
      aria-label="SIREN UA 3D Orbital Device Ecosystem"
    >
      {/* Container Card with Premium Deep Dark Matte Styling */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden rounded-3xl bg-slate-950/95 border-2 border-slate-800 shadow-2xl backdrop-blur-2xl transition-all"
        style={{
          perspective: '1200px',
        }}
      >
        {/* Subtle Spatial Coordinate Grid & Glow in Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.15) 0%, transparent 60%),
              linear-gradient(to right, rgba(51, 65, 85, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(51, 65, 85, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 48px 48px, 48px 48px',
          }}
        />

        {/* Header HUD Bar */}
        <div className="relative z-20 px-5 sm:px-8 pt-6 pb-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                  3D ORBITAL DEVICE ECOSYSTEM
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>8 ГАДЖЕТІВ СИНХРОНІЗОВАНО</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Одна система. Один потік даних. 8 способів взаємодії.
              </h2>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Render Tier Quality Toggle */}
            <button
              onClick={() => {
                const tiers: RenderTier[] = ['ULTRA', 'HIGH', 'MEDIUM', 'LOW', 'STATIC'];
                const nextIdx = (tiers.indexOf(renderTier) + 1) % tiers.length;
                setRenderTier(tiers[nextIdx]);
                playWebAudioSound('click');
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 transition-all"
              title="Перемкнути профіль продуктивності 3D сцени (ULTRA/HIGH/MED/LOW/STATIC)"
            >
              <Sliders className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline text-[11px]">{renderTier}</span>
            </button>

            {/* Partner Mode Toggle */}
            <button
              onClick={() => {
                setPartnerMode(!partnerMode);
                playWebAudioSound('click');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all border ${
                partnerMode
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-950'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <span>{partnerMode ? '🟣 Partner Core' : '🔵 Safety Core'}</span>
            </button>

            {/* Pause / Play Orbital Motion */}
            <button
              onClick={() => {
                setIsPaused(!isPaused);
                playWebAudioSound('click');
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1"
              title={isPaused ? 'Запустити 3D орбіту' : 'Призупинити рух'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-cyan-400" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            {/* Quick Test Sync All */}
            <button
              onClick={handleTriggerSyncTest}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Синхронний тест</span>
            </button>
          </div>
        </div>

        {/* Main 3D Spatial Canvas Area */}
        <div 
          className="relative w-full h-[540px] sm:h-[620px] md:h-[680px] flex items-center justify-center overflow-hidden select-none"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Subtle Floating Intelligence Cards */}
          <FloatingCards 
            threatModel={threatModel} 
            partnerMode={partnerMode} 
            isPaused={isPaused} 
          />

          {/* 3D Parallax Root Stage */}
          <div 
            className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${-mouseParallax.y}deg) rotateY(${mouseParallax.x}deg)`,
            }}
          >
            {/* SVG Spatial Data Connections between Center Core & Devices */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
              viewBox="-600 -350 1200 700"
            >
              <defs>
                <linearGradient id="cyanLineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="roseLineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.7" />
                </linearGradient>
              </defs>

              {/* Draw animated connecting data lines */}
              {!selectedDevice && visibleDevices.map((d) => {
                const isHovered = hoveredDevice === d.type;
                const isAlarm = threatModel.activeAlarmsCount > 0;
                return (
                  <g key={`conn-${d.type}`}>
                    {/* Background Connection Path */}
                    <line
                      x1="0"
                      y1="0"
                      x2={d.x}
                      y2={d.y}
                      stroke={isAlarm ? 'url(#roseLineGlow)' : 'url(#cyanLineGlow)'}
                      strokeWidth={isHovered ? 2.5 : 1.2}
                      strokeDasharray={isHovered ? 'none' : '4 4'}
                      strokeOpacity={isHovered ? 0.9 : 0.4}
                    />

                    {/* Light Pulse Traveling from Core to Device */}
                    {!isPaused && (
                      <circle
                        r={isHovered ? 3.5 : 2.5}
                        fill={isAlarm ? '#fb7185' : '#38bdf8'}
                        className="filter drop-shadow-[0_0_6px_#38bdf8]"
                      >
                        <animateMotion
                          path={`M 0,0 L ${d.x},${d.y}`}
                          dur={`${2.2 / (d.config.orbitSpeed * 30)}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Central SIREN Spatial Core / Digital Twin of Ukraine */}
            <div 
              className={`relative z-10 transition-all duration-700 ${
                selectedDevice ? 'opacity-20 scale-75 pointer-events-none' : 'opacity-100'
              }`}
            >
              <SpatialCoreUkraine 
                threatModel={threatModel}
                partnerMode={partnerMode}
                isPaused={isPaused}
                onSelectCore={() => playWebAudioSound('click')}
              />
            </div>

            {/* Floating 8 Devices in 3D Space (Desktop / Tablet view) */}
            <div className="absolute inset-0 hidden sm:flex items-center justify-center pointer-events-none">
              {!selectedDevice && visibleDevices.map((d) => {
                const isThisHovered = hoveredDevice === d.type;
                const isAnyHovered = hoveredDevice !== null && !isThisHovered;

                return (
                  <div
                    key={d.type}
                    onMouseEnter={() => setHoveredDevice(d.type)}
                    onMouseLeave={() => setHoveredDevice(null)}
                    className="absolute pointer-events-auto transition-transform duration-500 ease-out"
                    style={{
                      transform: `translate3d(${d.x}px, ${d.y}px, ${d.z}px) rotateX(${d.tilt[0]}deg) rotateY(${d.tilt[1]}deg) rotateZ(${d.tilt[2]}deg) scale(${d.scale})`,
                      transformStyle: 'preserve-3d',
                      zIndex: d.config.depthZone === 'FOREGROUND' ? 30 : d.config.depthZone === 'MIDGROUND' ? 20 : 10,
                    }}
                  >
                    {/* Device Tooltip Label on Hover */}
                    {isThisHovered && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-cyan-400 text-[10px] font-mono font-black text-cyan-300 whitespace-nowrap shadow-xl z-50 animate-in fade-in">
                        {d.config.title.toUpperCase()} · [КЛІК ДЛЯ FOCUS MODE]
                      </div>
                    )}

                    <OrbitalDeviceModel
                      type={d.type}
                      threatModel={threatModel}
                      isSelected={false}
                      isDimmed={isAnyHovered}
                      partnerMode={partnerMode}
                      onClick={() => handleDeviceClick(d.type)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Mobile Touch Orbital Carousel (Phone Screen fallback) */}
            <div className="sm:hidden absolute inset-x-2 bottom-6 z-20 flex flex-col items-center">
              <div className="w-full bg-slate-950/90 p-3 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-800">
                  <span className="text-cyan-300 font-bold">
                    {DEVICE_CONFIGS_DICT[ALL_ORBITAL_DEVICES[activeMobileDeviceIndex]].title}
                  </span>
                  <span className="text-slate-400">
                    {activeMobileDeviceIndex + 1} / {ALL_ORBITAL_DEVICES.length}
                  </span>
                </div>

                <div className="py-2 flex justify-center">
                  <OrbitalDeviceModel
                    type={ALL_ORBITAL_DEVICES[activeMobileDeviceIndex]}
                    threatModel={threatModel}
                    isSelected={true}
                    partnerMode={partnerMode}
                    onClick={() => handleDeviceClick(ALL_ORBITAL_DEVICES[activeMobileDeviceIndex])}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setActiveMobileDeviceIndex((prev) => (prev > 0 ? prev - 1 : ALL_ORBITAL_DEVICES.length - 1));
                      playWebAudioSound('click');
                    }}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeviceClick(ALL_ORBITAL_DEVICES[activeMobileDeviceIndex])}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
                  >
                    Focus Mode
                  </button>
                  <button
                    onClick={() => {
                      setActiveMobileDeviceIndex((prev) => (prev < ALL_ORBITAL_DEVICES.length - 1 ? prev + 1 : 0));
                      playWebAudioSound('click');
                    }}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Device Focus Mode Detailed Modal Overlay */}
            {selectedDevice && (
              <div className="absolute inset-4 sm:inset-8 z-40 overflow-y-auto flex items-center justify-center p-2">
                <DeviceFocusDetail
                  deviceType={selectedDevice}
                  threatModel={threatModel}
                  onBackToEcosystem={handleCloseFocus}
                  onNavigateToMap={() => onNavigateToTab?.('map')}
                  onNavigateToSimulator={() => onNavigateToTab?.('simulator')}
                  onNavigateToShelters={() => onNavigateToTab?.('shelters')}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Accessibility DOM Navigation Bar for all 8 Devices */}
        <div className="relative z-20 px-5 sm:px-8 py-4 bg-slate-950 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
              Швидкий вибір пристрою (Клавіатура & DOM):
            </span>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {ALL_ORBITAL_DEVICES.map((type) => {
                const config = DEVICE_CONFIGS_DICT[type];
                const isCurrent = selectedDevice === type;

                return (
                  <button
                    key={type}
                    onClick={() => handleDeviceClick(type)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all border ${
                      isCurrent
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-950'
                        : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    {config.modeTag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
