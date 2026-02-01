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

  const fontStyle = {
    fontFamily: "'Helvetica Neue LT Pro', Arial, Helvetica, sans-serif",
  };

  return (
    <>
      {/* Brasília-DF, Brasil — col 1 (mirrors REC at col 1) */}
      <div
        className="fixed text-white text-xs z-40"
        style={{
          left: getMarkerPosition(1),
          top: 'calc(100vh - 50px + 2px)',
          ...fontStyle,
        }}
      >
        Brasília-DF, Brasil
      </div>

      {/* GPS coordinates — col 3 (mirrors logo at col 3) */}
      <div
        className="fixed text-white text-xs z-40"
        style={{
          left: getMarkerPosition(3),
          top: 'calc(100vh - 50px + 2px)',
          ...fontStyle,
          letterSpacing: '0.02em',
        }}
      >
        -15.7942°S, -47.8822°W
      </div>

      {/* Timecode — col 11 (mirrors date at col 11) */}
      <div
        className="fixed text-white text-xs z-40"
        suppressHydrationWarning
        style={{
          left: getMarkerPosition(11),
          top: 'calc(100vh - 50px + 2px)',
          ...fontStyle,
          letterSpacing: '0.05em',
        }}
      >
        {currentTime}
      </div>
    </>
  );
}
