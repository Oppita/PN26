export type Room = {
  id: string;
  name: string;
  capacity: number;
  location: string;
  color: string;
};

export type EventType = 
  | 'Sesión plenaria' 
  | 'Sesión paralela y temática' 
  | 'Escenario en vivo' 
  | 'Laboratorio de aprendizaje' 
  | string;

export type Speaker = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
};

export type AgendaEvent = {
  id: string;
  title: string;
  type: string;
  roomId: string;
  startTime: string; 
  endTime: string;
  speakers: Speaker[];
  organizers?: string[];
  moderators?: string[];
  description?: string; // conceptualNote
  summary?: string;
  objective?: string;
  registeredCount?: number;
  capacity?: number;
  themeTag?: string;
};

export const INITIAL_ROOMS: Room[] = [];

export const INITIAL_EVENTS: AgendaEvent[] = [];

