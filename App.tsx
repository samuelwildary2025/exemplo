
import React, { useState, useMemo, useEffect } from 'react';
import { ControlState, HydraulicAction } from './types';
import ControlPanel from './components/ControlPanel';
import HydraulicSchematic from './components/HydraulicSchematic';
import StatusDisplay from './components/StatusDisplay';
import ComponentPanel from './components/ComponentPanel';

const App: React.FC = () => {
  const [controls, setControls] = useState<ControlState>({
    engineRunning: false,
    realtime: {
      leftJoystick: { x: 0, y: 0 },
      rightJoystick: { x: 0, y: 0 },
      leftPedal: 0,
      rightPedal: 0,
    },
    locked: {
      leftJoystick: null,
      rightJoystick: null,
      leftPedal: null,
      rightPedal: null,
    }
  });

  // Listener para Tecla de Trava Cumulativa (Espaço ou Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!controls.engineRunning) return;
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        setControls(prev => {
          const nextLocked = { ...prev.locked };
          
          // Se o comando atual tiver qualquer movimento, ele "carimba" a trava naquela posição
          if (Math.abs(prev.realtime.leftJoystick.x) > 0.1 || Math.abs(prev.realtime.leftJoystick.y) > 0.1) {
            nextLocked.leftJoystick = { ...prev.realtime.leftJoystick };
          }
          if (Math.abs(prev.realtime.rightJoystick.x) > 0.1 || Math.abs(prev.realtime.rightJoystick.y) > 0.1) {
            nextLocked.rightJoystick = { ...prev.realtime.rightJoystick };
          }
          if (Math.abs(prev.realtime.leftPedal) > 0.1) {
            nextLocked.leftPedal = prev.realtime.leftPedal;
          }
          if (Math.abs(prev.realtime.rightPedal) > 0.1) {
            nextLocked.rightPedal = prev.realtime.rightPedal;
          }
          
          return { ...prev, locked: nextLocked };
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [controls.engineRunning]);

  // Resolução dos comandos ativos
  const activeActions = useMemo((): HydraulicAction[] => {
    if (!controls.engineRunning) return ['ENGINE_OFF'];
    
    const actions: HydraulicAction[] = [];
    
    // Prioriza o valor travado se existir, senão usa o realtime
    const lj = controls.locked.leftJoystick || controls.realtime.leftJoystick;
    const rj = controls.locked.rightJoystick || controls.realtime.rightJoystick;
    const lp = controls.locked.leftPedal !== null ? controls.locked.leftPedal : controls.realtime.leftPedal;
    const rp = controls.locked.rightPedal !== null ? controls.locked.rightPedal : controls.realtime.rightPedal;

    if (lj.x < -0.3) actions.push('SWING_LEFT');
    if (lj.x > 0.3) actions.push('SWING_RIGHT');
    if (lj.y > 0.3) actions.push('STICK_IN');
    if (lj.y < -0.3) actions.push('STICK_OUT');

    if (rj.x < -0.3) actions.push('BUCKET_OPEN');
    if (rj.x > 0.3) actions.push('BUCKET_CLOSE');
    if (rj.y > 0.3) actions.push('BOOM_UP');
    if (rj.y < -0.3) actions.push('BOOM_DOWN');

    if (lp > 0.3 && rp > 0.3) actions.push('TRAVEL_FORWARD');
    else if (lp < -0.3 && rp < -0.3) actions.push('TRAVEL_BACKWARD');
    else {
      if (lp > 0.3) actions.push('TRAVEL_LEFT');
      if (rp > 0.3) actions.push('TRAVEL_RIGHT');
    }

    if (Object.values(controls.locked).some(v => v !== null)) actions.push('LOCKED_STATE');
    return actions.length > 0 ? actions : ['IDLE'] as HydraulicAction[];
  }, [controls]);

  const isAnyLocked = Object.values(controls.locked).some(v => v !== null);

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 flex flex-col overflow-hidden select-none">
      <header className="h-20 border-b border-zinc-800/50 bg-zinc-900/20 backdrop-blur-3xl flex items-center justify-between px-8 shrink-0 z-30 shadow-xl">
        <div className="flex items-center gap-8">
          <div className="bg-cat-yellow w-14 h-11 rounded flex items-center justify-center font-black text-black text-2xl shadow-[0_0_20px_rgba(255,205,17,0.4)] tracking-tighter">
            CAT
          </div>
          <div className="h-10 w-px bg-zinc-800/50" />
          <div>
            <h1 className="text-sm font-black tracking-tight text-zinc-200 uppercase flex items-center gap-2">
              Analizador Hidráulico 320DL
              {isAnyLocked && (
                <span className="px-2 py-0.5 bg-cat-yellow text-black text-[9px] font-black rounded border border-cat-yellow shadow-[0_0_10px_rgba(255,205,17,0.3)]">TRAVA CUMULATIVA ATIVA</span>
              )}
            </h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[10px] text-zinc-600 font-mono tracking-wider">REF: DIAG_MANUAL_320DL</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${controls.engineRunning ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'} animate-pulse`} />
                <span className="text-[9px] font-black text-zinc-500 uppercase">{controls.engineRunning ? 'MOTOR EM OPERAÇÃO' : 'MOTOR DESLIGADO'}</span>
              </div>
            </div>
          </div>
        </div>
        <StatusDisplay actions={activeActions} engineRunning={controls.engineRunning} />
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative bg-[radial-gradient(circle_at_40%_40%,_#111_0%,_#020202_100%)] flex flex-col overflow-hidden">
          {/* Guia de Comando */}
          {controls.engineRunning && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 px-6 py-2 bg-black/60 border border-zinc-800 rounded-full backdrop-blur-md shadow-2xl flex items-center gap-4">
              <div className="px-2 py-0.5 bg-zinc-800 text-[10px] font-black text-zinc-400 rounded">ESPAÇO</div>
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Aperte para FIXAR comando e acumular fluxos</span>
            </div>
          )}
          
          <HydraulicSchematic 
            actions={activeActions} 
            engineRunning={controls.engineRunning} 
            isPaused={isAnyLocked} 
          />
        </div>

        <ComponentPanel actions={activeActions} engineRunning={controls.engineRunning} />
      </main>

      <footer className="h-80 border-t border-zinc-800/80 bg-zinc-950/90 backdrop-blur-2xl p-8 relative z-20 shadow-[0_-30px_60px_rgba(0,0,0,0.6)]">
        <ControlPanel controls={controls} setControls={setControls} />
      </footer>
    </div>
  );
};

export default App;
