import { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_EVENTS,
  INITIAL_ROOMS,
  AgendaEvent,
  Room,
  EventType
} from '../data/agenda';

import { getSupabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export function useAgendaData() {

  const { user } = useAuth();

  // =========================
  // STATES
  // =========================

  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('agenda-bookmarks-v3');
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) {}

    return new Set<string>();
  });

  const [registrations, setRegistrations] = useState<Set<string>>(new Set());

  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);

  // SIEMPRE iniciar con eventos locales
  const [eventsData, setEventsData] =
    useState<AgendaEvent[]>(INITIAL_EVENTS);

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedType, setSelectedType] =
    useState<EventType | 'All'>('All');

  const [selectedRoom, setSelectedRoom] =
    useState<string>('All');

  const [selectedDay, setSelectedDay] =
    useState<string | null>(null);

  const [viewMode, setViewMode] =
    useState<'All' | 'MyAgenda'>('All');

  // =========================
  // BOOKMARKS LOCAL STORAGE
  // =========================

  useEffect(() => {
    localStorage.setItem(
      'agenda-bookmarks-v3',
      JSON.stringify(Array.from(bookmarks))
    );
  }, [bookmarks]);

  // =========================
  // LOAD FROM SUPABASE
  // =========================

  useEffect(() => {

    const loadSupabase = async () => {

      try {

        console.log('🔵 Conectando a Supabase...');

        const supabase = getSupabase();

        // =========================
        // USER REGISTRATIONS
        // =========================

        if (user) {

          const { data: regData, error: regError } =
            await supabase
              .from('registrations')
              .select('talk_id')
              .eq('user_id', user.id);

          if (regError) {
            console.error('❌ REGISTRATION ERROR', regError);
          }

          if (regData) {

            const regSet = new Set<string>(
              regData.map((r: any) => r.talk_id)
            );

            setRegistrations(regSet);
          }
        }

        // =========================
        // LOAD TALKS
        // =========================

        const { data, error } =
          await supabase
            .from('talks')
            .select('*')
            .order('start_time', { ascending: true });

        console.log('SUPABASE TALKS', data);
        console.log('SUPABASE ERROR', error);

        // =========================
        // ERROR -> USAR LOCAL
        // =========================

        if (error) {

          console.error('❌ Error cargando Supabase');

          setEventsData(INITIAL_EVENTS);

          return;
        }

        // =========================
        // SI NO HAY DATOS
        // SUBIR INITIAL_EVENTS
        // =========================

        if (!data || data.length === 0) {

          console.log('🟡 Supabase vacío');
          console.log('⬆️ Subiendo INITIAL_EVENTS...');

          const formattedEvents = INITIAL_EVENTS.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description || '',
            start_time: event.startTime,
            end_time: event.endTime,
            room_id: event.roomId,
            type: event.type,
            theme_tag: event.themeTag || '',
            speakers: event.speakers || [],
            organizers: event.organizers || [],
            moderators: event.moderators || [],
            summary: event.summary || '',
            objective: event.objective || '',
            registered_count: event.registeredCount || 0,
            capacity: event.capacity || 100
          }));

          const { error: insertError } =
            await supabase
              .from('talks')
              .upsert(formattedEvents);

          if (insertError) {

            console.error(
              '❌ Error insertando talks',
              insertError
            );

          } else {

            console.log('✅ INITIAL_EVENTS guardados');

          }

          setEventsData(INITIAL_EVENTS);

          return;
        }

        // =========================
        // MAP SUPABASE -> APP
        // =========================

        const mapped: AgendaEvent[] = data.map((t: any) => ({

          id: t.id,

          title: t.title,

          description: t.description || '',

          startTime: t.start_time,

          endTime: t.end_time,

          roomId: t.room_id,

          type: t.type || 'Sesion',

          themeTag: t.theme_tag || '',

          speakers:
            Array.isArray(t.speakers)
              ? t.speakers
              : [],

          organizers:
            Array.isArray(t.organizers)
              ? t.organizers
              : [],

          moderators:
            Array.isArray(t.moderators)
              ? t.moderators
              : [],

          summary: t.summary || '',

          objective: t.objective || '',

          registeredCount:
            t.registered_count || 0,

          capacity:
            t.capacity || 100

        }));

        console.log('✅ Datos cargados desde Supabase');

        setEventsData(mapped);

      } catch (err) {

        console.error('❌ ERROR GENERAL', err);

        setEventsData(INITIAL_EVENTS);
      }
    };

    loadSupabase();

  }, [user]);

  // =========================
  // AUTO SELECT DAY
  // =========================

  useEffect(() => {

    if (!selectedDay && eventsData.length > 0) {

      const days = Array.from(
        new Set(
          eventsData.map(
            e => e.startTime.split('T')[0]
          )
        )
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

  const registerForEvent = async (
    eventId: string
  ) => {

    if (!user) return;

    setRegistrations(prev => {

      const next = new Set(prev);

      next.add(eventId);

      return next;
    });

    setEventsData(prev =>
      prev.map(event =>
        event.id === eventId
          ? {
              ...event,
              registeredCount:
                (event.registeredCount || 0) + 1
            }
          : event
      )
    );

    try {

      const supabase = getSupabase();

      // GUARDAR REGISTRO

      const { error } =
        await supabase
          .from('registrations')
          .insert({
            user_id: user.id,
            talk_id: eventId
          });

      if (error) {
        console.error(error);
      }

      // ACTUALIZAR CONTADOR

      const current =
        eventsData.find(e => e.id === eventId);

      if (current) {

        await supabase
          .from('talks')
          .update({
            registered_count:
              (current.registeredCount || 0) + 1
          })
          .eq('id', eventId);
      }

    } catch (err) {

      console.error(err);
    }
  };

  // =========================
  // CANCEL REGISTRATION
  // =========================

  const cancelRegistration = async (
    eventId: string
  ) => {

    if (!user) return;

    setRegistrations(prev => {

      const next = new Set(prev);

      next.delete(eventId);

      return next;
    });

    try {

      const supabase = getSupabase();

      await supabase
        .from('registrations')
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
        eventsData.map(
          e => e.startTime.split('T')[0]
        )
      )
    ).sort();

  }, [eventsData]);

  // =========================
  // FILTERED EVENTS
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

          const query =
            searchQuery.toLowerCase();

          const matchesTitle =
            event.title
              .toLowerCase()
              .includes(query);

          const matchesSpeakers =
            event.speakers.some(s =>
              s.name
                .toLowerCase()
                .includes(query)
            );

          if (
            !matchesTitle &&
            !matchesSpeakers
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {

        return (
          new Date(a.startTime).getTime() -
          new Date(b.startTime).getTime()
        );
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
  // GROUPED EVENTS
  // =========================

  const groupedEvents = useMemo(() => {

    const groups:
      Record<
        string,
        Record<string, AgendaEvent[]>
      > = {};

    filteredEvents.forEach(event => {

      const dateKey =
        event.startTime.split('T')[0];

      const timeKey =
        event.startTime;

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

  // =========================
  // RETURN
  // =========================

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

    setViewMode
  };
}
