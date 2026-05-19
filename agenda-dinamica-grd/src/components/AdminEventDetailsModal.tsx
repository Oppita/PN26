import React, { useState, useEffect } from 'react';
import { AgendaEvent, Room } from '../data/agenda';
import { X, Users, Mail, Phone, Download, Clock, MapPin, Tag } from 'lucide-react';
import { getSupabase } from '../lib/supabaseClient';
import { formatTime } from '../lib/utils';

interface Props {
  event: AgendaEvent;
  room?: Room;
  onClose: () => void;
}

export function AdminEventDetailsModal({ event, room, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('registration')
          .select(`
            id,
            user_id,
            profile:user_id (
              name,
              email,
              phone,
              organization
            )
          `)
          .eq('talk_id', event.id);

        if (error) {
          console.error(error);
        } else if (data) {
          const users = data.map(r => ({
            id: r.user_id,
            ...r.profile
          }));
          setRegisteredUsers(users);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [event.id]);

  const exportCSV = () => {
    const headers = ['Nombre', 'Email', 'Teléfono', 'Organización'];
    const csvContent = [
      headers.join(','),
      ...registeredUsers.map(u => 
        [u.name || '', u.email || '', u.phone || '', u.organization || ''].map(s => `"${s}"`).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inscritos-${event.title.substring(0,20).replace(/\s/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header - Dark version */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-900">
          <div className="flex-1 pr-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{event.type}</p>
            <h2 className="text-xl font-black text-white leading-tight mb-3">{event.title}</h2>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {room?.name || <span className="text-red-400 font-bold">Sin sala asignada</span>}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                {formatTime(event.startTime)} – {formatTime(event.endTime)}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                {registeredUsers.length} inscritos
              </span>
              {event.themeTag && (
                <span className="flex items-center gap-1.5 text-xs text-blue-300 font-bold">
                  <Tag className="w-3.5 h-3.5" />{event.themeTag}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors shrink-0">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">

          {/* Organizadores / Moderadores */}
          {((event.organizers && event.organizers.length > 0) || (event.moderators && event.moderators.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.organizers && event.organizers.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Organizadores</h4>
                  <p className="text-sm text-slate-700 font-medium">{event.organizers.join(', ')}</p>
                </div>
              )}
              {event.moderators && event.moderators.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Moderadores</h4>
                  <p className="text-sm text-slate-700 font-medium">{event.moderators.join(', ')}</p>
                </div>
              )}
            </div>
          )}

          {/* NOTA CONCEPTUAL - SIEMPRE visible */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <div className="w-8 h-[2px] bg-blue-600"></div> NOTA CONCEPTUAL
            </h4>
            {event.description ? (
              <div className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                {event.description}
              </div>
            ) : (
              <div className="text-sm text-slate-400 italic text-center py-4 border-2 border-dashed border-slate-200 rounded-lg">
                No hay nota conceptual cargada para este evento
              </div>
            )}
          </section>

          {/* Objetivo y Resumen - solo si existen */}
          {(event.objective || event.summary) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              {event.objective && (
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">OBJETIVO</h4>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{event.objective}</p>
                </div>
              )}
              {event.summary && (
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">RESUMEN</h4>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{event.summary}</p>
                </div>
              )}
            </div>
          )}

          {/* Ponentes - si existen */}
          {event.speakers && event.speakers.length > 0 && (
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center">
                CONFERENCISTAS & EXPERTOS ({event.speakers.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.speakers.filter(s => s.name).map((speaker, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 border-slate-200 bg-slate-200 flex items-center justify-center">
                      {speaker.photoUrl ? (
                        <img 
                          src={speaker.photoUrl} 
                          alt={speaker.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-2xl font-black text-slate-400">{speaker.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-black text-sm text-slate-900 leading-none mb-1">{speaker.name}</p>
                      <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wide mb-2">{speaker.role}</p>
                      {speaker.bio && (
                        <p className="text-xs text-slate-500 leading-snug">{speaker.bio}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PARTICIPANTES INSCRITOS - SIEMPRE visible con énfasis */}
          <div className="bg-white p-6 rounded-2xl border-2 border-blue-100 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-blue-700 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" /> 
                PARTICIPANTES INSCRITOS ({registeredUsers.length})
              </h3>
              <button 
                onClick={exportCSV} 
                className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-md hover:bg-blue-700 transition"
                disabled={registeredUsers.length === 0}
              >
                <Download className="w-3.5 h-3.5" /> Exportar CSV
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-10">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : registeredUsers.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Aún no hay participantes inscritos
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Los participantes aparecerán aquí cuando se registren
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b-2 border-slate-200">
                      <th className="px-4 py-3 text-xs font-black text-slate-600 uppercase tracking-wider">Nombre</th>
                      <th className="px-4 py-3 text-xs font-black text-slate-600 uppercase tracking-wider">Organización</th>
                      <th className="px-4 py-3 text-xs font-black text-slate-600 uppercase tracking-wider">Contacto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {registeredUsers.map((u, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-sm text-slate-800">
                          {u.name || '—'}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 font-medium">
                          {u.organization || '—'}
                        </td>
                        <td className="px-4 py-3">
                          {u.email && <p className="text-xs text-slate-600 flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400"/> {u.email}</p>}
                          {u.phone && <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1"><Phone className="w-3 h-3 text-slate-400"/> {u.phone}</p>}
                          {!u.email && !u.phone && <span className="text-xs text-slate-400">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
