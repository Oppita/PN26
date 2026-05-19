import { useState, useEffect, useMemo } from 'react';
import { INITIAL_EVENTS, INITIAL_ROOMS, AgendaEvent, Room, EventType } from '../data/agenda';
import { getSupabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export function useAgendaData() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('agenda-bookmarks-v3');
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) {}
    return new Set<string>();
  });
  
  const [registrations, setRegistrations] = useState<Set<string>>(new Set());
  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('agenda-rooms-v3');
        if (saved && saved !== '[]' && saved !== 'null') return JSON.parse(saved);
      }
    } catch(e) {}
    return INITIAL_ROOMS;
  });
  
  const [eventsData, setEventsData] = useState<AgendaEvent[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('agenda-events-v3');
        if (saved && saved !== '[]' && saved !== 'null') return JSON.parse(saved);
      }
    } catch(e) {}
    return INITIAL_EVENTS;
  });
  
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [supabaseLog, setSupabaseLog] = useState<{rooms: number, events: number, status: string}>({rooms: 0, events: 0, status: 'Esperando...'});

  const clearLocalCache = () => {
    localStorage.removeItem('agenda-events-v3');
    localStorage.removeItem('agenda-rooms-v3');
    setEventsData([]);
    setRooms([]);
    toast.info("Caché local limpiada. Sincronizando...");
    syncData();
  };

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('agenda-bookmarks-v3', JSON.stringify(Array.from(bookmarks)));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('agenda-rooms-v3', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('agenda-events-v3', JSON.stringify(eventsData));
  }, [eventsData]);

  const syncData = async () => {
    setSyncStatus('syncing');
    console.log('--- SUPABASE SYNC START ---');
    try {
      const supabase = getSupabase();
      
      // Fetch registrations
      if (user) {
        console.log('Fetching registrations for user:', user.id);
        const { data: regData, error: regError } = await supabase
          .from('registration')
          .select('talk_id')
          .eq('user_id', user.id);
          
        if (!regError && regData) {
          console.log(`Fetched ${regData.length} registrations`);
          setRegistrations(new Set(regData.map(r => r.talk_id)));
        }
      }

      // Fetch rooms
      console.log('Fetching rooms...');
      const { data: fetchRooms, error: roomsError } = await supabase
        .from('rooms')
        .select('*');
        
      if (roomsError) {
        console.error('Supabase Rooms Error:', roomsError);
        throw roomsError;
      }
      
      if (Array.isArray(fetchRooms)) {
        console.log(`Fetched ${fetchRooms.length} rooms from Supabase`);
        setRooms(fetchRooms as Room[]);
        localStorage.setItem('agenda-rooms-v3', JSON.stringify(fetchRooms));
        setSupabaseLog(prev => ({ ...prev, rooms: fetchRooms.length }));
      }

      // Fetch talks
      console.log('Fetching talks...');
      const { data: fetchTalks, error: talksError } = await supabase
        .from('talks')
        .select('*');
        
      if (talksError) {
        console.error('Supabase Talks Error:', talksError);
        throw talksError;
      }

      if (Array.isArray(fetchTalks)) {
        console.log(`Fetched ${fetchTalks.length} talks from Supabase`);
        if (fetchTalks.length > 0) {
          console.table(fetchTalks.slice(0, 5).map(t => ({ id: t.id, title: t.title.substring(0, 20) })));
        }
        const mappedTalks = fetchTalks.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          startTime: t.start_time || t.startTime,
          endTime: t.end_time || t.endTime,
          roomId: t.room_id || t.roomId,
          type: t.type || 'Keynote',
          themeTag: t.theme_tag || t.themeTag,
          speakers: t.speakers ? (typeof t.speakers === 'string' ? JSON.parse(t.speakers) : t.speakers) : [],
          registeredCount: t.registered_count || t.registeredCount || 0,
          capacity: t.capacity || 100,
          organizers: t.organizers || [],
          moderators: t.moderators || [],
          summary: t.summary || '',
          objective: t.objective || ''
        })) as AgendaEvent[];
        setEventsData(mappedTalks);
        localStorage.setItem('agenda-events-v3', JSON.stringify(mappedTalks));
        setSupabaseLog(prev => ({ ...prev, events: mappedTalks.length, status: 'Conectado ✓' }));
      }
      
      setSyncStatus('success');
      setLastSynced(new Date());
      console.log('--- SUPABASE SYNC SUCCESS ---');
    } catch (err: any) {
      console.error('Supabase Sync Failed:', err);
      setSyncStatus('error');
      setSupabaseLog(prev => ({ ...prev, status: `Error: ${err.message || 'Desconocido'}` }));
    }
  };

  const saveRoom = async (room: Room) => {
    const prevRooms = [...rooms];
    const isNew = !rooms.find(r => r.id === room.id) || room.id === 'new';
    const finalRoom = { ...room };
    if (isNew && room.id === 'new') {
      finalRoom.id = room.name.toLowerCase().replace(/\s+/g, '-');
    }

    // 1. Local Persistence First
    const updatedRooms = isNew 
      ? [...rooms, finalRoom] 
      : rooms.map(r => r.id === finalRoom.id ? finalRoom : r);
    
    setRooms(updatedRooms);
    localStorage.setItem('agenda-rooms-v3', JSON.stringify(updatedRooms));
    
    const toastId = toast.loading(isNew ? "Creando sala..." : "Actualizando sala...");

    try {
      const supabase = getSupabase();
      // TABLA 'rooms'
      const { error } = isNew 
        ? await supabase.from('rooms').insert([finalRoom])
        : await supabase.from('rooms').update(finalRoom).eq('id', finalRoom.id);
      
      if (error) throw error;
      
      toast.success(isNew ? "Sala creada" : "Sala actualizada", { id: toastId });
      await new Promise(resolve => setTimeout(resolve, 500));
      await syncData();
    } catch (err: any) {
      setRooms(prevRooms);
      toast.error(`Error: ${err.message}`, { id: toastId });
    }
  };

  const deleteRoom = async (id: string) => {
    const prevRooms = [...rooms];
    const updatedRooms = rooms.filter(r => r.id !== id);
    setRooms(updatedRooms);
    localStorage.setItem('agenda-rooms-v3', JSON.stringify(updatedRooms));

    const toastId = toast.loading("Eliminando sala...");
    try {
      const supabase = getSupabase();
      // TABLA 'rooms'
      const { error } = await supabase.from('rooms').delete().eq('id', id);
      if (error) throw error;
      toast.success("Sala eliminada", { id: toastId });
      await new Promise(resolve => setTimeout(resolve, 500));
      await syncData();
    } catch (err: any) {
      setRooms(prevRooms);
      toast.error(`Error: ${err.message}`, { id: toastId });
    }
  };

  const saveEvent = async (event: AgendaEvent) => {
    const prevEvents = [...eventsData];
    const isNew = !eventsData.find(e => e.id === event.id);
    
    // 1. Local Persistence First
    const updatedEvents = isNew 
      ? [...eventsData, event] 
      : eventsData.map(e => e.id === event.id ? event : e);
    
    setEventsData(updatedEvents);
    localStorage.setItem('agenda-events-v3', JSON.stringify(updatedEvents));
    
    const toastId = toast.loading(isNew ? "Creando charla..." : "Actualizando charla...");

    try {
      const supabase = getSupabase();
      const payload = {
        id: event.id,
        title: event.title,
        description: event.description || '',
        start_time: event.startTime,
        end_time: event.endTime,
        room_id: event.roomId,
        type: event.type,
        theme_tag: event.themeTag || '',
        speakers: event.speakers || [],
        registered_count: event.registeredCount || 0,
        capacity: event.capacity || 100,
        organizers: event.organizers || [],
        moderators: event.moderators || [],
        summary: event.summary || '',
        objective: event.objective || ''
      };

      // TABLA 'talks'
      const { error } = isNew 
        ? await supabase.from('talks').insert([payload])
        : await supabase.from('talks').update(payload).eq('id', event.id);
      
      if (error) throw error;
      
      toast.success(isNew ? "Charla creada" : "Charla actualizada", { id: toastId });
      await new Promise(resolve => setTimeout(resolve, 500));
      await syncData();
    } catch (err: any) {
      setEventsData(prevEvents);
      toast.error(`Error: ${err.message}`, { id: toastId });
    }
  };

  const deleteEvent = async (id: string) => {
    const prevEvents = [...eventsData];
    
    // 1. ACTUALIZACIÓN INMEDIATA (OPTIMISTA)
    const updatedEvents = eventsData.filter(e => e.id !== id);
    setEventsData(updatedEvents);
    localStorage.setItem('agenda-events-v3', JSON.stringify(updatedEvents));
    
    const toastId = toast.loading("Eliminando de la nube...");
    
    try {
      const supabase = getSupabase();
      
      // 2. Limpiar dependencias (registros)
      await supabase.from('registration').delete().eq('talk_id', id);

      // 3. Borrar en la DB principal (TABLA 'talks')
      const { error } = await supabase.from('talks').delete().eq('id', id);
      
      if (error) throw error;
      
      toast.success("Eliminado permanentemente", { id: toastId });
      
      // 4. ESPERA CRÍTICA DE CONSISTENCIA (500ms)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 5. RESINCRONIZACIÓN DE VERIFICACIÓN
      await syncData();
      
    } catch (err: any) {
      console.error("Delete Error:", err);
      // Rollback si falla
      setEventsData(prevEvents);
      localStorage.setItem('agenda-events-v3', JSON.stringify(prevEvents));
      toast.error(`Error: ${err.message}`, { id: toastId });
    }
  };

  // Fetch initial data from Supabase
  useEffect(() => {
    const init = async () => {
      await syncData();
      setLoadingInitial(false);
    };
    init();
  }, [user]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<EventType | 'All'>('All');
  const [selectedRoom, setSelectedRoom] = useState<string>('All');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'All' | 'MyAgenda'>('All');

  useEffect(() => {
    if (!selectedDay && eventsData.length > 0) {
      const days = Array.from(new Set(eventsData.map(e => e.startTime.split('T')[0]))).sort();
      if (days.length > 0) setSelectedDay(days[0]);
    }
  }, [eventsData, selectedDay]);

  const toggleBookmark = (eventId: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  const registerForEvent = async (eventId: string) => {
    if (!user) return;
    // Optimistic UI updates
    setEventsData(prev => prev.map(e => e.id === eventId ? { ...e, registeredCount: (e.registeredCount || 0) + 1 } : e));
    setRegistrations(prev => new Set(prev).add(eventId));
    
    try {
      const supabase = getSupabase();
      await supabase.from('registration').insert({ user_id: user.id, talk_id: eventId });
    } catch (e) {
      console.error('Failed to register', e);
      // Revert optimistic
      setRegistrations(prev => { const n = new Set(prev); n.delete(eventId); return n; });
    }
  };
 
  const cancelRegistration = async (eventId: string) => {
    if (!user) return;
    setEventsData(prev => prev.map(e => e.id === eventId ? { ...e, registeredCount: Math.max(0, (e.registeredCount || 0) - 1) } : e));
    setRegistrations(prev => { const n = new Set(prev); n.delete(eventId); return n; });

    try {
      const supabase = getSupabase();
      await supabase.from('registration').delete().match({ user_id: user.id, talk_id: eventId });
    } catch (e) {
      console.error('Failed to cancel', e);
    }
  };

  const availableDays = useMemo(() => {
    return Array.from(new Set(eventsData.map(e => e.startTime.split('T')[0]))).sort();
  }, [eventsData]);

  const filteredEvents = useMemo(() => {
    return eventsData.filter((event) => {
      if (selectedDay && event.startTime.split('T')[0] !== selectedDay && viewMode !== 'MyAgenda') return false;
      if (viewMode === 'MyAgenda' && !bookmarks.has(event.id) && !registrations.has(event.id)) return false;
      if (selectedRoom !== 'All' && event.roomId !== selectedRoom) return false;
      if (selectedType !== 'All' && event.type !== selectedType) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesSpeakers = event.speakers.some((s) => s.name.toLowerCase().includes(query));
        if (!matchesTitle && !matchesSpeakers) return false;
      }
      return true;
    }).sort((a, b) => {
      const timeDiff = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      if (timeDiff !== 0) return timeDiff;
      return a.title.localeCompare(b.title);
    });
  }, [searchQuery, selectedType, selectedRoom, selectedDay, viewMode, bookmarks, registrations, eventsData]);

  const groupedEvents = useMemo(() => {
    const groups: Record<string, Record<string, AgendaEvent[]>> = {};
    filteredEvents.forEach(event => {
      const dateKey = event.startTime.split('T')[0];
      const timeKey = event.startTime;
      if (!groups[dateKey]) groups[dateKey] = {};
      if (!groups[dateKey]?.[timeKey]) groups[dateKey][timeKey] = [];
      groups[dateKey][timeKey].push(event);
    });
    return groups;
  }, [filteredEvents]);

  return {
    events: eventsData,
    filteredEvents,
    groupedEvents,
    rooms,
    setRooms,
    setEventsData,
    bookmarks,
    toggleBookmark,
    registrations,
    registerForEvent,
    cancelRegistration,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedRoom,
    setSelectedRoom,
    selectedDay,
    setSelectedDay,
    availableDays,
    viewMode,
    setViewMode,
    syncData,
    syncStatus,
    lastSynced,
    supabaseLog,
    clearLocalCache,
    deleteEvent,
    saveEvent,
    saveRoom,
    deleteRoom,
  };
}
