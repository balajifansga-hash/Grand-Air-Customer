export interface CustomerProfile {
  name: string;
  phone: string;
  upiId: string;
  email: string;
  registeredAt?: string;
}

export interface UnitWarranty {
  active: boolean;
  totalMonths: number;
  expiryDate: string;
  remainingDays: number;
}

export interface ScannedUnitCertificate {
  organization: string;
  productName: string;
  modelNumber: string;
  serialNumber: string;
  verificationCode: string;
  category: string;
  batchNumber: string;
  manufacturingDate: string;
  plantLocation: string;
  qcStamp: string;
  qcPassed: boolean;
  lifecycleStatus: string;
  specs: {
    sweepMm: number;
    rpm: number;
    powerWatts: number;
    color: string;
    warrantyMonths: number;
  };
  warranty: UnitWarranty;
  verificationCount: number;
  lastScannedAt?: string;
  warrantyRegistration?: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerUpiId?: string;
    redeemAmount?: number;
    redeemStatus?: string;
    registeredAt: string;
  };
}

export interface EmailRecord {
  id: string;
  recipientType: 'customer' | 'management';
  to: string;
  from?: string;
  subject: string;
  html?: string;
  bodyHtml?: string;
  serialNumber?: string;
  customerName?: string;
  customerUpiId?: string;
  redeemAmount?: number;
  sentAt: string;
  status: 'delivered' | 'simulated' | 'pending_smtp' | 'failed';
}

