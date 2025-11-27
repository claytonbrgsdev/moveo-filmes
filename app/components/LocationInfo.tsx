'use client'

import { useState, useEffect } from 'react';
import { getMarkerPosition } from '@/lib/utils/gridCoordinates';

export function LocationInfo() {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      const now = new Date();
      const parts = formatter.formatToParts(now);
      const hours = parts.find(p => p.type === 'hour')?.value || '00';
      const minutes = parts.find(p => p.type === 'minute')?.value || '00';
      const seconds = parts.find(p => p.type === 'second')?.value || '00';
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Brasília-DF, Brasil - Coluna 1 */}
      <div 
        className="fixed text-white text-xs z-40" 
        style={{ 
          left: getMarkerPosition(1),
          top: 'calc(100vh - 50px + 2px)',
          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
        }}
      >
        Brasília-DF, Brasil
      </div>

      {/* Divider entre coluna 1 e 3 */}
      <div 
        className="fixed text-white text-xs z-40 opacity-50" 
        style={{ 
          left: getMarkerPosition(2),
          top: 'calc(100vh - 50px + 2px)',
          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
        }}
      >
        |
      </div>

      {/* Coordenadas - Coluna 3 */}
      <div 
        className="fixed text-white text-xs z-40" 
        style={{ 
          left: getMarkerPosition(3),
          top: 'calc(100vh - 50px + 2px)',
          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
        }}
      >
        -15.7942°S, -47.8822°W
      </div>

      {/* Divider entre coluna 3 e 7 */}
      <div 
        className="fixed text-white text-xs z-40 opacity-50" 
        style={{ 
          left: getMarkerPosition(4),
          top: 'calc(100vh - 50px + 2px)',
          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
        }}
      >
        |
      </div>

      {/* Timezone - Coluna 7 */}
      <div 
        className="fixed text-white text-xs z-40" 
        style={{ 
          left: getMarkerPosition(7),
          top: 'calc(100vh - 50px + 2px)',
          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
        }}
      >
        America/Sao_Paulo (UTC-3)
      </div>

      {/* Divider entre coluna 7 e 11 */}
      <div 
        className="fixed text-white text-xs z-40 opacity-50" 
        style={{ 
          left: getMarkerPosition(9),
          top: 'calc(100vh - 50px + 2px)',
          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
        }}
      >
        |
      </div>

      {/* Horário - Coluna 11 */}
      <div 
        className="fixed text-white text-xs z-40" 
        style={{ 
          left: getMarkerPosition(11),
          top: 'calc(100vh - 50px + 2px)',
          fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif"
        }}
      >
        {currentTime}
      </div>
    </>
  );
}

