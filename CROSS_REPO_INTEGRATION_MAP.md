# SIREN UA — Cross-Repository Architecture & Integration Map

This document establishes the verified architectural map, roles, data flows, and integration interfaces across the three repositories forming the SIREN UA ecosystem:

---

## 1. Ecosystem Repositories & Roles

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 SIREN UA ECOSYSTEM                              │
└─────────────────────────────────────────────────────────────────────────────────┘
         │                                      │                                │
         ▼                                      ▼                                ▼
┌──────────────────────┐              ┌──────────────────┐             ┌─────────────────────┐
│ 1. SirenUA-Website   │ ◄──────────► │ 2. SirenUA       │ ◄─────────► │ 3. SirenUA-         │
│ (Web Platform & Hub) │              │ (Core App Logic) │             │    ThreatServer     │
└──────────────────────┘              └──────────────────┘             └─────────────────────┘
  • React 18 + Vite                     • Shared Core VM                 • Real-time Radar &
  • 3D WebGL / Three.js                 • Referral Rules Engine            Early Threat Warning
  • Light/Dark Theme                    • Multi-Device Sync              • Spatial Vector Paths
  • Resident Cabinet                    • Local Persistence Layer        • Official Ingest
  • Finance Hub & Payouts               • Offline Siren Engine             (DSNS, Air Raid UA)
  • Partner Network                     • Emergency Protocols            • High-speed REST &
                                                                           WebSocket / SSE
```

### Repository Roles:
1. **SirenUA-Website** (`https://github.com/atlastrinity/SirenUA-Website`):
   - **Primary Function**: The public web portal, situational dashboard, and partner workspace.
   - **Status**: `DESIGN_LOCKED = TRUE`. Retains the 2-tone theme, 3D Ukraine oblast map, 3D holographic cards, and responsive layout.
   - **Data Consumers**: Displays live threat vectors, partner network constellations, ledger summaries, shelter routes, and device ecosystems.

2. **SirenUA** (`https://github.com/atlastrinity/SirenUA`):
   - **Primary Function**: The core application engine shared between client platforms (Web, iOS, Android, macOS/Windows).
   - **Key Modules**:
     - `ReferralEngine`: Strict 5-tier referral rules (Starter, Bronze, Silver, Gold, Platinum) with rank based exclusively on qualified active L1.
     - `DeviceSync`: Orbital device topology synchronization (Desktop, Mobile, Apple Watch, CarPlay, Home Siren Box).
     - `ShelterEngine`: Offline geographic indexing of fortified civil shelters and route finding.
     - `AudioEngine`: Synthesizer chimes, alarms, and voice notifications.

3. **SirenUA-ThreatServer** (`https://github.com/atlastrinity/SirenUA-ThreatServer`):
   - **Primary Function**: Ingestion, verification, and spatial threat processing backend.
   - **Key Modules**:
     - `ThreatIngest`: Aggregates official sirens (DSNS, Air Alert API, regional military administrations).
     - `RadarProcessor`: Interpolates ballistic trajectories, Shahed-136 routes, cruise missile headings, and calculation of ETA per oblast.
     - `SafetyBroadcast`: High-throughput WebSocket/SSE streaming and resilient `/api/v1/*` REST endpoints.

---

## 2. API Contract & Data Flow Map

```
  [ OFFICIAL SOURCES (DSNS, Radar) ]
                 │
                 ▼
     [ SirenUA-ThreatServer ]
                 │
                 ├──────────────────────────────┬──────────────────────────────┐
                 ▼                              ▼                              ▼
     GET /api/v1/threats/live       GET /api/v1/threats/spatial     GET /api/v1/system/status
     (Oblast alerts status)         (Missile / Drone vectors)       (Health, Latency, Freshness)
                 │                              │                              │
                 └──────────────────────────────┼──────────────────────────────┘
                                                ▼
                                    [ SirenUA Integration Adapter ]
                                    (threatServerService.ts)
                                                │
                          ┌─────────────────────┴─────────────────────┐
                          ▼                                           ▼
                 [ CONNECTED / LIVE ]                        [ NOT CONNECTED / DEMO ]
                 Real radar vectors & alerts                 Safe cached baseline with
                 tagged with "LIVE" badge                    explicit fallback tags
                                                │
                                                ▼
                                    [ SirenUA-Website UI ]
                               • 3D Ukraine Spatial Map
                               • SmartMetricRail
                               • Situation Workspace
                               • Finance & Network Hub
```

---

## 3. Referral Commission & Rank Matrix (Section 8 Locked)

| Rank | Active Paid L1 Required | L1 Commission | L2 Commission | L2 Status | Advancement Metric |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **STARTER** | 1 – 9 | **5%** | **0%** | 🔒 Locked | Own Paid L1 only |
| **BRONZE** | 10 – 29 | **10%** | **10%** | 🟢 Unlocked | Own Paid L1 only |
| **SILVER** | 30 – 74 | **15%** | **15%** | 🟢 Unlocked | Own Paid L1 only |
| **GOLD** | 75 – 199 | **20%** | **20%** | 🟢 Unlocked | Own Paid L1 only |
| **PLATINUM**| 200+ | **25%** | **25%** | 🟢 Unlocked | Own Paid L1 only |

*Note: Level 2 (L2) network partners generate revenue once unlocked starting at Bronze, but NEVER count towards rank advancement. Financial levels are capped strictly at 2 (L1 and L2).*
