import { useEffect, useRef } from 'react';

export const ScrollHint = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      if (window.scrollY > 50) {
        ref.current.style.opacity = '0';
      } else {
        ref.current.style.opacity = '1';
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className="flex flex-col items-center gap-4 transition-opacity duration-500"
    >
      <span className="text-xs uppercase tracking-[0.25em] font-semibold text-white/90">Explore</span>
      <div className="w-[2px] h-24 bg-white/20 overflow-hidden rounded-full">
        <div className="w-full h-full bg-white animate-scroll-line"></div>
      </div>
    </div>
  );
};

