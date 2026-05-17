import React from 'react';
import { Search, MapPin, Tag } from 'lucide-react';
import { Room, EventType } from '../data/agenda';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedType: EventType | 'All';
  setSelectedType: (val: EventType | 'All') => void;
  selectedRoom: string;
  setSelectedRoom: (val: string) => void;
  rooms: Room[];
}

export function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedRoom,
  setSelectedRoom,
  rooms
}: FilterBarProps) {
  
  const types: (EventType | 'All')[] = ['All', 'Plenaria', 'Paralela', 'Laboratorio', 'Temática', 'Especial', 'Social'];

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Búsqueda</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full text-xs border border-slate-200 rounded-md pl-8 pr-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            placeholder="Buscar charla o ponente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Tipo de Sesión</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Tag className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <select
            className="w-full text-xs border border-slate-200 rounded-md pl-8 pr-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 appearance-none cursor-pointer"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
          >
            <option value="All">Todos los Tipos</option>
            {types.filter(t => t !== 'All').map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Room Filter */}
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Salas Principales</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <select
            className="w-full text-xs border border-slate-200 rounded-md pl-8 pr-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 appearance-none cursor-pointer"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            <option value="All">Todas las Salas</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
