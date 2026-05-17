import React from 'react';
import { Bookmark, Clock, MapPin, Users, UserCheck } from 'lucide-react';
import { AgendaEvent, Room } from '../data/agenda';
import { formatTime, classNames } from '../lib/utils';

interface AgendaCardProps {
  event: AgendaEvent;
  room?: Room;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onClickRoom: (roomId: string) => void;
  onClickCard: () => void;
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function AgendaCard({ event, room, isBookmarked, onToggleBookmark, onClickRoom, onClickCard }: AgendaCardProps) {
  const roomColor = room?.color || '#cbd5e1';
  
  // Custom styling based on session type
  const typeStyles: Record<string, { bg: string, text: string, decoration: string }> = {
    'Sesión plenaria': { bg: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-900', decoration: 'border-emerald-500' },
    'Sesión paralela y temática': { bg: 'bg-blue-50 text-blue-700', text: 'text-blue-900', decoration: 'border-blue-500' },
    'Escenario en vivo': { bg: 'bg-amber-50 text-amber-700', text: 'text-amber-900', decoration: 'border-amber-500' },
    'Laboratorio de aprendizaje': { bg: 'bg-purple-50 text-purple-700', text: 'text-purple-900', decoration: 'border-purple-500' }
  };

  const style = typeStyles[event.type] || { bg: 'bg-slate-50 text-slate-700', text: 'text-slate-900', decoration: 'border-slate-300' };

  return (
    <div 
      className={classNames(
        "session-card rounded-2xl p-1.5 relative flex flex-col h-full transition-all hover:shadow-xl hover:-translate-y-1 group/card cursor-pointer",
        "border border-slate-200 shadow-md"
      )}
      style={{ backgroundColor: roomColor }}
      onClick={onClickCard}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3 gap-4">
          <span className={classNames("text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm border border-slate-100", style.bg)}>
            {event.type}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(event.id);
            }}
            className="text-slate-300 hover:text-blue-600 focus:outline-none flex-shrink-0 transition-all p-1 bg-white rounded-full shadow-sm"
            title={isBookmarked ? "Quitar de mi agenda" : "Guardar en mi agenda"}
          >
            <Bookmark className={classNames("w-4 h-4", isBookmarked ? "fill-blue-600 text-blue-600" : "")} />
          </button>
        </div>

        <h3 className="font-black text-sm md:text-base leading-tight mb-4 flex-grow text-slate-900 group-hover/card:text-blue-600 transition-colors">
          {event.title}
        </h3>

        <div className="space-y-2 mt-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 w-fit px-2 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
          </div>
          
          {room && (
            <div 
              className="flex items-center gap-2 text-xs font-bold text-slate-500 group/room bg-slate-50 w-fit px-2 py-1 rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                onClickRoom(room.id);
              }}
            >
              <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover/room:text-blue-600 transition-colors" />
              <span className="group-hover/room:text-blue-600 transition-colors">
                {room.name} 
              </span>
            </div>
          )}

          {event.speakers && event.speakers.length > 0 && (
            <div className="flex items-start gap-2 pt-3 mt-3 border-t border-slate-100">
              <Users className="w-3.5 h-3.5 text-slate-400 mt-1 shrink-0" />
              <div className="flex flex-wrap gap-1.5">
                 {event.speakers.map((s, i) => (
                   <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold whitespace-nowrap border border-slate-200">
                     {s.name}
                   </span>
                 ))}
              </div>
            </div>
          )}

          {room && event.registeredCount !== undefined && (
            <div className="flex justify-between items-center bg-slate-50 rounded-xl px-3 py-2 mt-3 border border-slate-100">
                <div className="flex items-center gap-1.5 font-black text-[10px] text-slate-700 w-fit">
                  <UserCheck className="w-3 h-3 text-emerald-500" />
                  <span>{event.registeredCount} INSCRITOS</span>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  FALTA: {Math.max(0, room.capacity - event.registeredCount)} 
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

