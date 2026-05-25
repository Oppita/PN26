import React from 'react';
import QRCode from 'react-qr-code';

export function FeedbackQR({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm text-center ${className}`}>
        <h3 className="font-black text-emerald-800 tracking-tight leading-tight mb-2 uppercase text-sm">
          Déjanos conocer tu opinión
        </h3>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">
          Escanea el código QR
        </p>
        <div className="p-3 bg-white border-2 border-emerald-50 rounded-xl shadow-sm">
          <QRCode value="https://symmetrical-succotash-1.onrender.com/q/plataforma2026" size={120} fgColor="#064e3b" />
        </div>
    </div>
  );
}
