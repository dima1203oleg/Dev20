import { Shelter } from '../types';
import { DataEnvelope } from '../types/dataEnvelope';
import { runtimeConfig } from '../config/runtime';
import { getJson, isJsonObject } from './apiClient';
import { INITIAL_SHELTERS } from '../data/spatialThreatData';

const nowTime = () => new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

const isShelter = (value: unknown): value is Shelter => {
  if (!isJsonObject(value) || typeof value.id !== 'string' || typeof value.name !== 'string' || typeof value.address !== 'string') return false;
  if (typeof value.regionId !== 'string' || typeof value.capacity !== 'number' || typeof value.distanceMeters !== 'number' || typeof value.walkTimeMins !== 'number') return false;
  if (!['metro', 'bunker', 'basement', 'parking'].includes(String(value.type))) return false;
  if (!['VERIFIED_DSNS', 'COMMUNITY_CHECKED'].includes(String(value.verifiedStatus))) return false;
  if (!isJsonObject(value.features)) return false;
  return ['powerGenerator', 'wifi', 'ventilation', 'waterSupply', 'wheelchairAccessible', 'allDayOpen']
    .every((key) => typeof value.features?.[key] === 'boolean');
};

class ShelterService {
  public async getShelters(regionId: string): Promise<DataEnvelope<Shelter[]>> {
    const updatedAt = nowTime();

    if (runtimeConfig.apiBaseUrl) {
      try {
        const remote = await getJson<unknown>(`/api/v1/shelters?regionId=${encodeURIComponent(regionId)}`, 2500);
        if (!Array.isArray(remote) || !remote.every(isShelter)) throw new Error('Shelter payload has invalid shape');
        return {
          data: remote,
          state: 'LIVE',
          source: 'SIREN_UA_SHELTER_REGISTRY',
          updatedAt,
          isRealData: true,
        };
      } catch {
        return {
          data: null,
          state: 'NOT_CONNECTED',
          source: 'SIREN_UA_SHELTER_REGISTRY',
          updatedAt,
          isRealData: false,
          error: 'Реєстр укриттів не підключений або повернув некоректні дані',
        };
      }
    }

    return {
      data: INITIAL_SHELTERS.filter((shelter) => shelter.regionId === regionId),
      state: 'DEMO',
      source: 'LOCAL_DEMO_SHELTER_DATA',
      updatedAt,
      isRealData: false,
    };
  }
}

export const shelterService = new ShelterService();
