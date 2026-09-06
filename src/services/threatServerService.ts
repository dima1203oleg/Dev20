/**
 * SIREN UA ThreatServer Integration Service
 * 
 * Provides unified, contract-locked integration with SirenUA-ThreatServer & SirenUA core.
 * Handles live polling, status probing, spatial threat radar, fallback caching,
 * and explicit connectivity status ('CONNECTED' | 'NOT_CONNECTED' | 'STALE' | 'DEMO_MODE').
 */

import { RegionData, AlertEvent, ThreatTrajectory } from '../types';
import { INITIAL_REGIONS, INITIAL_ALERTS_FEED } from '../data/ukraineMapData';
import { INITIAL_TRAJECTORIES } from '../data/spatialThreatData';

export type ThreatServerConnectionStatus = 
  | 'CONNECTED' 
  | 'NOT_CONNECTED' 
  | 'STALE' 
  | 'OFFLINE' 
  | 'DEMO_MODE';

export interface ThreatServerSystemStatus {
  service: string;
  version: string;
  status: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  uptimeSeconds: number;
  activeIngestSources: string[];
  lastIngestTimestamp: string;
  latencyMs: number;
  totalActiveAlerts: number;
  totalActiveVectors: number;
  environment: 'production' | 'staging' | 'development' | 'offline_fallback';
}

export interface LiveThreatsPayload {
  regions: RegionData[];
  alerts: AlertEvent[];
  trajectories: ThreatTrajectory[];
  systemStatus: ThreatServerSystemStatus;
  connectionStatus: ThreatServerConnectionStatus;
  lastUpdated: string;
  isRealData: boolean;
}

const API_BASE = '/api/v1';
const CACHE_KEY_REGIONS = 'sirenua_cached_regions_v1';
const CACHE_KEY_ALERTS = 'sirenua_cached_alerts_v1';

class ThreatServerService {
  private connectionStatus: ThreatServerConnectionStatus = 'NOT_CONNECTED';
  private lastStatus: ThreatServerSystemStatus | null = null;
  private isDemoMode: boolean = false;

  public setDemoMode(enabled: boolean) {
    this.isDemoMode = enabled;
  }

  public getIsDemoMode(): boolean {
    return this.isDemoMode;
  }

  public getConnectionStatus(): ThreatServerConnectionStatus {
    if (this.isDemoMode) return 'DEMO_MODE';
    return this.connectionStatus;
  }

  /**
   * Probes ThreatServer health and returns system status
   */
  public async checkHealth(): Promise<ThreatServerSystemStatus> {
    const start = performance.now();
    try {
      const response = await fetch(`${API_BASE}/system/status`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });

      const latencyMs = Math.round(performance.now() - start);

      if (response.ok) {
        const data = await response.json();
        this.connectionStatus = 'CONNECTED';
        this.lastStatus = {
          ...data,
          latencyMs,
          status: 'HEALTHY'
        };
        return this.lastStatus;
      } else {
        this.connectionStatus = 'STALE';
      }
    } catch {
      this.connectionStatus = 'NOT_CONNECTED';
    }

    // Default fallback status when ThreatServer is offline or not running locally
    this.lastStatus = {
      service: 'SirenUA-ThreatServer',
      version: '2.4.0',
      status: 'OFFLINE',
      uptimeSeconds: 0,
      activeIngestSources: ['DSNS_UA', 'AIR_RAID_OFFICIAL', 'RADAR_EARLY_WARNING'],
      lastIngestTimestamp: new Date().toISOString(),
      latencyMs: 0,
      totalActiveAlerts: INITIAL_REGIONS.filter(r => r.isAlarm).length,
      totalActiveVectors: INITIAL_TRAJECTORIES.length,
      environment: 'offline_fallback'
    };

    return this.lastStatus;
  }

  /**
   * Fetches full live threat dataset (regions + alerts + trajectories)
   */
  public async fetchLiveThreats(): Promise<LiveThreatsPayload> {
    if (this.isDemoMode) {
      return {
        regions: INITIAL_REGIONS,
        alerts: INITIAL_ALERTS_FEED,
        trajectories: INITIAL_TRAJECTORIES,
        systemStatus: {
          service: 'SirenUA-ThreatServer (Demo)',
          version: '2.4.0',
          status: 'HEALTHY',
          uptimeSeconds: 86400,
          activeIngestSources: ['SIMULATOR_SCENARIOS'],
          lastIngestTimestamp: new Date().toISOString(),
          latencyMs: 12,
          totalActiveAlerts: 3,
          totalActiveVectors: 2,
          environment: 'development'
        },
        connectionStatus: 'DEMO_MODE',
        lastUpdated: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
        isRealData: false
      };
    }

    try {
      const [regionsRes, alertsRes, radarRes] = await Promise.all([
        fetch(`${API_BASE}/threats/regions`, { signal: AbortSignal.timeout(3500) }),
        fetch(`${API_BASE}/alerts/feed`, { signal: AbortSignal.timeout(3500) }),
        fetch(`${API_BASE}/threats/spatial`, { signal: AbortSignal.timeout(3500) }),
      ]);

      if (regionsRes.ok && alertsRes.ok && radarRes.ok) {
        const regions = await regionsRes.json();
        const alerts = await alertsRes.json();
        const trajectories = await radarRes.json();
        
        this.connectionStatus = 'CONNECTED';
        
        // Cache for offline resilience
        try {
          localStorage.setItem(CACHE_KEY_REGIONS, JSON.stringify(regions));
          localStorage.setItem(CACHE_KEY_ALERTS, JSON.stringify(alerts));
        } catch {
          // ignore
        }

        return {
          regions,
          alerts,
          trajectories,
          systemStatus: await this.checkHealth(),
          connectionStatus: 'CONNECTED',
          lastUpdated: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
          isRealData: true
        };
      }
    } catch {
      // Offline fallback
    }

    this.connectionStatus = 'NOT_CONNECTED';
    
    // Retrieve cached data if available
    let cachedRegions = INITIAL_REGIONS;
    let cachedAlerts = INITIAL_ALERTS_FEED;

    try {
      const savedReg = localStorage.getItem(CACHE_KEY_REGIONS);
      const savedAlt = localStorage.getItem(CACHE_KEY_ALERTS);
      if (savedReg) cachedRegions = JSON.parse(savedReg);
      if (savedAlt) cachedAlerts = JSON.parse(savedAlt);
    } catch {
      // ignore
    }

    return {
      regions: cachedRegions,
      alerts: cachedAlerts,
      trajectories: INITIAL_TRAJECTORIES,
      systemStatus: this.lastStatus || await this.checkHealth(),
      connectionStatus: 'NOT_CONNECTED',
      lastUpdated: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
      isRealData: false
    };
  }
}

export const threatServerService = new ThreatServerService();
