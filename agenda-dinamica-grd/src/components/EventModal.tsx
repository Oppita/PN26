import React, { useState } from 'react';
import { X, Clock, MapPin, Users, UserCheck, Bookmark, AlignLeft, CheckCircle2 } from 'lucide-react';
import { AgendaEvent, Room } from '../data/agenda';
import { formatTime, formatDateStr, classNames } from '../lib/utils';

interface EventModalProps {
  event: AgendaEvent | null;
  room?: Room;
  isBookmarked: boolean;
  isRegistered: boolean;
  onClose: () => void;
  onToggleBookmark: (id: string) => void;
  onRoomClick: (roomId: string) => void;
  onRegister: () => void;
  onCancelRegistration: () => void;
}

export function EventModal({ event, room, isBookmarked, isRegistered, onClose, onToggleBookmark, onRoomClick, onRegister, onCancelRegistration }: EventModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!event) return null;

  const roomColor = room?.color || '#cbd5e1';
  const availableSpots = room ? Math.max(0, room.capacity - (event.registeredCount || 0)) : 0;
  const isFull = availableSpots === 0;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Sidebar Info (Visible on Desktop) */}
      <div className="w-full md:w-80 lg:w-96 bg-slate-50 border-r border-slate-200 overflow-y-auto p-6 md:p-8 shrink-0">
        <div className="flex justify-between items-center mb-8 md:hidden">
           <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 border border-slate-200">
             <X className="w-5 h-5 text-slate-800" />
           </button>
        </div>

        <div className="hidden md:block mb-8">
           <button onClick={onClose} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors mb-6">
             <X className="w-4 h-4" /> Volver a la agenda
           </button>
        </div>

        <div className="space-y-8">
           <div>
             <span className="inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-slate-200 text-slate-600 rounded mb-4">
                INFO SESIÓN
             </span>
             <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Horario</p>
                    <p className="font-bold text-slate-800 text-sm">
                      {formatDateStr(event.startTime.split('T')[0])}<br/>
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </p>
                  </div>
                </div>

                {room && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lugar</p>
                      <p className="font-bold text-slate-800 text-sm">{room.name}</p>
                      <p className="text-xs text-slate-500">{room.location}</p>
                    </div>
                  </div>
                )}
             </div>
           </div>

           {/* Registration Status and Action */}
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-center mb-4">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Estado Registro</p>
                 {isRegistered ? (
                    <div className="flex flex-col items-center gap-2">
                       <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full">
                          <CheckCircle2 className="w-8 h-8" />
                       </div>
                       <p className="text-sm font-black text-emerald-600 uppercase">¡Estás inscrito!</p>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center gap-2">
                       <p className="text-2xl font-black text-slate-800">{availableSpots}</p>
                       <p className="text-[10px] font-bold text-slate-500 uppercase">Cupos Disponibles</p>
                    </div>
                 )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                   {showConfirm ? (
                       <div className="absolute inset-0 bg-white border border-blue-500 rounded-lg flex items-center justify-between px-3 z-20">
                          <span className="text-[10px] font-bold text-slate-700">¿Confirmar?</span>
                          <div className="flex gap-1">
                            <button onClick={() => setShowConfirm(false)} className="text-[10px] px-2 py-1 bg-slate-100 rounded font-bold">No</button>
                            <button onClick={() => { onRegister(); setShowConfirm(false); }} className="text-[10px] px-2 py-1 bg-blue-600 rounded font-bold text-white">Sí</button>
                          </div>
                       </div>
                   ) : showCancelConfirm ? (
                       <div className="absolute inset-0 bg-white border border-red-500 rounded-lg flex items-center justify-between px-3 z-20">
                          <span className="text-[10px] font-bold text-slate-700">¿Cancelar?</span>
                          <div className="flex gap-1">
                            <button onClick={() => setShowCancelConfirm(false)} className="text-[10px] px-2 py-1 bg-slate-100 rounded font-bold">No</button>
                            <button onClick={() => { onCancelRegistration(); setShowCancelConfirm(false); }} className="text-[10px] px-2 py-1 bg-red-600 rounded font-bold text-white">Sí</button>
                          </div>
                       </div>
                   ) : (
                      <button
                        onClick={() => isRegistered ? setShowCancelConfirm(true) : setShowConfirm(true)}
                        disabled={!isRegistered && isFull}
                        className={classNames(
                          "w-full h-12 flex justify-center items-center gap-2 rounded-lg text-sm font-bold transition-all",
                          isRegistered 
                            ? "bg-slate-800 text-white hover:bg-red-600" 
                            : isFull
                              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                        )}
                      >
                        {isRegistered ? 'Cancelar INSCRIPCIÓN' : isFull ? 'SIN CUPOS' : 'INSCRIBIRME'}
                      </button>
                   )}
                </div>

                <button
                  onClick={() => onToggleBookmark(event.id)}
                  className="w-full flex justify-center items-center gap-2 h-10 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors text-slate-600"
                >
                  <Bookmark className={classNames("w-3.5 h-3.5", isBookmarked ? "fill-slate-900 text-slate-900" : "")} />
                  {isBookmarked ? 'QUITAR DE MI AGENDA' : 'MIS FAVORITOS'}
                </button>
              </div>
           </div>

           {/* Organizers and Moderators */}
           {((event.organizers && event.organizers.length > 0) || (event.moderators && event.moderators.length > 0)) && (
             <div className="space-y-6 pt-4 border-t border-slate-200">
                {event.organizers && event.organizers.length > 0 && (
                  <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Organizadores</h5>
                    <div className="flex flex-wrap gap-2">
                       {event.organizers.map((org, i) => (
                         <span key={i} className="text-xs font-bold text-slate-700 bg-slate-200/50 px-2.5 py-1 rounded-md">{org}</span>
                       ))}
                    </div>
                  </div>
                )}
                {event.moderators && event.moderators.length > 0 && (
                  <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Moderadores</h5>
                    <p className="text-sm font-bold text-slate-800">{event.moderators.join(', ')}</p>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-4xl mx-auto p-6 md:p-12 lg:p-16">
          <div className="mb-10">
             <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 bg-slate-900 text-white rounded">
                   {event.type}
                </span>
             </div>
             <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] mb-6">
                {event.title}
             </h1>
          </div>

          <div className="space-y-12">
            {/* Conceptual Note / Description */}
            {event.description && (
              <section>
                <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <div className="w-8 h-[2px] bg-blue-600"></div> NOTA CONCEPTUAL
                </h4>
                <div className="text-lg text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                  {event.description}
                </div>
              </section>
            )}

            {/* Objective & Summary Grid */}
            {(event.objective || event.summary) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-10 border-y border-slate-100">
                {event.objective && (
                   <div>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">OBJETIVO</h4>
                     <p className="text-sm md:text-base text-slate-600 leading-relaxed italic border-l-4 border-slate-200 pl-4">
                       "{event.objective}"
                     </p>
                   </div>
                )}
                {event.summary && (
                   <div>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">RESUMEN</h4>
                     <p className="text-sm md:text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                       {event.summary}
                     </p>
                   </div>
                )}
              </div>
            )}

            {/* Speakers Sections */}
            {event.speakers && event.speakers.length > 0 && (
              <section>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2 justify-center">
                   CONFERENCISTAS & EXPERTOS
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {event.speakers.map((speaker, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-5">
                         <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-4 border-slate-100 shadow-inner">
                            <img 
                              src={speaker.photoUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop'} 
                              alt={speaker.name} 
                              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                              referrerPolicy="no-referrer"
                            />
                         </div>
                         <div>
                            <p className="font-black text-lg text-slate-900 leading-none mb-1">{speaker.name}</p>
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-3">{speaker.role}</p>
                            <p className="text-sm text-slate-500 leading-snug line-clamp-3 md:line-clamp-none italic">
                               {speaker.bio || 'Consultor experto en gestión del riesgo y resiliencia climática con amplia trayectoria internacional.'}
                            </p>
                         </div>
                      </div>
                   ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

