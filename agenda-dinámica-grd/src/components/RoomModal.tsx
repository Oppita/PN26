import React from 'react';
import { X, Users, Map, CalendarRange } from 'lucide-react';
import { Room } from '../data/agenda';

interface RoomModalProps {
  room: Room | null;
  onClose: () => void;
  onFilterByRoom: (roomId: string) => void;
}

export function RoomModal({ room, onClose, onFilterByRoom }: RoomModalProps) {
  if (!room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Detalles de Sala</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <h3 className="text-2xl font-black text-indigo-900 mb-4">{room.name}</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Aforo / Capacidad</p>
                <p className="text-lg font-bold text-gray-900">{room.capacity} personas</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                <Map className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Ubicación</p>
                <p className="text-lg font-bold text-gray-900">{room.location}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 flex items-center justify-between gap-3">
          <button 
            onClick={() => {
              onFilterByRoom(room.id);
            }}
            className="flex-1 flex justify-center items-center gap-2 py-2.5 px-4 bg-indigo-100 text-indigo-700 rounded-xl font-medium hover:bg-indigo-200 transition-colors"
          >
            <CalendarRange className="w-4 h-4" />
            Ver Charlas Aquí
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
