
import React from 'react';
import Joystick from './Joystick';
import Pedal from './Pedal';
import IgnitionSwitch from './IgnitionSwitch';
import { ControlState } from '../types';

interface ControlPanelProps {
  controls: ControlState;
  setControls: React.Dispatch<React.SetStateAction<ControlState>>;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ controls, setControls }) => {
  const handleReset = () => {
    setControls(prev => ({
      ...prev,
      locked: {
        leftJoystick: null,
        rightJoystick: null,
        leftPedal: null,
        rightPedal: null
      }
    }));
  };

  return (
    <div className="h-full flex items-center justify-between max-w-7xl mx-auto w-full gap-8">
      {/* Joystick Esquerdo */}
      <div className="flex-1 flex justify-center">
        <Joystick 
          label="Joystick Esquerdo"
          subLabel="Giro e Braço"
          axisLabels={{ up: 'Braço p/ Frente', down: 'Braço p/ Trás', left: 'Girar Esquerda', right: 'Girar Direita' }}
          onChange={(pos) => setControls(prev => ({ ...prev, realtime: { ...prev.realtime, leftJoystick: pos } }))}
          disabled={!controls.engineRunning}
          lockedValue={controls.locked.leftJoystick}
        />
      </div>

      {/* Console Central */}
      <div className="flex flex-col items-center gap-6 px-10 border-x border-zinc-800/50">
        <IgnitionSwitch 
          isActive={controls.engineRunning} 
          onToggle={() => {
            if (controls.engineRunning) handleReset();
            setControls(prev => ({ ...prev, engineRunning: !prev.engineRunning }));
          }} 
        />
        
        {/* Botão REDEFINIR CIRCUITO */}
        <button
          onClick={handleReset}
          disabled={!controls.engineRunning}
          className={`flex flex-col items-center gap-2 group transition-all duration-300 ${!controls.engineRunning ? 'opacity-20 grayscale' : ''}`}
        >
          <div className="w-32 py-2 bg-red-950/30 border border-red-500/50 rounded-lg text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95">
            Redefinir Circuito
          </div>
          <p className="text-[8px] text-zinc-600 font-mono uppercase">Limpas Travas de Fluxo</p>
        </button>
        
        <div className="flex gap-10">
          <Pedal 
            label="Translação E" 
            value={controls.realtime.leftPedal} 
            onChange={(v) => setControls(prev => ({ ...prev, realtime: { ...prev.realtime, leftPedal: v } }))} 
            disabled={!controls.engineRunning}
            lockedValue={controls.locked.leftPedal}
          />
          <Pedal 
            label="Translação D" 
            value={controls.realtime.rightPedal} 
            onChange={(v) => setControls(prev => ({ ...prev, realtime: { ...prev.realtime, rightPedal: v } }))} 
            disabled={!controls.engineRunning}
            lockedValue={controls.locked.rightPedal}
          />
        </div>
      </div>

      {/* Joystick Direito */}
      <div className="flex-1 flex justify-center">
        <Joystick 
          label="Joystick Direito"
          subLabel="Lança e Caçamba"
          axisLabels={{ up: 'Levantar Lança', down: 'Baixar Lança', left: 'Abrir Caçamba', right: 'Fechar Caçamba' }}
          onChange={(pos) => setControls(prev => ({ ...prev, realtime: { ...prev.realtime, rightJoystick: pos } }))}
          disabled={!controls.engineRunning}
          lockedValue={controls.locked.rightJoystick}
        />
      </div>
    </div>
  );
};

export default ControlPanel;
