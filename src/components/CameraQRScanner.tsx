import React, { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { CustomerApiService } from '../services/api';
import { 
  Camera, 
  X, 
  Upload, 
  FlipHorizontal, 
  AlertCircle, 
  Search, 
  Sparkles,
  QrCode
} from 'lucide-react';

interface CameraQRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (scannedText: string) => void;
}

export const CameraQRScanner: React.FC<CameraQRScannerProps> = ({
  isOpen,
  onClose,
  onScanSuccess
}) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [manualInput, setManualInput] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const scannerInstanceRef = useRef<Html5Qrcode | null>(null);

  const READER_ELEMENT_ID = 'grand-air-html5-qr-reader';
  const FILE_READER_ELEMENT_ID = 'grand-air-html5-qr-file-reader';

  // Stop camera tracks and clear Html5Qrcode instance
  const stopCamera = async () => {
    if (scannerInstanceRef.current) {
      try {
        if (scannerInstanceRef.current.isScanning) {
          await scannerInstanceRef.current.stop();
        }
        await scannerInstanceRef.current.clear();
      } catch (e) {
        // ignore cleanup errors
      }
      scannerInstanceRef.current = null;
    }
    setCameraActive(false);
  };

  // Start Camera with Html5Qrcode ZXing engine
  const startCamera = async () => {
    await stopCamera();
    setCameraError('');

    try {
      const html5QrCode = new Html5Qrcode(READER_ELEMENT_ID);
      scannerInstanceRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: facingMode },
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          handleDetectedCode(decodedText);
        },
        () => {
          // ignore scan frame misses
        }
      );

      setCameraActive(true);
    } catch (err: any) {
      console.warn('Html5Qrcode camera error:', err);
      setCameraError('Camera access unavailable or blocked. Please enable camera permission, upload a QR photo, or enter the serial key.');
      setCameraActive(false);
    }
  };

  const extractSerialFromScannedText = (raw: string): string => {
    if (!raw) return '';
    const text = raw.trim();

    // 1. Direct Regex match for Grand Air Serial (GA-CF-YYYYMM-BXX-XXXX) anywhere in text
    const serialMatch = text.match(/GA-[A-Z0-9]{2,4}-\d{6}-B\d{2,4}-\d{3,5}/i);
    if (serialMatch) {
      return serialMatch[0].toUpperCase();
    }

    // 2. Try JSON parsing
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
        const candidate = parsed.serialNumber || parsed.sn || parsed.serial || parsed.id;
        if (candidate) {
          const cMatch = String(candidate).match(/GA-[A-Z0-9]{2,4}-\d{6}-B\d{2,4}-\d{3,5}/i);
          return cMatch ? cMatch[0].toUpperCase() : String(candidate).trim().toUpperCase();
        }
      }
    } catch {}

    // 3. Try URL parsing
    try {
      const url = new URL(text);
      const param = url.searchParams.get('verify') || url.searchParams.get('sn') || url.searchParams.get('serial');
      if (param) {
        const pMatch = param.match(/GA-[A-Z0-9]{2,4}-\d{6}-B\d{2,4}-\d{3,5}/i);
        return pMatch ? pMatch[0].toUpperCase() : param.trim().toUpperCase();
      }
    } catch {}

    return text.toUpperCase();
  };

  const handleDetectedCode = async (code: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    await stopCamera();

    const extractedSerial = extractSerialFromScannedText(code);
    onScanSuccess(extractedSerial);
  };

  // Photo Upload scan using Html5Qrcode ZXing engine
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    // 1. Try decoding via Html5Qrcode ZXing scanner
    try {
      let fileScanner = new Html5Qrcode(FILE_READER_ELEMENT_ID);
      const decodedResult = await fileScanner.scanFile(file, false);
      if (decodedResult) {
        await fileScanner.clear();
        handleDetectedCode(decodedResult);
        return;
      }
    } catch (qrErr: any) {
      console.warn('Html5Qrcode file scan warning:', qrErr);
    }

    // 2. Check if the image filename itself has the Grand Air serial format (e.g. QR-GA-CF-202611-B01-0004.png)
    const nameMatch = file.name.match(/GA-[A-Z]{2}-\d{6}-B\d{2,3}-\d{4}/i);
    if (nameMatch) {
      handleDetectedCode(nameMatch[0]);
      return;
    }

    // 3. Fallback: Check if BarcodeDetector is supported in this browser
    if ('BarcodeDetector' in window) {
      try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((res) => { img.onload = res; });
        const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        const barcodes = await detector.detect(img);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          handleDetectedCode(barcodes[0].rawValue);
          return;
        }
      } catch (err) {
        console.warn('BarcodeDetector fallback error:', err);
      }
    }

    setIsProcessing(false);
    setUploadError('Could not detect QR code from uploaded photo. Please enter the serial number printed below the QR sticker:');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      stopCamera();
      onScanSuccess(manualInput.trim().toUpperCase());
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      // Small timeout to ensure DOM container is mounted
      const timer = setTimeout(() => {
        startCamera();
      }, 250);
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative bg-slate-900 text-white rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl overflow-hidden my-auto">
        
        {/* Hidden container for file decoding */}
        <div id={FILE_READER_ELEMENT_ID} style={{ display: 'none' }} />

        {/* Top Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Grand Air Product QR Scanner</h3>
              <p className="text-[11px] text-slate-400">Point your camera at the QR sticker on the fan box</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative bg-black min-h-[300px] flex items-center justify-center overflow-hidden">
          {/* Html5Qrcode video container */}
          <div 
            id={READER_ELEMENT_ID} 
            className="w-full h-full min-h-[290px] overflow-hidden" 
          />

          {/* Camera Error Overlay */}
          {cameraError && (
            <div className="absolute inset-x-6 p-4 rounded-2xl bg-slate-900/95 border border-amber-500/50 text-center space-y-2 z-20">
              <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
              <div className="text-xs font-bold text-white">Camera Offline</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {cameraError}
              </p>
              <button
                type="button"
                onClick={startCamera}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all"
              >
                Retry Camera
              </button>
            </div>
          )}

          {/* Camera Flip Control */}
          {cameraActive && (
            <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20">
              <button
                type="button"
                onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white backdrop-blur-sm transition-all"
                title="Flip Camera"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Alternate Scan Options (Photo Upload & Manual Serial Entry) */}
        <div className="p-4 sm:p-5 bg-slate-900 space-y-4">
          <div className="flex items-center gap-3 text-xs">
            {/* File Upload Option */}
            <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold cursor-pointer transition-all">
              <Upload className="w-4 h-4 text-blue-400" />
              <span>Upload QR Photo / Sticker</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              Or Enter Serial Number Manually
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="space-y-2">
            {uploadError && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-[11px]">{uploadError}</span>
              </div>
            )}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="e.g. GA-CF-202611-B01-0001"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-24 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!manualInput.trim()}
                className="absolute right-1.5 top-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Verify
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Serial is printed beneath the QR sticker.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
