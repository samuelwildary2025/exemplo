
import React, { useRef, useEffect, useState } from 'react';

interface PedalProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  lockedValue: number | null;
}

const Pedal: React.FC<PedalProps> = ({ label, value, onChange, disabled = false, lockedValue }) => {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const isLocked = lockedValue !== null;
  const activeValue = isLocked ? lockedValue : value;

  const handleUpdate = (clientY: number) => {
    if (!trackRef.current || disabled || isLocked) return;
    const rect = trackRef.current.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const height = rect.height / 2;
    
    let dy = clientY - centerY;
    dy = Math.max(-height, Math.min(height, dy));
    
    const normVal = -(dy / height);
    onChange(normVal);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => isDragging && handleUpdate(e.clientY);
    const onEnd = () => {
      setIsDragging(false);
      if (!isLocked) onChange(0);
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
    };
  }, [isDragging, isLocked]);

  return (
    <div className={`flex flex-col items-center select-none transition-all duration-300 ${disabled ? 'opacity-30' : ''} ${isLocked ? 'scale-105' : ''}`}>
      <div className={`text-[10px] font-black mb-2 uppercase tracking-tight ${isLocked ? 'text-cat-yellow' : 'text-zinc-500'}`}>{label}</div>
      <div 
        ref={trackRef}
        onMouseDown={(e) => { if(!disabled && !isLocked) { setIsDragging(true); handleUpdate(e.clientY); } }}
        className={`w-14 h-44 bg-black border-2 ${isLocked ? 'border-cat-yellow/40 shadow-[0_0_15px_rgba(255,205,17,0.2)]' : 'border-zinc-800'} rounded-xl relative shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] overflow-hidden ${disabled || isLocked ? 'cursor-not-allowed' : 'cursor-ns-resize'}`}
      >
        <div 
          className={`absolute left-1 right-1 h-20 bg-gradient-to-b ${isLocked ? 'from-cat-yellow to-[#E5B800] border-white/20' : 'from-zinc-700 to-zinc-900 border-zinc-600'} rounded flex flex-col items-center justify-center shadow-2xl transition-all duration-75`}
          style={{ 
            top: '50%',
            transform: `translateY(calc(-50% - ${activeValue * 60}px))`,
          }}
        >
          <div className="w-full h-[1px] bg-white/5 my-1" />
          <div className={`w-2/3 h-2 ${isLocked ? 'bg-black/20' : 'bg-black/40'} my-1 rounded-sm shadow-inner`} />
          <div className={`w-2/3 h-2 ${isLocked ? 'bg-black/20' : 'bg-black/40'} my-1 rounded-sm shadow-inner`} />
        </div>
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-zinc-700/30 pointer-events-none" />
      </div>
      <div className="mt-2 font-black text-[10px] font-mono transition-colors duration-300">
        <span className={isLocked || Math.abs(activeValue) > 0.1 ? 'text-cat-yellow' : 'text-zinc-700'}>
          {activeValue > 0.1 ? 'FWD' : activeValue < -0.1 ? 'REV' : 'NEU'}
        </span>
      </div>
    </div>
  );
};

export default Pedal;
