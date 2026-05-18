import React, { useState } from 'react';
import { useAgenda } from '../contexts/AgendaContext';
import { Trash2, RefreshCw, Database, AlertTriangle } from 'lucide-react';

export function AdminPanel() {
  const { 
    events, 
    rooms, 
    syncStatus, 
    syncError, 
    lastSyncTime, 
    syncData, 
    clearCache,
    deleteEvent 
  } = useAgenda();
  
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('¿Estás seguro de eliminar esta charla permanentemente?')) {
      setDeletingId(eventId);
      try {
        await deleteEvent(eventId);
        console.log('Event deleted successfully');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Error al eliminar. Revisa la consola.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleClearCache = () => {
    if (confirm('¿Limpiar caché local? Esto forzará una recarga completa desde Supabase.')) {
      clearCache();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="p-6">
      {/* Header con contadores y botón de limpiar caché */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <Database className="w-4 h-4 text-blue-600 inline mr-2" />
            <span className="text-sm font-bold text-blue-700">
              Charlas: {events.length}
            </span>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <Database className="w-4 h-4 text-green-600 inline mr-2" />
            <span className="text-sm font-bold text-green-700">
              Salas: {rooms.length}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleClearCache}
            className="px-3 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Limpiar Caché
          </button>
          
          <button
            onClick={syncData}
            disabled={syncStatus === 'syncing'}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            {syncStatus === 'syncing' ? 'Sincronizando...' : 'Forzar Sync'}
          </button>
        </div>
      </div>

      {/* Indicador de error */}
      {syncError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700">{syncError}</span>
        </div>
      )}

      {/* Última sincronización */}
      {lastSyncTime && (
        <div className="mb-4 text-xs text-slate-400">
          Última sincronización: {lastSyncTime.toLocaleTimeString()}
        </div>
      )}

      {/* Lista de eventos */}
      <div className="space-y-2">
        {events.map((event) => (
          <div key={event.id} className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="font-bold">{event.title}</h3>
              <p className="text-sm text-slate-500">{event.id}</p>
            </div>
            <button
              onClick={() => handleDeleteEvent(event.id)}
              disabled={deletingId === event.id}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              {deletingId === event.id ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
