import React, { useState, useRef } from 'react';
import { Room, AgendaEvent, EventType, Speaker } from '../data/agenda';
import { X, Plus, Save, Trash2, Edit, Download, Upload } from 'lucide-react';
import { getSupabase } from '../lib/supabaseClient';
import Papa from 'papaparse';

interface AdminPanelProps {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  events: AgendaEvent[];
  setEvents: React.Dispatch<React.SetStateAction<AgendaEvent[]>>;
  onClose: () => void;
  onEventClick?: (event: AgendaEvent) => void;
  syncData: () => Promise<void>;
}

export function AdminPanel({ rooms, setRooms, events, setEvents, onClose, onEventClick, syncData }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'rooms' | 'events'>('rooms');

  // Room form state
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null);
  
  // Event form state
  const [editingEvent, setEditingEvent] = useState<Partial<AgendaEvent> | null>(null);



  const deleteEvent = async (id: string) => {
    if (confirm('¿Eliminar esta charla permanentemente?')) {
      const prevEvents = [...events];
      setEvents(events.filter(e => e.id !== id));
      try {
        const supabase = getSupabase();
        await supabase.from('talks').delete().match({ id });
        await syncData();
      } catch(err) {
        setEvents(prevEvents);
        console.error(err);
      }
    }
  };

  const deleteRoom = async (id: string) => {
    if (confirm('¿Eliminar esta sala permanentemente?')) {
      const prevRooms = [...rooms];
      setRooms(rooms.filter(r => r.id !== id));
      try {
        const supabase = getSupabase();
        await supabase.from('rooms').delete().match({ id });
        await syncData();
      } catch(err) {
        setRooms(prevRooms);
        console.error(err);
      }
    }
  };

  const saveRoom = async () => {
    if (!editingRoom?.name || !editingRoom?.id) return;
    
    // Check if new or edit
    const exists = rooms.some(r => r.id === editingRoom.id);
    const id = editingRoom.id === 'new' ? editingRoom.name.toLowerCase().replace(/\s+/g, '-') : editingRoom.id;
    const roomPayload = { ...editingRoom, id } as Room;

    const prevRooms = [...rooms];
    if (exists && editingRoom.id !== 'new') {
      setRooms(rooms.map(r => r.id === editingRoom.id ? roomPayload : r));
    } else {
      setRooms([...rooms, roomPayload]);
    }
    setEditingRoom(null);

    try {
      const supabase = getSupabase();
      if (exists && editingRoom.id !== 'new') {
        const { error } = await supabase.from('rooms').update(roomPayload).match({ id });
        if (error) console.error('Supabase update room error:', error);
      } else {
        const { error } = await supabase.from('rooms').insert([roomPayload]);
        if (error) console.error('Supabase insert room error:', error);
      }
      await syncData();
    } catch(err) {
      setRooms(prevRooms);
      console.error('saveRoom Exception:', err);
    }
  };

  const saveEvent = async () => {
    if (!editingEvent?.title || !editingEvent?.roomId) return;
    const isEditing = !!editingEvent.id;
    const id = isEditing ? editingEvent.id! : `evt-${Date.now()}`;
    const newEvent = { ...editingEvent, id, speakers: editingEvent.speakers || [] } as AgendaEvent;
    
    // Optimistic Update
    setEvents(events.map(e => e.id === editingEvent.id ? newEvent : e));
    if (!isEditing) setEvents([...events, newEvent]);
    setEditingEvent(null);

    // Supabase Sync
    try {
      const supabase = getSupabase();
      const payload = {
        id: newEvent.id,
        title: newEvent.title,
        description: newEvent.description,
        start_time: newEvent.startTime,
        end_time: newEvent.endTime,
        room_id: newEvent.roomId,
        type: newEvent.type,
        theme_tag: newEvent.themeTag,
        speakers: newEvent.speakers,
        registered_count: newEvent.registeredCount || 0,
        capacity: newEvent.capacity || 100
      };
      
      if (isEditing) {
        const { error } = await supabase.from('talks').update(payload).match({ id });
        if (error) console.error('Supabase update talk error:', error, payload);
      } else {
        const { error } = await supabase.from('talks').insert([payload]);
        if (error) console.error('Supabase insert talk error:', error, payload);
      }
      await syncData();
    } catch(err) {
      console.error('saveEvent Exception:', err);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportCSV = () => {
    // Only keeping fundamental fields for easier CSV format
    const flatEvents = events.map(e => ({
      ...e,
      speakers: JSON.stringify(e.speakers || []),
      organizers: e.organizers?.join(', ') || '',
      moderators: e.moderators?.join(', ') || ''
    }));
    
    const csv = Papa.unparse(flatEvents);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `agenda_export_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const importedEvents = results.data.map((row: any) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            startTime: row.startTime,
            endTime: row.endTime,
            roomId: row.roomId,
            type: row.type || 'Sesión paralela y temática',
            themeTag: row.themeTag,
            speakers: (row.speakers && typeof row.speakers === 'string' && row.speakers.startsWith('[')) 
              ? JSON.parse(row.speakers) : [],
            registeredCount: parseInt(row.registeredCount) || 0,
            capacity: parseInt(row.capacity) || 100,
            organizers: row.organizers ? row.organizers.split(',').map((s: string) => s.trim()) : [],
            moderators: row.moderators ? row.moderators.split(',').map((s: string) => s.trim()) : [],
            summary: row.summary,
            objective: row.objective
          })) as AgendaEvent[];

          // Update local state
          setEvents(importedEvents);
          alert(`Éxito al importar ${importedEvents.length} eventos. Sincronizando con Supabase...`);
          
          // Bulk Upsert in Supabase
          const supabase = getSupabase();
          const supabasePayload = importedEvents.map(e => ({
            id: e.id,
            title: e.title,
            description: e.description,
            start_time: e.startTime,
            end_time: e.endTime,
            room_id: e.roomId,
            type: e.type,
            theme_tag: e.themeTag,
            speakers: e.speakers,
            registered_count: e.registeredCount,
            capacity: e.capacity
          }));
          
          await supabase.from('talks').upsert(supabasePayload);
        } catch (error) {
          console.error("Error importing CSV:", error);
          alert("Hubo un error importando el CSV. Asegúrate de que el formato sea el correcto.");
        }
        
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
        <header className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Panel de Configuración</h2>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-red-500 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex px-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <button 
            className={`py-3 px-4 font-bold text-sm border-b-2 ${activeTab === 'rooms' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500'}`}
            onClick={() => setActiveTab('rooms')}
          >
            Subeventos (Salas)
          </button>
          <button 
            className={`py-3 px-4 font-bold text-sm border-b-2 ${activeTab === 'events' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500'}`}
            onClick={() => setActiveTab('events')}
          >
            Charlas (Contenido)
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* ROOMS TAB */}
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              {!editingRoom ? (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Listado de Subeventos</h3>
                    <button 
                      onClick={() => setEditingRoom({ id: 'new', name: '', capacity: 0, location: '', color: '#3b82f6' })}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4"/> Subevento
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {rooms.map(room => (
                      <div key={room.id} className="bg-white p-4 border border-slate-200 rounded-xl flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: room.color }}></div>
                          <div>
                            <p className="font-bold text-sm text-slate-800">{room.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{room.location}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingRoom(room)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4"/></button>
                          <button onClick={() => deleteRoom(room.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800 border-b pb-2">{editingRoom.id === 'new' ? 'Crear Subevento' : 'Editar Subevento'}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nombre (ej. Resiliencia)</label>
                      <input type="text" className="w-full border rounded p-2 text-sm" value={editingRoom.name || ''} onChange={e => setEditingRoom({...editingRoom, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Ubicación física</label>
                        <input type="text" className="w-full border rounded p-2 text-sm" value={editingRoom.location || ''} onChange={e => setEditingRoom({...editingRoom, location: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Aforo (Personas)</label>
                        <input type="number" className="w-full border rounded p-2 text-sm" value={editingRoom.capacity || 0} onChange={e => setEditingRoom({...editingRoom, capacity: parseInt(e.target.value)})} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Color representativo</label>
                      <input type="color" className="w-full h-10 border rounded p-1 cursor-pointer" value={editingRoom.color || '#000000'} onChange={e => setEditingRoom({...editingRoom, color: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button onClick={() => setEditingRoom(null)} className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-100 rounded">Cancelar</button>
                    <button onClick={saveRoom} className="px-4 py-2 bg-slate-900 text-white text-sm font-bold flex items-center gap-2 rounded hover:bg-slate-800"><Save className="w-4 h-4"/> Guardar</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              {!editingEvent ? (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Listado de Charlas y Plenarias</h3>
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        accept=".csv" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={importCSV}
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-slate-200"
                        title="Importar CSV"
                      >
                        <Upload className="w-4 h-4"/>
                      </button>
                      <button 
                        onClick={exportCSV}
                        className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-slate-200"
                        title="Exportar CSV"
                      >
                        <Download className="w-4 h-4"/>
                      </button>
                      <button 
                        onClick={() => setEditingEvent({ title: '', roomId: rooms[0]?.id || '', type: 'Plenaria', startTime: '2026-05-20T08:00', endTime: '2026-05-20T09:00', speakers: [], registeredCount: 0 })}
                        className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-emerald-700 ml-2"
                      >
                        <Plus className="w-4 h-4"/> Charla
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {events.map((event, i) => (
                      <div 
                        key={i} 
                        className="bg-white p-4 border border-slate-200 rounded-xl flex items-center justify-between shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
                        onClick={(e) => {
                           // don't trigger if clicking buttons
                           if ((e.target as HTMLElement).closest('button')) return;
                           onEventClick?.(event);
                        }}
                      >
                        <div className="flex-1 pr-4">
                          <p className="font-bold text-sm text-slate-800 leading-tight">{event.title}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                            {rooms.find(r => r.id === event.roomId)?.name || 'Subevento Borrado'} • {event.startTime.split('T')[1]}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => setEditingEvent(event)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4"/></button>
                          <button onClick={() => deleteEvent(event.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800 border-b pb-2">{editingEvent.id ? 'Editar Charla' : 'Crear Charla'}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Título de la Charla</label>
                      <input type="text" className="w-full border rounded p-2 text-sm" value={editingEvent.title || ''} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Subevento (Sala)</label>
                        <select className="w-full border rounded p-2 text-sm bg-white" value={editingEvent.roomId || ''} onChange={e => setEditingEvent({...editingEvent, roomId: e.target.value})}>
                          {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tipo de Sesión</label>
                        <select className="w-full border rounded p-2 text-sm bg-white" value={editingEvent.type || 'Sesión plenaria'} onChange={e => setEditingEvent({...editingEvent, type: e.target.value as EventType})}>
                          <option value="Sesión plenaria">Sesión plenaria</option>
                          <option value="Sesión paralela y temática">Sesión paralela y temática</option>
                          <option value="Escenario en vivo">Escenario en vivo</option>
                          <option value="Laboratorio de aprendizaje">Laboratorio de aprendizaje</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Hora Inicio</label>
                        <input type="datetime-local" className="w-full border rounded p-2 text-sm" value={editingEvent.startTime || ''} onChange={e => setEditingEvent({...editingEvent, startTime: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Hora Fin</label>
                        <input type="datetime-local" className="w-full border rounded p-2 text-sm" value={editingEvent.endTime || ''} onChange={e => setEditingEvent({...editingEvent, endTime: e.target.value})} />
                      </div>
                      <div>
                         <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1"># Inscritos Actuales</label>
                         <input type="number" className="w-full border rounded p-2 text-sm" value={editingEvent.registeredCount || 0} onChange={e => setEditingEvent({...editingEvent, registeredCount: parseInt(e.target.value)})} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Organizadores (sep. por coma)</label>
                        <input type="text" className="w-full border rounded p-2 text-sm" value={editingEvent.organizers?.join(', ') || ''} onChange={e => setEditingEvent({...editingEvent, organizers: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Moderadores (sep. por coma)</label>
                        <input type="text" className="w-full border rounded p-2 text-sm" value={editingEvent.moderators?.join(', ') || ''} onChange={e => setEditingEvent({...editingEvent, moderators: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded p-4 bg-slate-50 relative mt-4">
                      {/* ... existing speaker editor ... */}
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Ponentes</label>
                        <button 
                          onClick={() => setEditingEvent({...editingEvent, speakers: [...(editingEvent.speakers || []), { id: `s-${Date.now()}`, name: '', role: '', bio: '', photoUrl: '' }]})}
                          className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-0.5 rounded text-blue-600 hover:bg-blue-50"
                        >
                          + Añadir
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(editingEvent.speakers || []).map((speaker, idx) => (
                           <div key={speaker.id} className="bg-white p-3 border border-slate-200 rounded relative shadow-sm">
                              <button 
                                onClick={() => setEditingEvent({...editingEvent, speakers: (editingEvent.speakers || []).filter((_, i) => i !== idx)})}
                                className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                              ><Trash2 className="w-4 h-4"/></button>
                              <div className="grid grid-cols-2 gap-2 pr-6 mb-2">
                                <input type="text" placeholder="Nombre completo" className="border rounded px-2 py-1 text-xs w-full" value={speaker.name} onChange={e => {
                                  const newArr = [...(editingEvent.speakers || [])];
                                  newArr[idx] = { ...newArr[idx], name: e.target.value };
                                  setEditingEvent({...editingEvent, speakers: newArr});
                                }} />
                                <input type="text" placeholder="Rol / Cargo" className="border rounded px-2 py-1 text-xs w-full" value={speaker.role} onChange={e => {
                                  const newArr = [...(editingEvent.speakers || [])];
                                  newArr[idx] = { ...newArr[idx], role: e.target.value };
                                  setEditingEvent({...editingEvent, speakers: newArr});
                                }} />
                              </div>
                              <input type="text" placeholder="URL Foto" className="border rounded px-2 py-1 text-xs w-full mb-2" value={speaker.photoUrl} onChange={e => {
                                  const newArr = [...(editingEvent.speakers || [])];
                                  newArr[idx] = { ...newArr[idx], photoUrl: e.target.value };
                                  setEditingEvent({...editingEvent, speakers: newArr});
                                }} />
                              <textarea placeholder="Bibliografía" className="border rounded px-2 py-1 text-xs w-full" rows={2} value={speaker.bio} onChange={e => {
                                  const newArr = [...(editingEvent.speakers || [])];
                                  newArr[idx] = { ...newArr[idx], bio: e.target.value };
                                  setEditingEvent({...editingEvent, speakers: newArr});
                                }} />
                           </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-2 space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nota Conceptual</label>
                        <textarea className="w-full border rounded p-2 text-sm" rows={3} value={editingEvent.description || ''} onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Resumen</label>
                        <textarea className="w-full border rounded p-2 text-sm" rows={3} value={editingEvent.summary || ''} onChange={e => setEditingEvent({...editingEvent, summary: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Objetivo</label>
                        <textarea className="w-full border rounded p-2 text-sm" rows={2} value={editingEvent.objective || ''} onChange={e => setEditingEvent({...editingEvent, objective: e.target.value})} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button onClick={() => setEditingEvent(null)} className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-100 rounded">Cancelar</button>
                    <button onClick={saveEvent} className="px-4 py-2 bg-slate-900 text-white text-sm font-bold flex items-center gap-2 rounded hover:bg-slate-800"><Save className="w-4 h-4"/> Guardar</button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
