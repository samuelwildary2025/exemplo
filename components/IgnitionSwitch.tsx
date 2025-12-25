
import React from 'react';

interface IgnitionSwitchProps {
  isActive: boolean;
  onToggle: () => void;
}

const IgnitionSwitch: React.FC<IgnitionSwitchProps> = ({ isActive, onToggle }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Chave de Partida</div>
      <button 
        onClick={onToggle}
        className={`group relative w-20 h-20 rounded-2xl border-2 transition-all duration-500 flex items-center justify-center shadow-2xl overflow-hidden
          ${isActive 
            ? 'bg-cat-yellow border-cat-yellow/50 shadow-[0_0_40px_rgba(255,205,17,0.3)]' 
            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-tr from-black/20 to-white/10 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Ícone de Ignição */}
        <div className={`relative z-10 transition-transform duration-700 ${isActive ? 'rotate-90 scale-110' : 'rotate-0'}`}>
          <div className={`w-1.5 h-12 rounded-full shadow-lg ${isActive ? 'bg-zinc-900' : 'bg-zinc-700'}`} />
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${isActive ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-700 border-zinc-600'}`} />
        </div>

        {/* Indicador LED */}
        <div className={`absolute bottom-2 right-2 w-2 h-2 rounded-full transition-all duration-300 ${isActive ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500/50'}`} />
      </button>
      
      <div className="flex items-center gap-4 text-[10px] font-black font-mono">
        <span className={!isActive ? 'text-red-500' : 'text-zinc-700'}>OFF</span>
        <div className="w-1 h-1 bg-zinc-800 rounded-full" />
        <span className={isActive ? 'text-cat-yellow' : 'text-zinc-700'}>START</span>
      </div>
    </div>
  );
};

export default IgnitionSwitch;
