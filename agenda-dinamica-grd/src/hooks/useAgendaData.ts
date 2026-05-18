import { useState, useEffect, useCallback } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import { AgendaEvent, Room, INITIAL_EVENTS, INITIAL_ROOMS } from '../data/agenda';

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

interface UseAgendaDataReturn {
  events: AgendaEvent[];
  rooms: Room[];
  syncStatus: SyncStatus;
  syncError: string | null;
  lastSyncTime: Date | null;
  syncData: () => Promise<void>;
  clearCache: () => void;
  createEvent: (event: Omit<AgendaEvent, 'id'>) => Promise<void>;
  updateEvent: (event: AgendaEvent) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  updateRoom: (room: Room) => Promise<void>;
  deleteRoom: (roomId: string) => Promise<void>;
}

// Cache keys
const CACHE_KEYS = {
  EVENTS: 'agenda_events_cache',
  ROOMS: 'agenda_rooms_cache',
  LAST_SYNC: 'agenda_last_sync'
};

export function useAgendaData(): UseAgendaDataReturn {
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const supabase = getSupabase();

  // Load from localStorage on mount
  useEffect(() => {
    const cachedEvents = localStorage.getItem(CACHE_KEYS.EVENTS);
    const cachedRooms = localStorage.getItem(CACHE_KEYS.ROOMS);
    const cachedLastSync = localStorage.getItem(CACHE_KEYS.LAST_SYNC);
    
    if (cachedEvents) {
      setEvents(JSON.parse(cachedEvents));
    }
    if (cachedRooms) {
      setRooms(JSON.parse(cachedRooms));
    }
    if (cachedLastSync) {
      setLastSyncTime(new Date(JSON.parse(cachedLastSync)));
    }
  }, []);

  // Save to localStorage whenever events/rooms change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem(CACHE_KEYS.EVENTS, JSON.stringify(events));
    }
    if (rooms.length > 0) {
      localStorage.setItem(CACHE_KEYS.ROOMS, JSON.stringify(rooms));
    }
    if (lastSyncTime) {
      localStorage.setItem(CACHE_KEYS.LAST_SYNC, JSON.stringify(lastSyncTime.toISOString()));
    }
  }, [events, rooms, lastSyncTime]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEYS.EVENTS);
    localStorage.removeItem(CACHE_KEYS.ROOMS);
    localStorage.removeItem(CACHE_KEYS.LAST_SYNC);
    setEvents([]);
    setRooms([]);
    setLastSyncTime(null);
    syncData(); // Force fresh sync after clearing cache
  }, []);

  const syncData = useCallback(async () => {
    setSyncStatus('syncing');
    setSyncError(null);
    
    try {
      console.log('🔄 Syncing data from Supabase...');
      
      // Fetch events from Supabase
      const { data: eventsData, error: eventsError } = await supabase
        .from('agenda_talks')
        .select('*')
        .order('startTime', { ascending: true });

      if (eventsError) {
        if (eventsError.code === '42P01') {
          console.warn('Table agenda_talks does not exist yet');
          setEvents([]);
          localStorage.setItem(CACHE_KEYS.EVENTS, JSON.stringify([]));
        } else {
          throw new Error(`Events error: ${eventsError.message}`);
        }
      } else {
        console.log(`📊 Fetched ${eventsData?.length || 0} events from Supabase`);
        setEvents(eventsData as AgendaEvent[] || []);
        localStorage.setItem(CACHE_KEYS.EVENTS, JSON.stringify(eventsData || []));
      }
      
      // Fetch rooms from Supabase
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*');

      if (roomsError && roomsError.code !== '42P01') {
        throw new Error(`Rooms error: ${roomsError.message}`);
      }
      
      if (roomsData && roomsData.length > 0) {
        setRooms(roomsData as Room[]);
        localStorage.setItem(CACHE_KEYS.ROOMS, JSON.stringify(roomsData));
      } else if (roomsError?.code === '42P01') {
        setRooms(INITIAL_ROOMS);
        localStorage.setItem(CACHE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
      } else {
        setRooms(INITIAL_ROOMS);
        localStorage.setItem(CACHE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
      }

      const now = new Date();
      setLastSyncTime(now);
      localStorage.setItem(CACHE_KEYS.LAST_SYNC, JSON.stringify(now.toISOString()));
      
      setSyncStatus('success');
      console.log('✅ Sync completed successfully');
      
      setTimeout(() => {
        setSyncStatus(prev => prev === 'success' ? 'idle' : prev);
      }, 2000);
      
    } catch (err) {
      console.error('❌ Sync error:', err);
      setSyncError(err instanceof Error ? err.message : 'Error de sincronización');
      setSyncStatus('error');
      
      setTimeout(() => {
        setSyncError(null);
        setSyncStatus(prev => prev === 'error' ? 'idle' : prev);
      }, 4000);
    }
  }, [supabase]);

  // Delete event - CRUCIAL: with localStorage update and 500ms delay
  const deleteEvent = useCallback(async (eventId: string) => {
    console.log(`🗑️ Deleting event: ${eventId}`);
    
    // 1. Immediate optimistic update in memory
    const currentEvents = events;
    const updatedEvents = currentEvents.filter(e => e.id !== eventId);
    setEvents(updatedEvents);
    
    // 2. IMMEDIATE localStorage update (CRITICAL FIX)
    localStorage.setItem(CACHE_KEYS.EVENTS, JSON.stringify(updatedEvents));
    console.log(`💾 Updated localStorage immediately, new count: ${updatedEvents.length}`);
    
    try {
      // 3. First, delete from registration table (clean dependencies)
      const { error: regError } = await supabase
        .from('registration')
        .delete()
        .eq('talk_id', eventId);
      
      if (regError) {
        console.warn('Warning when deleting registrations:', regError);
      }
      
      // 4. Then delete the talk
      const { error } = await supabase
        .from('agenda_talks')
        .delete()
        .eq('id', eventId);
      
      if (error) throw error;
      
      console.log(`✅ Event ${eventId} deleted from Supabase`);
      
      // 5. Wait 500ms to ensure cloud consistency (CRITICAL DELAY)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 6. Force re-sync to confirm with cloud
      console.log('🔄 Re-syncing to confirm deletion...');
      await syncData();
      
    } catch (err) {
      console.error('❌ Error deleting event:', err);
      setSyncError('Error al eliminar la charla');
      setSyncStatus('error');
      
      // Revert optimistic update on error
      setEvents(currentEvents);
      localStorage.setItem(CACHE_KEYS.EVENTS, JSON.stringify(currentEvents));
      await syncData();
      throw err;
    }
  }, [supabase, syncData, events]);

  const createEvent = useCallback(async (eventData: Omit<AgendaEvent, 'id'>) => {
    const newEvent = {
      ...eventData,
      id: crypto.randomUUID(),
    };
    
    try {
      const { error } = await supabase
        .from('agenda_talks')
        .insert([newEvent]);
      
      if (error) throw error;
      
      await syncData();
    } catch (err) {
      console.error('Error creating event:', err);
      setSyncError('Error al crear la charla');
      setSyncStatus('error');
      throw err;
    }
  }, [supabase, syncData]);

  const updateEvent = useCallback(async (updatedEvent: AgendaEvent) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    localStorage.setItem(CACHE_KEYS.EVENTS, JSON.stringify(
      events.map(e => e.id === updatedEvent.id ? updatedEvent : e)
    ));
    
    try {
      const { error } = await supabase
        .from('agenda_talks')
        .upsert(updatedEvent);
      
      if (error) throw error;
      
      await syncData();
    } catch (err) {
      console.error('Error updating event:', err);
      setSyncError('Error al guardar la charla');
      setSyncStatus('error');
      await syncData();
      throw err;
    }
  }, [supabase, syncData, events]);

  const updateRoom = useCallback(async (updatedRoom: Room) => {
    setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    localStorage.setItem(CACHE_KEYS.ROOMS, JSON.stringify(
      rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r)
    ));
    
    try {
      const { error } = await supabase
        .from('rooms')
        .upsert(updatedRoom);
      
      if (error) throw error;
      await syncData();
    } catch (err) {
      console.error('Error updating room:', err);
      setSyncError('Error al guardar la sala');
      setSyncStatus('error');
      await syncData();
    }
  }, [supabase, syncData, rooms]);

  const deleteRoom = useCallback(async (roomId: string) => {
    setRooms(prev => prev.filter(r => r.id !== roomId));
    localStorage.setItem(CACHE_KEYS.ROOMS, JSON.stringify(rooms.filter(r => r.id !== roomId)));
    
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);
      
      if (error) throw error;
      await syncData();
    } catch (err) {
      console.error('Error deleting room:', err);
      setSyncError('Error al eliminar la sala');
      setSyncStatus('error');
      await syncData();
    }
  }, [supabase, syncData, rooms]);

  useEffect(() => {
    syncData();
  }, []);

  return {
    events,
    rooms,
    syncStatus,
    syncError,
    lastSyncTime,
    syncData,
    clearCache,
    createEvent,
    updateEvent,
    deleteEvent,
    updateRoom,
    deleteRoom,
  };
}
