// Financial Types & ViewModels for SIREN UA DEV20

export type Money = number;

export type FinancialDataStatus = 'SUCCESS' | 'LOADING' | 'STALE' | 'ERROR';

export interface PartnerFinancialSummary {
  totalBalance: Money;
  availableBalance: Money;
  pendingBalance: Money;
  heldBalance: Money;
  earnedThisMonth: Money;
  earnedLastMonth: Money;
  lifetimeEarnings: Money;
  lifetimePaid: Money;
  minimumPayout: Money;
  amountUntilMinimum?: Money;
  l1Earnings?: Money;
  l2Earnings?: Money;
  sparkline?: number[];
  qualifiedL1?: number;
  updatedAt: string;
  status: FinancialDataStatus;
}

export interface FinancialCardViewModel {
  balance: {
    total: Money;
    available: Money;
    pending: Money;
    held: Money;
  };
  earnings: {
    thisMonth: Money;
    lastMonth: Money;
    lifetime: Money;
    l1?: Money;
    l2?: Money;
    sparklineData: number[];
    percentageChange: number;
  };
  payout: {
    available: Money;
    lifetimePaid: Money;
    minimum: Money;
    remainingUntilMinimum?: Money;
    eligible: boolean;
  };
  rank: {
    name: string;
    id: 'STARTER' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    l1Rate: number;
    l2Rate: number;
    qualifiedL1: number;
    nextThreshold?: number;
    nextRankName?: string;
    remainingToNext?: number;
    isL2Unlocked: boolean;
  };
  updatedAt: string;
  dataState: FinancialDataStatus;
}
