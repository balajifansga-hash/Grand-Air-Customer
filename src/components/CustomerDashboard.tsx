import React, { useState } from 'react';
import { CustomerProfile, ScannedUnitCertificate } from '../types';
import { 
  Fan, 
  ShieldCheck, 
  Gift, 
  QrCode, 
  Calendar, 
  CheckCircle2, 
  Download, 
  Wrench, 
  Mail, 
  CreditCard, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Clock
} from 'lucide-react';

interface CustomerDashboardProps {
  profile: CustomerProfile;
  appliances: ScannedUnitCertificate[];
  onScanAnother: () => void;
  onInspectAppliance: (cert: ScannedUnitCertificate) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  profile,
  appliances,
  onScanAnother,
  onInspectAppliance
}) => {
  const totalRewards = appliances.length * 150;

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Welcome & Profile Summary Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 border border-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Verified Grand Air Customer
              </span>
              <span className="text-blue-200 text-xs font-mono">{profile.phone}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome, {profile.name}!
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Your registered Grand Air ceiling fans, official digital warranty cards, and ₹150 UPI cashback rewards are active and managed here.
            </p>

            {/* Profile Credentials Pill */}
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-300" />
                <span>UPI: <strong>{profile.upiId}</strong></span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-300" />
                <span>{profile.email}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onScanAnother}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-blue-900 font-black text-xs shadow-lg shadow-black/10 transition-all active:scale-95 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-blue-700" />
              <span>Scan Product QR Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Registered Fans */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Registered Fans</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Fan className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">{appliances.length}</span>
            <span className="text-xs text-blue-600 font-semibold">Active Units</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Covered under 2-year warranty</p>
        </div>

        {/* Card 2: Cashback Rewards */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Redeem Rewards</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 font-mono">₹{totalRewards}</span>
            <span className="text-xs text-amber-700 font-semibold">Earned</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">₹150 per scanned QR code</p>
        </div>

        {/* Card 3: Payout Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">UPI Payout</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-black text-emerald-700 font-mono">Processing</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 truncate">To: {profile.upiId}</p>
        </div>

        {/* Card 4: Official QC Protection */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Protection</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-black text-teal-800">100% Genuine</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">ISO 9001 certified plant</p>
        </div>
      </div>

      {/* Appliances / Fans Registered Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Your Registered Grand Air Fans</h2>
            <p className="text-xs text-slate-500">Official warranty certificates registered under your name</p>
          </div>
          <button
            onClick={onScanAnother}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>+ Register Another Fan</span>
          </button>
        </div>

        {appliances.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <Fan className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Grand Air Fans Registered Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the button below to open your camera and scan the QR code sticker on your fan box to activate your 24-month warranty and unlock ₹150 cashback!
            </p>
            <button
              onClick={onScanAnother}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
            >
              Open Camera & Scan QR
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appliances.map((item) => (
              <div 
                key={item.serialNumber}
                className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 transition-all hover:shadow-md relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
                      <Fan className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm leading-tight">
                        {item.productName}
                      </h4>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Model: {item.modelNumber}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap">
                    Warranty Active
                  </span>
                </div>

                {/* Serial & Warranty Key Details */}
                <div className="bg-white border border-slate-200/90 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Serial Number:</span>
                    <span className="font-mono font-bold text-blue-700">{item.serialNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Warranty Expiry:</span>
                    <span className="font-bold text-slate-800">{new Date(item.warranty?.expiryDate || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Cashback Payout:</span>
                    <span className="font-bold text-emerald-700 font-mono">₹150 to {profile.upiId}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onInspectAppliance(item)}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Digital Certificate</span>
                  </button>
                  <button
                    onClick={() => alert(`Service ticket opened for ${item.serialNumber}. Grand Air technician will contact you on ${profile.phone}.`)}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                    title="Request Maintenance or Service"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Service</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Helpline & Support Card */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-300">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">Grand Air Customer Care Desk</div>
            <div className="text-base font-black">1800-425-GRAND • care@grandair.in</div>
          </div>
        </div>
        <div className="text-xs text-slate-400 text-center sm:text-right">
          Mon - Sat • 9:00 AM - 7:00 PM IST<br/>
          Coimbatore, Tamil Nadu, India
        </div>
      </div>

    </div>
  );
};

