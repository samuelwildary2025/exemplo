
import React from 'react';
import { HydraulicAction } from '../types';

interface StatusDisplayProps {
  actions: HydraulicAction[];
  engineRunning: boolean;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ actions, engineRunning }) => {
  const isActionActive = actions.some(a => a !== 'IDLE' && a !== 'ENGINE_OFF');

  return (
    <div className="flex items-center gap-10">
      <div className="flex flex-col items-end">
        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Pressão Principal</span>
        <span className={`text-2xl font-black font-mono leading-none transition-colors ${!engineRunning ? 'text-zinc-800' : isActionActive ? 'text-cat-yellow' : 'text-zinc-400'}`}>
          {!engineRunning ? '0.0' : isActionActive ? '34.300' : '3.900'} <small className="text-[10px] text-zinc-600">kPa</small>
        </span>
      </div>
      
      <div className="h-10 w-px bg-zinc-800" />
      
      <div className="flex flex-col items-end">
        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Temp. Hidráulica</span>
        <span className={`text-2xl font-black font-mono leading-none transition-colors ${!engineRunning ? 'text-zinc-800' : 'text-zinc-300'}`}>
          {!engineRunning ? '--' : '62'}<small className="text-[10px] text-zinc-600">°C</small>
        </span>
      </div>

      <div className="h-10 w-px bg-zinc-800" />

      <div className="flex flex-col items-end">
        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Carga do Motor</span>
        <div className="flex items-center gap-4">
          <div className="w-32 h-2.5 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full transition-all duration-500 ${isActionActive ? 'bg-cat-yellow shadow-[0_0_10px_#FFCD11]' : 'bg-zinc-700'}`}
              style={{ width: !engineRunning ? '0%' : isActionActive ? '82%' : '18%' }}
            />
          </div>
          <span className="text-sm font-black font-mono text-zinc-300 w-8">
            {!engineRunning ? '0' : isActionActive ? '82' : '18'}<small className="text-[10px] text-zinc-600">%</small>
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusDisplay;
