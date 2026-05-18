import { useState, useEffect } from 'react';

export type QRScanLog = {
  id: string;
  qrData: string;
  timestamp: string;
  type: 'ROOM' | 'MEAL';
  roomId?: string;
  mealType?: 'refrigerio' | 'almuerzo';
};

export function useQRControl() {
  const [logs, setLogs] = useState<QRScanLog[]>(() => {
    try {
      const saved = localStorage.getItem('qr-logs-v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem('qr-logs-v1', JSON.stringify(logs));
  }, [logs]);

  // Load from Supabase on mount
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { getSupabase } = await import('../lib/supabaseClient');
        const supabase = getSupabase();
        const { data, error } = await supabase.from('qr_logs').select('*').order('timestamp', { ascending: false });
        if (!error && data) {
          // Map DB to local format
           const mappedLogs = data.map((d: any) => ({
             id: d.id,
             qrData: d.qr_data,
             timestamp: d.timestamp,
             type: d.type,
             roomId: d.room_id,
             mealType: d.meal_type
           }));
           setLogs(mappedLogs);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchLogs();
  }, []);

  const syncLog = async (log: QRScanLog) => {
    try {
      const { getSupabase } = await import('../lib/supabaseClient');
      const supabase = getSupabase();
      await supabase.from('qr_logs').insert([{
         id: log.id,
         qr_data: log.qrData,
         timestamp: log.timestamp,
         type: log.type,
         room_id: log.roomId,
         meal_type: log.mealType
      }]);
    } catch(e) {
      console.error(e);
    }
  };

  const addRoomAccess = (qrData: string, roomId: string) => {
    const newLog: QRScanLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      qrData,
      timestamp: new Date().toISOString(),
      type: 'ROOM',
      roomId
    };
    setLogs(prev => [newLog, ...prev]);
    syncLog(newLog);
    return true; // always allow room access (unless we want to block something)
  };

  const claimMeal = (qrData: string, mealType: 'refrigerio' | 'almuerzo'): { success: boolean; message: string } => {
    // Check if user already claimed this meal type
    const hasClaimed = logs.some(
      log => log.type === 'MEAL' && log.mealType === mealType && log.qrData === qrData
    );

    if (hasClaimed) {
      return { success: false, message: `El usuario ya reclamó su ${mealType}` };
    }

    const newLog: QRScanLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      qrData,
      timestamp: new Date().toISOString(),
      type: 'MEAL',
      mealType
    };
    
    setLogs(prev => [newLog, ...prev]);
    syncLog(newLog);
    return { success: true, message: `${mealType} registrado con éxito` };
  };

  return { logs, addRoomAccess, claimMeal };
}
