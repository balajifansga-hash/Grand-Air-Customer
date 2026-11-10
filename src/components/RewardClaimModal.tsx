import React, { useState } from 'react';
import { CustomerProfile, ScannedUnitCertificate } from '../types';
import { 
  ShieldCheck, 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Mail, 
  CreditCard,
  Fan,
  Building,
  Check
} from 'lucide-react';

interface RewardClaimModalProps {
  unit: ScannedUnitCertificate;
  profile: CustomerProfile;
  onClaimSuccess: (updatedUnit: ScannedUnitCertificate) => void;
  onClose: () => void;
  onRegisterWarranty: (serialNumber: string) => Promise<{ success: boolean; message: string; data?: any }>;
}

export const RewardClaimModal: React.FC<RewardClaimModalProps> = ({
  unit,
  profile,
  onClaimSuccess,
  onClose,
  onRegisterWarranty
}) => {
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [claimCompleted, setClaimCompleted] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleClaim = async () => {
    setIsClaiming(true);
    setStatusMessage('Verifying authenticity and sending automated emails...');

    try {
      const res = await onRegisterWarranty(unit.serialNumber);
      if (res.success) {
        setClaimCompleted(true);
        setStatusMessage(res.message);
        const updatedCertificate: ScannedUnitCertificate = {
          ...unit,
          lifecycleStatus: 'sold',
          warrantyRegistration: {
            customerName: profile.name,
            customerPhone: profile.phone,
            customerEmail: profile.email,
            customerUpiId: profile.upiId,
            redeemAmount: 150,
            redeemStatus: 'Processing',
            registeredAt: new Date().toISOString()
          }
        };
        setTimeout(() => {
          onClaimSuccess(updatedCertificate);
        }, 2200);
      } else {
        setStatusMessage(res.message || 'Registration failed. Please retry.');
        setIsClaiming(false);
      }
    } catch (err: any) {
      setStatusMessage('Network error. Retrying warranty activation...');
      setIsClaiming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-white/20 text-white border border-white/30 backdrop-blur-sm flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Genuine Grand Air Product</span>
            </span>
            <span className="text-emerald-100 text-xs font-mono">100% Authentic</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Product Scanned & Verified!
          </h2>
          <p className="text-emerald-100 text-xs mt-1">
            Serial Key: <strong className="font-mono text-white">{unit.serialNumber}</strong>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Product Summary Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 flex-shrink-0">
              <Fan className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-900 text-sm truncate">{unit.productName}</h3>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                Model: {unit.modelNumber} • Batch: {unit.batchNumber}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>24 Months Comprehensive Manufacturer Warranty</span>
              </div>
            </div>
          </div>

          {/* Cashback & UPI Reward Banner */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-200/60 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                  <Gift className="w-3 h-3 text-amber-700" />
                  <span>Welcome Cashback Reward</span>
                </span>
                <div className="text-3xl font-black text-amber-950 font-mono">
                  ₹150 Cash Redeem
                </div>
                <p className="text-xs text-amber-800 mt-1 max-w-sm">
                  Scanning was successful! Your redeem amount of <strong>₹150</strong> will be credited directly to your UPI ID.
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 flex items-center justify-center text-amber-600 flex-shrink-0">
                <Sparkles className="w-6 h-6 text-amber-600 animate-spin" />
              </div>
            </div>

            {/* Payout & Notification Destination Details */}
            <div className="mt-4 pt-3 border-t border-amber-200/80 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200/60">
                <div className="text-[10px] uppercase font-bold text-slate-400">Target UPI ID</div>
                <div className="font-mono font-bold text-blue-900 truncate mt-0.5">
                  {profile.upiId}
                </div>
              </div>
              <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200/60">
                <div className="text-[10px] uppercase font-bold text-slate-400">Confirmation Email</div>
                <div className="font-semibold text-slate-800 truncate mt-0.5">
                  {profile.email}
                </div>
              </div>
            </div>
          </div>

          {/* Dual Email Notice */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold">Automated Email Notification:</div>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                1. <strong>To Your Email ({profile.email}):</strong> Official digital warranty certificate & ₹150 cashback receipt.<br/>
                2. <strong>To Company (balajifansga@gmail.com):</strong> Automated alert with your UPI ID ({profile.upiId}) and fan serial number.
              </p>
            </div>
          </div>

          {/* Claim Action Button */}
          {claimCompleted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2 animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/30">
                <Check className="w-6 h-6" />
              </div>
              <div className="text-sm font-black text-emerald-900">
                Warranty Activated & Reward Initiated!
              </div>
              <p className="text-xs text-emerald-700">
                Scanning was successful. Redirecting you to your customer warranty dashboard...
              </p>
            </div>
          ) : (
            <div className="pt-2">
              <button
                type="button"
                disabled={isClaiming}
                onClick={handleClaim}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {isClaiming ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing & Sending Emails...</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    <span>Claim ₹150 & Activate 2-Year Warranty</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

