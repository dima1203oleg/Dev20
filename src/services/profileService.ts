/**
 * SIREN UA User Profile & Account Domain Service
 * 
 * Manages authenticated user profile, identity verification status,
 * partner accreditation, and settings persistence.
 * 
 * Strictly integrates with `referralEngine.ts`.
 */

import { DataEnvelope } from '../types/dataEnvelope';
import { calculateRankByL1, getNextTierInfo, ReferralTierDefinition } from './referralEngine';

export interface UserProfileData {
  id: string;
  partnerId: string;
  partnerCode: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  regionId: string;
  avatarUrl: string;
  registrationDate: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  qualifiedL1: number;
  totalNetworkCount: number;
  currentRank: ReferralTierDefinition;
  nextRank: ReferralTierDefinition | null;
  remainingL1ToNextRank: number;
  rankProgressPercent: number;
  ambassadorStatus: 'NOT_ELIGIBLE' | 'CANDIDATE' | 'APPROVED';
  ambassadorTitle: string;
}

const DEFAULT_PROFILE: UserProfileData = {
  id: 'usr-994201',
  partnerId: 'SRN-849201',
  partnerCode: 'OLEKSANDR25',
  fullName: 'Олександр Кравчук',
  firstName: 'Олександр',
  lastName: 'Кравчук',
  email: 'o.kravchuk@gmail.com',
  phone: '+380 (67) 842-19-44',
  city: 'Одеса',
  regionId: 'odesa',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  registrationDate: '12 квітня 2024',
  isEmailVerified: true,
  isPhoneVerified: true,
  qualifiedL1: 154,
  totalNetworkCount: 2847,
  currentRank: calculateRankByL1(154),
  nextRank: getNextTierInfo(calculateRankByL1(154), 154).nextTier,
  remainingL1ToNextRank: getNextTierInfo(calculateRankByL1(154), 154).remainingL1, // 46 for Platinum
  rankProgressPercent: getNextTierInfo(calculateRankByL1(154), 154).progressPercent, // 63%
  ambassadorStatus: 'CANDIDATE',
  ambassadorTitle: 'Кандидат у Бренд-Амбасадори',
};

class ProfileService {
  private profile: UserProfileData = DEFAULT_PROFILE;

  public async getProfile(): Promise<DataEnvelope<UserProfileData>> {
    const currentRank = calculateRankByL1(this.profile.qualifiedL1);
    const progression = getNextTierInfo(currentRank, this.profile.qualifiedL1);

    const data: UserProfileData = {
      ...this.profile,
      currentRank,
      nextRank: progression.nextTier,
      remainingL1ToNextRank: progression.remainingL1,
      rankProgressPercent: progression.progressPercent,
    };

    return {
      data,
      state: 'DEMO',
      source: 'LOCAL_DEMO_PROFILE_DATA',
      updatedAt: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
      isRealData: false,
    };
  }

  public updateProfile(updates: Partial<UserProfileData>): UserProfileData {
    this.profile = { ...this.profile, ...updates };
    return this.profile;
  }
}

export const profileService = new ProfileService();
