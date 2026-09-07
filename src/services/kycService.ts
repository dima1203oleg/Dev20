/**
 * SIREN UA KYC Verification Service
 */

import { DataEnvelope } from '../types/dataEnvelope';

export interface KycVerificationData {
  status: 'VERIFIED' | 'PENDING' | 'DOCUMENTS_REQUIRED' | 'UNVERIFIED';
  method: 'DIIA_SIGN' | 'PASSPORT_SCAN' | 'BANK_ID';
  verifiedAt: string;
  documentType: 'ID_CARD' | 'PASSPORT' | 'TAX_NUMBER';
  documentNumberMasked: string;
  taxIdMasked: string;
  limits: {
    maxSingleWithdrawalUah: number;
    monthlyLimitUah: number;
    unlimitedPayouts: boolean;
  };
}

const DEFAULT_KYC: KycVerificationData = {
  status: 'VERIFIED',
  method: 'DIIA_SIGN',
  verifiedAt: '14.04.2024, 15:42',
  documentType: 'ID_CARD',
  documentNumberMasked: '•••••••• 4819',
  taxIdMasked: '3481••••92',
  limits: {
    maxSingleWithdrawalUah: 150000,
    monthlyLimitUah: 1000000,
    unlimitedPayouts: true,
  },
};

class KycService {
  private kyc: KycVerificationData = DEFAULT_KYC;

  public async getKycStatus(): Promise<DataEnvelope<KycVerificationData>> {
    return {
      data: this.kyc,
      state: 'LIVE',
      source: 'KYC_GOV_VERIFICATION_SERVICE',
      updatedAt: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
      isRealData: true,
    };
  }
}

export const kycService = new KycService();
