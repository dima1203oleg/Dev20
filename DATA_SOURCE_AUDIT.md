# Аудит джерел даних (Data Source Audit)

Цей документ описує походження, сервіси та життєвий цикл даних для кожного інформаційного блоку у додатку SIREN UA. Всі дані інкапсульовані у `DataEnvelope<T>` для відстеження їхньої актуальності (LIVE, CACHED, STALE, ERROR).

## 1. Головний екран (Home / Map)
- **Карта загроз (3D WebGL / SVG)**
  - **Джерело**: `threatServerService.ts`
  - **Дані**: `ThreatSceneModel` (радари, траєкторії БпЛА/Ракет, укриття)
  - **Fallback**: CACHED `ThreatSceneModel` з LocalStorage `sirenua_threat_scene_cache`.

- **Регіональні статуси (Тривоги)**
  - **Джерело**: `ukraineMapData.ts` (Mocked for Demo) -> `localStorage: sirenua_regions_state`
  - **Дані**: Масив `RegionData` (статус тривоги, активні загрози).

## 2. Мережа (Network / Affiliate)
- **Агрегована статистика (Активні L1, L2, Конверсія)**
  - **Джерело**: `networkService.ts` (`fetchNetworkSummary`)
  - **Дані**: `NetworkSummary`
  - **Fallback**: CACHED з `CacheManager` (ключ `network_summary`).

- **Дерево партнерів та список**
  - **Джерело**: `networkService.ts` (`fetchNetworkNodes`)
  - **Дані**: Масив `NetworkNode`
  - **Fallback**: CACHED з `CacheManager`.

- **Прогрес Рангу**
  - **Джерело**: Розраховується динамічно через `referralEngine.ts` на основі `summary.qualifiedL1`.
  - **Дані**: `RankTier`, прогрес-бар %.

## 3. Фінанси (Finance)
- **Баланс та метрики**
  - **Джерело**: `financialService.ts` (`fetchFinancialSummary`)
  - **Дані**: `PartnerFinancialSummary` (availableBalance, pendingBalance, lifetimePaid)
  - **Fallback**: CACHED з `CacheManager` (ключ `finance_summary`).

- **Історія транзакцій (Ledger)**
  - **Джерело**: `financialService.ts` (`fetchLedger`)
  - **Дані**: Масив `LedgerTransaction`
  - **Fallback**: CACHED з `CacheManager`.

- **Життєвий цикл виплат (State Machine)**
  - **Джерело**: `financialService.ts` (`executeWithdrawal`)
  - **Дані**: Callbacks on progress: REQUESTED -> PROCESSING -> PAID. Змінює баланс локально на час демо.

## 4. Загальна інфраструктура
- **Кешування**: `CacheManager.ts` з TTL (Time-to-Live) та валідацією версії.
- **Стан (Freshness)**: Відстежується через компонент `DataFreshnessIndicator`, що базується на полі `state` у `DataEnvelope`.
