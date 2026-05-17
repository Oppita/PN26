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

  const addRoomAccess = (qrData: string, roomId: string) => {
    const newLog: QRScanLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      qrData,
      timestamp: new Date().toISOString(),
      type: 'ROOM',
      roomId
    };
    setLogs(prev => [newLog, ...prev]);
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
    return { success: true, message: `${mealType} registrado con éxito` };
  };

  return { logs, addRoomAccess, claimMeal };
}
