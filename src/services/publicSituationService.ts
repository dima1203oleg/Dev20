import { DataEnvelope, DataState } from '../types/dataEnvelope';

export type SituationLayer = 'AIR' | 'POWER' | 'HAZARDS';

export type PowerStatus =
  | 'POWER_ON'
  | 'POWER_OFF'
  | 'POSSIBLE_OUTAGE'
  | 'EMERGENCY_OUTAGE'
  | 'UNKNOWN';

export interface PowerTimelineSlot {
  hour: number;
  startLabel: string;
  endLabel: string;
  status: PowerStatus;
  sourceCode: string;
}

export interface PowerRegionSnapshot {
  regionId: string;
  regionName: string;
  group: string;
  groupLabel: string;
  availableGroups: Array<{ id: string; label: string }>;
  currentStatus: PowerStatus;
  currentStatusLabel: string;
  nextChangeAt: string | null;
  nextChangeLabel: string | null;
  timeline: PowerTimelineSlot[];
  sourceUpdatedAt?: string;
  sourceUrl: string;
  note?: string;
}

export type HazardType =
  | 'HAIL'
  | 'THUNDERSTORM'
  | 'HEAVY_RAIN'
  | 'FLOOD'
  | 'STRONG_WIND'
  | 'FOG'
  | 'ICE'
  | 'SNOW'
  | 'EXTREME_HEAT'
  | 'EXTREME_COLD';

export type HazardSeverity = 'ADVISORY' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface HazardItem {
  id: string;
  type: HazardType;
  title: string;
  severity: HazardSeverity;
  confidence: 'PREDICTED';
  startsAt: string;
  metric: string;
  recommendation: string;
}

export interface HazardSnapshot {
  regionId: string;
  regionName: string;
  latitude: number;
  longitude: number;
  highestSeverity: HazardSeverity | null;
  activeEvents: HazardItem[];
  sourceUrl: string;
  summary: string;
}

type RawOutagePayload = {
  regionId?: string;
  lastUpdated?: string;
  fact?: {
    data?: unknown[];
    update?: string;
    updateFact?: string;
  };
  preset?: {
    sch_names?: Record<string, string>;
    time_zone?: Record<string, [string, string, string]>;
    time_type?: Record<string, string>;
    data?: Record<string, Record<string, Record<string, string>>>;
    update?: string;
    updateFact?: string;
  };
  lastUpdateStatus?: {
    status?: string;
    ok?: boolean;
    code?: number;
    message?: string | null;
    at?: string;
  };
};

const POWER_REPOSITORY_BASE = 'https://raw.githubusercontent.com/Baskerville42/outage-data-ua/main/data';
const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';

const POWER_SLUG_BY_REGION: Record<string, string> = {
  kyiv_city: 'kyiv',
  kyiv_obl: 'kyiv-region',
  dnipro: 'dnipro',
  odesa: 'odesa',
};

const REGION_LABELS: Record<string, string> = {
  kyiv_city: 'м. Київ',
  kyiv_obl: 'Київська область',
  dnipro: 'Дніпропетровська область',
  odesa: 'Одеська область',
};

const REGION_COORDINATES: Record<string, { lat: number; lon: number; name: string }> = {
  volyn: { lat: 50.75, lon: 25.34, name: 'Волинська область' },
  rivne: { lat: 50.62, lon: 26.25, name: 'Рівненська область' },
  zhytomyr: { lat: 50.25, lon: 28.66, name: 'Житомирська область' },
  kyiv_obl: { lat: 50.45, lon: 30.52, name: 'Київська область' },
  kyiv_city: { lat: 50.45, lon: 30.52, name: 'м. Київ' },
  chernihiv: { lat: 51.5, lon: 31.28, name: 'Чернігівська область' },
  sumy: { lat: 50.91, lon: 34.8, name: 'Сумська область' },
  kharkiv: { lat: 49.99, lon: 36.23, name: 'Харківська область' },
  luhansk: { lat: 48.57, lon: 39.31, name: 'Луганська область' },
  donetsk: { lat: 48.02, lon: 37.8, name: 'Донецька область' },
  poltava: { lat: 49.59, lon: 34.55, name: 'Полтавська область' },
  dnipro: { lat: 48.46, lon: 35.05, name: 'Дніпропетровська область' },
  zaporizhzhia: { lat: 47.84, lon: 35.14, name: 'Запорізька область' },
  cherkasy: { lat: 49.44, lon: 32.06, name: 'Черкаська область' },
  kirovohrad: { lat: 48.51, lon: 32.26, name: 'Кіровоградська область' },
  vinnytsia: { lat: 49.23, lon: 28.47, name: 'Вінницька область' },
  khmelnytskyi: { lat: 49.42, lon: 26.99, name: 'Хмельницька область' },
  ternopil: { lat: 49.55, lon: 25.59, name: 'Тернопільська область' },
  ivano_frankivsk: { lat: 48.92, lon: 24.71, name: 'Івано-Франківська область' },
  zakarpattia: { lat: 48.62, lon: 22.3, name: 'Закарпатська область' },
  lviv: { lat: 49.84, lon: 24.03, name: 'Львівська область' },
  chernivtsi: { lat: 48.29, lon: 25.94, name: 'Чернівецька область' },
  odesa: { lat: 46.48, lon: 30.73, name: 'Одеська область' },
  mykolaiv: { lat: 46.98, lon: 31.99, name: 'Миколаївська область' },
  kherson: { lat: 46.64, lon: 32.62, name: 'Херсонська область' },
  crimea: { lat: 44.95, lon: 34.1, name: 'АР Крим' },
};

const powerCache = new Map<string, DataEnvelope<PowerRegionSnapshot>>();
const hazardCache = new Map<string, DataEnvelope<HazardSnapshot>>();

const severityWeight: Record<HazardSeverity, number> = {
  ADVISORY: 1,
  MODERATE: 2,
  HIGH: 3,
  CRITICAL: 4,
};

const getKyivClock = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Kyiv',
    weekday: 'short',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const weekday = parts.find((part) => part.type === 'weekday')?.value || 'Mon';
  const hour = Number(parts.find((part) => part.type === 'hour')?.value || '0');
  const weekdayMap: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  return { weekday: weekdayMap[weekday] || 1, hour };
};

const normalizePowerCode = (code: string): PowerStatus => {
  if (code === 'yes') return 'POWER_ON';
  if (code === 'no' || code === 'first' || code === 'second') return 'POWER_OFF';
  if (code === 'maybe' || code === 'mfirst' || code === 'msecond') return 'POSSIBLE_OUTAGE';
  return 'UNKNOWN';
};

export const powerStatusLabel = (status: PowerStatus) => {
  switch (status) {
    case 'POWER_ON': return 'Світло є';
    case 'POWER_OFF': return 'Світла немає';
    case 'POSSIBLE_OUTAGE': return 'Можливе відключення';
    case 'EMERGENCY_OUTAGE': return 'Аварійне відключення';
    default: return 'Статус невідомий';
  }
};

const dataStateFromTimestamp = (timestamp?: string): DataState => {
  if (!timestamp) return 'CACHED';
  const parsed = Date.parse(timestamp);
  if (Number.isNaN(parsed)) return 'CACHED';
  const ageMinutes = (Date.now() - parsed) / 60000;
  if (ageMinutes <= 45) return 'LIVE';
  if (ageMinutes <= 360) return 'CACHED';
  return 'STALE';
};

const nextPowerChange = (timeline: PowerTimelineSlot[], currentHour: number) => {
  const current = timeline[currentHour]?.status || 'UNKNOWN';
  for (let offset = 1; offset < timeline.length; offset += 1) {
    const slot = timeline[(currentHour + offset) % timeline.length];
    if (slot && slot.status !== current) return slot;
  }
  return null;
};

const fetchJson = async <T>(url: string, timeoutMs = 10000): Promise<T> => {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json() as T;
  } finally {
    window.clearTimeout(timer);
  }
};

export const isPowerRegionSupported = (regionId: string) => Boolean(POWER_SLUG_BY_REGION[regionId]);

const fetchPower = async (regionId: string, requestedGroup?: string): Promise<DataEnvelope<PowerRegionSnapshot>> => {
  const slug = POWER_SLUG_BY_REGION[regionId];
  if (!slug) {
    return {
      data: null,
      state: 'NOT_CONNECTED',
      source: 'Power public adapter',
      error: 'Для цього регіону прямий публічний feed ще не підключений.',
      isRealData: false,
    };
  }

  const cacheKey = `${regionId}:${requestedGroup || 'default'}`;
  const sourceUrl = `${POWER_REPOSITORY_BASE}/${slug}.json`;
  try {
    const payload = await fetchJson<RawOutagePayload>(sourceUrl);
    const names = payload.preset?.sch_names || {};
    const groups = Object.entries(names).map(([id, label]) => ({ id, label }));
    const group = requestedGroup && names[requestedGroup] ? requestedGroup : groups[0]?.id;
    const { weekday, hour } = getKyivClock();

    if (!group || !payload.preset?.data?.[group]) {
      const envelope: DataEnvelope<PowerRegionSnapshot> = {
        data: null,
        state: 'ERROR',
        source: 'outage-data-ua / upstream provider',
        updatedAt: payload.lastUpdated,
        error: 'У джерелі немає доступного графіка для вибраної групи.',
        isRealData: true,
      };
      powerCache.set(cacheKey, envelope);
      return envelope;
    }

    const daySchedule = payload.preset.data[group][String(weekday)] || {};
    const timeline: PowerTimelineSlot[] = Array.from({ length: 24 }, (_, slotHour) => {
      const sourceCode = daySchedule[String(slotHour + 1)] || 'unknown';
      return {
        hour: slotHour,
        startLabel: `${String(slotHour).padStart(2, '0')}:00`,
        endLabel: `${String((slotHour + 1) % 24).padStart(2, '0')}:00`,
        status: normalizePowerCode(sourceCode),
        sourceCode,
      };
    });

    const currentStatus = timeline[hour]?.status || 'UNKNOWN';
    const nextChange = nextPowerChange(timeline, hour);
    const sourceUpdatedAt = payload.lastUpdated || payload.lastUpdateStatus?.at;
    const state = dataStateFromTimestamp(sourceUpdatedAt);
    const snapshot: PowerRegionSnapshot = {
      regionId,
      regionName: REGION_LABELS[regionId] || regionId,
      group,
      groupLabel: names[group] || group,
      availableGroups: groups,
      currentStatus,
      currentStatusLabel: powerStatusLabel(currentStatus),
      nextChangeAt: nextChange?.startLabel || null,
      nextChangeLabel: nextChange ? powerStatusLabel(nextChange.status) : null,
      timeline,
      sourceUpdatedAt,
      sourceUrl,
      note: payload.lastUpdateStatus?.ok === false
        ? 'Останнє оновлення джерела завершилося помилкою. Показано останній доступний графік.'
        : undefined,
    };
    const envelope: DataEnvelope<PowerRegionSnapshot> = {
      data: snapshot,
      state,
      source: 'outage-data-ua / upstream provider',
      updatedAt: sourceUpdatedAt,
      isRealData: true,
    };
    powerCache.set(cacheKey, envelope);
    return envelope;
  } catch (error) {
    const cached = powerCache.get(cacheKey);
    if (cached?.data) {
      return {
        ...cached,
        state: cached.state === 'STALE' ? 'STALE' : 'CACHED',
        error: error instanceof Error ? error.message : 'Помилка джерела',
      };
    }
    return {
      data: null,
      state: 'ERROR',
      source: 'outage-data-ua / upstream provider',
      error: error instanceof Error ? error.message : 'Не вдалося отримати дані',
      isRealData: false,
    };
  }
};

type OpenMeteoResponse = {
  generationtime_ms?: number;
  hourly?: {
    time?: string[];
    temperature_2m?: number[];
    precipitation?: number[];
    precipitation_probability?: number[];
    wind_gusts_10m?: number[];
    visibility?: number[];
    weather_code?: number[];
  };
};

const buildHazard = (
  regionId: string,
  index: number,
  type: HazardType,
  title: string,
  severity: HazardSeverity,
  startsAt: string,
  metric: string,
  recommendation: string,
): HazardItem => ({
  id: `${regionId}-${type}-${index}`,
  type,
  title,
  severity,
  confidence: 'PREDICTED',
  startsAt,
  metric,
  recommendation,
});

const highestSeverity = (items: HazardItem[]): HazardSeverity | null => {
  if (!items.length) return null;
  return items.reduce((best, item) => severityWeight[item.severity] > severityWeight[best] ? item.severity : best, items[0].severity);
};

const dedupeHazards = (items: HazardItem[]) => {
  const byType = new Map<HazardType, HazardItem>();
  items.forEach((item) => {
    const current = byType.get(item.type);
    if (!current || severityWeight[item.severity] > severityWeight[current.severity] || item.startsAt < current.startsAt) {
      byType.set(item.type, item);
    }
  });
  return Array.from(byType.values())
    .sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity] || a.startsAt.localeCompare(b.startsAt))
    .slice(0, 6);
};

const fetchHazards = async (regionId: string): Promise<DataEnvelope<HazardSnapshot>> => {
  const coordinates = REGION_COORDINATES[regionId];
  if (!coordinates) {
    return {
      data: null,
      state: 'NOT_CONNECTED',
      source: 'Open-Meteo',
      error: 'Для цього регіону ще не задано координати прогнозу.',
      isRealData: false,
    };
  }

  const params = new URLSearchParams({
    latitude: String(coordinates.lat),
    longitude: String(coordinates.lon),
    hourly: 'temperature_2m,precipitation,precipitation_probability,wind_gusts_10m,visibility,weather_code',
    wind_speed_unit: 'ms',
    timezone: 'Europe/Kyiv',
    forecast_days: '2',
  });
  const sourceUrl = `${OPEN_METEO_BASE}?${params.toString()}`;

  try {
    const response = await fetchJson<OpenMeteoResponse>(sourceUrl);
    const hourly = response.hourly;
    const times = hourly?.time || [];
    const startIndex = Math.max(0, times.findIndex((time) => Date.parse(time) >= Date.now() - 3600000));
    const endIndex = Math.min(times.length, startIndex + 24);
    const items: HazardItem[] = [];

    let firstSixHourRain = 0;
    for (let index = startIndex; index < Math.min(endIndex, startIndex + 6); index += 1) {
      firstSixHourRain += Number(hourly?.precipitation?.[index] || 0);
    }

    for (let index = startIndex; index < endIndex; index += 1) {
      const time = times[index];
      if (!time) continue;
      const temperature = Number(hourly?.temperature_2m?.[index] ?? 0);
      const precipitation = Number(hourly?.precipitation?.[index] ?? 0);
      const probability = Number(hourly?.precipitation_probability?.[index] ?? 0);
      const gust = Number(hourly?.wind_gusts_10m?.[index] ?? 0);
      const visibility = Number(hourly?.visibility?.[index] ?? 100000);
      const weatherCode = Number(hourly?.weather_code?.[index] ?? 0);

      if (weatherCode === 96 || weatherCode === 99) {
        items.push(buildHazard(regionId, index, 'HAIL', 'Ймовірний град', weatherCode === 99 ? 'HIGH' : 'MODERATE', time, `WMO ${weatherCode}`, 'За можливості перемістіть автомобіль під накриття та уникайте відкритих ділянок.'));
      }
      if (weatherCode >= 95 && weatherCode <= 99) {
        items.push(buildHazard(regionId, index, 'THUNDERSTORM', 'Грозова активність', weatherCode === 99 ? 'HIGH' : 'MODERATE', time, `Ймовірність опадів ${probability}%`, 'Уникайте відкритої місцевості та не перебувайте біля поодиноких високих об’єктів.'));
      }
      if (precipitation >= 15) {
        items.push(buildHazard(regionId, index, 'HEAVY_RAIN', 'Сильна злива', 'HIGH', time, `${precipitation.toFixed(1)} мм/год`, 'Перевірте маршрут і уникайте низин та ділянок, схильних до підтоплення.'));
      } else if (precipitation >= 7) {
        items.push(buildHazard(regionId, index, 'HEAVY_RAIN', 'Інтенсивні опади', 'MODERATE', time, `${precipitation.toFixed(1)} мм/год`, 'Врахуйте погіршення видимості та стану дорожнього покриття.'));
      }
      if (gust >= 25) {
        items.push(buildHazard(regionId, index, 'STRONG_WIND', 'Небезпечні пориви вітру', 'CRITICAL', time, `${gust.toFixed(0)} м/с`, 'Уникайте дерев, рекламних конструкцій та не залишайте авто під нестійкими об’єктами.'));
      } else if (gust >= 20) {
        items.push(buildHazard(regionId, index, 'STRONG_WIND', 'Сильний вітер', 'HIGH', time, `${gust.toFixed(0)} м/с`, 'Закріпіть легкі предмети та уникайте дерев і рекламних конструкцій.'));
      } else if (gust >= 15) {
        items.push(buildHazard(regionId, index, 'STRONG_WIND', 'Поривчастий вітер', 'MODERATE', time, `${gust.toFixed(0)} м/с`, 'Будьте уважні під час пересування та паркування.'));
      }
      if (visibility <= 500) {
        items.push(buildHazard(regionId, index, 'FOG', 'Дуже низька видимість', 'HIGH', time, `${Math.round(visibility)} м`, 'Водіям варто зменшити швидкість і збільшити дистанцію.'));
      } else if (visibility <= 1000) {
        items.push(buildHazard(regionId, index, 'FOG', 'Туман / низька видимість', 'MODERATE', time, `${Math.round(visibility)} м`, 'Зменште швидкість і використовуйте відповідне освітлення.'));
      }
      if (temperature <= 1 && precipitation >= 0.5) {
        items.push(buildHazard(regionId, index, 'ICE', 'Ризик ожеледиці', 'MODERATE', time, `${temperature.toFixed(1)}°C · ${precipitation.toFixed(1)} мм`, 'Врахуйте можливу ожеледицю на дорогах і тротуарах.'));
      }
      if (temperature >= 35) {
        items.push(buildHazard(regionId, index, 'EXTREME_HEAT', 'Небезпечна спека', temperature >= 39 ? 'HIGH' : 'MODERATE', time, `${temperature.toFixed(1)}°C`, 'Уникайте тривалого перебування на сонці та підтримуйте водний баланс.'));
      }
      if (temperature <= -20) {
        items.push(buildHazard(regionId, index, 'EXTREME_COLD', 'Сильний мороз', temperature <= -25 ? 'HIGH' : 'MODERATE', time, `${temperature.toFixed(1)}°C`, 'Обмежте перебування надворі та захистіть відкриті ділянки шкіри.'));
      }
    }

    if (firstSixHourRain >= 35 && times[startIndex]) {
      items.push(buildHazard(regionId, startIndex, 'FLOOD', 'Ризик локального підтоплення', firstSixHourRain >= 55 ? 'HIGH' : 'MODERATE', times[startIndex], `${firstSixHourRain.toFixed(0)} мм / 6 год`, 'Уникайте низин, підземних переходів і ділянок із відомим ризиком підтоплення.'));
    }

    const activeEvents = dedupeHazards(items);
    const snapshot: HazardSnapshot = {
      regionId,
      regionName: coordinates.name,
      latitude: coordinates.lat,
      longitude: coordinates.lon,
      highestSeverity: highestSeverity(activeEvents),
      activeEvents,
      sourceUrl,
      summary: activeEvents.length
        ? `Виявлено ${activeEvents.length} прогнозованих ризиків на найближчі 24 години.`
        : 'За моделлю погоди істотних локальних ризиків на найближчі 24 години не виявлено.',
    };
    const envelope: DataEnvelope<HazardSnapshot> = {
      data: snapshot,
      state: 'LIVE',
      source: 'Open-Meteo',
      updatedAt: new Date().toISOString(),
      latencyMs: response.generationtime_ms,
      isRealData: true,
    };
    hazardCache.set(regionId, envelope);
    return envelope;
  } catch (error) {
    const cached = hazardCache.get(regionId);
    if (cached?.data) {
      return {
        ...cached,
        state: 'CACHED',
        error: error instanceof Error ? error.message : 'Помилка погодного джерела',
      };
    }
    return {
      data: null,
      state: 'ERROR',
      source: 'Open-Meteo',
      error: error instanceof Error ? error.message : 'Не вдалося отримати погодні дані',
      isRealData: false,
    };
  }
};

export const publicSituationService = {
  fetchPower,
  fetchHazards,
};
