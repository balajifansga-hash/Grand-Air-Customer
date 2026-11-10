import React, { useState, useEffect } from 'react';
import { CustomerProfile } from '../types';
import { 
  User, 
  Phone, 
  CreditCard, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  Gift, 
  Sparkles,
  Fan
} from 'lucide-react';

interface OnboardingModalProps {
  initialProfile: CustomerProfile | null;
  onSaveProfile: (profile: CustomerProfile) => void;
  canClose?: boolean;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  onSaveProfile,
  canClose = false,
  onClose
}) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [phone, setPhone] = useState(initialProfile?.phone || '');
  const [upiId, setUpiId] = useState(initialProfile?.upiId || '');
  const [email, setEmail] = useState(initialProfile?.email || '');
  const [error, setError] = useState('');

  useEffect(() => {
    setName(initialProfile?.name || '');
    setPhone(initialProfile?.phone || '');
    setUpiId(initialProfile?.upiId || '');
    setEmail(initialProfile?.email || '');
    setError('');
  }, [initialProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name / username');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!upiId.trim() || !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g. mobile@upi or name@okhdfcbank)');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address to receive your warranty certificate');
      return;
    }

    setError('');
    onSaveProfile({
      name: name.trim(),
      phone: phone.trim(),
      upiId: upiId.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      registeredAt: initialProfile?.registeredAt || new Date().toISOString()
    });
  };

  const handleFillDemo = () => {
    setName('Rahul Sharma');
    setPhone('9876543210');
    setUpiId('rahul.sharma@okhdfcbank');
    setEmail('rahul.sharma@gmail.com');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 p-6 text-white relative">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Fan className="w-6 h-6 text-white" />
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-bold bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-full border border-white/30 transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Fill Demo Profile</span>
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Customer Warranty & UPI Reward Registration
          </h2>
          <p className="text-blue-100 text-xs mt-1 leading-relaxed">
            Register your buyer details to scan Grand Air fan products, activate official 24-month warranties, and receive instant cashback to your UPI account.
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Gift className="w-3.5 h-3.5" />
            <span>₹150 Guaranteed Cashback on QR Verification</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          {/* 1. Full Name / Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Full Name / Username</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 transition-all outline-none"
            />
          </div>

          {/* 2. Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>Mobile Phone Number</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400 font-mono">+91</span>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="98765 43210"
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-12 pr-3.5 py-2.5 text-xs text-slate-900 font-mono font-medium placeholder-slate-400 transition-all outline-none"
              />
            </div>
          </div>

          {/* 3. UPI ID for Cashback */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>UPI ID (for Cashback Transfer)</span>
              </label>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                ₹150 Credit
              </span>
            </div>
            <input
              type="text"
              required
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. mobile@upi or name@okhdfcbank"
              className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-semibold placeholder-slate-400 transition-all outline-none"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Supports GPay, PhonePe, Paytm, BHIM, Cred, and bank UPI handles.
            </p>
          </div>

          {/* 4. Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul.sharma@gmail.com"
              className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 transition-all outline-none"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Automated warranty certificate and payment confirmation will be delivered to this email.
            </p>
          </div>

          <div className="pt-2 flex gap-2">
            {canClose && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Continue to QR Scanner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

