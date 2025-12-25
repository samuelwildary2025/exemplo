
import React from 'react';
import { HydraulicAction } from '../types';
import { COMPONENT_DATA } from '../constants';

interface ComponentPanelProps {
  actions: HydraulicAction[];
  engineRunning: boolean;
}

const ComponentPanel: React.FC<ComponentPanelProps> = ({ actions, engineRunning }) => {
  const getActiveComponents = () => {
    if (!engineRunning) return [];
    const active = new Set<number>();
    active.add(17); active.add(30); active.add(24);
    if (actions.some(a => a.includes('BOOM'))) active.add(7);
    if (actions.some(a => a.includes('SWING'))) active.add(16);
    return COMPONENT_DATA.filter(c => active.has(c.id));
  };

  const activeComponents = getActiveComponents();

  return (
    <div className="w-96 border-l border-zinc-800 bg-black/40 backdrop-blur-2xl flex flex-col shrink-0">
      <div className="p-6 border-b border-zinc-800 bg-gradient-to-r from-zinc-900/50 to-transparent">
        <h2 className="text-xs font-black text-cat-yellow flex items-center gap-3 tracking-widest uppercase">
          <span className="w-1.5 h-4 bg-cat-yellow rounded-full animate-pulse" />
          Dados Técnicos do Sistema
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeComponents.map(comp => (
          <div 
            key={comp.id} 
            className="group p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-xl flex flex-col gap-3 transition-all hover:border-cat-yellow/40 hover:bg-zinc-800/60 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 bg-cat-yellow/10 text-cat-yellow text-[9px] font-black rounded border border-cat-yellow/20 uppercase">Item {comp.id}</span>
              <span className="text-[9px] font-bold text-zinc-500 font-mono italic">REF: {comp.schematicLoc}</span>
            </div>
            
            <div>
              <h3 className="text-xs font-black text-zinc-100 uppercase leading-tight">{comp.name}</h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-1">N/P: {comp.partNumber}</p>
            </div>

            <div className="grid grid-cols-1 gap-1.5 pt-3 border-t border-zinc-800/50">
              {comp.technicalSpecs && Object.entries(comp.technicalSpecs).map(([key, val]) => (
                <div key={key} className="flex justify-between text-[10px] font-mono">
                  <span className="text-zinc-600 font-bold uppercase">{key}</span>
                  <span className="text-zinc-300 font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {!engineRunning && (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-6 rotate-12">
              <svg className="w-10 h-10 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Diagnóstico Bloqueado</p>
            <p className="text-[10px] font-mono mt-3 text-zinc-600 leading-relaxed">AGUARDANDO PARTIDA DO MOTOR PARA SINCRONIZAR DADOS DO BARRAMENTO CAN.</p>
          </div>
        )}
      </div>

      <div className="p-6 bg-zinc-900/40 border-t border-zinc-800">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter">Integridade do Sistema</span>
            <span className="text-[10px] text-green-500 font-bold font-mono">NOMINAL</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
            <div className={`h-full bg-cat-yellow transition-all duration-1000 ${engineRunning ? 'w-full shadow-[0_0_10px_#FFCD11]' : 'w-0'}`} />
          </div>
          <div className="h-24 bg-black/60 rounded-lg border border-zinc-800 p-3 font-mono text-[9px] text-green-500/70 overflow-y-auto leading-relaxed custom-scrollbar">
            {actions.map((a, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <span className="text-zinc-700">[{new Date().toLocaleTimeString('pt-BR')}]</span>
                <span>COMANDO_{a} : ATIVO</span>
              </div>
            ))}
            {!engineRunning && <div className="text-red-500/80 animate-pulse font-bold">ALERTA: PRESSÃO_ZERO - MOTOR_DESLIGADO</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentPanel;
