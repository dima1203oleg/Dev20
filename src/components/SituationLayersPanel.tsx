import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Cloud,
  CloudLightning,
  CloudRain,
  Clock3,
  ExternalLink,
  Layers,
  MapPin,
  Radio,
  RefreshCw,
  Snowflake,
  ThermometerSun,
  Wind,
  Zap,
} from 'lucide-react';
import { INITIAL_REGIONS } from '../data/ukraineMapData';
import { RegionData } from '../types';
import { DataEnvelope, DataState } from '../types/dataEnvelope';
import { LiveThreatsPayload, threatServerService } from '../services/threatServerService';
import {
  HazardItem,
  HazardSeverity,
  HazardSnapshot,
  PowerRegionSnapshot,
  PowerStatus,
  SituationLayer,
  isPowerRegionSupported,
  publicSituationService,
  powerStatusLabel,
} from '../services/publicSituationService';

interface SituationLayersPanelProps {
  theme?: 'light' | 'dark';
}

const neutralRegions = INITIAL_REGIONS.map((region) => ({
  ...region,
  isAlarm: false,
  threatType: 'none' as const,
  startedAt: null,
  durationMinutes: 0,
}));

const supportedPowerRegions = ['kyiv_city', 'kyiv_obl', 'dnipro', 'odesa'];

const stateLabels: Record<DataState, string> = {
  LOADING: 'ОНОВЛЕННЯ',
  LIVE: 'LIVE',
  CACHED: 'ДЖЕРЕЛО-КОПІЯ',
  STALE: 'ЗАСТАРІЛО',
  DEMO: 'DEMO',
  NOT_CONNECTED: 'НЕ ПІДКЛЮЧЕНО',
  ERROR: 'ПОМИЛКА',
};

const stateTone = (state: DataState, isDark: boolean) => {
  if (state === 'LIVE') return isDark ? 'bg-emerald-400/10 text-emerald-300 border-emerald-300/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (state === 'CACHED') return isDark ? 'bg-sky-400/10 text-sky-300 border-sky-300/20' : 'bg-sky-50 text-sky-700 border-sky-200';
  if (state === 'LOADING') return isDark ? 'bg-blue-400/10 text-blue-300 border-blue-300/20' : 'bg-blue-50 text-blue-700 border-blue-200';
  if (state === 'DEMO') return isDark ? 'bg-violet-400/10 text-violet-300 border-violet-300/20' : 'bg-violet-50 text-violet-700 border-violet-200';
  return isDark ? 'bg-amber-400/10 text-amber-200 border-amber-300/20' : 'bg-amber-50 text-amber-700 border-amber-200';
};

const formatTimestamp = (value?: string) => {
  if (!value) return '—';
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'Europe/Kyiv',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(parsed));
};

const formatForecastTime = (value: string) => {
  const normalized = /(?:Z|[+-]\d\d:\d\d)$/.test(value) ? value : `${value}Z`;
  const parsed = Date.parse(normalized);
  if (Number.isNaN(parsed)) return value.replace('T', ' ');
  return new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'Europe/Kyiv',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(parsed));
};

const severityLabel: Record<HazardSeverity, string> = {
  ADVISORY: 'Інформаційний',
  MODERATE: 'Помірний',
  HIGH: 'Високий',
  CRITICAL: 'Критичний',
};

const hazardTone = (severity: HazardSeverity, isDark: boolean) => {
  if (severity === 'CRITICAL') return isDark ? 'bg-rose-400/10 border-rose-300/25 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-700';
  if (severity === 'HIGH') return isDark ? 'bg-amber-400/10 border-amber-300/25 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800';
  if (severity === 'MODERATE') return isDark ? 'bg-sky-400/10 border-sky-300/25 text-sky-200' : 'bg-sky-50 border-sky-200 text-sky-700';
  return isDark ? 'bg-slate-400/10 border-slate-300/20 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600';
};

const hazardIcon = (event: HazardItem) => {
  if (event.type === 'HAIL' || event.type === 'THUNDERSTORM') return CloudLightning;
  if (event.type === 'HEAVY_RAIN' || event.type === 'FLOOD') return CloudRain;
  if (event.type === 'STRONG_WIND') return Wind;
  if (event.type === 'FOG') return Cloud;
  if (event.type === 'ICE' || event.type === 'SNOW') return Snowflake;
  if (event.type === 'EXTREME_HEAT' || event.type === 'EXTREME_COLD') return ThermometerSun;
  return AlertTriangle;
};

const powerColor = (status: PowerStatus, isDark: boolean) => {
  if (status === 'POWER_ON') return isDark ? '#5F99AE' : '#A9CFDF';
  if (status === 'POWER_OFF') return isDark ? '#263843' : '#647684';
  if (status === 'POSSIBLE_OUTAGE') return isDark ? '#B68A4A' : '#E1B96B';
  if (status === 'EMERGENCY_OUTAGE') return isDark ? '#B85D51' : '#D98272';
  return isDark ? '#304854' : '#D8E2E8';
};

const airRegionColor = (region: RegionData, state: DataState, isDark: boolean) => {
  if (state !== 'LIVE' && state !== 'DEMO') return isDark ? '#304854' : '#DCE7EC';
  if (!region.isAlarm) return isDark ? '#3C6574' : '#C6DEE8';
  if (region.threatType === 'ballistic' || region.threatType === 'missile') return isDark ? '#A95750' : '#D77D72';
  return isDark ? '#A2734C' : '#D5A367';
};

const genericRegionColor = (isSelected: boolean, isDark: boolean) => {
  if (isSelected) return isDark ? '#648FA2' : '#9FC7D8';
  return isDark ? '#304854' : '#DCE7EC';
};

const timelineColor = (status: PowerStatus, isDark: boolean) => {
  if (status === 'POWER_ON') return isDark ? 'bg-[#6EADBE]' : 'bg-[#A9CFDF]';
  if (status === 'POWER_OFF') return isDark ? 'bg-[#283B47]' : 'bg-[#667987]';
  if (status === 'POSSIBLE_OUTAGE') return isDark ? 'bg-[#B58A4E]' : 'bg-[#E2BC73]';
  if (status === 'EMERGENCY_OUTAGE') return isDark ? 'bg-[#B75C51]' : 'bg-[#D98272]';
  return isDark ? 'bg-[#3B515E]' : 'bg-[#D6E0E6]';
};

const emptyPowerEnvelope: DataEnvelope<PowerRegionSnapshot> = { data: null, state: 'NOT_CONNECTED' };
const emptyHazardEnvelope: DataEnvelope<HazardSnapshot> = { data: null, state: 'NOT_CONNECTED' };
const emptyAirEnvelope: DataEnvelope<LiveThreatsPayload> = { data: null, state: 'NOT_CONNECTED' };

export const SituationLayersPanel: React.FC<SituationLayersPanelProps> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';
  const [activeLayer, setActiveLayer] = useState<SituationLayer>('AIR');
  const [selectedRegionId, setSelectedRegionId] = useState('odesa');
  const [selectedPowerGroup, setSelectedPowerGroup] = useState<string | undefined>();
  const [powerByRegion, setPowerByRegion] = useState<Record<string, DataEnvelope<PowerRegionSnapshot>>>({});
  const [hazards, setHazards] = useState<DataEnvelope<HazardSnapshot>>(emptyHazardEnvelope);
  const [air, setAir] = useState<DataEnvelope<LiveThreatsPayload>>(emptyAirEnvelope);
  const [refreshNonce, setRefreshNonce] = useState(0);

  const selectedRegion = useMemo(
    () => INITIAL_REGIONS.find((region) => region.id === selectedRegionId) || INITIAL_REGIONS.find((region) => region.id === 'odesa') || INITIAL_REGIONS[0],
    [selectedRegionId],
  );

  useEffect(() => {
    let mounted = true;
    if (activeLayer !== 'AIR') return undefined;
    setAir((current) => ({ ...current, state: 'LOADING' }));
    threatServerService.fetchLiveThreats(selectedRegionId).then((response) => {
      if (mounted) setAir(response);
    }).catch((error) => {
      if (!mounted) return;
      setAir({ data: null, state: 'ERROR', error: error instanceof Error ? error.message : 'Не вдалося підключити повітряний feed.' });
    });
    return () => { mounted = false; };
  }, [activeLayer, selectedRegionId, refreshNonce]);

  useEffect(() => {
    let mounted = true;
    if (activeLayer !== 'POWER') return undefined;
    const load = async () => {
      const results = await Promise.all(supportedPowerRegions.map(async (regionId) => [regionId, await publicSituationService.fetchPower(regionId)] as const));
      if (!mounted) return;
      setPowerByRegion((current) => ({ ...current, ...Object.fromEntries(results) }));
    };
    load();
    return () => { mounted = false; };
  }, [activeLayer, refreshNonce]);

  useEffect(() => {
    let mounted = true;
    if (activeLayer !== 'POWER' || !isPowerRegionSupported(selectedRegionId)) return undefined;
    const current = powerByRegion[selectedRegionId];
    const inferredGroup = selectedPowerGroup || current?.data?.group;
    publicSituationService.fetchPower(selectedRegionId, inferredGroup).then((response) => {
      if (!mounted) return;
      setPowerByRegion((existing) => ({ ...existing, [selectedRegionId]: response }));
      if (response.data?.group && !selectedPowerGroup) setSelectedPowerGroup(response.data.group);
    });
    return () => { mounted = false; };
  }, [activeLayer, selectedRegionId, selectedPowerGroup, refreshNonce]);

  useEffect(() => {
    setSelectedPowerGroup(undefined);
  }, [selectedRegionId]);

  useEffect(() => {
    let mounted = true;
    if (activeLayer !== 'HAZARDS') return undefined;
    setHazards((current) => ({ ...current, state: 'LOADING' }));
    publicSituationService.fetchHazards(selectedRegionId).then((response) => {
      if (mounted) setHazards(response);
    });
    return () => { mounted = false; };
  }, [activeLayer, selectedRegionId, refreshNonce]);

  const airRegions = air.data?.regions || neutralRegions;
  const currentPower = powerByRegion[selectedRegionId] || emptyPowerEnvelope;
  const currentHour = Number(new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Kyiv',
    hour: '2-digit',
    hourCycle: 'h23',
  }).format(new Date()));

  const currentEnvelope = activeLayer === 'AIR' ? air : activeLayer === 'POWER' ? currentPower : hazards;
  const selectedAirRegion = airRegions.find((region) => region.id === selectedRegionId);

  const mapFill = (region: RegionData) => {
    if (activeLayer === 'AIR') {
      const liveRegion = airRegions.find((item) => item.id === region.id) || { ...region, isAlarm: false, threatType: 'none' as const };
      return airRegionColor(liveRegion, air.state, isDark);
    }
    if (activeLayer === 'POWER') {
      const snapshot = powerByRegion[region.id]?.data;
      if (snapshot) return powerColor(snapshot.currentStatus, isDark);
      return genericRegionColor(selectedRegionId === region.id, isDark);
    }
    return genericRegionColor(selectedRegionId === region.id, isDark);
  };

  const layerButtons: Array<{ id: SituationLayer; label: string; icon: React.ElementType; description: string }> = [
    { id: 'AIR', label: 'Повітряні загрози', icon: Radio, description: 'Поточний повітряний шар' },
    { id: 'POWER', label: 'Відключення світла', icon: Zap, description: 'Графіки та статус електропостачання' },
    { id: 'HAZARDS', label: 'Стихійні ризики', icon: CloudLightning, description: 'Прогнозовані локальні ризики' },
  ];

  return (
    <section className={`w-full rounded-[28px] border overflow-hidden ${isDark ? 'bg-[#111D27] border-[#28404B] text-slate-100 shadow-[0_24px_60px_rgba(0,0,0,0.18)]' : 'bg-[#F7FAFC] border-[#D4E0E7] text-[#0F172A] shadow-[0_22px_58px_rgba(66,91,105,0.08)]'}`}>
      <div className="p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black tracking-[0.08em] ${isDark ? 'bg-[#162833] border-[#2A4857] text-[#9FC7D7]' : 'bg-[#EDF5F8] border-[#C9DDE6] text-[#547E91]'}`}>
              <Layers className="w-3.5 h-3.5" />
              ОДНА КАРТА · ТРИ СИТУАЦІЙНІ ШАРИ
            </div>
            <h2 className="mt-3 text-[24px] sm:text-[28px] font-black tracking-tight">Що відбувається навколо вас</h2>
            <p className={`mt-1.5 max-w-2xl text-[12px] sm:text-[13px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#596A79]'}`}>
              Сайт показує компактний прев’ю-режим. Повна деталізація, персональні сповіщення та історія подій доступні у застосунку SIREN UA.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRefreshNonce((value) => value + 1)}
            className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-[11px] font-bold transition-colors ${isDark ? 'border-[#31505E] bg-[#172934] text-[#B6D6E2] hover:bg-[#1C3340]' : 'border-[#C9D9E1] bg-white text-[#486A7B] hover:bg-[#F0F6F8]'}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${currentEnvelope.state === 'LOADING' ? 'animate-spin' : ''}`} />
            Оновити
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {layerButtons.map((layer) => {
            const Icon = layer.icon;
            const isActive = layer.id === activeLayer;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveLayer(layer.id)}
                className={`rounded-[18px] border px-4 py-3 text-left transition-all ${isActive
                  ? isDark ? 'bg-[#1B3946] border-[#4F8195] shadow-[0_12px_30px_rgba(44,105,129,0.18)]' : 'bg-[#E7F2F6] border-[#8DB8C9] shadow-[0_12px_30px_rgba(82,132,153,0.12)]'
                  : isDark ? 'bg-[#14232D] border-[#29414C] hover:border-[#456A79]' : 'bg-white border-[#D7E2E8] hover:border-[#AAC7D4]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${isActive ? isDark ? 'bg-[#28556A] text-[#C3E3EE]' : 'bg-[#D3E8F0] text-[#4A7E94]' : isDark ? 'bg-[#1B2E38] text-[#8BB2C2]' : 'bg-[#F1F6F8] text-[#6D93A3]'}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-extrabold">{layer.label}</div>
                    <div className={`mt-0.5 text-[9px] leading-tight ${isDark ? 'text-slate-500' : 'text-[#7A8995]'}`}>{layer.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1.35fr_0.85fr] gap-4">
          <div className={`relative min-h-[370px] rounded-[24px] border overflow-hidden ${isDark ? 'bg-[#0E1A22] border-[#263F4A]' : 'bg-[#EEF4F7] border-[#D7E3E9]'}`}>
            <div className="absolute inset-0 opacity-80 pointer-events-none" style={{ backgroundImage: isDark ? 'radial-gradient(circle at 50% 50%, rgba(102,157,177,0.12), transparent 55%)' : 'radial-gradient(circle at 50% 50%, rgba(105,159,184,0.16), transparent 58%)' }} />
            <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10">
              <div className={`rounded-full border px-3 py-1.5 text-[10px] font-bold backdrop-blur-md ${isDark ? 'bg-[#10222C]/90 border-[#294856] text-[#C6DDE5]' : 'bg-white/90 border-[#CBDCE4] text-[#486878]'}`}>
                <MapPin className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />
                {selectedRegion.name}
              </div>
              <span className={`rounded-full border px-2.5 py-1 text-[9px] font-black tracking-wide ${stateTone(currentEnvelope.state, isDark)}`}>
                {stateLabels[currentEnvelope.state]}
              </span>
            </div>

            <svg viewBox="0 0 1000 650" role="img" aria-label={`Інтерактивна карта України — ${layerButtons.find((item) => item.id === activeLayer)?.label}`} className="absolute inset-x-3 top-14 bottom-5 w-[calc(100%-1.5rem)] h-[calc(100%-4.75rem)] drop-shadow-[0_16px_28px_rgba(45,70,83,0.18)]">
              {INITIAL_REGIONS.map((region) => {
                const isSelected = region.id === selectedRegionId;
                const hasPower = activeLayer === 'POWER' && isPowerRegionSupported(region.id);
                return (
                  <path
                    key={region.id}
                    d={region.path}
                    fill={mapFill(region)}
                    stroke={isSelected ? (isDark ? '#D1E8F0' : '#527F92') : (isDark ? '#55717C' : '#FFFFFF')}
                    strokeWidth={isSelected ? 5 : 3}
                    opacity={activeLayer === 'POWER' && !hasPower && !isSelected ? 0.55 : 1}
                    tabIndex={0}
                    role="button"
                    aria-label={`Вибрати ${region.name}`}
                    onClick={() => setSelectedRegionId(region.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') setSelectedRegionId(region.id);
                    }}
                    className="cursor-pointer transition-all duration-200 hover:brightness-95 focus:outline-none"
                  />
                );
              })}
            </svg>

            <div className={`absolute bottom-3 left-3 right-3 rounded-2xl border px-3 py-2 backdrop-blur-md text-[9px] ${isDark ? 'bg-[#10212B]/88 border-[#2B4652] text-slate-400' : 'bg-white/88 border-[#D2E0E7] text-[#667783]'}`}>
              {activeLayer === 'AIR' && 'Червоний/бурштиновий — активний статус тільки коли SIREN отримав підтверджений або явно позначений DEMO feed. Без підключення карта нейтральна.'}
              {activeLayer === 'POWER' && 'Кольором показані регіони, для яких доступний публічний агрегований графік. Дзеркальні дані не видаються за прямий live-feed постачальника.'}
              {activeLayer === 'HAZARDS' && 'Стихійні ризики є прогнозною оцінкою погодної моделі, а не гарантією події. Натисніть область, щоб отримати локальний прогноз.'}
            </div>
          </div>

          <div className={`rounded-[24px] border p-4 sm:p-5 min-h-[370px] ${isDark ? 'bg-[#13232D] border-[#29414C]' : 'bg-white border-[#D6E2E8]'}`}>
            {activeLayer === 'AIR' && (
              <div className="h-full flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className={`text-[10px] font-black tracking-[0.08em] ${isDark ? 'text-[#84AFC0]' : 'text-[#668FA0]'}`}>ПОВІТРЯНИЙ ШАР</div>
                    <h3 className="mt-1.5 text-[19px] font-black">{selectedRegion.name}</h3>
                  </div>
                  <Radio className="w-5 h-5 text-[#6C9CAF]" />
                </div>
                <div className={`mt-4 rounded-2xl border p-4 ${selectedAirRegion?.isAlarm && (air.state === 'LIVE' || air.state === 'DEMO') ? hazardTone('HIGH', isDark) : isDark ? 'bg-[#172A35] border-[#2E4854]' : 'bg-[#F3F7F9] border-[#D9E5EA]'}`}>
                  <div className="text-[11px] font-bold">{air.state === 'LIVE' || air.state === 'DEMO'
                    ? selectedAirRegion?.isAlarm ? 'Активний сигнал для регіону' : 'Активний сигнал не зафіксовано'
                    : 'Актуальні дані тимчасово недоступні'}</div>
                  <div className={`mt-1 text-[10px] ${isDark ? 'text-slate-400' : 'text-[#6D7C88]'}`}>
                    {air.state === 'DEMO' ? 'Демонстраційний режим позначено окремо.' : air.state === 'LIVE' ? `Джерело: ${air.source || 'SIREN ThreatServer'}` : 'Карта не підставляє тестові загрози замість відсутнього feed.'}
                  </div>
                </div>
                <div className="mt-auto pt-4 text-[10px] leading-relaxed text-slate-500">
                  Повна оперативна карта, хронологія та персональні сповіщення доступні у застосунку SIREN UA.
                </div>
              </div>
            )}

            {activeLayer === 'POWER' && (
              <div className="h-full flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className={`text-[10px] font-black tracking-[0.08em] ${isDark ? 'text-[#84AFC0]' : 'text-[#668FA0]'}`}>ЕЛЕКТРОПОСТАЧАННЯ</div>
                    <h3 className="mt-1.5 text-[19px] font-black">{selectedRegion.name}</h3>
                  </div>
                  <Zap className="w-5 h-5 text-[#6C9CAF]" />
                </div>

                {!isPowerRegionSupported(selectedRegionId) && (
                  <div className={`mt-4 rounded-2xl border p-4 ${isDark ? 'bg-[#172A35] border-[#2E4854]' : 'bg-[#F3F7F9] border-[#D9E5EA]'}`}>
                    <div className="text-[11px] font-bold">Публічний feed цього регіону ще не підключений на сайті.</div>
                    <div className={`mt-1 text-[10px] ${isDark ? 'text-slate-400' : 'text-[#6D7C88]'}`}>
                      Зараз у web-прототипі доступні Київ, Київська область, Дніпропетровська та Одеська області. Архітектура залишена розширюваною для серверного агрегатора.
                    </div>
                  </div>
                )}

                {isPowerRegionSupported(selectedRegionId) && currentPower.state === 'LOADING' && (
                  <div className="mt-8 flex items-center gap-2 text-[11px] text-slate-500"><RefreshCw className="w-4 h-4 animate-spin" /> Отримуємо графік…</div>
                )}

                {isPowerRegionSupported(selectedRegionId) && currentPower.data && (
                  <>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] text-slate-500">Поточний статус</div>
                        <div className="mt-1 text-[18px] font-black">{currentPower.data.currentStatusLabel}</div>
                      </div>
                      <div className={`w-3 h-3 rounded-full shadow-[0_0_0_6px_rgba(109,159,184,0.08)]`} style={{ background: powerColor(currentPower.data.currentStatus, false) }} />
                    </div>

                    {currentPower.data.availableGroups.length > 0 && (
                      <label className="mt-4 block">
                        <span className="text-[9px] font-bold text-slate-500">Черга / група</span>
                        <select
                          value={selectedPowerGroup || currentPower.data.group}
                          onChange={(event) => setSelectedPowerGroup(event.target.value)}
                          className={`mt-1.5 w-full rounded-xl border px-3 py-2 text-[11px] font-semibold outline-none ${isDark ? 'bg-[#0F1E27] border-[#31505D] text-slate-200' : 'bg-[#F8FBFC] border-[#D4E1E7] text-[#22313A]'}`}
                        >
                          {currentPower.data.availableGroups.map((group) => <option key={group.id} value={group.id}>{group.label}</option>)}
                        </select>
                      </label>
                    )}

                    <div className="mt-4 flex items-center gap-2 text-[10px]">
                      <Clock3 className="w-3.5 h-3.5 text-[#6D9FB8]" />
                      {currentPower.data.nextChangeAt
                        ? <>Наступна зміна близько <strong>{currentPower.data.nextChangeAt}</strong> · {currentPower.data.nextChangeLabel}</>
                        : <>Зміни в поточному добовому шаблоні не знайдені.</>}
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[9px] text-slate-500 mb-1.5"><span>Графік на сьогодні</span><span>Europe/Kyiv</span></div>
                      <div className="relative flex h-7 rounded-lg overflow-hidden border border-black/5 dark:border-white/5">
                        {currentPower.data.timeline.map((slot) => (
                          <div key={slot.hour} title={`${slot.startLabel}–${slot.endLabel}: ${powerStatusLabel(slot.status)}`} className={`relative flex-1 ${timelineColor(slot.status, isDark)} ${slot.hour === currentHour ? 'after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] after:bg-white after:shadow-[0_0_0_1px_rgba(0,0,0,0.25)]' : ''}`} />
                        ))}
                      </div>
                      <div className="mt-1 flex justify-between text-[8px] text-slate-500"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>
                    </div>

                    {currentPower.data.note && <div className={`mt-3 rounded-xl border px-3 py-2 text-[9px] ${isDark ? 'border-amber-300/20 bg-amber-300/5 text-amber-200' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>{currentPower.data.note}</div>}

                    <a href={currentPower.data.sourceUrl} target="_blank" rel="noreferrer" className={`mt-auto pt-4 inline-flex items-center gap-1.5 text-[9px] font-bold ${isDark ? 'text-[#86B4C5]' : 'text-[#5F899B]'}`}>
                      Джерело: публічний агрегатор <ExternalLink className="w-3 h-3" />
                    </a>
                    <div className="mt-1 text-[8px] text-slate-500">Оновлення джерела: {formatTimestamp(currentPower.data.sourceUpdatedAt)} · Дзеркальні дані показуються як копія, не як прямий live-feed постачальника.</div>
                  </>
                )}

                {isPowerRegionSupported(selectedRegionId) && currentPower.state === 'ERROR' && !currentPower.data && (
                  <div className={`mt-4 rounded-2xl border p-4 ${isDark ? 'bg-amber-400/5 border-amber-300/20 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                    <div className="text-[11px] font-bold">Не вдалося отримати графік.</div>
                    <div className="mt-1 text-[9px]">{currentPower.error || 'Перевірте доступність джерела.'}</div>
                  </div>
                )}
              </div>
            )}

            {activeLayer === 'HAZARDS' && (
              <div className="h-full flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className={`text-[10px] font-black tracking-[0.08em] ${isDark ? 'text-[#84AFC0]' : 'text-[#668FA0]'}`}>СТИХІЙНІ РИЗИКИ · 24 ГОД</div>
                    <h3 className="mt-1.5 text-[19px] font-black">{selectedRegion.name}</h3>
                  </div>
                  <CloudLightning className="w-5 h-5 text-[#6C9CAF]" />
                </div>

                {hazards.state === 'LOADING' && <div className="mt-8 flex items-center gap-2 text-[11px] text-slate-500"><RefreshCw className="w-4 h-4 animate-spin" /> Аналізуємо прогноз…</div>}

                {hazards.data && (
                  <>
                    <div className={`mt-4 rounded-2xl border p-3 ${isDark ? 'bg-[#172A35] border-[#2E4854]' : 'bg-[#F3F7F9] border-[#D9E5EA]'}`}>
                      <div className="text-[10px] font-semibold">{hazards.data.summary}</div>
                      <div className="mt-1 text-[8px] text-slate-500">Confidence: PREDICTED · не є гарантією фактичної події</div>
                    </div>

                    <div className="mt-3 space-y-2 max-h-[210px] overflow-auto pr-1">
                      {hazards.data.activeEvents.length === 0 && (
                        <div className="py-4 text-[10px] text-slate-500">Істотних погодних ризиків за заданими порогами не виявлено.</div>
                      )}
                      {hazards.data.activeEvents.map((event) => {
                        const Icon = hazardIcon(event);
                        return (
                          <div key={event.id} className={`rounded-2xl border p-3 ${hazardTone(event.severity, isDark)}`}>
                            <div className="flex items-start gap-2.5">
                              <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="text-[10px] font-black">{event.title}</div>
                                  <span className="text-[8px] font-black uppercase">{severityLabel[event.severity]}</span>
                                </div>
                                <div className="mt-1 text-[9px] opacity-80">{formatForecastTime(event.startsAt)} · {event.metric}</div>
                                <div className="mt-1.5 text-[8px] leading-relaxed opacity-75">{event.recommendation}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <a href={hazards.data.sourceUrl} target="_blank" rel="noreferrer" className={`mt-auto pt-3 inline-flex items-center gap-1.5 text-[9px] font-bold ${isDark ? 'text-[#86B4C5]' : 'text-[#5F899B]'}`}>
                      Погодна модель: Open-Meteo <ExternalLink className="w-3 h-3" />
                    </a>
                  </>
                )}

                {hazards.state === 'ERROR' && !hazards.data && (
                  <div className={`mt-4 rounded-2xl border p-4 ${isDark ? 'bg-amber-400/5 border-amber-300/20 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                    <div className="text-[11px] font-bold">Прогноз тимчасово недоступний.</div>
                    <div className="mt-1 text-[9px]">{hazards.error || 'Не вдалося отримати дані погодної моделі.'}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
