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
  {
    id: 'e1',
    title: "Paralela 1 - Colombia ante las amenazas extraterrestres",
    type: "Paralela",
    roomId: 'resiliencia',
    startTime: "2026-05-20T10:00",
    endTime: "2026-05-20T10:45",
    speakers: [
    {
        "id": "s1",
        "name": "Lauren Flor Torres",
        "role": "Doctora en Astrof√≠sica",
        "bio": "Doctora en Astrof√≠sica,, profesora e investigadora en la Universidad de Antioquia. Su trabajo integra la investigaci√≥n en astrof√≠sica estelar y espectroscopia, junto con a la creaci√≥n de espacios m√°s equitativos en las √°reas STEM. Actualmente se desempe√±a como Presidenta de la Comunidad Colombiana de Astronom√≠a (AstroCO). Ha liderado iniciativas de pol√≠tica p√∫blica cient√≠fica ante organismos gubernamentales y cuenta con una trayectoria dedicada a la formaci√≥n acad√©mica universitaria y la divulgaci√≥n cient√≠fica, promoviendo la integraci√≥n de la ciencia en la agenda de seguridad y desarrollo sostenible del pa√≠s.",
        "photoUrl": ""
    },
    {
        "id": "s2",
        "name": "Jorge I. Zuluaga Callejas",
        "role": "Doctor en F√≠sica",
        "bio": "F√≠sico y Doctor en F√≠sica, profesor titular e investigador en la Universidad de Antioquia. Su trabajo integra investigaci√≥n en ciencias planetarias y astrobiolog√≠a, computaci√≥n cient√≠fica de alto desempe√±o y formaci√≥n avanzada en f√≠sica y astronom√≠a. Ha liderado grupos y programas acad√©micos, y cuenta con una trayectoria de publicaciones en exoplanetas, exolunas, campos magn√©ticos planetarios, din√°mica orbital y meteoroides, junto con una labor sostenida de divulgaci√≥n cient√≠fica en escenarios acad√©micos y p√∫blicos\n",
        "photoUrl": ""
    },
    {
        "id": "s-1778897588919",
        "name": "Adriana Victoria Araujo Salcedo ",
        "role": "PhD. en F√≠sica Te√≥rica con Maestr√≠a en F√≠sica y pregrado en Matem√°ticas ",
        "bio": "PhD. en F√≠sica Te√≥rica con Maestr√≠a en F√≠sica y pregrado en Matem√°ticas \nDirectora del observatorio Julio Garavito Armero del Gimnasio Campestre\n",
        "photoUrl": ""
    },
    {
        "id": "s-1778897642651",
        "name": "Mauricio Romero Torres",
        "role": "Doctor en biociencias",
        "bio": "Doctor en biociencias, Subdirecci√≥n para el Conocimiento del Riesgo, Unidad Nacional para la Gesti√≥n del Riesgo de Desastres\n",
        "photoUrl": ""
    }
],
    organizers: ["AstroCO - Comunidad Colombiana de Astronom√≠a", "Universidad de Antioquia"],
    moderators: [],
    description: "Las amenazas de origen extraterrestre ‚Äîimpactos de asteroides y meteoritos, tormentas geomagn√©ticas severas y objetos de √≥rbita cercana a la Tierra (NEOs)‚Äî constituyen fen√≥menos documentados con capacidad de generar desastres de escala regional o global. A pesar de su relevancia, estas amenazas permanecen ausentes de los marcos nacionales y regionales de gesti√≥n del riesgo en Am√©rica Latina, representando una brecha cr√≠tica de conocimiento y gobernanza en la implementaci√≥n del Marco de Sendai 2015‚Äì2030.\n\nEsta sesi√≥n responde directamente a las Prioridades 1 y 2 del Marco de Sendai: comprender el riesgo de desastres y fortalecer la gobernanza para gestionarlo.\n\nEn l√≠nea con la Prioridad 1, se presentar√° evidencia cient√≠fica sobre la naturaleza, probabilidad e impacto potencial de estas amenazas en el territorio colombiano y la regi√≥n andina, incluyendo las lecciones del seguimiento al asteroide 2024 YR4 ‚Äîprimer objeto de esta naturaleza identificado como amenaza potencial concreta para Am√©rica del Sur‚Äî. Esta evidencia ha sido construida por astr√≥nomas y astr√≥nomos colombianos, lo que subraya el valor estrat√©gico de invertir en ciencia propia para conocer y gestionar los riesgos del pa√≠s.\n\nEn articulaci√≥n con la Prioridad 2, la sesi√≥n presentar√° la creaci√≥n de la Mesa T√©cnica de Amenazas Extraterrestres en la Comisi√≥n Nacional para el Conocimiento del Riesgo, liderada por la UNGRD con participaci√≥n de AstroCO. Esta mesa es un hito in√©dito en la regi√≥n y un modelo de gobernanza interinstitucional que reconoce expl√≠citamente a la comunidad cient√≠fica nacional como actor indispensable en la construcci√≥n de lineamientos de gesti√≥n del riesgo.\n\nUn mensaje central de esta sesi√≥n es que fortalecer la gesti√≥n del riesgo extraterrestre en Colombia requiere, de manera inseparable, fortalecer la astronom√≠a \n",
    objective: "Visibilizar las amenazas de origen extraterrestre como riesgos reales que deben integrarse a los marcos nacionales de gesti√≥n del riesgo de \ndesastres, a partir de evidencia cient√≠fica generada por investigadoras e investigadores colombianos. \nPresentar los avances institucionales de Colombia en la materia, en particular la creaci√≥n de la Mesa T√©cnica de Amenazas Extraterrestres en la Comisi√≥n Nacional para el Conocimiento del Riesgo, y el papel de la astronom√≠a  observacional nacional como capacidad estrat√©gica soberana para la detecci√≥n, monitoreo y gesti√≥n de estas amenazas. \nConvocar a tomadores de decisiones a comprometer acciones concretas que fortalezcan simult√°neamente la gesti√≥n del riesgo extraterrestre y el desarrollo de la astronom√≠a observacional hecha en Colombia.\n\n",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e2',
    title: "Paralela 6 Escuelas Resilientes y Construcci√≥n de Paz  SAVE THE CHILDREN / SCOUT",
    type: "Paralela",
    roomId: 'resiliencia',
    startTime: "2026-05-20T11:00",
    endTime: "2026-05-20T11:45",
    speakers: [
    {
        "id": "s-1778900138427",
        "name": "Julian Cort√©s",
        "role": "Especialista en educaci√≥n y gesti√≥n del riesgo",
        "bio": "",
        "photoUrl": ""
    },
    {
        "id": "s-1778900206963",
        "name": "Natalia Montes Gonz√°lez",
        "role": "profesional del sector humanitario con experiencia en protecci√≥n infantil y educaci√≥n en emergencias.",
        "bio": "Natalia Montes Gonz√°lez es profesional del sector humanitario con experiencia\nen protecci√≥n infantil y educaci√≥n en emergencias. Su trabajo se ha centrado en\nel fortalecimiento de entornos protectores y en el desarrollo de respuestas\neducativas en contextos de riesgo, en articulaci√≥n con comunidades y actores del\nsistema educativo.\nHa acompa√±ado procesos orientados a la gesti√≥n del riesgo y al bienestar de\nni√±os, ni√±as y adolescentes, integrando enfoques diferenciales, de g√©nero y de\nderechos. Tiene especial inter√©s en el dise√±o y facilitaci√≥n de metodolog√≠as\nparticipativas que promuevan el aprendizaje colectivo, el intercambio de saberes\ny la apropiaci√≥n de herramientas en contextos educativos, apostando por\nprocesos que sean significativos y sostenibles para las comunidades.",
        "photoUrl": ""
    },
    {
        "id": "s-1778900288902",
        "name": "Nataly Mart√≠nez Cuellar",
        "role": "Comisionada Nacional de Gesti√≥n del Riesgo",
        "bio": "Administradora de empresas con experiencia en gesti√≥n integrada de sistemas,\ncertificada como auditora interna en ISO 9001, 14001 y 45001. Inici√© mi trayectoria\nen el sector salud como auxiliar de enfermer√≠a, especializ√°ndome en Promoci√≥n y\nPrevenci√≥n (PYP), bienestar laboral y gesti√≥n del riesgo. Capacitadora en PYP y\n\nbienestar, con amplia experiencia en la implementaci√≥n y mantenimiento de SG-\nSST y gesti√≥n ambiental. Habilidades en supervisi√≥n de equipos, atenci√≥n a\n\nclientes, coordinaci√≥n de contratos y optimizaci√≥n de procesos. Mi enfoque en\neficiencia operativa, control de personal y mejora continua garantiza el cumplimiento\nnormativo y el fortalecimiento organizacional.",
        "photoUrl": ""
    },
    {
        "id": "s-1778900325174",
        "name": "",
        "role": "",
        "bio": "",
        "photoUrl": ""
    }
],
    organizers: [],
    moderators: [],
    description: "La educaci√≥n para la Reducci√≥n del Riesgo de Desastres\n(RRD) en Colombia ha cobrado una relevancia cr√≠tica en los\n√∫ltimos a√±os debido a la combinaci√≥n de amenazas\nnaturales, antr√≥picas y derivadas del conflicto armado, las\ncuales afectan de manera directa la continuidad educativa\ny el bienestar de ni√±as, ni√±os y docentes.\nEn este contexto, la gesti√≥n integral del riesgo escolar\n(GIRE) se ha consolidado como una pol√≠tica p√∫blica\nnecesaria para garantizar escuelas seguras y resilientes,\n\narticulada con el Plan de Acci√≥n Nacional de Escuelas\nSeguras 2022‚Äì2026.\nEl Consorcio CREER ‚ÄîComunidades resilientes, escuelas\nresilientes‚Äî, conformado por Save the Children Colombia\ny otras organizaciones nacionales e internacionales, se ha\nconvertido en un actor central en la implementaci√≥n de\nestas pol√≠ticas en territorios priorizados como Arauca y\nNari√±o, incluyendo Tumaco. [linkedin.com],\n[savethechi...ren.org.co]\nEl proyecto CREER parte de un diagn√≥stico contundente:\nen 2023 los eventos violentos que afectaron la educaci√≥n\naumentaron un 53 %, y el reclutamiento de menores por\ngrupos armados creci√≥ un 500 %, lo que evidencia que la\neducaci√≥n en emergencias es un componente estructural\nde la garant√≠a del derecho a la educaci√≥n en el pa√≠s. En\nrespuesta, el consorcio trabaja en fortalecer capacidades\ninstitucionales, comunitarias y escolares para anticiparse,\nreducir y responder a riesgos que amenazan los entornos\neducativos. [linkedin.com], [savethechi...ren.org.co]\nAcciones en Arauca\nEn Arauca, la implementaci√≥n del Consorcio CREER se\narticula con la creaci√≥n del Comit√© T√©cnico Territorial de\nGesti√≥n Integral del Riesgo Escolar (GIRE), formalizado\nmediante la Resoluci√≥n 3423 de 2022. Este comit√© lidera\nacciones intersectoriales para garantizar la continuidad del\nservicio educativo ante riesgos naturales, antr√≥picos y\nasociados al conflicto armado, e integra a la Secretar√≠a de\nEducaci√≥n, entidades p√∫blicas y cooperaci√≥n internacional.\nDesde CREER, estas estructuras institucionales se\nfortalecen mediante procesos de capacitaci√≥n,\nacompa√±amiento t√©cnico y acciones de protecci√≥n\norientadas a que las comunidades escolares desarrollen\ncapacidades para prevenir y responder a emergencias, as√≠\ncomo para proteger a los estudiantes frente a din√°micas de\nviolencia que afectan a la regi√≥n. [arauca.gov.co]\n[linkedin.com], [es.linkedin.com]\nAdem√°s, investigaciones realizadas en el marco del\nconsorcio evidencian que entre 2024 y 2025 los eventos\nque afectaron a instituciones educativas en territorios\ncomo Arauca pasaron de 331 a 571, lo que demuestra la\n\nurgencia de consolidar una gobernanza escolar efectiva del\nriesgo. [es.linkedin.com]\nAcciones en Tumaco (Nari√±o)\nTumaco, como territorio del departamento de Nari√±o,\nenfrenta m√∫ltiples riesgos asociados al conflicto armado,\ndesastres naturales y desplazamientos forzados. El\nConsorcio CREER trabaja en esta zona promoviendo la\neducaci√≥n segura y la resiliencia escolar mediante el\nfortalecimiento del monitoreo de ataques a escuelas, el\nacompa√±amiento psicosocial y la formaci√≥n de docentes y\ndirectivos en RRD y educaci√≥n en emergencias. Los\nespacios de di√°logo interinstitucional, como el webinar ‚ÄúDel\nriesgo a la resiliencia: educaci√≥n segura en el camino‚Äù,\nprofundizan el an√°lisis de la situaci√≥n educativa en Nari√±o\ny destacan los hallazgos del monitoreo de riesgos en\nTumaco, visibilizando las voces de estudiantes afectados\npor la violencia. [savethechi...ren.org.co], [ascofade.co]\n[ascofade.co]\nLa experiencia del Consorcio CREER demuestra que la\neducaci√≥n en RRD y la integraci√≥n de la gesti√≥n integral del\nriesgo escolar en la pol√≠tica p√∫blica colombiana son\nfundamentales para garantizar escuelas como territorios\nprotectores. En Arauca y Tumaco, el trabajo articulado con\ninstituciones educativas, gobiernos locales y comunidades\ncontribuye a fortalecer la resiliencia, asegurar el acceso y la\npermanencia escolar y avanzar hacia entornos educativos\nseguros en contextos de alta vulnerabilidad.\nEl proyecto EsParce Paz es una iniciativa de Scouts de\nColombia que surge como respuesta a los impactos\npersistentes del conflicto armado, la violencia y la exclusi√≥n\nsocial en diversos territorios del pa√≠s, los cuales han\nafectado especialmente el bienestar emocional, la cohesi√≥n\ncomunitaria y las oportunidades de desarrollo de j√≥venes y\ncomunidades.\nEn este contexto, el proyecto se orienta a fortalecer\ncapacidades en j√≥venes y actores comunitarios para la\nconstrucci√≥n de paz, el cuidado emocional y la acci√≥n\nhumanitaria, reconociendo a la juventud como agente clave\nde transformaci√≥n social. Su enfoque integra elementos de\nsalud mental, educaci√≥n para la paz, liderazgo juvenil y\ngesti√≥n comunitaria del riesgo, alineado con marcos\n\nnacionales e internacionales como la pol√≠tica de salud\nmental y los Objetivos de Desarrollo Sostenible.\nOperativamente, EsParce Paz se implementa a trav√©s de\nmetodolog√≠as participativas propias del Movimiento Scout,\nbajo el principio del aprender haciendo, y se estructura en\ntres l√≠neas principales de acci√≥n:\n‚Ä¢ Fortalecimiento del bienestar emocional,\nmediante espacios de autocuidado, escucha activa y\nresiliencia comunitaria.\n‚Ä¢ C√≠rculos de paz y reconciliaci√≥n comunitaria, que\npromueven el di√°logo, la cohesi√≥n social y la\ntransformaci√≥n de conflictos.\n‚Ä¢ Educaci√≥n en acci√≥n humanitaria, integrando\nherramientas pr√°cticas para la preparaci√≥n,\nrespuesta y resiliencia comunitaria frente a\nemergencias.\nAdicionalmente, el proyecto impulsa la articulaci√≥n\ninterinstitucional y la generaci√≥n de redes locales,\nreconociendo que la respuesta a los riesgos y las\nemergencias requiere coordinaci√≥n entre j√≥venes,\ncomunidades, instituciones educativas y actores\nhumanitarios.\nDe esta manera, EsParce Paz se convierte en un espacio de\nintegraci√≥n entre aprendizaje, acci√≥n y reflexi√≥n, donde se\naporta el enfoque metodol√≥gico y conceptual para\nfortalecer capacidades, promover la colaboraci√≥n local y\nconsolidar sistemas de respuesta m√°s efectivos, centrados\nen la protecci√≥n, el bienestar y la construcci√≥n de entornos\nseguros.\nEs as√≠ como Scouts de Colombia, a trav√©s del proyecto\nEsParce Paz, aporta un enfoque de acci√≥n humanitaria con\nliderazgo juvenil basado en metodolog√≠as de aprendizaje\nexperiencial aprender haciendo, promoviendo el desarrollo\nde capacidades en la ni√±ez, adolescentes y j√≥venes como\nagentes de cambio para la construcci√≥n de entornos\nprotectores, la gesti√≥n emocional y la promoci√≥n de una\ncultura de paz.\nEste espacio busca generar un di√°logo entre actores\nhumanitarios, educativos y comunitarios para compartir\naprendizajes, identificar desaf√≠os comunes y fortalecer la\nimplementaci√≥n de estrategias integrales que contribuyan\na la resiliencia de las comunidades educativas en contextos\n\nde emergencia mediante la escucha activa, regulaci√≥n\nemocional y promoviendo una cultura de paz.\nEn este sentido, la sesi√≥n se proyecta como un espacio de\narticulaci√≥n pr√°ctica entre la pol√≠tica p√∫blica, la acci√≥n\nhumanitaria y las iniciativas comunitarias, donde las\nexperiencias territoriales permiten aterrizar los\nlineamientos nacionales a realidades concretas. A trav√©s\ndel di√°logo entre actores, se busca resaltar la importancia\nde enfoques integrales que incorporen la gesti√≥n\nemocional, la protecci√≥n y la participaci√≥n activa de ni√±as,\nni√±os y j√≥venes, reconociendo que la construcci√≥n de\nescuelas resilientes depende tanto de capacidades\ninstitucionales como del fortalecimiento del tejido social en\nlos territorios.",
    objective: "Visibilizar las lecciones aprendidas en la implementaci√≥n de\nla estrategia de gesti√≥n integral del riesgo escolar en el\nmarco del consorcio Creer (Arauca, Tumaco, Buenaventura\ny Cauca), articulando el proyecto EsParce Paz como una\napuesta para fortalecer la acci√≥n humanitaria con enfoque\njuvenil, comunitario y de construcci√≥n de paz.\nPresentar de manera pr√°ctica las experiencias\ndesarrolladas en los territorios, destacando logros, retos y\naprendizajes clave en la gesti√≥n del riesgo escolar.\n\nEvidenciar c√≥mo el proyecto EsParce Paz aporta al\nfortalecimiento de capacidades en j√≥venes y comunidades,\nvinculando la acci√≥n humanitaria con la promoci√≥n de la\npaz, la prevenci√≥n de riesgos y la generaci√≥n de entornos\nseguros.\nGenerar un espacio din√°mico donde los participantes, a\ntrav√©s de metodolog√≠as experienciales, identifiquen\naprendizajes aplicables a sus propios contextos\nterritoriales.",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e3',
    title: "Paralela 11 Reducir el riesgo y salvaguardar la biodiversidad SRR UNGRD",
    type: "Paralela",
    roomId: 'participacion',
    startTime: "2026-05-22T15:00",
    endTime: "2026-05-22T11:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e4',
    title: "Paralela 13 Anticipar, planificar y resistir: los desaf√≠os de la GRD UNGRD / MIN VIVIENDA",
    type: "Paralela",
    roomId: 'resiliencia',
    startTime: "2026-05-20T14:15",
    endTime: "2026-05-20T15:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e5',
    title: "Paralela 15 Hacia la ‚ÄúIniciativa del Marco de Resiliencia del Mar Caribe‚Äù mediante el fomento de la inversi√≥n en la RRD JICA",
    type: "Paralela",
    roomId: 'resiliencia',
    startTime: "2026-05-20T16:30",
    endTime: "2026-05-20T17:15",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e6',
    title: "Paralela 17 De la observaci√≥n a la acci√≥n: CopernicusLAC en la gesti√≥n del riesgo multiamenazas en Colombia COPERNICUS",
    type: "Paralela",
    roomId: 'resiliencia',
    startTime: "2026-05-20T17:30",
    endTime: "2026-05-20T18:15",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e7',
    title: "Paralela 19 Animales y desastres: una mirada desde la sociedad civil SMD UNGRD - GNRD",
    type: "Paralela",
    roomId: 'resiliencia',
    startTime: "2026-05-21T10:15",
    endTime: "2026-05-21T11:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e8',
    title: "Paralela 22 Del dato a la decisi√≥n: IA para la gesti√≥n del riesgo 3IS",
    type: "Paralela",
    roomId: 'resiliencia',
    startTime: "2026-05-21T11:15",
    endTime: "2026-05-21T12:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e9',
    title: "Paralela 25 G√©nero, datos e innovaci√≥n: Del compromiso global a la acci√≥n territorial GIZ - Red Lac Mujeres RRD - UNDRR - ONU MUJERES",
    type: "Paralela",
    roomId: 'resiliencia',
    startTime: "2026-05-21T13:30",
    endTime: "2026-05-21T14:15",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e10',
    title: "Paralela 27 Cuando los datos se vuelven protecci√≥n (visi√≥n geoespacial para la transferencia del riesgo) FASECOLDA",
    type: "Paralela",
    roomId: 'resiliencia',
    startTime: "2026-05-21T14:30",
    endTime: "2026-05-21T15:15",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e11',
    title: "Paralela 29 ¬øQui√©n paga el riesgo? Financiamiento de la resiliencia en contextos de alta exposici√≥n a desastres UNDRR - SRR UNGRD",
    type: "Paralela",
    roomId: 'resiliencia',
    startTime: "2026-05-21T16:15",
    endTime: "2026-05-21T17:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e12',
    title: "Paralela 32 Hacia territorios resilientes en Colombia: orientaciones conceptuales para pol√≠tica e inversi√≥n p√∫blica. DNP",
    type: "Paralela",
    roomId: 'resiliencia',
    startTime: "2026-05-21T17:15",
    endTime: "2026-05-21T18:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e13',
    title: "Paralela 34 Construyendo espacios de paz en la ruralidad ARN",
    type: "Paralela",
    roomId: 'resiliencia',
    startTime: "2026-05-22T16:00",
    endTime: "2026-05-22T17:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e14',
    title: "Paralela 36 - Incorporaci√≥n del desplazamiento por desastres y eventos de evoluci√≥n lenta",
    type: "Paralela",
    roomId: 'resiliencia',
    startTime: "2026-05-21T17:00",
    endTime: "2026-05-21T18:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 112,
    capacity: 100
  },

  {
    id: 'e15',
    title: "Paralela 2 Avances en el sistema de alertas por ciclones tropicales SCR-UNGRD",
    type: "Paralela",
    roomId: 'participacion',
    startTime: "2026-05-20T10:00",
    endTime: "2026-05-20T10:45",
    speakers: [
    {
        "id": "s3",
        "name": "Cr. DIANA CAROLINA RUEDA",
        "role": "Oficial de la Fuerza Aeroespacial Colombiana, Magister en meteorolog√≠a, especialista en corrientes en chorro de bajo nivel",
        "bio": "Oficial de la Fuerza Aeroespacial Colombiana, Magister en meteorolog√≠a, especialista en corrientes en chorro de bajo nivel, fue jefe de la Oficina de Pron√≥sticos y Alertas del IDEAM en el 2023 y 2025, en donde lider√≥ la articulaci√≥n participativa del Protocolo Nacional de Alertas por Ciclones Tropicales en compa√±√≠a de la UNGRD. Ahora se desempe√±a como Subdirectora de Meteorolog√≠a dependencia encargada de la vigilancia y monitoreo de las condiciones clim√°ticas y de variabilidad.\n",
        "photoUrl": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        "id": "s4",
        "name": "Ing. CLAUDIA URBANO",
        "role": "Ingeniera F√≠sica y Candidata a Doctor en Ciencias del Mar.",
        "bio": "Ingeniera F√≠sica y Candidata a Doctor en Ciencias del Mar. Es investigador en el √°rea de Oceanograf√≠a Operacional del Centro Oceanogr√°fico e Hidrogr√°fico del Caribe (CIOH), instituto de investigaci√≥n de la Direcci√≥n General Mar√≠tima (DIMAR).\nActualmente funge como l√≠der t√©cnico del proyecto SIPSEM Sistema Integrado de Pron√≥sticos para la Seguridad Integral Mar√≠tima, encargada de la modelaci√≥n num√©rica para la realizaci√≥n de pron√≥sticos hidrodin√°micos, oleaje y marejada de tormenta.\n",
        "photoUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        "id": "s-1778898097616",
        "name": "JULIETH CAROLINA RODRIGUEZ",
        "role": "Ingeniera Ge√≥loga, especialista en prevenci√≥n, reducci√≥n y atenci√≥n de desastres y estudiante de maestr√≠a en Gesti√≥n del Riesgo y Proyectos de Desarrollo.",
        "bio": "Ingeniera Ge√≥loga, especialista en prevenci√≥n, reducci√≥n y atenci√≥n de desastres y estudiante de maestr√≠a en Gesti√≥n del Riesgo y Proyectos de Desarrollo. Durante los √∫ltimos 6 a√±os, ha consolidado su carrera en la UNGRD, especializ√°ndose en la implementaci√≥n de la Ley 1523 de 2012 y en el fortalecimiento de la preparaci√≥n para la respuesta.\nSu gesti√≥n se centra en la Gobernanza del Riesgo, desempe√±ando funciones cr√≠ticas en la activaci√≥n de la Sala de Crisis Nacional y la coordinaci√≥n de protocolos de alerta. Como l√≠der del equipo de preparativos para la respuesta, garantiza la sinergia entre las entidades del SNGRD para la optimizaci√≥n de recursos y tiempos de respuesta. As√≠ mismo, ha participado en la atenci√≥n de situaciones de desastre como el Hurac√°n Iota en 2020.\n \n",
        "photoUrl": ""
    },
    {
        "id": "s-1778898154085",
        "name": "ANGELA TATIANA RODRIGUEZ TOBAR",
        "role": "Ingeniera Ge√≥grafa y Ambiental, mag√≠ster en Meteorolog√≠a. Especialista en an√°lisis meteorol√≥gicos y clim√°ticos, con √©nfasis en procesos de interacci√≥n oc√©ano atm√≥sfera. ",
        "bio": "Ingeniera Ge√≥grafa y Ambiental, mag√≠ster en Meteorolog√≠a.\nEspecialista en an√°lisis meteorol√≥gicos y clim√°ticos, con √©nfasis en procesos de interacci√≥n oc√©ano atm√≥sfera. Actualmente se desempe√±a como profesional especializado en la SCR de la UNGRD, apoyando en el tema de gesti√≥n del riesgo de desastres asociados a procesos hidrometeorol√≥gicos, adicionalmente lidera la coordinaci√≥n de la Mesa T√©cnica de Alerta por Ciclones Tropicales, integrada por IDEAM, DIMAR, FAC, AEROCIVIL y la UNGRD. \n",
        "photoUrl": ""
    }
],
    organizers: [],
    moderators: [],
    description: "Marco de Sendai - Fortalecimiento del conocimiento del riesgo (Prioridad 1)\nLos avances en Colombia, como el uso de modelos num√©ricos, im√°genes, integraci√≥n de m√∫ltiples fuentes y an√°lisis de informaci√≥n, caracterizaci√≥n de los escenarios de riesgo, entre otros contribuyen a una mejor comprensi√≥n del riesgo por ciclones tropicales.\n\nEs as√≠ como las instituciones de la Mesa T√©cnica de Alertas por Ciclones Tropicales (MTACT), conformada por el IDEAM, la DIMAR, la Aerocivil, la FAC y la UNGRD, han venido trabajando en ese sentido en pro de una mejora en la resoluci√≥n espacial y temporal de los pron√≥sticos, una mejor identificaci√≥n de este fen√≥meno ‚Äúmultiamenaza‚Äù (vientos, lluvias, marejada cicl√≥nica, inundaciones, movimientos en masa, entre otros). As√≠ como en el desarrollo de productos t√©cnicos m√°s claros para la toma de decisiones.\n\nEn t√©rminos del Marco de Sendai, esto fortalece la base cient√≠fica del conocimiento del riesgo.\n\nFortalecimiento de la gobernanza del riesgo (Prioridad 2)\nEn Colombia, MTACT, como m√°xima instancia del Comit√© Nacional para el Conocimiento del Riesgo en materia de estos eventos, ha configurado un reto de coordinaci√≥n y cooperaci√≥n de las instituciones de orden nacional en pro de la implementaci√≥n de un sistema de alertas de orden nacional que le permita al SNGRD tomar mejores decisiones ante la probabilidad de materializaci√≥n de la amenaza por ciclones tropicales.\n\nEsto implica roles m√°s claros en la generaci√≥n y difusi√≥n de alertas. Estandarizadas de niveles de alerta y comunicados t√©cnicos, coordinaci√≥n interinstitucional m√°s eficiente tanto de la MTACT como en interacci√≥n con los diferentes actores del SNGRD\n\nAs√≠ mismo, Sendai enfatiza la gobernanza como eje central para que la informaci√≥n t√©cnica se traduzca en acci√≥n, por lo que se busca la articulaci√≥n del Protocolo Nacional alertas por ciclones tropicales y el Plan Nacional para la respuesta ante la ocurrencia de estos eventos, con los instrumentos de gesti√≥n del riesgo de desastres territoriales, sectoriales y comunitarios.\n",
    objective: "Dar a conocer los avances tanto operativos como t√©cnicos con los que cuenta la MTACT en el marco del Protocolo nacional de alertas por ciclones tropicales.\n\n\nSocializar la misi√≥n de la MTACT y la meta a alcanzar con el Protocolo nacional de alertas por ciclones tropicales.\n",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e16',
    title: "Paralela 7 Por qu√© y donde ocurren las avenidas torrenciales SCR-UNGRD",
    type: "Paralela",
    roomId: 'participacion',
    startTime: "2026-05-20T11:00",
    endTime: "2026-05-20T11:45",
    speakers: [
    {
        "id": "s5",
        "name": "Miguel Angel Vanegas Ramos",
        "role": "Ingeniero Civil y Mag√≠ster en Ingenier√≠a - Recursos Hidr√°ulicos de la Universidad Nacional de Colombia, con 18 a√±os de experiencia en el an√°lisis, modelaci√≥n y gesti√≥n de sistemas h√≠dricos, riesgo de desastres y cambio clim√°tico.",
        "bio": "Ingeniero Civil y Mag√≠ster en Ingenier√≠a - Recursos Hidr√°ulicos de la Universidad Nacional de Colombia, con 18 a√±os de experiencia en el an√°lisis, modelaci√≥n y gesti√≥n de sistemas h√≠dricos, riesgo de desastres y cambio clim√°tico. Actualmente integra el equipo t√©cnico de la Unidad Nacional para la Gesti√≥n del Riesgo de Desastres (UNGRD), donde ha liderado la implementaci√≥n de procesos de conocimiento del riesgo. En su trayectoria institucional destaca como coautor de documentos t√©cnicos fundamentales, tales como el Bolet√≠n, la Cartilla y la Metodolog√≠a de Priorizaci√≥n de Avenidas Torrenciales, as√≠ como los Lineamientos para la Elaboraci√≥n de Estudios B√°sicos y Detallados en esta materia. Su perfil especializado combina el desarrollo de modelos hidrol√≥gicos e hidr√°ulicos avanzados aplicados al ordenamiento territorial, con una s√≥lida trayectoria en docencia universitaria en √°reas de hidroinform√°tica, hidrolog√≠a, hidr√°ulica y mec√°nica de fluidos.\n\n",
        "photoUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        "id": "s6",
        "name": "oana P√©rez Betancourt",
        "role": "Ingeniera en recursos h√≠dricos y gesti√≥n ambiental de la Universidad Central y M√°ster en Pol√≠tica P√∫blica y Servicios Sociales de la Universidad de Salamanca, Espa√±a. ",
        "bio": "Ingeniera en recursos h√≠dricos y gesti√≥n ambiental de la Universidad Central y M√°ster en Pol√≠tica P√∫blica y Servicios Sociales de la Universidad de Salamanca, Espa√±a. Se desempe√±a\ncomo docente universitaria en la Maestr√≠a de Gesti√≥n del Riesgo de Desastres y Desarrollo de la Escuela Militar de Ingenieros, as√≠ como de la Especializaci√≥n Gesti√≥n Territorial y Aval√∫os de la Universidad Santo Tom√°s. Actualmente, es profesional especializada de la Unidad Nacional para la Gesti√≥n del Riesgo de Desastres en la Subdirecci√≥n para el Conocimiento del Riesgo, encargada de los escenarios de riesgo por fen√≥menos de origen hidrometeorol√≥gico donde ha desarrollado junto con el ingeniero Miguel Angel Vanegas, el documento priorizaci√≥n de avenidas torrenciales.\n\n",
        "photoUrl": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200&h=200"
    }
],
    organizers: [],
    moderators: [],
    description: "Esta sesi√≥n expone el an√°lisis de 1.640 eventos de emergencias por avenidas torrenciales registrados entre 1921 y 2021. Se explicar√° c√≥mo la Subdirecci√≥n para el Conocimiento del Riesgo (UNGRD) delimit√≥ cuencas aferentes a 586 cabeceras municipales, clasificando la prioridad (Alta, Media, Baja) seg√∫n el impacto en personas fallecidas, viviendas destruidas y acueductos afectados. El enfoque central es proporcionar una base t√©cnica para que los departamentos m√°s afectados, como Antioquia (247 eventos) y Huila (126 eventos), orienten sus inversiones de manera efectiva.\n\n",
    objective: "Presentar el esquema metodol√≥gico para la identificaci√≥n de √°reas de estudio a nivel municipal frente a avenidas torrenciales.\nSocializar los resultados de la priorizaci√≥n nacional, destacando las 193 cuencas de prioridad alta identificadas seg√∫n criterios de impacto social y de infraestructura.\nFomentar la integraci√≥n de estos estudios b√°sicos de amenaza en los planes municipales de gesti√≥n del riesgo y ordenamiento territorial.\n\n",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e17',
    title: "Paralela 12 Camino hacia \"\"Tsunami Ready\"\" en Colombia SCR - UNGRD - DIMAR",
    type: "Paralela",
    roomId: 'participacion',
    startTime: "2026-05-20T13:15",
    endTime: "2026-05-20T14:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e18',
    title: "Paralela 14 GRD en el sector agropecuario MINAGRICULTURA-FAO",
    type: "Paralela",
    roomId: 'cimientos',
    startTime: "2026-05-21T11:15",
    endTime: "2026-05-21T12:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e19',
    title: "Paralela 16 Cuando un desastre desencadena eventos tecnol√≥gicos: riesgo NATECH en Colombia RI",
    type: "Paralela",
    roomId: 'participacion',
    startTime: "2026-05-22T11:15",
    endTime: "2026-05-22T12:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e20',
    title: "Paralela 18 Implementaci√≥n de la pol√≠tica de GRD en las IES colombianas AUSCUN, REDULAC/RRD Cap√≠tulo Colombia,  MEN,  UNGRD",
    type: "Paralela",
    roomId: 'participacion',
    startTime: "2026-05-20T17:30",
    endTime: "2026-05-20T18:15",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e21',
    title: "Paralela 20 √Åreas protegidas y gesti√≥n del riesgo clim√°tico PNN",
    type: "Paralela",
    roomId: 'participacion',
    startTime: "2026-05-21T10:15",
    endTime: "2026-05-21T11:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e22',
    title: "Paralela 23 El Ej√©rcito Colombiano: pilar fundamental de la Gesti√≥n del Riesgo ESING",
    type: "Paralela",
    roomId: 'participacion',
    startTime: "2026-05-21T11:15",
    endTime: "2026-05-21T12:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e23',
    title: "Paralela 26 - Lineamientos de GRD para la infraestructura de transporte",
    type: "Paralela",
    roomId: 'participacion',
    startTime: "2026-05-21T10:00",
    endTime: "2026-05-21T11:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 60,
    capacity: 100
  },

  {
    id: 'e24',
    title: "Paralela 28 Invertir en prevenci√≥n: responsabilidad fiscal y sostenibilidad en la gesti√≥n del riesgo de desastres UNAL",
    type: "Paralela",
    roomId: 'participacion',
    startTime: "2026-05-21T11:00",
    endTime: "2026-05-21T12:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e25',
    title: "Paralela 30 El colapso clim√°tico y ambiental en Colombia: diagn√≥stico para una resiliencia territorial sostenible UDCA",
    type: "Paralela",
    roomId: 'participacion',
    startTime: "2026-05-21T16:15",
    endTime: "2026-05-21T17:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e26',
    title: "Paralela 33 Respuesta Humanitaria Inclusiva: Una apuesta centrada en las mujeres y personas con discapacidad CARE - Humanity & Inclusion",
    type: "Paralela",
    roomId: 'participacion',
    startTime: "2026-05-21T17:15",
    endTime: "2026-05-21T18:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e27',
    title: "Paralela 35 Sistemas alimentarios resilientes ICLEI / FAO",
    type: "Paralela",
    roomId: 'resiliencia',
    startTime: "2026-05-20T13:15",
    endTime: "2026-05-20T14:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e28',
    title: "Paralela 37 Preparaci√≥n ante emergencias y movilidad humana OIM / CRC\"",
    type: "Sesi√≥n paralela y tem√°tica",
    roomId: 'participacion',
    startTime: "2026-05-20T16:30",
    endTime: "2026-05-20T17:15",
    speakers: [
    {
        "id": "s-1777046121817",
        "name": "maria meza",
        "role": "subdirectora",
        "bio": "fknkjh",
        "photoUrl": ""
    }
],
    organizers: ["ungrd"],
    moderators: ["nelson"],
    description: "holagggj",
    objective: "mnk",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e29',
    title: "Acto de apertura",
    type: "Escenario en vivo",
    roomId: 'sal√≥n-colombia',
    startTime: "2026-05-20T09:00",
    endTime: "2026-05-20T09:45",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e30',
    title: "PLENARIA¬†1 - Sistemas de conocimiento en las alertas tempranas: Un di√°logo de saberes para salvar vidas SCR - UNGRD",
    type: "Plenaria",
    roomId: 'sal√≥n-colombia',
    startTime: "2026-05-20T12:00",
    endTime: "2026-05-20T13:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e31',
    title: "PLENARIA¬†2 - Lanzamiento del SINGRD OAPI - UNGRD",
    type: "Plenaria",
    roomId: 'sal√≥n-colombia',
    startTime: "2026-05-20T15:15",
    endTime: "2026-05-20T16:15",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e32',
    title: "Tem√°tica 2 Brechas y oportunidades para la integraci√≥n del conocimiento del riesgo s√≠smico en la GRD territorial SGC - UNGRD",
    type: "Sesi√≥n paralela y tem√°tica",
    roomId: 'solidaridad',
    startTime: "2026-05-20T13:15",
    endTime: "2026-05-20T15:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e33',
    title: "Especial 4 Infraestructura de transporte resiliente al clima: avances y desaf√≠os para Colombia MINTRANSPORTE",
    type: "Sesi√≥n paralela y tem√°tica",
    roomId: 'solidaridad',
    startTime: "2026-05-20T16:30",
    endTime: "2026-05-20T18:15",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e34',
    title: "Paralela 4 Continuidad de las operaciones y resiliencia territorial en las cadenas de suministro RI - CCS",
    type: "Sesi√≥n plenaria",
    roomId: 'cimientos',
    startTime: "2026-05-20T10:00",
    endTime: "2026-05-20T10:45",
    speakers: [
    {
        "id": "s-1778899670622",
        "name": "Lida Gonz√°lez. EPM",
        "role": "",
        "bio": "",
        "photoUrl": ""
    },
    {
        "id": "s-1778899683183",
        "name": "Diego Rivera. Alcald√≠a de Manizales",
        "role": "",
        "bio": "",
        "photoUrl": ""
    },
    {
        "id": "s-1778899696482",
        "name": "Adriana Solano. Board Global ARISE. CCS",
        "role": "",
        "bio": "",
        "photoUrl": ""
    }
],
    organizers: [],
    moderators: ["Luis Bonilla", "Oficial de Asuntos Econ√≥micos ‚Äì UNDRR"],
    description: "Las cadenas de suministro constituyen un componente\ncr√≠tico para asegurar el desarrollo econ√≥mico, el\nabastecimiento de alimentos, la provisi√≥n de servicios\nesenciales y la generaci√≥n de empleo y los medios de\nvida en los territorios.\nEn el contexto colombiano, los impactos crecientes\nderivados del cambio clim√°tico y la recurrencia de\ndesastres tales como inundaciones, remoci√≥n en masa,\nsequ√≠as, avenidas torrenciales, eventos clim√°ticos\nextremos, entre otros, evidencian la alta vulnerabilidad\nde los procesos productivos y de los flujos de bienes\nesenciales y no esenciales, con efectos directos sobre\nlos medios de vida de las comunidades, la estabilidad de\nlos mercados locales y la propia econom√≠a territorial y\nnacional.\nEn Colombia, la continuidad de las operaciones en las\ncadenas de suministro representa un desaf√≠o y una\noportunidad estrat√©gica para el Sistema Nacional de\n\nNo. Secci√≥n Descripci√≥n\n\nGesti√≥n del Riesgo de Desastres (SNGRD), en tanto\nrequiere una articulaci√≥n efectiva entre la planificaci√≥n\nterritorial, la inversi√≥n p√∫blica y privada, y la gesti√≥n del\nriesgo a nivel sectorial, local y nacional.\nLa continuidad de las operaciones en las cadenas de\nsuministro busca proteger el desarrollo alcanzado, evitar\nretrocesos socioecon√≥micos y fortalecer la resiliencia\nterritorial, en l√≠nea con las prioridades del Marco de\nSendai para la Reducci√≥n del Riesgo de Desastres\n2015‚Äì2030, particularmente:\n‚Ä¢ La comprensi√≥n del riesgo sist√©mico,\n‚Ä¢ El fortalecimiento de la gobernanza con\nparticipaci√≥n del sector privado,\n‚Ä¢ La inversi√≥n en resiliencia, y\n‚Ä¢ La preparaci√≥n para una recuperaci√≥n oportuna y\nsostenible.\nEl Marco de Sendai reconoce expl√≠citamente el rol\ndel sector privado como actor fundamental para la\nreducci√≥n del riesgo de desastres, destacando su\nresponsabilidad en la gesti√≥n del riesgo en sus\noperaciones, la protecci√≥n de infraestructura cr√≠tica y la\narticulaci√≥n con las autoridades p√∫blicas para garantizar\nla continuidad de bienes y servicios esenciales. En este\nsentido, asegurar la continuidad de las cadenas de\nsuministro no solo protege activos empresariales, sino\nque salvaguarda el empleo, los ingresos de los hogares,\nla seguridad alimentaria y el acceso a servicios\ncr√≠ticos como salud, energ√≠a, agua y transporte.\nLa sesi√≥n abordar√° la continuidad de operaciones desde\nuna mirada integral y territorial, incorporando:\n‚Ä¢ La experiencia del sector empresarial en la\ngesti√≥n del riesgo y la adaptaci√≥n clim√°tica en\nsus cadenas de valor;\n‚Ä¢ El rol del gobierno local en la planificaci√≥n,\nregulaci√≥n y coordinaci√≥n territorial;\n‚Ä¢ La integraci√≥n de las comunidades, como actores\nclave para la prevenci√≥n, la respuesta y la\nrecuperaci√≥n, especialmente en territorios\naltamente expuestos.",
    objective: "Analizar el rol de la continuidad de operaciones\nen las cadenas de suministro como condici√≥n\nhabilitante para la resiliencia territorial, la\nprotecci√≥n del empleo y los medios de vida frente\ndesastres y al cambio clim√°tico.\n\nNo. Secci√≥n Descripci√≥n\n\n‚Ä¢ Identificar responsabilidades y capacidades\ncomplementarias del sector p√∫blico y privado\npara garantizar la continuidad de los procesos\nproductivos y los servicios cr√≠ticos.\n‚Ä¢ Visibilizar experiencias y aprendizajes desde el\nnivel territorial que integren empresas ancla,\ngobiernos locales y comunidades.\n‚Ä¢ Proponer mensajes estrat√©gicos y\nrecomendaciones para fortalecer la integraci√≥n\nde inversiones y esfuerzos p√∫blico‚Äìprivados en el\nmarco del SNGRD.",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e35',
    title: "Paralela 9 Alianzas que transforman la Gesti√≥n del Riesgo de Desastres OAPI - UNGRD",
    type: "Plenaria",
    roomId: 'cimientos',
    startTime: "2026-05-20T11:00",
    endTime: "2026-05-20T11:45",
    speakers: [
    {
        "id": "s-1778901027281",
        "name": "Juan Carlos Orrego",
        "role": "Especialista senior en cambio clim√°tico, gesti√≥n de riesgos y conservaci√≥n ambiental ",
        "bio": "Especialista senior en cambio clim√°tico, gesti√≥n de riesgos y conservaci√≥n ambiental con trayectoria en 14 pa√≠ses de Am√©rica Latina. Cuenta con amplia experiencia en la alta direcci√≥n p√∫blica en Colombia (UNGRD, Fondo Adaptaci√≥n, Parques Nacionales) y en el liderazgo de proyectos de inversi√≥n y pol√≠ticas p√∫blicas con organismos internacionales como la ONU y la CAF. Es adem√°s un referente medi√°tico en temas de resiliencia y manejo de crisis.\n\n",
        "photoUrl": ""
    },
    {
        "id": "s-1778901076237",
        "name": "Gipsy Vivian Arenas Hern√°ndez",
        "role": "Jefe Oficina Gesti√≥n del Riesgo - Parques Nacionales Naturales de Colombia ",
        "bio": "Ingeniera Ambiental, Especialista en evaluaci√≥n de impacto ambiental de proyectos, Magister en Planeaci√≥n Territorial y Din√°micas de Poblaci√≥n, con m√°s de 12 a√±os de experiencia en temas de gesti√≥n del riesgo de desastre, cambio clim√°tico ordenamiento territorial y evaluaciones de da√±os y p√©rdidas posdesastres.\n\n",
        "photoUrl": ""
    },
    {
        "id": "s-1778901145745",
        "name": "Isabel Cristina Arboleda L√≥pez",
        "role": "Experta en sostenibilidad urbana y pol√≠ticas p√∫blicas",
        "bio": "Experta en sostenibilidad urbana y pol√≠ticas p√∫blicas con una s√≥lida base en ingenier√≠a ambiental. Con experiencia en el sector p√∫blico y el liderazgo de iniciativas regionales de incidencia clim√°tica, se especializa en articular la gesti√≥n t√©cnica con la participaci√≥n ciudadana. Es una voz l√≠der en temas de ciudades inteligentes, econom√≠a circular y el empoderamiento de nuevas generaciones en la agenda clim√°tica de Am√©rica Latina\n\n",
        "photoUrl": ""
    },
    {
        "id": "s-1778901190281",
        "name": "Liliana Boh√≥rquez Avenda√±o",
        "role": " Directora Infraesfructura ministerio de trasnporte",
        "bio": "Ingeniera Civil de la Universidad Nacional de Colombia y Mag√≠ster en Seguros y Gerencia de Riesgos (Espa√±a). Con 25 a√±os de trayectoria, es experta en tr√°nsito, transporte y seguridad vial. Ha liderado direcciones clave en la Secretar√≠a de Movilidad de Bogot√° y desempe√±ado roles estrat√©gicos en la Superintendencia de Transporte y la Agencia Nacional de Seguridad Vial. Su experiencia incluye consultor√≠a internacional en Venezuela y Espa√±a, as√≠ como una destacada labor docente.\n\n",
        "photoUrl": ""
    },
    {
        "id": "s-1778901246147",
        "name": " Oswaldo Muca Castizo.",
        "role": "Presidente Organizaci√≥n Nacional de los Pueblos Ind√≠genas de la Amazon√≠a Colombiana (OPIAC)",
        "bio": "Coordinador General-Representante Legal OPIAC. Ind√≠gena del pueblo Tanimuca del clan Tigre, oriundo del resguardo Comeyafu, perteneciente a la Asociaci√≥n AIPEA del √°rea no municipalizada de la Pedrera Amazonas. Amplio conocimiento y recorrido como dirigente local, regional y nacional por m√°s de 19 a√±os, trabajando con autoridades ind√≠genas de base. Secretario Operativo de la Mesa Regional Amaz√≥nica, MRA y delegado de la MRA por el departamento del Amazonas.\n\n",
        "photoUrl": ""
    },
    {
        "id": "s-1778901420322",
        "name": "Petrona Romero Navarro",
        "role": "Coordinadora Departamental de Gesti√≥n del Riesgo de Desastres del departamento del Cesar.",
        "bio": "Petrona Romero Navarro, licenciada en Espa√±ol y comunicaci√≥n, abogada y Especialista en Gobierno y estudios pol√≠ticos. Con una amplia experiencia en lo p√∫blico y en trabajo con comunidades, actualmente es Coordinadora Departamental de Gesti√≥n del Riesgo de Desastres del departamento del Cesar. \n\nCargo desde donde venimos impulsando procesos de prevenci√≥n, preparaci√≥n y respuestas a emergencias, adem√°s promoviendo un trabajo articulado con entidades, organismos de socorro y comunidades.\n\n",
        "photoUrl": ""
    }
],
    organizers: [],
    moderators: [],
    description: "La sesi√≥n se desarrollar√° como un espacio de alto nivel donde los sectores presentar√°n, en intervenciones de m√°ximo 7 minutos, sus proyectos m√°s exitosos y los desaf√≠os que deben trascender hacia el pr√≥ximo Plan Nacional de Desarrollo. En paralelo, se entregar√°n a los asistentes un portafolio de los proyectos expuestos para que los asistentes opinen sobre su inter√©s en generar alianzas o financiar estas apuestas. \nA diferencia de una exposici√≥n t√©cnica tradicional, el enfoque es de negociaci√≥n estrat√©gica. Se busca que los directivos y cooperantes internacionales visualicen la Gesti√≥n del Riesgo de Desastres (GRD) no como un gasto, sino como una inversi√≥n necesaria para la sostenibilidad nacional. La sesi√≥n cerrar√° con una din√°mica de matchmaking para conectar las necesidades de los sectores con las capacidades t√©cnicas y financieras de los aliados presentes\n",
    objective: "Identificar socios estrat√©gicos para financiamiento y ejecuci√≥n de acciones sectoriales bajo el actual Plan Nacional de Gesti√≥n del Riesgo de Desastres (PNGRD) visibilizando las apuestas estrat√©gicas para el pr√≥ximo Plan Nacional de Desarrollo y las actualizaciones del PNGRD. ",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e36',
    title: "Tem√°tica 3 Anticipaci√≥n en acci√≥n CRC - MERCYCORPS - START NETWORK - FAO",
    type: "Sesi√≥n paralela y tem√°tica",
    roomId: 'cimientos',
    startTime: "2026-05-20T13:15",
    endTime: "2026-05-20T15:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e37',
    title: "Laboratorio 5 Aportes de la Sociedad Civil a la GRD GNRD",
    type: "Sesi√≥n paralela y tem√°tica",
    roomId: 'cimientos',
    startTime: "2026-05-20T16:30",
    endTime: "2026-05-20T18:15",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e38',
    title: "Paralela 5 Educaci√≥n a lo largo de la vida en GRD SCR - UNGRD",
    type: "Plenaria",
    roomId: 'convergencia',
    startTime: "2026-05-20T10:00",
    endTime: "2026-05-20T10:45",
    speakers: [
    {
        "id": "s-1778899875002",
        "name": "Alexander Duque ",
        "role": "Ministerio de Educaci√≥n ",
        "bio": "",
        "photoUrl": ""
    },
    {
        "id": "s-1778899891088",
        "name": "William Gaviria ",
        "role": "Universidad de Manizales ",
        "bio": "",
        "photoUrl": ""
    }
],
    organizers: [],
    moderators: [],
    description: "Esta propuesta de sesi√≥n paralela, se justifica como un componente para alcanzar la resiliencia estructural y sist√©mica que persigue la PN26. Se reconoce que la educaci√≥n no es una acci√≥n aislada, sino un proceso continuo que debe permear todas las etapas del desarrollo humano para transformar la cultura de la gesti√≥n del riesgo en Colombia.\nLa sesi√≥n se alinea directamente con la prioridad 1 del Marco de Sendai, que enfatiza la necesidad de comprender el riesgo de desastres en todas sus dimensiones. Al fomentar un aprendizaje que integre el conocimiento t√©cnico con los saberes ancestrales y locales, se empodera a la ciudadan√≠a para tomar decisiones informadas, reduciendo la vulnerabilidad desde la ni√±ez hasta la edad adulta.\nBajo el enfoque de Comunidades de aprendizaje y participaci√≥n, definido para la plataforma, este espacio permitir√° identificar brechas en la formaci√≥n actual y proponer estrategias pedag√≥gicas inclusivas, y pertinentes.\n\n",
    objective: "Analizar los desaf√≠os actuales en la educaci√≥n para  la GRD desde la ni√±ez hasta la edad adulta, y c√≥mo el conocimiento ancestral y la innovaci√≥n digital pueden coexistir en la formaci√≥n ciudadana\n\nFomentar el uso de la ruta metodol√≥gica del Plan Nacional de Capacitaci√≥n para identificar necesidades de formaci√≥n por grupos poblacionales, asegurando que la educaci√≥n formal y la informal se articulen para crear una verdadera cultura del riesgo.\n\n",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e39',
    title: "Paralela 21 Semillas de resiliencia: el aula como espacio de conocimiento del riesgo CRC / UNGRD",
    type: "Plenaria",
    roomId: 'solidaridad',
    startTime: "2026-05-21T10:15",
    endTime: "2026-05-21T11:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e40',
    title: "Paralela 24 De la naturaleza al territorio: validaci√≥n t√©cnica de la AbE MADS",
    type: "Sesi√≥n paralela y tem√°tica",
    roomId: 'solidaridad',
    startTime: "2026-05-21T11:15",
    endTime: "2026-05-21T12:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e41',
    title: "Recapitulaci√≥n D√≠a 1",
    type: "Plenaria",
    roomId: 'sal√≥n-colombia',
    startTime: "2026-05-21T08:30",
    endTime: "2026-05-21T08:45",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e42',
    title: "PLENARIA¬†3 - Infraestructura Resiliente: de la evidencia a la inversi√≥n UNDRR - UNGRD - CAF - BID",
    type: "Plenaria",
    roomId: 'sal√≥n-colombia',
    startTime: "2026-05-21T09:00",
    endTime: "2026-05-21T10:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e43',
    title: "PLENARIA¬†4 - Reconstruir mejor: Intercambio de experiencias y lecciones aprendidas para fortalecer la recuperaci√≥n posdesastre PNUD",
    type: "Plenaria",
    roomId: 'sal√≥n-colombia',
    startTime: "2026-05-21T12:15",
    endTime: "2026-05-21T09:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e44',
    title: "Laboratorio 6 Del sat√©lite al cultivo FAO",
    type: "Laboratorio de aprendizaje",
    roomId: 'solidaridad',
    startTime: "2026-05-21T13:30",
    endTime: "2026-05-21T15:15",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e45',
    title: "Paralela 31 Supervisi√≥n basada en riesgos con un enfoque en la resiliencia de los servicios p√∫blicos domiciliarios SUPERSERVICIOS",
    type: "Plenaria",
    roomId: 'solidaridad',
    startTime: "2026-05-21T16:15",
    endTime: "2026-05-21T17:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e46',
    title: "Paralela 38 Puentes con la gente y para la gente GOBERNACI√ìN CASANARE",
    type: "Plenaria",
    roomId: 'cimientos',
    startTime: "2026-05-21T10:15",
    endTime: "2026-05-21T11:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e47',
    title: "Laboratorio 7 Memorias que caben en la mano MAGMA",
    type: "Laboratorio de aprendizaje",
    roomId: 'cimientos',
    startTime: "2026-05-21T13:30",
    endTime: "2026-05-21T15:15",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e48',
    title: "Laboratorio 9 Mesa t√©cnica agroclim√°tica para la GRD FAO",
    type: "Laboratorio de aprendizaje",
    roomId: 'cimientos',
    startTime: "2026-05-21T16:15",
    endTime: "2026-05-21T18:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e49',
    title: "Tem√°tica 6 (Privada) Formar para transformar: Herramientas, resiliencia clim√°tica y aprendizajes territoriales  MCR2030",
    type: "Plenaria",
    roomId: 'convergencia',
    startTime: "2026-05-21T10:15",
    endTime: "2026-05-21T12:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e50',
    title: "Especial 5 Sistemas de conocimientos ind√≠genas en la planificaci√≥n para la GRD  MPC",
    type: "Plenaria",
    roomId: 'convergencia',
    startTime: "2026-05-21T13:30",
    endTime: "2026-05-20T18:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e51',
    title: "Laboratorio 4 (Privada) G√©nero, datos y paz: aprendizajes del BootCamp para transformar la GRD en Colombia GIZ - RedLac Mujeres RRD - UNDRR - ONU MUJERES",
    type: "Laboratorio de aprendizaje",
    roomId: 'entretejidos',
    startTime: "2026-05-21T10:15",
    endTime: "2026-05-21T12:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e52',
    title: "Especial 2 (Cont.) Encuentro Entretejidos Artesanas Reduciendo el Riesgo de Desastres (Sesi√≥n 2)  SRR - UNGRD",
    type: "Plenaria",
    roomId: 'entretejidos',
    startTime: "2026-05-21T13:30",
    endTime: "2026-05-21T18:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e53',
    title: "Especial 8 Final de la Hackathon: innovaci√≥n en sistemas de alerta temprana de bajo costo PNUD - SCR UNGRD   Minuto a Minuto",
    type: "Plenaria",
    roomId: 'horizonte',
    startTime: "2026-05-21T10:15",
    endTime: "2026-05-21T12:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e54',
    title: "Especial 3 (Cont.) Da√±os y p√©rdidas: medir para decidir (Taller CRM - Sesi√≥n 2)  UNDRR - GIZ - PNUD - UNGRD",
    type: "Plenaria",
    roomId: 'horizonte',
    startTime: "2026-05-21T13:30",
    endTime: "2026-05-21T18:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e55',
    title: "Especial¬†1 (Privada) Encuentro de Experiencias - Sector Ambiente -  MADS",
    type: "Plenaria",
    roomId: 'sinergia',
    startTime: "2026-05-20T10:00",
    endTime: "2026-05-20T14:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e56',
    title: "Especial 9 (Privada) Gesti√≥n integral del riesgo en el sector agropecuario: retos institucionales, capacidades e instrumentos para la pol√≠tica publica  MINAGRICULTURA",
    type: "Plenaria",
    roomId: 'sinergia',
    startTime: "2026-05-20T14:15",
    endTime: "2026-05-20T18:15",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e57',
    title: "Especial 10 Ancestralidad que protege: voces Afrocolombianas, Raizales y Palenqueras, para la resiliencia territorial  UNGRD",
    type: "Plenaria",
    roomId: 'sinergia',
    startTime: "2026-05-21T10:15",
    endTime: "2026-05-21T14:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e58',
    title: "Especial 6 (Privada) GRD con enfoque en animales: articulaci√≥n normativa, territorial y clim√°tica para la resiliencia de los medios de vida  GNRD - SMD UNGRD",
    type: "Plenaria",
    roomId: 'sinergia',
    startTime: "2026-05-21T13:30",
    endTime: "2026-05-21T18:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e59',
    title: "Escenarios en Vivo (5h)",
    type: "Plenaria",
    roomId: 'diversidad',
    startTime: "2026-05-20T13:15",
    endTime: "2026-05-20T18:15",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e60',
    title: "Escenarios en Vivo (7h 45')",
    type: "Plenaria",
    roomId: 'diversidad',
    startTime: "2026-05-21T10:15",
    endTime: "2026-05-21T18:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e61',
    title: "Alto nivel 1 (Privada) Tejiendo Resiliencia: Asamblea Nacional de J√≥venes para la GRD  RED DE JOVENES GRD COL  U. Sergio Arboleda - UNDRR",
    type: "Plenaria",
    roomId: 'gobernanza',
    startTime: "2026-05-20T10:00",
    endTime: "2026-05-20T18:15",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e62',
    title: "Recapitulaci√≥n D√≠a 2",
    type: "Plenaria",
    roomId: 'sal√≥n-colombia',
    startTime: "2026-05-22T08:30",
    endTime: "2026-05-20T08:45",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e63',
    title: "PLENARIA¬†5 - El Manejo Integral del Fuego (MIF) como pol√≠tica p√∫blica de estado UNGRD - FAO",
    type: "Plenaria",
    roomId: 'sal√≥n-colombia',
    startTime: "2026-05-22T08:45",
    endTime: "2026-05-22T10:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e64',
    title: "Paralela 8 Hospitales Resilientes frente a emergencias de salud y desastres OPS - MINSALUD",
    type: "Plenaria",
    roomId: 'resiliencia',
    startTime: "2026-05-22T11:15",
    endTime: "2026-05-22T12:00",
    speakers: [
    {
        "id": "s-1778900783943",
        "name": "Fred Gonz√°lez",
        "role": "Ministerio de Salud y Protecci√≥n Social",
        "bio": "",
        "photoUrl": ""
    },
    {
        "id": "s-1778900826233",
        "name": "Alejandra Mendoza",
        "role": "Organizaci√≥n Panamericana de la Salud",
        "bio": "",
        "photoUrl": ""
    }
],
    organizers: [],
    moderators: [],
    description: "La evaluaci√≥n de la resiliencia hospitalaria frente a emergencias sanitarias y desastres permite identificar la exposici√≥n multiamenaza de la red de servicios de salud, mediante la aplicaci√≥n de herramientas desarrolladas por la Organizaci√≥n Panamericana de la Salud, tales como la evaluaci√≥n estrat√©gica del riesgo de emergencias y desastres en establecimientos de salud, el √≠ndice de seguridad hospitalaria, y la incorporaci√≥n de criterios de inclusi√≥n, as√≠ como la evaluaci√≥n de la capacidad de respuesta frente a situaciones de violencia.\nLa resiliencia hospitalaria, busca acciones a trav√©s de las fases del ciclo de gesti√≥n del riesgo: evaluaci√≥n, planificaci√≥n y reducci√≥n del riesgo; preparaci√≥n, respuesta y recuperaci√≥n.\nAsimismo, para el fortalecimiento institucional, se implementan procesos de capacitaci√≥n dirigidos a equipos t√©cnicos del nivel ministerial y territorial, orientados a la formulaci√≥n de estrategias y a la evaluaci√≥n de capacidades para la resiliencia hospitalaria.\nEn el marco del fortalecimiento de capacidades para la preparaci√≥n, respuesta y recuperaci√≥n ante emergencias y desastres, se llev√≥ a cabo un proceso de mapeo de la infraestructura cr√≠tica de los establecimientos de salud con servicios de urgencias frente a escenarios s√≠smicos en las ciudades de Bogot√° y Cali.\nEste ejercicio tuvo como prop√≥sito apoyar a las Secretar√≠as Distritales de Salud en el mejoramiento del conocimiento del riesgo, particularmente en relaci√≥n con los niveles de exposici√≥n y vulnerabilidad ante un sismo, facilitando la toma de decisiones a nivel territorial y nacional para la gesti√≥n de la respuesta ante situaciones de emergencia o desastre.\n",
    objective: "Describir el estado de avance del pa√≠s en la implementaci√≥n de la iniciativa de Hospitales Resilientes frente a emergencias de salud y desastres, orientada a la preparaci√≥n y respuesta.\n\n",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e65',
    title: "ACTO DE CLAUSURA",
    type: "Plenaria",
    roomId: 'resiliencia',
    startTime: "2026-05-22T12:00",
    endTime: "2026-05-22T13:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e66',
    title: "Especial 7 Hacia la gesti√≥n integral de la erosi√≥n costera en Colombia: Comunidades, ecosistemas y econom√≠a resiliente al clima DAMCRA - UNGRD, DIMAR, CCO, PNN, Mincomercio, Minvivienda, DNP, Mintrasporte, INVEMAR, IDEAM, SGC",
    type: "Plenaria",
    roomId: 'solidaridad',
    startTime: "2026-05-22T10:15",
    endTime: "2026-05-22T12:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e67',
    title: "Laboratorio 3 GRD para la inclusi√≥n de personas con discapacidad: construyendo desde el enfoque diferencial MINIGUALDAD",
    type: "Laboratorio de aprendizaje",
    roomId: 'cimientos',
    startTime: "2026-05-22T10:15",
    endTime: "2026-05-22T12:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e68',
    title: "Laboratorio 10 Sistema Nacional de Informaci√≥n para la GRD (SNIGRD) OAPI UNGRD",
    type: "Plenaria",
    roomId: 'convergencia',
    startTime: "2026-05-22T10:15",
    endTime: "2026-05-22T12:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e69',
    title: "Laboratorio 8 Cartograf√≠a participativa: mapas comunitarios SCR UNGRD - Humanitarian OpenStreetMap - Instituto de Tecnolog√≠a de Geo informaci√≥n de Heidelberg (HEIGIT)",
    type: "Plenaria",
    roomId: 'entretejidos',
    startTime: "2026-05-22T10:15",
    endTime: "2026-05-22T12:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e70',
    title: "Tem√°tica 5 Nueva pol√≠tica p√∫blica de desplazamiento por desastres y eventos de evoluci√≥n lenta PNUD - MADS",
    type: "Plenaria",
    roomId: 'horizonte',
    startTime: "2026-05-22T10:15",
    endTime: "2026-05-22T12:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e71',
    title: "Alto nivel 3 Desayuno PNUD - PNN",
    type: "Plenaria",
    roomId: 'sinergia',
    startTime: "2026-05-22T07:30",
    endTime: "2026-05-22T11:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e72',
    title: "Declaraciones oficiales (1h 45')",
    type: "Plenaria",
    roomId: 'diversidad',
    startTime: "2026-05-22T10:15",
    endTime: "2026-05-22T12:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  },

  {
    id: 'e73',
    title: "Alto nivel 2 Sesi√≥n Extraordinaria y Conjunta de Comit√©s T√©cnicos Nacionales UNGRD",
    type: "Plenaria",
    roomId: 'gobernanza',
    startTime: "2026-05-22T10:15",
    endTime: "2026-05-22T12:00",
    speakers: [],
    organizers: [],
    moderators: [],
    description: "",
    objective: "",
    summary: "",
    registeredCount: 0,
    capacity: 100
  }
];
