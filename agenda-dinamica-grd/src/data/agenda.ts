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

export const INITIAL_ROOMS: Room[] = [
  { id: 'resiliencia', name: 'Resiliencia', capacity: 200, location: 'Sala 1 x Streaming', color: '#ef4444' }, // Red
  { id: 'participacion', name: 'Participación', capacity: 120, location: 'Sala 2', color: '#3b82f6' }, // Blue
  { id: 'solidaridad', name: 'Solidaridad', capacity: 120, location: 'Sala 3', color: '#10b981' }, // Emerald
  { id: 'cimientos', name: 'Cimientos', capacity: 140, location: 'Sala 4', color: '#f59e0b' }, // Amber
  { id: 'convergencia', name: 'Convergencia', capacity: 140, location: 'Sala 5', color: '#8b5cf6' }, // Violet
  { id: 'entretejidos', name: 'Entretejidos', capacity: 100, location: 'Mezzanine', color: '#ec4899' }, // Pink
  { id: 'horizonte', name: 'Horizonte', capacity: 120, location: 'Capilla', color: '#06b6d4' }, // Cyan
  { id: 'sinergia', name: 'Sinergia', capacity: 120, location: 'Sala Piso 2', color: '#6366f1' }, // Indigo
  { id: 'diversidad', name: 'Diversidad', capacity: 30, location: 'Vivo', color: '#14b8a6' }, // Teal
  { id: 'gobernanza', name: 'Gobernanza', capacity: 50, location: 'Sala VIP', color: '#64748b' } // Slate
];

const mockSpeaker1: Speaker = {
  id: 's1',
  name: 'Dr. J. Allen Hynek',
  role: 'Astrofísico Asesor',
  bio: 'Profesor de astronomía y asesor científico. Es conocido por su participación pionera en proyectos de investigación gubernamentales sobre objetos voladores no identificados.',
  photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200'
};

const mockSpeaker2: Speaker = {
  id: 's2',
  name: 'Dra. Diana Trujillo',
  role: 'Ingeniera Aeroespacial',
  bio: 'Líder de misiones espaciales con amplia experiencia en exploración planetaria y robótica. Ha sido clave en la planificación de protocolos de resiliencia.',
  photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200'
};

const mockSpeaker3: Speaker = {
  id: 's3',
  name: 'Dra. María González',
  role: 'Directora de Meteorología',
  bio: 'Experta en climatología tropical y sistemas de alerta temprana. Autora de múltiples publicaciones sobre mitigación de desastres por ciclones.',
  photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200'
};

const mockSpeaker4: Speaker = {
  id: 's4',
  name: 'Ing. Roberto Fuentes',
  role: 'Ingeniero de Radares',
  bio: 'Especialista en desarrollo e implementación de sistemas de teledetección para el monitoreo de fenómenos hidrometeorológicos.',
  photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'
};

const mockSpeaker5: Speaker = {
  id: 's5',
  name: 'Dr. Carlos Vives',
  role: 'Geólogo',
  bio: 'Investigador asociado en hidrología y evaluación de amenazas en cuencas andinas y zonas de ladera.',
  photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200'
};

const mockSpeaker6: Speaker = {
  id: 's6',
  name: 'Ing. Ana Cárdenas',
  role: 'Experta en GIS',
  bio: 'Coordinadora de modelamiento geoespacial para la predicción de movimientos en masa y avenidas torrenciales.',
  photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200&h=200'
};

export const INITIAL_EVENTS: AgendaEvent[] = [
  // DAY 1 - MAY 20
  {
    id: 'e1',
    title: 'Colombia ante las amenazas climáticas extralimitadas',
    type: 'Sesion plenaria',
    roomId: 'resiliencia',
    startTime: '2026-05-20T08:00:00',
    endTime: '2026-05-20T09:30:00',
    speakers: [mockSpeaker2],
    organizers: ['UNGRD', 'Ministerio de Ambiente'],
    moderators: ['Juan Carlos Pérez'],
    description: 'Análisis profundo sobre los riesgos emergentes en el territorio nacional ante el cambio climático global.',
    objective: 'Establecer una hoja de ruta para la mitigación de riesgos en ciudades costeras.',
    summary: 'Se abordarán puntos críticos de la geografía colombiana y la infraestructura vital.',
    registeredCount: 145
  },
  {
    id: 'e2',
    title: 'Avances en el sistema de alertas por ciclones tropicales',
    type: 'Sesion paralela y tematica',
    roomId: 'participacion',
    startTime: '2026-05-20T10:00:00',
    endTime: '2026-05-20T11:30:00',
    speakers: [mockSpeaker3, mockSpeaker4],
    organizers: ['Ideam', 'DIMAR'],
    description: 'Revisión de las tecnologías de monitoreo satelital instaladas y la boyas inteligentes en el Caribe.',
    objective: 'Mejorar los tiempos de respuesta ante huracanes de categoría 4 o superior.',
    registeredCount: 78
  },

  // DAY 2 - MAY 21
  {
    id: 'e3',
    title: 'GRD en el sector agropecuario: Taller de Resiliencia',
    type: 'Laboratorio de aprendizaje',
    roomId: 'resiliencia',
    startTime: '2026-05-21T09:00:00',
    endTime: '2026-05-21T11:00:00',
    speakers: [mockSpeaker5, mockSpeaker6],
    organizers: ['FAO', 'MinAgricultura'],
    description: 'Taller práctico sobre seguros climáticos para pequeños productores rurales.',
    objective: 'Capacitar a técnicos regionales en herramientas de transferencia de riesgo agropecuario.',
    summary: 'Casos de éxito en el altiplano cundiboyacense y la costa pacífica.',
    registeredCount: 110
  },
  {
    id: 'e4',
    title: '5 Minutes Pitch: Tecnologías dron para rescate',
    type: 'Escenario en vivo',
    roomId: 'participacion',
    startTime: '2026-05-21T11:30:00',
    endTime: '2026-05-21T12:00:00',
    speakers: [mockSpeaker4],
    organizers: ['Startup Hub Colombia'],
    description: 'Presentación de soluciones disruptivas para la búsqueda de personas en terrenos difíciles.',
    summary: 'Drones con sensores térmicos y mapeo 3D en tiempo real.',
    registeredCount: 45
  },
  // DAY 3 - MAY 22
  {
    id: 'e5',
    title: 'Clausura: El futuro de la GRD',
    type: 'Sesion plenaria',
    roomId: 'resiliencia',
    startTime: '2026-05-22T08:00:00',
    endTime: '2026-05-22T10:00:00',
    speakers: [mockSpeaker1],
    organizers: ['UNGRD'],
    description: 'Conclusiones y compromisos finales del encuentro.',
    objective: 'Consolidar la agenda de resiliencia nacional 2026-2030.',
    registeredCount: 200
  }
];
