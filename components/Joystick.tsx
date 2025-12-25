
import React, { useState, useRef, useEffect } from 'react';
import { Vec2 } from '../types';

interface JoystickProps {
  label: string;
  subLabel: string;
  axisLabels: { up: string; down: string; left: string; right: string };
  onChange: (pos: Vec2) => void;
  disabled?: boolean;
  lockedValue: Vec2 | null;
}

const Joystick: React.FC<JoystickProps> = ({ label, subLabel, axisLabels, onChange, disabled = false, lockedValue }) => {
  const [position, setPosition] = useState<Vec2>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isLocked = lockedValue !== null;
  const currentPos = isLocked ? { x: lockedValue.x * 60, y: -lockedValue.y * 60 } : position;

  const handleMove = (clientX: number, clientY: number) => {
    if (!containerRef.current || disabled || isLocked) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radius = rect.width / 2 - 10;

    let dx = clientX - centerX;
    let dy = clientY - centerY;

    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > radius) {
      const angle = Math.atan2(dy, dx);
      dx = Math.cos(angle) * radius;
      dy = Math.sin(angle) * radius;
    }

    const normX = dx / radius;
    const normY = -(dy / radius);

    setPosition({ x: dx, y: dy });
    onChange({ x: normX, y: normY });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (disabled || isLocked) return;
    setIsDragging(true);
    handleMove(e.clientX, e.clientY);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX, e.clientY);
    };
    const onEnd = () => {
      setIsDragging(false);
      if (!isLocked) {
        setPosition({ x: 0, y: 0 });
        onChange({ x: 0, y: 0 });
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
    };
  }, [isDragging, isLocked]);

  return (
    <div className={`flex flex-col items-center bg-zinc-900/80 p-6 rounded-[2.5rem] border transition-all duration-300 select-none shadow-2xl ${disabled ? 'border-zinc-800 opacity-40' : isLocked ? 'border-cat-yellow/50 bg-cat-yellow/5' : 'border-zinc-700/50 hover:border-zinc-500'}`}>
      <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isLocked ? 'text-cat-yellow' : 'text-zinc-500'}`}>{label}</div>
      <div className={`text-[9px] font-mono mb-6 uppercase tracking-tight ${isLocked ? 'text-cat-yellow/60 animate-pulse' : 'text-zinc-600'}`}>
        {isLocked ? '● COMANDO FIXADO' : subLabel}
      </div>
      
      <div className="relative w-44 h-44 flex items-center justify-center">
        <div className="absolute -top-3 text-[10px] font-black text-zinc-700 uppercase">{axisLabels.up}</div>
        <div className="absolute -bottom-3 text-[10px] font-black text-zinc-700 uppercase">{axisLabels.down}</div>
        
        <div 
          ref={containerRef}
          onMouseDown={onMouseDown}
          className={`w-36 h-36 rounded-full bg-gradient-to-br from-zinc-800 to-black border-8 ${isLocked ? 'border-cat-yellow/30' : 'border-zinc-900'} shadow-[inset_0_5px_15px_rgba(0,0,0,0.8)] relative flex items-center justify-center ${disabled || isLocked ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}`}
        >
          <div 
            className={`w-16 h-16 rounded-full bg-gradient-to-tr ${isLocked ? 'from-cat-yellow to-[#E5B800] border-white/40 shadow-[0_0_25px_rgba(255,205,17,0.4)]' : 'from-zinc-700 to-zinc-500 border-zinc-400'} border-2 shadow-[0_10px_20px_rgba(0,0,0,0.6)] flex items-center justify-center transition-transform duration-75 relative z-10`}
            style={{ transform: `translate(${currentPos.x}px, ${currentPos.y}px)` }}
          >
            <div className="w-6 h-6 rounded-full bg-black/20 border border-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Joystick;
