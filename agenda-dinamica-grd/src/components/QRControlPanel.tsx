import React, { useState, useEffect } from 'react';
import { X, QrCode, MonitorPlay, Coffee, MapPin, CheckCircle2, XCircle, Users, PieChart } from 'lucide-react';
import { Room } from '../data/agenda';
import { classNames } from '../lib/utils';
import { QRScanner } from './QRScanner';
import { useQRControl } from '../hooks/useQRControl';
import { useAttendees } from '../hooks/useAttendees';
import { DirectoryDashboard } from './DirectoryDashboard';

interface QRControlPanelProps {
  rooms: Room[];
  onClose: () => void;
  initialTab?: TabType;
}

type TabType = 'ROOM' | 'MEAL' | 'DIRECTORY';

export function QRControlPanel({ rooms, onClose, initialTab = 'ROOM' }: QRControlPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [selectedRoom, setSelectedRoom] = useState<string>(rooms[0]?.id || '');
  const [selectedMeal, setSelectedMeal] = useState<'refrigerio' | 'almuerzo'>('refrigerio');
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<{ success: boolean; message: string; data?: string; rawQrData?: string; time?: string } | null>(null);

  const { logs, addRoomAccess, claimMeal } = useQRControl();
  const { attendees } = useAttendees();

  // Auto-dismiss the success toast to free up the UI visually, but the scanner never stops
  useEffect(() => {
    if (lastScan) {
      const timer = setTimeout(() => {
        setLastScan(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [lastScan]);

  const handleScanSuccess = (decodedText: string) => {
    // Avoid double scanning the same code very quickly (cooldown of 4s)
    if (lastScan && lastScan.rawQrData === decodedText && (new Date().getTime() - new Date(lastScan.time!).getTime() < 4000)) {
        return; // Ignore
    }

    let resultMsg = '';
    let success = false;
    const attendee = attendees.find(a => a.id === decodedText);
    const identifierText = attendee ? `${attendee.name} (${attendee.organization})` : `Invitado No Registrado [${decodedText}]`;

    if (activeTab === 'ROOM') {
      addRoomAccess(decodedText, selectedRoom);
      success = true;
      resultMsg = `Acceso registrado`;
    } else if (activeTab === 'MEAL') {
      const res = claimMeal(decodedText, selectedMeal);
      success = res.success;
      resultMsg = res.message;
    }
    
    setLastScan({ 
         success, 
         message: resultMsg, 
         data: identifierText,
         rawQrData: decodedText,
         time: new Date().toISOString()
    });
  };

  const handleScanFailure = (err: any) => {
    if (typeof err === 'string' && err.startsWith('setup_error:')) {
      setIsScanning(false);
      alert('Error accediendo a la cámara. Por favor asegúrate de darle permisos en el navegador.\nDetalles: ' + err.replace('setup_error:', ''));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col md:flex-row overflow-hidden animate-in fade-in">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-80 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
           <div>
             <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-500" /> Control Hub
             </h2>
             <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 uppercase">Escáner Dinámico</p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors md:hidden">
              <X className="w-5 h-5" />
           </button>
        </div>

        <div className="p-4 flex flex-col gap-2 flex-grow">
           <button 
             onClick={() => { setActiveTab('ROOM'); setIsScanning(false); setLastScan(null); }}
             className={classNames(
                "w-full text-left px-4 py-3 rounded-lg font-bold text-sm tracking-wide transition-all border",
                activeTab === 'ROOM' ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
             )}
           >
             <div className="flex items-center gap-3"><MonitorPlay className="w-4 h-4" /> Control de Acceso</div>
           </button>
           <button 
             onClick={() => { setActiveTab('MEAL'); setIsScanning(false); setLastScan(null); }}
             className={classNames(
                "w-full text-left px-4 py-3 rounded-lg font-bold text-sm tracking-wide transition-all border",
                activeTab === 'MEAL' ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
             )}
           >
             <div className="flex items-center gap-3"><Coffee className="w-4 h-4" /> Control de Comida</div>
           </button>
           <button 
             onClick={() => { setActiveTab('DIRECTORY'); setIsScanning(false); setLastScan(null); }}
             className={classNames(
                "w-full text-left px-4 py-3 rounded-lg font-bold text-sm tracking-wide transition-all border",
                activeTab === 'DIRECTORY' ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
             )}
           >
             <div className="flex items-center gap-3"><PieChart className="w-4 h-4" /> Directorio / Reportes</div>
           </button>
        </div>

        <div className="p-4 border-t border-slate-800 hidden md:block">
           <button onClick={onClose} className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-400 uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
             <X className="w-4 h-4" /> Salir del Panel
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'DIRECTORY' ? (
         <DirectoryDashboard logs={logs} rooms={rooms} />
      ) : (
      <div className="flex-1 bg-white overflow-y-auto w-full relative">
         <div className="max-w-3xl mx-auto p-6 md:p-12 min-h-full flex flex-col">
            
            {(activeTab as string) !== 'DIRECTORY' && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Configuración del Punto</h3>
                 
                 {activeTab === 'ROOM' && (
                    <div>
                       <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5"><MapPin className="w-3 h-3"/> Sala Destino</label>
                       <select 
                         value={selectedRoom} 
                         onChange={e => setSelectedRoom(e.target.value)}
                         className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 font-bold text-slate-800 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                       >
                         {rooms.map(r => (
                            <option key={r.id} value={r.id}>{r.name} - {r.location}</option>
                         ))}
                       </select>
                    </div>
                 )}

                 {activeTab === 'MEAL' && (
                    <div>
                       <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Coffee className="w-3 h-3"/> Tipo de Comida</label>
                       <div className="flex gap-4">
                          <button 
                             onClick={() => setSelectedMeal('refrigerio')}
                             className={classNames(
                               "flex-1 py-3 rounded-xl border-2 font-black uppercase tracking-wider text-sm transition-all",
                               selectedMeal === 'refrigerio' ? "bg-amber-100 border-amber-500 text-amber-700" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                             )}
                          >
                             Refrigerio
                          </button>
                          <button 
                             onClick={() => setSelectedMeal('almuerzo')}
                             className={classNames(
                               "flex-1 py-3 rounded-xl border-2 font-black uppercase tracking-wider text-sm transition-all",
                               selectedMeal === 'almuerzo' ? "bg-orange-100 border-orange-500 text-orange-700" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                             )}
                          >
                             Almuerzo
                          </button>
                       </div>
                    </div>
                 )}
              </div>
            )}

            {/* SCANNER VIEW */}
            {(activeTab as string) !== 'DIRECTORY' && (
                 <div className="flex-1 flex flex-col items-center w-full">
                    {!isScanning ? (
                       <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300 w-full flex-1">
                          <QrCode className="w-16 h-16 text-slate-300 mb-4" />
                          <p className="text-slate-500 font-bold text-center mb-6 max-w-sm">
                             Habilita la cámara para automatizar el registro continuado de asistentes.
                          </p>
                          <button 
                            onClick={() => setIsScanning(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95"
                          >
                            Iniciar Escáner
                          </button>
                       </div>
                    ) : (
                       <div className="w-full h-[600px] max-h-[70vh] flex flex-col bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl p-6">
                           <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-pulse"><span className="w-2 h-2 rounded-full bg-white"></span> Escaneando Continuamente</span>
                              <button onClick={() => setIsScanning(false)} className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2 rounded-full"><X className="w-4 h-4"/></button>
                           </div>
                           
                           <div className="flex-1 min-h-0 w-full relative pt-8 flex items-center justify-center">
                             <QRScanner onScanSuccess={handleScanSuccess} onScanFailure={handleScanFailure} />
                           </div>

                           {/* Last Scan Result Toast overlay */}
                           {lastScan && (
                               <div className="absolute bottom-6 left-6 right-6">
                                  <div className={classNames(
                                     "p-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-start gap-4 animate-in slide-in-from-bottom-5",
                                     lastScan.success ? "bg-emerald-500/95 border-emerald-400 text-white" : "bg-red-500/95 border-red-400 text-white"
                                  )}>
                                     {lastScan.success ? <CheckCircle2 className="w-10 h-10 shrink-0"/> : <XCircle className="w-10 h-10 shrink-0" />}
                                     <div className="flex-1 pt-1">
                                        <h4 className="font-black text-lg uppercase tracking-wider leading-tight">{lastScan.message}</h4>
                                        <p className="text-sm font-bold opacity-90 mt-1">{lastScan.data}</p>
                                     </div>
                                  </div>
                               </div>
                           )}
                       </div>
                    )}
                 </div>
            )}

            {/* DIRECTORY VIEW is handled above */}
            
         </div>
      </div>
      )}
    </div>
  );
}
