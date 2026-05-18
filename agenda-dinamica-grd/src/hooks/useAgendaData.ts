import { useState, useEffect, useMemo } from 'react';
import { INITIAL_EVENTS, INITIAL_ROOMS, AgendaEvent, Room, EventType } from '../data/agenda';
import { getSupabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export function useAgendaData() {
  const { user } = useAuth();

  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [registrations, setRegistrations] = useState<Set<string>>(new Set());

  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);

  // SIEMPRE iniciar con agenda local
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
    const loadSupabase = async () => {
      try {
        console.log('🚀 Conectando a Supabase...');

        const supabase = getSupabase();

        const { data, error } = await supabase
          .from('talks')
          .select('*');

        console.log('SUPABASE TALKS', data);
        console.log('SUPABASE ERROR', error);

        // SI EXISTEN DATOS EN SUPABASE
        if (!error && data && data.length > 0) {

          const mapped: AgendaEvent[] = data.map((t: any) => ({
            id: t.id,
            title: t.title,
            type: t.type || '',
            roomId: t.room_id || '',
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

          setEventsData(mapped);

        } else {

          // SI SUPABASE ESTÁ VACÍO
          // SUBIR TODO INITIAL_EVENTS AUTOMÁTICAMENTE

          console.log('⚠️ Supabase vacío. Subiendo agenda local...');

          const payload = INITIAL_EVENTS.map((e) => ({
            id: e.id,
            title: e.title,
            type: e.type,
            room_id: e.roomId,
            start_time: e.startTime,
            end_time: e.endTime,
            speakers: e.speakers,
            organizers: e.organizers || [],
            moderators: e.moderators || [],
            description: e.description || '',
            summary: e.summary || '',
            objective: e.objective || '',
            registered_count: e.registeredCount || 0,
            capacity: e.capacity || 100,
            theme_tag: e.themeTag || ''
          }));

          const { error: insertError } = await supabase
            .from('talks')
            .upsert(payload);

          console.log('UPLOAD RESULT', insertError);

          // mantener local
          setEventsData(INITIAL_EVENTS);
        }

      } catch (err) {
        console.error('❌ Error general Supabase', err);

        // fallback seguro
        setEventsData(INITIAL_EVENTS);
      }
    };

    loadSupabase();
  }, []);

  // =========================
  // QR REGISTRATIONS
  // =========================

  useEffect(() => {
    if (!user) return;

    const loadRegistrations = async () => {
      try {
        const supabase = getSupabase();

        const { data } = await supabase
          .from('registration')
          .select('talk_id')
          .eq('user_id', user.id);

        if (data) {
          setRegistrations(new Set(data.map((r: any) => r.talk_id)));
        }

      } catch (e) {
        console.error(e);
      }
    };

    loadRegistrations();

  }, [user]);

  // =========================
  // BOOKMARKS
  // =========================

  const toggleBookmark = (eventId: string) => {
    setBookmarks((prev) => {
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
  // REGISTRO QR
  // =========================

  const registerForEvent = async (eventId: string) => {

    if (!user) return;

    setRegistrations((prev) => new Set(prev).add(eventId));

    try {

      const supabase = getSupabase();

      await supabase
        .from('registration')
        .upsert({
          user_id: user.id,
          talk_id: eventId
        });

      console.log('✅ Registro guardado');

    } catch (e) {
      console.error('❌ Error registro', e);
    }
  };

  const cancelRegistration = async (eventId: string) => {

    if (!user) return;

    const next = new Set(registrations);
    next.delete(eventId);

    setRegistrations(next);

    try {

      const supabase = getSupabase();

      await supabase
        .from('registration')
        .delete()
        .match({
          user_id: user.id,
          talk_id: eventId
        });

    } catch (e) {
      console.error(e);
    }
  };

  // =========================
  // AVAILABLE DAYS
  // =========================

  const availableDays = useMemo(() => {
    return Array.from(
      new Set(eventsData.map(e => e.startTime.split('T')[0]))
    ).sort();
  }, [eventsData]);

  useEffect(() => {
    if (!selectedDay && availableDays.length > 0) {
      setSelectedDay(availableDays[0]);
    }
  }, [availableDays]);

  // =========================
  // FILTROS
  // =========================

  const filteredEvents = useMemo(() => {

    return eventsData.filter((event) => {

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

        const query = searchQuery.toLowerCase();

        const matchesTitle =
          event.title.toLowerCase().includes(query);

        const matchesSpeakers =
          event.speakers.some((s) =>
            s.name.toLowerCase().includes(query)
          );

        if (!matchesTitle && !matchesSpeakers) {
          return false;
        }
      }

      return true;

    });

  }, [
    eventsData,
    selectedDay,
    selectedRoom,
    selectedType,
    searchQuery,
    bookmarks,
    registrations,
    viewMode
  ]);

  // =========================
  // GROUPED EVENTS
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
