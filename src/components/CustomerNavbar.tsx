import React from 'react';
import { CustomerProfile } from '../types';
import { 
  Fan, 
  User, 
  QrCode, 
  Mail, 
  LogOut, 
  Gift, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface CustomerNavbarProps {
  profile: CustomerProfile | null;
  onOpenScanner: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
  earnedRewards: number;
}

export const CustomerNavbar: React.FC<CustomerNavbarProps> = ({
  profile,
  onOpenScanner,
  onEditProfile,
  onLogout,
  earnedRewards
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/20 group">
              <Fan className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-wider text-slate-900 font-sans">
                  GRAND AIR
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Customer
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium -mt-0.5">
                Warranty & Cashback Portal
              </div>
            </div>
          </div>

          {/* Action buttons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Rewards Pill */}
            {profile && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                <Gift className="w-3.5 h-3.5 text-amber-600" />
                <span>Rewards: ₹{earnedRewards}</span>
              </div>
            )}

            {/* Scan Product Button */}
            <button
              onClick={onOpenScanner}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan QR Code</span>
            </button>

            {/* Customer Profile badge & Logout */}
            {profile ? (
              <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2 sm:pl-3">
                <button
                  onClick={onEditProfile}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-800 font-semibold transition-all"
                  title="Edit Customer Profile"
                >
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span className="max-w-[90px] sm:max-w-[120px] truncate">{profile.name}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Switch Customer / Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onEditProfile}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

