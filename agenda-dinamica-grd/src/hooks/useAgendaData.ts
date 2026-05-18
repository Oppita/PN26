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

  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);

  const [eventsData, setEventsData] = useState<AgendaEvent[]>(INITIAL_EVENTS);

  const [loadingInitial, setLoadingInitial] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<EventType | 'All'>('All');
  const [selectedRoom, setSelectedRoom] = useState<string>('All');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'All' | 'MyAgenda'>('All');

  useEffect(() => {
    localStorage.setItem(
      'agenda-bookmarks-v3',
      JSON.stringify(Array.from(bookmarks))
    );
  }, [bookmarks]);

  // =========================
  // FETCH SUPABASE DATA
  // =========================
  useEffect(() => {

    const fetchData = async () => {

      try {

        console.log('🔄 Conectando a Supabase...');

        const supabase = getSupabase();

        // =========================
        // USER REGISTRATIONS
        // =========================
        if (user) {

          const { data: regData, error: regError } = await supabase
            .from('registrations')
            .select('talk_id')
            .eq('user_id', user.id);

          console.log('REGISTRATIONS:', regData);
          console.log('REGISTRATIONS ERROR:', regError);

          if (!regError && regData) {

            const registrationSet = new Set<string>(
              regData.map((r: any) => r.talk_id)
            );

            setRegistrations(registrationSet);
          }
        }

        // =========================
        // TALKS
        // =========================
        const { data: talksData, error: talksError } = await supabase
          .from('talks')
          .select('*')
          .order('start_time', { ascending: true });

        console.log('SUPABASE TALKS:', talksData);
        console.log('SUPABASE ERROR:', talksError);

        // =========================
        // SUCCESS
        // =========================
        if (!talksError && talksData && talksData.length > 0) {

          const mappedTalks: AgendaEvent[] = talksData.map((t: any) => ({

            id: t.id,

            title: t.title || '',

            description: t.description || '',

            startTime: t.start_time,

            endTime: t.end_time,

            roomId: t.room_id || 'resiliencia',

            type: t.type || 'Sesion plenaria',

            themeTag: t.theme_tag || '',

            speakers:
              typeof t.speakers === 'string'
                ? JSON.parse(t.speakers)
                : t.speakers || [],

            registeredCount: t.registered_count || 0,

            capacity: t.capacity || 100,

            organizers: t.organizers || [],

            moderators: t.moderators || [],

            summary: t.summary || '',

            objective: t.objective || ''

          }));

          setEventsData(mappedTalks);

          console.log('✅ Datos cargados desde Supabase');

        } else {

          console.log('⚠️ No hay talks en Supabase. Usando INITIAL_EVENTS');

          setEventsData(INITIAL_EVENTS);
        }

      } catch (err) {

        console.error('❌ Error general Supabase:', err);

        setEventsData(INITIAL_EVENTS);

      } finally {

        setLoadingInitial(false);
      }
    };

    fetchData();

  }, [user]);

  // =========================
  // INITIAL DAY
  // =========================
  useEffect(() => {

    if (!selectedDay && eventsData.length > 0) {

      const days = Array.from(
        new Set(eventsData.map(e => e.startTime.split('T')[0]))
      ).sort();

      if (days.length > 0) {
        setSelectedDay(days[0]);
      }
    }

  }, [eventsData, selectedDay]);

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
  // REGISTER EVENT
  // =========================
  const registerForEvent = async (eventId: string) => {

    if (!user) return;

    setRegistrations(prev => new Set(prev).add(eventId));

    setEventsData(prev =>
      prev.map(e =>
        e.id === eventId
          ? {
              ...e,
              registeredCount: (e.registeredCount || 0) + 1
            }
          : e
      )
    );

    try {

      const supabase = getSupabase();

      const { error } = await supabase
        .from('registrations')
        .insert({
          user_id: user.id,
          talk_id: eventId
        });

      if (error) {
        console.error(error);
      }

    } catch (err) {

      console.error('❌ Error registrando:', err);
    }
  };

  // =========================
  // CANCEL REGISTRATION
  // =========================
  const cancelRegistration = async (eventId: string) => {

    if (!user) return;

    setRegistrations(prev => {

      const next = new Set(prev);

      next.delete(eventId);

      return next;
    });

    setEventsData(prev =>
      prev.map(e =>
        e.id === eventId
          ? {
              ...e,
              registeredCount: Math.max(
                0,
                (e.registeredCount || 0) - 1
              )
            }
          : e
      )
    );

    try {

      const supabase = getSupabase();

      const { error } = await supabase
        .from('registrations')
        .delete()
        .match({
          user_id: user.id,
          talk_id: eventId
        });

      if (error) {
        console.error(error);
      }

    } catch (err) {

      console.error('❌ Error cancelando registro:', err);
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

  // =========================
  // FILTER EVENTS
  // =========================
  const filteredEvents = useMemo(() => {

    return eventsData
      .filter(event => {

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

          const matchesTitle = event.title
            .toLowerCase()
            .includes(query);

          const matchesSpeakers = event.speakers.some(
            s => s.name.toLowerCase().includes(query)
          );

          if (!matchesTitle && !matchesSpeakers) {
            return false;
          }
        }

        return true;

      })
      .sort((a, b) => {

        const timeDiff =
          new Date(a.startTime).getTime() -
          new Date(b.startTime).getTime();

        if (timeDiff !== 0) return timeDiff;

        return a.title.localeCompare(b.title);
      });

  }, [
    searchQuery,
    selectedType,
    selectedRoom,
    selectedDay,
    viewMode,
    bookmarks,
    registrations,
    eventsData
  ]);

  // =========================
  // GROUP EVENTS
  // =========================
  const groupedEvents = useMemo(() => {

    const groups: Record<
      string,
      Record<string, AgendaEvent[]>
    > = {};

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

    loadingInitial
  };
}
