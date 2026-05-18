import React, { useState, useEffect } from 'react';
import { AgendaEvent, Room } from '../data/agenda';
import { X, Users, Mail, Phone, Download } from 'lucide-react';
import { getSupabase } from '../lib/supabaseClient';

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
        // Since we need to get user details, we join registration with profile
        // Alternatively, since it might not be a strict foreign key in the view yet, let's select from registration and inner join profile manually or using postgrest syntax
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
          // Flatten the structure
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
          <div>
            <h2 className="text-xl font-black text-slate-800 mb-1">{event.title}</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{room?.name || 'Sin sala'} • {registeredUsers.length} inscritos</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 border border-slate-200 shrink-0">
             <X className="w-5 h-5 text-slate-800" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="space-y-10 mb-10">
            {/* Conceptual Note / Description */}
            {event.description && (
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <div className="w-8 h-[2px] bg-blue-600"></div> NOTA CONCEPTUAL
                </h4>
                <div className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                  {event.description}
                </div>
              </section>
            )}

            {/* Objective & Summary Grid */}
            {(event.objective || event.summary) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                {event.objective && (
                   <div>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">OBJETIVO</h4>
                     <p className="text-sm text-slate-600 leading-relaxed italic border-l-4 border-slate-200 pl-4">
                       "{event.objective}"
                     </p>
                   </div>
                )}
                {event.summary && (
                   <div>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">RESUMEN</h4>
                     <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                       {event.summary}
                     </p>
                   </div>
                )}
              </div>
            )}

            {/* Speakers Sections */}
            {event.speakers && event.speakers.length > 0 && (
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 justify-center">
                   CONFERENCISTAS & EXPERTOS
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {event.speakers.map((speaker, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-4">
                         <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 border-slate-100 shadow-inner">
                            <img src={speaker.photoUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop'} alt={speaker.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                         </div>
                         <div>
                            <p className="font-black text-base text-slate-900 leading-none mb-1">{speaker.name}</p>
                            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wide mb-2">{speaker.role}</p>
                            <p className="text-xs text-slate-500 leading-snug line-clamp-3 md:line-clamp-none italic">
                               {speaker.bio || 'Consultor experto en gestión del riesgo y resiliencia climática con amplia trayectoria internacional.'}
                            </p>
                         </div>
                      </div>
                   ))}
                </div>
              </section>
            )}
          </div>

          <div className="flex justify-between items-center mb-6">
             <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
               <Users className="w-4 h-4 text-blue-600" /> Detalle de Inscritos
             </h3>
             <button onClick={exportCSV} className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-md hover:bg-blue-700 transition">
               <Download className="w-3.5 h-3.5" /> Exportar CSV
             </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-10">
               <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : registeredUsers.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-200">
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nadie se ha inscrito aún</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Nombre / Org</th>
                    <th className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Contacto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registeredUsers.map((u, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-bold text-sm text-slate-800">{u.name || 'Sin nombre'}</p>
                        <p className="text-xs text-slate-500 font-medium">{u.organization || 'Sin organización'}</p>
                      </td>
                      <td className="px-4 py-3">
                        {u.email && <p className="text-xs text-slate-600 flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400"/> {u.email}</p>}
                        {u.phone && <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1"><Phone className="w-3 h-3 text-slate-400"/> {u.phone}</p>}
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
  );
}
