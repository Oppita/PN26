import { useState, useEffect, useMemo } from 'react';
import { INITIAL_EVENTS, INITIAL_ROOMS, AgendaEvent, Room, EventType } from '../data/agenda';
import { getSupabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

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
      const saved = localStorage.getItem('agenda-rooms-v3');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return INITIAL_ROOMS;
  });
  
  const [eventsData, setEventsData] = useState<AgendaEvent[]>(() => {
    try {
      const saved = localStorage.getItem('agenda-events-v3');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return INITIAL_EVENTS;
  });
  
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

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
    try {
      const supabase = getSupabase();
      
      // Fetch registrations if user exists
      if (user) {
        const { data: regData, error: regError } = await supabase
          .from('registration')
          .select('talk_id')
          .eq('user_id', user.id);
          
        if (!regError && regData) {
          const apiRegistrations = new Set<string>(regData.map(r => r.talk_id));
          setRegistrations(apiRegistrations);
        }
      }

      // Fetch rooms
      const { data: fetchRooms, error: roomsError } = await supabase
        .from('rooms')
        .select('*');
        
      if (!roomsError && Array.isArray(fetchRooms)) {
        if (fetchRooms.length > 0) {
          setRooms(fetchRooms as Room[]);
          localStorage.setItem('agenda-rooms-v4-seeded', 'true');
        } else {
          // Supabase is empty. Only seed if we haven't done it before for this version
          const isSeeded = localStorage.getItem('agenda-rooms-v4-seeded') === 'true';
          if (!isSeeded) {
            console.log('Performing initial rooms seeding...');
            const seedRooms = rooms.length > 0 ? rooms : INITIAL_ROOMS;
            await supabase.from('rooms').upsert(seedRooms);
            setRooms(seedRooms);
            localStorage.setItem('agenda-rooms-v4-seeded', 'true');
          } else {
            // Legitimately empty
            setRooms([]);
          }
        }
      }

      // Fetch talks
      const { data: fetchTalks, error: talksError } = await supabase
        .from('talks')
        .select('*');
        
      if (!talksError && Array.isArray(fetchTalks)) {
        if (fetchTalks.length > 0) {
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
          localStorage.setItem('agenda-events-v4-seeded', 'true');
        } else {
          const isSeeded = localStorage.getItem('agenda-events-v4-seeded') === 'true';
          if (!isSeeded) {
            console.log('Performing initial events seeding...');
            const seedEvents = eventsData.length > 0 ? eventsData : INITIAL_EVENTS;
            const payload = seedEvents.map(e => ({
                id: e.id,
                title: e.title,
                description: e.description,
                start_time: e.startTime,
                end_time: e.endTime,
                room_id: e.roomId,
                type: e.type,
                theme_tag: e.themeTag,
                speakers: e.speakers,
                registered_count: e.registeredCount || 0,
                capacity: e.capacity || 100,
                organizers: e.organizers || [],
                moderators: e.moderators || [],
                summary: e.summary || '',
                objective: e.objective || ''
            }));
            await supabase.from('talks').upsert(payload);
            setEventsData(seedEvents);
            localStorage.setItem('agenda-events-v4-seeded', 'true');
          } else {
            setEventsData([]);
          }
        }
      }
      setSyncStatus('success');
      setLastSynced(new Date());
    } catch (err) {
      console.error('Failed to fetch from supabase', err);
      setSyncStatus('error');
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
  };
}
