import { useState, useEffect, useMemo } from 'react';
import { INITIAL_EVENTS, INITIAL_ROOMS, AgendaEvent, Room, EventType } from '../data/agenda';
import { getSupabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export function useAgendaData() {

  const { user } = useAuth();

  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [registrations, setRegistrations] = useState<Set<string>>(new Set());

  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);

  const [eventsData, setEventsData] = useState<AgendaEvent[]>(INITIAL_EVENTS);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<EventType | 'All'>('All');
  const [selectedRoom, setSelectedRoom] = useState<string>('All');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'All' | 'MyAgenda'>('All');

  // =========================
  // CARGAR DATOS SUPABASE
  // =========================

  useEffect(() => {

    const fetchData = async () => {

      try {

        console.log('🔥 Conectando a Supabase...');

        const supabase = getSupabase();

        // =========================
        // TALKS
        // =========================

        const { data: talksData, error: talksError } = await supabase
          .from('talks')
          .select('*');

        console.log('SUPABASE TALKS:', talksData);
        console.log('SUPABASE ERROR:', talksError);

        if (!talksError && talksData && talksData.length > 0) {

          const mappedTalks: AgendaEvent[] = talksData.map((t: any) => ({
            id: t.id,
            title: t.title,
            type: t.type || 'General',
            roomId: t.room_id,
            startTime: t.start_time,
            endTime: t.end_time,
            speakers: t.speakers || [],
            organizers: t.organizers || [],
            moderators: t.moderators || [],
            description: t.description || '',
            summary: t.summary || '',
            objective: t.objective || '',
            registeredCount: t.registered_count || 0,
            capacity: t.capacity || 100,
            themeTag: t.theme_tag || ''
          }));

          console.log('✅ Datos cargados desde Supabase');

          setEventsData(mappedTalks);

        } else {

          console.log('⚠️ Supabase vacío. Usando INITIAL_EVENTS');

          setEventsData(INITIAL_EVENTS);
        }

        // =========================
        // REGISTRATIONS
        // =========================

        if (user) {

          const { data: regData } = await supabase
            .from('registration')
            .select('talk_id')
            .eq('user_id', user.id);

          if (regData) {

            setRegistrations(
              new Set(regData.map((r: any) => r.talk_id))
            );
          }
        }

      } catch (err) {

        console.error('❌ Error conectando Supabase:', err);

        setEventsData(INITIAL_EVENTS);
      }
    };

    fetchData();

  }, [user]);

  // =========================
  // BOOKMARKS
  // =========================

  const toggleBookmark = (eventId: string) => {

    setBookmarks(prev => {

      const next = new Set(prev);

      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }

      return next;
    });
  };

  // =========================
  // REGISTER
  // =========================

  const registerForEvent = async (eventId: string) => {

    if (!user) return;

    setRegistrations(prev => new Set(prev).add(eventId));

    try {

      const supabase = getSupabase();

      await supabase
        .from('registration')
        .insert({
          user_id: user.id,
          talk_id: eventId
        });

    } catch (err) {

      console.error(err);
    }
  };

  // =========================
  // CANCEL REGISTER
  // =========================

  const cancelRegistration = async (eventId: string) => {

    if (!user) return;

    setRegistrations(prev => {

      const next = new Set(prev);

      next.delete(eventId);

      return next;
    });

    try {

      const supabase = getSupabase();

      await supabase
        .from('registration')
        .delete()
        .match({
          user_id: user.id,
          talk_id: eventId
        });

    } catch (err) {

      console.error(err);
    }
  };

  // =========================
  // AVAILABLE DAYS
  // =========================

  const availableDays = useMemo(() => {

    return Array.from(
      new Set(
        eventsData.map(e => e.startTime.split('T')[0])
      )
    ).sort();

  }, [eventsData]);

  // =========================
  // DEFAULT DAY
  // =========================

  useEffect(() => {

    if (!selectedDay && availableDays.length > 0) {

      setSelectedDay(availableDays[0]);
    }

  }, [availableDays, selectedDay]);

  // =========================
  // FILTER EVENTS
  // =========================

  const filteredEvents = useMemo(() => {

    return eventsData.filter(event => {

      if (
        selectedDay &&
        event.startTime.split('T')[0] !== selectedDay &&
        viewMode !== 'MyAgenda'
      ) {
        return false;
      }

      if (
        viewMode === 'MyAgenda' &&
        !bookmarks.has(event.id) &&
        !registrations.has(event.id)
      ) {
        return false;
      }

      if (
        selectedRoom !== 'All' &&
        event.roomId !== selectedRoom
      ) {
        return false;
      }

      if (
        selectedType !== 'All' &&
        event.type !== selectedType
      ) {
        return false;
      }

      if (searchQuery) {

        const q = searchQuery.toLowerCase();

        const matchTitle =
          event.title.toLowerCase().includes(q);

        const matchSpeaker =
          event.speakers.some(
            (s: any) =>
              s.name?.toLowerCase().includes(q)
          );

        if (!matchTitle && !matchSpeaker) {
          return false;
        }
      }

      return true;

    });

  }, [
    eventsData,
    searchQuery,
    selectedType,
    selectedRoom,
    selectedDay,
    viewMode,
    bookmarks,
    registrations
  ]);

  // =========================
  // GROUP EVENTS
  // =========================

  const groupedEvents = useMemo(() => {

    const groups: Record<string, Record<string, AgendaEvent[]>> = {};

    filteredEvents.forEach(event => {

      const dateKey = event.startTime.split('T')[0];

      const timeKey = event.startTime;

      if (!groups[dateKey]) {
        groups[dateKey] = {};
      }

      if (!groups[dateKey][timeKey]) {
        groups[dateKey][timeKey] = [];
      }

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
  };
}
