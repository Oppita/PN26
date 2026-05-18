import { useState, useEffect, useMemo } from 'react';
import { INITIAL_ROOMS, AgendaEvent, Room, EventType } from '../data/agenda';
import { getSupabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export function useAgendaData() {

  const { user } = useAuth();

  const [eventsData, setEventsData] = useState<AgendaEvent[]>([]);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [registrations, setRegistrations] = useState<Set<string>>(new Set());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<EventType | 'All'>('All');
  const [selectedRoom, setSelectedRoom] = useState<string>('All');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'All' | 'MyAgenda'>('All');

  // LOAD TALKS
  useEffect(() => {

    const loadTalks = async () => {

      try {

        const supabase = getSupabase();

        const { data, error } = await supabase
          .from('talks')
          .select('*')
          .order('start_time', { ascending: true });

        console.log('SUPABASE TALKS', data);

        if (error) {
          console.error(error);
          return;
        }

        const mapped: AgendaEvent[] = data.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          startTime: t.start_time,
          endTime: t.end_time,
          roomId: t.room_id,
          type: t.type || '',
          themeTag: t.theme_tag || '',
          speakers: t.speakers || [],
          organizers: t.organizers || [],
          moderators: t.moderators || [],
          summary: t.summary || '',
          objective: t.objective || '',
          registeredCount: t.registered_count || 0,
          capacity: t.capacity || 100
        }));

        setEventsData(mapped);

      } catch (err) {

        console.error(err);
      }
    };

    loadTalks();

  }, []);

  // LOAD USER REGISTRATIONS
  useEffect(() => {

    if (!user) return;

    const loadRegistrations = async () => {

      const supabase = getSupabase();

      const { data, error } = await supabase
        .from('registrations')
        .select('talk_id')
        .eq('user_id', user.id);

      if (!error && data) {

        setRegistrations(
          new Set(data.map((r: any) => r.talk_id))
        );
      }
    };

    loadRegistrations();

  }, [user]);

  // REGISTER EVENT
  const registerForEvent = async (eventId: string) => {

    if (!user) return;

    const supabase = getSupabase();

    await supabase
      .from('registrations')
      .insert({
        user_id: user.id,
        talk_id: eventId
      });

    setRegistrations(prev => new Set(prev).add(eventId));
  };

  // CANCEL REGISTRATION
  const cancelRegistration = async (eventId: string) => {

    if (!user) return;

    const supabase = getSupabase();

    await supabase
      .from('registrations')
      .delete()
      .match({
        user_id: user.id,
        talk_id: eventId
      });

    setRegistrations(prev => {

      const next = new Set(prev);

      next.delete(eventId);

      return next;
    });
  };

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

  const filteredEvents = useMemo(() => {

    return eventsData.filter(event => {

      if (
        selectedDay &&
        event.startTime.split('T')[0] !== selectedDay &&
        viewMode !== 'MyAgenda'
      ) return false;

      if (
        viewMode === 'MyAgenda' &&
        !bookmarks.has(event.id) &&
        !registrations.has(event.id)
      ) return false;

      if (
        selectedRoom !== 'All' &&
        event.roomId !== selectedRoom
      ) return false;

      if (
        selectedType !== 'All' &&
        event.type !== selectedType
      ) return false;

      if (searchQuery) {

        const q = searchQuery.toLowerCase();

        const title = event.title.toLowerCase();

        const speakers = event.speakers.some(
          (s: any) => s.name?.toLowerCase().includes(q)
        );

        if (!title.includes(q) && !speakers) {
          return false;
        }
      }

      return true;

    });

  }, [
    eventsData,
    selectedDay,
    viewMode,
    bookmarks,
    registrations,
    selectedRoom,
    selectedType,
    searchQuery
  ]);

  const groupedEvents = useMemo(() => {

    const groups: Record<string, Record<string, AgendaEvent[]>> = {};

    filteredEvents.forEach(event => {

      const day = event.startTime.split('T')[0];

      const time = event.startTime;

      if (!groups[day]) groups[day] = {};

      if (!groups[day][time]) groups[day][time] = [];

      groups[day][time].push(event);
    });

    return groups;

  }, [filteredEvents]);

  return {
    events: eventsData,
    groupedEvents,
    filteredEvents,
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
