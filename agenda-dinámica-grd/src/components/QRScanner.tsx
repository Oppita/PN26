import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: any) => void;
}

export function QRScanner({ onScanSuccess, onScanFailure }: QRScannerProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);

  // Store callbacks in refs to avoid recreating the scanner when they change
  const onScanSuccessRef = useRef(onScanSuccess);
  const onScanFailureRef = useRef(onScanFailure);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
    onScanFailureRef.current = onScanFailure;
  }, [onScanSuccess, onScanFailure]);

  useEffect(() => {
    if (!qrRef.current) return;
    
    // Provide a unique ID just in case
    if (!qrRef.current.id) {
       qrRef.current.id = `qr-reader-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    const html5QrCode = new Html5Qrcode(qrRef.current.id);
    setScanner(html5QrCode);

    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText) => {
        onScanSuccessRef.current(decodedText);
      },
      (errorMessage) => {
        if (onScanFailureRef.current) {
          onScanFailureRef.current(errorMessage);
        }
      }
    ).catch(err => {
      console.error("Error starting QR Code scanner", err);
      if (onScanFailureRef.current) {
        onScanFailureRef.current("setup_error: " + err);
      }
    });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
        }).catch(err => console.error("Error stopping scanner", err));
      }
    };
  }, []);

  return <div ref={qrRef} className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-xl border-4 border-slate-900 bg-black aspect-square"></div>;
}
