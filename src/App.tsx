import React, { useState, useEffect } from 'react';
import { CustomerProfile, ScannedUnitCertificate } from './types';
import { CustomerApiService } from './services/api';
import { CustomerNavbar } from './components/CustomerNavbar';
import { OnboardingModal } from './components/OnboardingModal';
import { CameraQRScanner } from './components/CameraQRScanner';
import { RewardClaimModal } from './components/RewardClaimModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { DigitalWarrantyCard } from './components/DigitalWarrantyCard';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<CustomerProfile | null>(() => CustomerApiService.getSavedProfile());
  const [appliances, setAppliances] = useState<ScannedUnitCertificate[]>(() => {
    const saved = CustomerApiService.getSavedProfile();
    return saved ? CustomerApiService.getRegisteredAppliances(saved.phone || saved.email) : [];
  });
  
  // Modals & Views
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => !CustomerApiService.getSavedProfile());
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannedCandidate, setScannedCandidate] = useState<ScannedUnitCertificate | null>(null);
  const [inspectingAppliance, setInspectingAppliance] = useState<ScannedUnitCertificate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync registered appliances strictly for the current logged-in customer identity
  useEffect(() => {
    if (profile?.phone || profile?.email) {
      const id = profile.phone || profile.email;
      const cached = CustomerApiService.getRegisteredAppliances(id);
      setAppliances(cached);

      CustomerApiService.fetchCustomerRegisteredAppliances(id).then(fresh => {
        if (Array.isArray(fresh)) {
          setAppliances(fresh);
        }
      });
    } else {
      setAppliances([]);
    }
  }, [profile?.phone, profile?.email]);

  // Check URL query parameters if user scanned a QR via native camera (e.g. ?verify=GA-CF-... or ?sn=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const snParam = params.get('verify') || params.get('sn') || params.get('code');
    if (snParam) {
      handleCodeScanned(snParam);
    }
  }, []);

  const handleSaveProfile = (newProfile: CustomerProfile) => {
    CustomerApiService.saveProfile(newProfile);
    setProfile(newProfile);
    setIsOnboardingOpen(false);

    // Strictly load appliances for this specific customer account only
    const id = newProfile.phone || newProfile.email;
    const local = CustomerApiService.getRegisteredAppliances(id);
    setAppliances(local);

    CustomerApiService.fetchCustomerRegisteredAppliances(id).then(fresh => {
      if (Array.isArray(fresh)) setAppliances(fresh);
    });

    showToast(`Welcome, ${newProfile.name}! Profile & UPI details saved.`);
    
    // Automatically open camera scanner after onboarding
    setTimeout(() => {
      setIsScannerOpen(true);
    }, 400);
  };

  const handleLogout = () => {
    const ok = window.confirm('Sign out of Grand Air Customer Portal?');
    if (ok) {
      CustomerApiService.clearProfile();
      setProfile(null);
      setAppliances([]);
      setIsOnboardingOpen(true);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Called when camera scanner or photo upload finds a serial number
  const handleCodeScanned = async (serial: string) => {
    setIsScannerOpen(false);
    showToast(`Verifying Grand Air Serial Key: ${serial}...`);

    const result = await CustomerApiService.verifySerialNumber(serial);
    if (result.success && result.genuine && result.certificate) {
      setScannedCandidate(result.certificate);
    } else {
      let cleanMsg = result.message || `The scanned code "${serial}" is not a recognized Grand Air electronic serial key.`;
      if (cleanMsg.includes('SSL') || cleanMsg.includes('routines') || cleanMsg.includes('alert')) {
        cleanMsg = `Connecting to factory records for serial "${serial}". Please retry or check the serial code printed below the QR code.`;
      }
      showToast(`⚠️ ${cleanMsg}`);
    }
  };

  // Warranty Registration & Dual Email Trigger
  const handleRegisterWarranty = async (serialNumber: string) => {
    if (!profile) {
      setIsOnboardingOpen(true);
      return { success: false, message: 'Customer profile required' };
    }
    return await CustomerApiService.registerCustomerWarranty(serialNumber, profile);
  };

  // After customer claims reward & activates warranty
  const handleClaimSuccess = (updatedUnit: ScannedUnitCertificate) => {
    if (profile) {
      CustomerApiService.saveRegisteredAppliance(updatedUnit, profile.phone || profile.email);
    }
    setAppliances(prev => [updatedUnit, ...prev.filter(item => item.serialNumber !== updatedUnit.serialNumber)]);
    setScannedCandidate(null);
    showToast(`🎉 ₹150 Cashback Initiated! Emails triggered to you and balajifansga@gmail.com.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar */}
      <CustomerNavbar
        profile={profile}
        onOpenScanner={() => {
          if (!profile) {
            setIsOnboardingOpen(true);
          } else {
            setIsScannerOpen(true);
          }
        }}
        onEditProfile={() => setIsOnboardingOpen(true)}
        onLogout={handleLogout}
        earnedRewards={appliances.length * 150}
      />

      {/* Main Customer Dashboard */}
      <main className="flex-1">
        {profile ? (
          <CustomerDashboard
            profile={profile}
            appliances={appliances}
            onScanAnother={() => setIsScannerOpen(true)}
            onInspectAppliance={(cert) => setInspectingAppliance(cert)}
          />
        ) : (
          <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto shadow-md">
              <span className="text-3xl">🌀</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">Grand Air Customer Hub</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Register your profile to scan fan QR codes, activate official 24-month warranties, and receive ₹150 instant UPI rewards.
            </p>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all"
            >
              Get Started • Register Details
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-slate-800 font-bold">Grand Air Electronics Pvt. Ltd.</strong> • Official Customer Warranty & Reward Portal
          </div>
          <div className="text-slate-400 text-[11px]">
            Instant UPI Cashback • Digital QR Verification • ISO 9001:2015
          </div>
        </div>
      </footer>

      {/* 1. Onboarding / Profile Modal */}
      {isOnboardingOpen && (
        <OnboardingModal
          initialProfile={profile}
          onSaveProfile={handleSaveProfile}
          canClose={!!profile}
          onClose={() => setIsOnboardingOpen(false)}
        />
      )}

      {/* 2. Live Camera QR Scanner */}
      <CameraQRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleCodeScanned}
      />

      {/* 3. Scanned Product & Cashback Claim Modal */}
      {scannedCandidate && profile && (
        <RewardClaimModal
          unit={scannedCandidate}
          profile={profile}
          onClaimSuccess={handleClaimSuccess}
          onClose={() => setScannedCandidate(null)}
          onRegisterWarranty={handleRegisterWarranty}
        />
      )}

      {/* 4. Digital Warranty Certificate Modal */}
      {inspectingAppliance && profile && (
        <DigitalWarrantyCard
          unit={inspectingAppliance}
          profile={profile}
          onClose={() => setInspectingAppliance(null)}
        />
      )}

      {/* 5. Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)} 
            className="text-slate-400 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default App;

