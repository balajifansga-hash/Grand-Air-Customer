import React, { useRef } from 'react';
import { ScannedUnitCertificate, CustomerProfile } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ShieldCheck, 
  Fan, 
  Printer, 
  X, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Building 
} from 'lucide-react';

interface DigitalWarrantyCardProps {
  unit: ScannedUnitCertificate;
  profile: CustomerProfile;
  onClose: () => void;
}

export const DigitalWarrantyCard: React.FC<DigitalWarrantyCardProps> = ({
  unit,
  profile,
  onClose
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        
        {/* Certificate Card Printable Container */}
        <div ref={cardRef} className="p-6 bg-gradient-to-b from-slate-50 to-white text-slate-900 border-b border-slate-200">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-blue-600 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white">
                <Fan className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-black tracking-wider text-slate-900">GRAND AIR</div>
                <div className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">
                  Electronic Certificate of Authenticity
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 no-print"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Certificate Body */}
          <div className="py-5 space-y-4">
            <div className="text-center space-y-1">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>24-Month Active Manufacturer Warranty</span>
              </span>
              <h3 className="text-lg font-black text-slate-900 pt-1">{unit.productName}</h3>
              <p className="text-xs text-slate-500 font-mono">Model: {unit.modelNumber} • {unit.specs?.sweepMm || 1200}mm Sweep</p>
            </div>

            {/* QR Code & Serial Key Centerpiece */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col items-center justify-center space-y-3">
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                <QRCodeSVG
                  value={JSON.stringify({
                    serial: unit.serialNumber,
                    verifyCode: unit.verificationCode,
                    org: 'Grand Air Electronics Pvt Ltd',
                    model: unit.modelNumber,
                    customer: profile.name,
                    warranty: 'Active 24M'
                  })}
                  size={140}
                  level="H"
                />
              </div>

              <div className="text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Unique Serial Key</div>
                <div className="text-base font-mono font-black text-blue-700 tracking-wide">
                  {unit.serialNumber}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  Security Code: <strong className="text-slate-700">{unit.verificationCode}</strong>
                </div>
              </div>
            </div>

            {/* Customer Details Snapshot */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Registered Owner</span>
                <span className="font-bold text-slate-900 truncate block mt-0.5">{profile.name}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Registered Mobile</span>
                <span className="font-mono font-bold text-slate-900 block mt-0.5">{profile.phone}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Cashback UPI</span>
                <span className="font-mono font-bold text-emerald-700 truncate block mt-0.5">{profile.upiId}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Warranty Expiry</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {new Date(unit.warranty?.expiryDate || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Official Seal / Quality Stamp */}
            <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-bold text-blue-900">QC Passed & Holographically Sealed</div>
                  <div className="text-[10px] text-blue-700">ISO 9001:2015 Coimbatore Factory Facility</div>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-blue-900 font-bold">
                {unit.qcStamp || 'QC-PASSED-ISO9001'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-100 flex items-center justify-between gap-3 no-print">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Warranty Card</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

