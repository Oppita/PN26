import { useState, useEffect } from 'react';

export type Attendee = {
  id: string; // QR code data
  name: string;
  email: string;
  organization: string;
  role: string;
  photoUrl?: string;
  registeredAt: string;
};

const INITIAL_ATTENDEES: Attendee[] = [
  { id: 'QR-001', name: 'Ana Gómez', email: 'ana.gomez@ejemplo.com', organization: 'Ministerio de Ambiente', role: 'Delegada Técnica', photoUrl: 'https://i.pravatar.cc/150?u=ana', registeredAt: '2026-05-18T10:00:00Z' },
  { id: 'QR-002', name: 'Carlos Díaz', email: 'cdiaz@rescate.org', organization: 'Defensa Civil', role: 'Coordinador Operativo', photoUrl: 'https://i.pravatar.cc/150?u=carlos', registeredAt: '2026-05-18T10:15:00Z' },
  { id: 'QR-003', name: 'María Forero', email: 'mforero@sostenible.co', organization: 'Ideam', role: 'Directora de Meteorología', photoUrl: 'https://i.pravatar.cc/150?u=maria', registeredAt: '2026-05-18T10:30:00Z' },
  { id: 'QR-004', name: 'Juan Torres', email: 'juan.torres@ungrd.gov.co', organization: 'UNGRD', role: 'Asesor', registeredAt: '2026-05-18T11:00:00Z' },
  { id: 'QR-005', name: 'Lucía Buitrago', email: 'lucia.b@fao.org', organization: 'FAO', role: 'Especialista en resiliencia', photoUrl: 'https://i.pravatar.cc/150?u=lucia', registeredAt: '2026-05-18T11:45:00Z' },
];

export function useAttendees() {
  const [attendees, setAttendees] = useState<Attendee[]>(() => {
    try {
      const saved = localStorage.getItem('agenda-attendees-v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_ATTENDEES;
  });

  useEffect(() => {
    localStorage.setItem('agenda-attendees-v1', JSON.stringify(attendees));
  }, [attendees]);

  const addAttendee = (attendee: Omit<Attendee, 'id' | 'registeredAt'>) => {
    const newAttendee: Attendee = {
      ...attendee,
      id: `QR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      registeredAt: new Date().toISOString()
    };
    setAttendees(prev => [newAttendee, ...prev]);
  };

  const updateAttendee = (id: string, data: Partial<Attendee>) => {
    setAttendees(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const deleteAttendee = (id: string) => {
    setAttendees(prev => prev.filter(a => a.id !== id));
  };

  return { attendees, addAttendee, updateAttendee, deleteAttendee };
}
