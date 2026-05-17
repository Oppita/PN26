import React, { useState } from 'react';
import { Calendar, Bookmark, Settings, QrCode, Users, LogOut } from 'lucide-react';
import { useAgendaData } from './hooks/useAgendaData';
import { FilterBar } from './components/FilterBar';
import { AgendaCard } from './components/AgendaCard';
import { RoomModal } from './components/RoomModal';
import { EventModal } from './components/EventModal';
import { AdminEventDetailsModal } from './components/AdminEventDetailsModal';
import { AdminPanel } from './components/AdminPanel';
import { QRControlPanel } from './components/QRControlPanel';
import { InteractiveMap } from './components/InteractiveMap';
import { formatTime, classNames } from './lib/utils';
import { Room, AgendaEvent } from './data/agenda';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';

export default function App() {
  const { user } = useAuth();
  
  if (!user) {
    return <LoginPage />;
  }
  
  return <MainApp />;
}

function MainApp() {
  const { user, isAdmin, signOut } = useAuth();
  const {
    events,
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
    viewMode,
    setViewMode,
    selectedDay,
    setSelectedDay,
    availableDays,
  } = useAgendaData();

  const [activeRoomModal, setActiveRoomModal] = useState<Room | null>(null);
  const [activeEventModal, setActiveEventModal] = useState<AgendaEvent | null>(null);
  const [activeAdminEventModal, setActiveAdminEventModal] = useState<AgendaEvent | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isQRHubOpen, setIsQRHubOpen] = useState(false);
  const [qrHubInitialTab, setQrHubInitialTab] = useState<'ROOM' | 'MEAL' | 'DIRECTORY'>('ROOM');

  const handleRoomClick = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId) || null;
    setActiveRoomModal(room);
  };

  const openQRHub = (tab: 'ROOM' | 'MEAL' | 'DIRECTORY') => {
    setQrHubInitialTab(tab);
    setIsQRHubOpen(true);
  };

  const handleCardClick = (event: AgendaEvent) => {
    if (isAdmin) {
      setActiveAdminEventModal(event);
    } else {
      setActiveEventModal(event);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden text-slate-800 bg-slate-50">
      {/* Header */}
      <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-black text-xl italic uppercase">G</div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none uppercase">Agenda GRD</h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 uppercase">V Encuentro Nacional</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          {isAdmin && (
            <>
              <button 
                className="flex items-center gap-1.5 px-3 py-1.5 border border-indigo-500 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[10px] font-black transition-colors uppercase tracking-widest text-white shadow-lg"
                onClick={() => openQRHub('DIRECTORY')}
              >
                <Users className="w-3.5 h-3.5" /> Directorio
              </button>
              <button 
                className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-500 bg-blue-600 hover:bg-blue-500 rounded-lg text-[10px] font-black transition-colors uppercase tracking-widest text-white shadow-lg"
                onClick={() => openQRHub('ROOM')}
              >
                <QrCode className="w-3.5 h-3.5" /> Escáner
              </button>
              <button 
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-700 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-black transition-colors uppercase tracking-widest"
                onClick={() => setIsAdminOpen(true)}
              >
                <Settings className="w-3.5 h-3.5" /> Configurar
              </button>
            </>
          )}
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-900 bg-red-950 hover:bg-red-900 rounded-lg text-[10px] font-black transition-colors uppercase tracking-widest text-red-200"
            onClick={() => signOut()}
          >
            <LogOut className="w-3.5 h-3.5" /> Salir
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        
        {/* Hero Interactive Map */}
        <div className="h-[35vh] lg:h-[45vh] shrink-0 border-b border-slate-200 relative z-10 shadow-sm bg-white">
            <InteractiveMap rooms={rooms} onSelectRoom={(id) => setSelectedRoom(prev => prev === id ? 'All' : id)} />
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <aside className="hidden lg:flex w-80 bg-white border-r border-slate-200 p-6 flex-col gap-8 overflow-y-auto relative z-20">
               <div className="relative z-10">
                 <FilterBar 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                    selectedRoom={selectedRoom}
                    setSelectedRoom={setSelectedRoom}
                    rooms={rooms}
                  />
               </div>
          </aside>

          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
            
            {/* Days & Main Navigation */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 shadow-sm z-30">
               <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto scroller-hide">
                  {availableDays.map((day, index) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={classNames(
                        "flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest whitespace-nowrap",
                        selectedDay === day 
                          ? "bg-white text-slate-800 shadow-sm scale-[1.02] border border-slate-200" 
                          : "text-slate-500 hover:text-slate-800"
                      )}
                    >
                      DÍA {index + 1}
                    </button>
                  ))}
                  {availableDays.length === 0 && (
                     <div className="px-6 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Aún no hay días</div>
                  )}
               </div>

               <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scroller-hide">
                  <button 
                    onClick={() => setViewMode('All')}
                    className={classNames(
                      "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                      viewMode === 'All' ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    AGENDA GENERAL
                  </button>
                  <button 
                    onClick={() => setViewMode('MyAgenda')}
                    className={classNames(
                      "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap border",
                      viewMode === 'MyAgenda' ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    <Bookmark className="w-3.5 h-3.5" /> MIS SESIONES ({bookmarks.size})
                  </button>
               </div>
            </div>

          <main className="flex-1 overflow-y-auto p-6 md:p-8">
             <div className="max-w-7xl mx-auto">
                 {viewMode === 'MyAgenda' && bookmarks.size === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
                    <Bookmark className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-xs">No tienes sesiones guardadas aún</p>
                    <button onClick={() => setViewMode('All')} className="mt-4 text-blue-600 text-[10px] font-black uppercase hover:underline">Ir a la agenda general</button>
                  </div>
                ) : Object.keys(groupedEvents).length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                    <Calendar className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-xs">No se encontraron sesiones</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Prueba ajustando los filtros o la búsqueda</p>
                  </div>
                ) : (
                  <div className="space-y-12 pb-20">
                    {Object.entries(groupedEvents).map(([dayKey, timeGroups]) => (
                      <div key={dayKey} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-6">
                          {Object.entries(timeGroups).sort().map(([time, events]) => (
                            <div key={time} className="grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-4 md:gap-8 border-b border-slate-200 pb-8 last:border-0 relative z-10">
                              {/* Time Block Column */}
                              <div className="lg:sticky lg:top-8 self-start">
                                <div className="bg-slate-800 text-white border border-slate-700 px-4 py-3 rounded-xl inline-block lg:block text-center shadow-md">
                                  <span className="text-lg font-black tracking-tighter">
                                    {formatTime(time)}
                                  </span>
                                </div>
                              </div>

                              {/* Sessions Cards Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {events.map(event => (
                                  <AgendaCard
                                    key={event.id}
                                    event={event}
                                    room={rooms.find(r => r.id === event.roomId)}
                                    isBookmarked={bookmarks.has(event.id)}
                                    onToggleBookmark={toggleBookmark}
                                    onClickRoom={handleRoomClick}
                                    onClickCard={() => handleCardClick(event)}
                                  />
                                ))}
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </main>
        </div>
      </div>
    </div>

    <RoomModal 
        room={activeRoomModal} 
        onClose={() => setActiveRoomModal(null)}
        onFilterByRoom={(roomId) => {
          setSelectedRoom(roomId);
          setActiveRoomModal(null);
        }}
      />

      <EventModal
        event={activeEventModal}
        room={activeEventModal ? rooms.find(r => r.id === activeEventModal.roomId) : undefined}
        isBookmarked={activeEventModal ? bookmarks.has(activeEventModal.id) : false}
        isRegistered={activeEventModal ? registrations.has(activeEventModal.id) : false}
        onClose={() => setActiveEventModal(null)}
        onToggleBookmark={toggleBookmark}
        onRoomClick={handleRoomClick}
        onRegister={activeEventModal ? () => registerForEvent(activeEventModal.id) : () => {}}
        onCancelRegistration={activeEventModal ? () => cancelRegistration(activeEventModal.id) : () => {}}
      />

      {activeAdminEventModal && (
        <AdminEventDetailsModal
          event={activeAdminEventModal}
          room={rooms.find(r => r.id === activeAdminEventModal.roomId)}
          onClose={() => setActiveAdminEventModal(null)}
        />
      )}

      {isAdminOpen && (
        <AdminPanel 
          rooms={rooms}
          setRooms={setRooms}
          events={events}
          setEvents={setEventsData}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {isQRHubOpen && (
        <QRControlPanel 
          rooms={rooms}
          initialTab={qrHubInitialTab}
          onClose={() => setIsQRHubOpen(false)}
        />
      )}
    </div>
  );
}
