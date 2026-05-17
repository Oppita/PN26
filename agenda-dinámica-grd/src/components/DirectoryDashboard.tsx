import React, { useState, useMemo } from 'react';
import { X, Search, Plus, User, Building, Mail, Clock, Download, QrCode, CheckCircle2, TrendingUp, Users, Presentation, Coffee } from 'lucide-react';
import QRCode from 'react-qr-code';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { useAttendees, Attendee } from '../hooks/useAttendees';
import { QRScanLog } from '../hooks/useQRControl';
import { Room } from '../data/agenda';
import { classNames } from '../lib/utils';

const COLORS = ['#4f46e5', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#6366f1'];

interface DirectoryDashboardProps {
  logs: QRScanLog[];
  rooms: Room[];
}

export function DirectoryDashboard({ logs, rooms }: DirectoryDashboardProps) {
  const { attendees, addAttendee, deleteAttendee } = useAttendees();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingQrFor, setViewingQrFor] = useState<Attendee | null>(null);

  // Compute metrics
  const uniqueScannedIds = useMemo(() => new Set(logs.map(l => l.qrData)), [logs]);
  const presentCount = uniqueScannedIds.size;
  const totalRegistered = attendees.length;
  const attendanceRate = totalRegistered > 0 ? Math.round((presentCount / totalRegistered) * 100) : 0;

  // Chart: Access by Room
  const roomAccessData = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.filter(l => l.type === 'ROOM' && l.roomId).forEach(l => {
      counts[l.roomId!] = (counts[l.roomId!] || 0) + 1;
    });
    return Object.entries(counts).map(([roomId, count]) => ({
      name: rooms.find(r => r.id === roomId)?.name || 'Desconocida',
      Acceso: count,
    }));
  }, [logs, rooms]);

  // Chart: Scans over time (Hourly)
  const timelineData = useMemo(() => {
    const hourly: Record<string, number> = {};
    logs.forEach(l => {
      const hour = new Date(l.timestamp).getHours();
      const label = `${hour}:00`;
      hourly[label] = (hourly[label] || 0) + 1;
    });
    return Object.entries(hourly).map(([time, count]) => ({ time, Escaneos: count })).sort((a,b) => parseInt(a.time) - parseInt(b.time));
  }, [logs]);

  // Derived attendee list with scan status
  const sortedAttendees = useMemo(() => {
    const filtered = attendees.filter(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort: Recently scanned first
    return filtered.sort((a, b) => {
      const lastScanA = logs.find(l => l.qrData === a.id);
      const lastScanB = logs.find(l => l.qrData === b.id);
      if (lastScanA && !lastScanB) return -1;
      if (!lastScanA && lastScanB) return 1;
      if (lastScanA && lastScanB) {
        return new Date(lastScanB.timestamp).getTime() - new Date(lastScanA.timestamp).getTime();
      }
      return 0;
    });
  }, [attendees, logs, searchQuery]);

  const handleExportCSV = () => {
    let csv = "ID,Nombre,Organizacion,Rol,Email,Escaneos,Ultimo Escaneo\\n";
    sortedAttendees.forEach(a => {
      const scans = logs.filter(l => l.qrData === a.id);
      const isPresent = scans.length > 0;
      const latestScanTime = isPresent ? new Date(scans[0].timestamp).toLocaleString() : 'N/A';
      csv += `${a.id},"${a.name}","${a.organization}","${a.role}","${a.email}",${scans.length},"${latestScanTime}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `directorio_reporte_${new Date().getTime()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto w-full relative">
       <div className="max-w-7xl mx-auto p-6 md:p-12 min-h-full flex flex-col gap-8">
          
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-slate-200 pb-6">
             <div>
               <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-indigo-600" />
                  Visualización de Directorio
               </h1>
               <p className="text-slate-500 font-bold mt-2 max-w-xl">Métricas de asistencia en tiempo real y registro dinámico de asistentes escaneados en el evento.</p>
             </div>
             <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-700 rounded-xl font-black uppercase tracking-widest transition-all shadow-sm">
                <Download className="w-5 h-5" /> Exportar Reporte
             </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                   <Users className="w-8 h-8" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Registrados</p>
                   <p className="text-4xl font-black text-slate-800">{totalRegistered}</p>
                </div>
             </div>
             <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                   <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asistencia Actual</p>
                   <p className="text-4xl font-black text-slate-800">{presentCount} <span className="text-lg opacity-50">/ {attendanceRate}%</span></p>
                </div>
             </div>
             <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                   <QrCode className="w-8 h-8" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Escaneos Totales</p>
                   <p className="text-4xl font-black text-slate-800">{logs.length}</p>
                </div>
             </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2"><TrendingUp className="w-4 h-4"/> Flujo de Escaneos (Hora a hora)</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineData}>
                      <defs>
                        <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="Escaneos" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>
             
             <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2"><Presentation className="w-4 h-4"/> Tráfico por Salas</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roomAccessData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 'bold'}} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="Acceso" fill="#0ea5e9" radius={[0, 4, 4, 0]}>
                         {roomAccessData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>

          {/* Directory Viewer */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
             <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Personas y Registros</h3>
                   <p className="text-sm font-bold text-slate-500 mt-1">Los asistentes recientemente escaneados aparecen primero.</p>
                </div>
                <div className="relative flex-1 max-w-sm">
                   <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                     type="text" 
                     placeholder="Buscar asistente..." 
                     className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                   />
                </div>
             </div>

             <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {sortedAttendees.length === 0 ? (
                      <div className="col-span-full py-16 text-center text-slate-400">
                         <QrCode className="w-16 h-16 mx-auto mb-4 opacity-20" />
                         <p className="font-bold uppercase tracking-widest">No se encontraron registros</p>
                      </div>
                   ) : (
                      sortedAttendees.map(attendee => {
                         const scans = logs.filter(l => l.qrData === attendee.id);
                         const isPresent = scans.length > 0;
                         const latestScan = scans[0]; // descending since logs are prepended unhooked? wait, useQRControl prepends new logs => [newLog, ...prev] => index 0 is newest.
                         
                         return (
                         <div key={attendee.id} className={classNames(
                            "border rounded-2xl p-5 hover:shadow-lg transition-shadow group flex flex-col relative overflow-hidden",
                            isPresent ? "bg-white border-indigo-100 hover:border-indigo-300" : "bg-slate-50/50 border-slate-200"
                         )}>
                            {/* Accent highlight for actively scanned today */}
                            {isPresent && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-indigo-500"></div>}
                            
                            <div className="flex justify-between items-start mb-4">
                               <div className="flex items-center gap-3">
                                  {attendee.photoUrl ? (
                                    <img src={attendee.photoUrl} alt={attendee.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100" />
                                  ) : (
                                    <div className={classNames(
                                       "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2",
                                       isPresent ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-slate-100 text-slate-400 border-slate-50"
                                    )}>
                                       {attendee.name.charAt(0)}
                                    </div>
                                  )}
                                  <div>
                                     <h3 className="font-black text-slate-900 leading-tight">{attendee.name}</h3>
                                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">{attendee.role}</p>
                                  </div>
                               </div>
                            </div>
                            
                            <div className="space-y-2 text-xs font-medium text-slate-600 block">
                               <div className="flex items-start gap-2">
                                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                                  <span>{attendee.organization}</span>
                               </div>
                               {attendee.email && (
                                  <div className="flex items-center gap-2">
                                     <Mail className="w-4 h-4 text-slate-400" />
                                     <span className="truncate">{attendee.email}</span>
                                  </div>
                               )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-end justify-between">
                               <div>
                                  {isPresent ? (
                                     <div className="flex flex-col gap-1">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit">
                                           <CheckCircle2 className="w-3 h-3" /> Asistió
                                        </span>
                                        <span className="text-[9px] text-slate-400 font-bold ml-1">Último: {new Date(latestScan.timestamp).toLocaleTimeString()}</span>
                                     </div>
                                  ) : (
                                     <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-1 rounded w-fit">
                                        Ausente / No Escaneado
                                     </span>
                                  )}
                               </div>
                               <button 
                                 onClick={() => setViewingQrFor(attendee)}
                                 className="text-slate-400 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-indigo-50"
                               >
                                  <QrCode className="w-5 h-5"/>
                               </button>
                            </div>
                         </div>
                      );
                   })
                 )}
                </div>
             </div>
          </div>

          {/* QR Modal View */}
          {viewingQrFor && (
             <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setViewingQrFor(null)}>
                <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                   <button onClick={() => setViewingQrFor(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2"><X className="w-5 h-5"/></button>
                   <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight mb-2">{viewingQrFor.name}</h3>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">{viewingQrFor.organization}</p>
                   
                   <div className="bg-white p-4 inline-block rounded-2xl border-4 border-indigo-100 mx-auto shadow-sm">
                      <QRCode value={viewingQrFor.id} size={200} level="H" />
                   </div>
                   
                   <div className="mt-8 bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ID Único</p>
                      <p className="font-mono text-xs font-bold text-slate-700">{viewingQrFor.id}</p>
                   </div>
                </div>
             </div>
          )}

       </div>
    </div>
  );
}
