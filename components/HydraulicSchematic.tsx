
import React from 'react';
import { HydraulicAction } from '../types';
import { COLORS } from '../constants';

interface HydraulicSchematicProps {
  actions: HydraulicAction[];
  engineRunning: boolean;
  isPaused?: boolean;
}

const HydraulicSchematic: React.FC<HydraulicSchematicProps> = ({ actions, engineRunning, isPaused = false }) => {
  const isAnyAction = actions.some(a => a !== 'IDLE' && a !== 'ENGINE_OFF' && a !== 'LOCKED_STATE');

  const boomActive = actions.some(a => a.startsWith('BOOM_'));
  const stickActive = actions.some(a => a.startsWith('STICK_'));
  const swingActive = actions.some(a => a.startsWith('SWING_'));
  const bucketActive = actions.some(a => a.startsWith('BUCKET_'));
  const transActive = actions.some(a => a.startsWith('TRAVEL_'));

  // Valores de pressão baseados na 320DL
  const getPressure = (type: 'MAIN' | 'BOOM' | 'STICK' | 'SWING' | 'RETURN') => {
    if (!engineRunning) return "0";
    if (type === 'RETURN') return isAnyAction ? "450" : "120";
    
    const isMoving = (type === 'BOOM' && boomActive) || 
                     (type === 'STICK' && stickActive) || 
                     (type === 'SWING' && swingActive) ||
                     (type === 'MAIN' && (isAnyAction || transActive));

    if (isMoving) {
      if (type === 'SWING') return "24.500";
      return "34.300";
    }
    return "3.900"; // Standby/Pilot pressure
  };

  const PressureBadge = ({ x, y, value, label }: { x: number; y: number; value: string; label?: string }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-35" y="-12" width="70" height="24" rx="4" fill="#000" stroke={value !== "0" && value !== "3.900" ? COLORS.highPressure : "#333"} strokeWidth="1.5" />
      <text x="0" y="-16" textAnchor="middle" className="tech-font" fill="#52525b" style={{ fontSize: '7px' }}>{label}</text>
      <text x="0" y="4" textAnchor="middle" className="tech-font" fill={value === "34.300" ? COLORS.highPressure : value === "0" ? "#3f3f46" : COLORS.active} style={{ fontSize: '9px', fontWeight: '900' }}>{value}</text>
      <text x="26" y="4" textAnchor="start" className="tech-font" fill="#3f3f46" style={{ fontSize: '6px' }}>kPa</text>
    </g>
  );

  const FlowPath = ({ d, active, color = COLORS.active, pilot = false }: { d: string; active: boolean; color?: string; pilot?: boolean }) => (
    <g>
      <path
        d={d}
        fill="none"
        stroke={active ? color : '#1e1e1e'}
        strokeWidth={pilot ? 2 : 4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-500 ease-in-out"
        filter={active ? `drop-shadow(0 0 3px ${color}88)` : 'none'}
      />
      {active && (
        <path
          d={d}
          fill="none"
          stroke="white"
          strokeWidth={pilot ? 0.8 : 1.5}
          strokeDasharray={pilot ? "4 8" : "10 15"}
          className="animate-[flow_0.5s_linear_infinite]"
          opacity="0.4"
        />
      )}
    </g>
  );

  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative">
      <style>{`
        @keyframes flow { from { stroke-dashoffset: 50; } to { stroke-dashoffset: 0; } }
        .tech-font { font-family: 'JetBrains Mono', monospace; }
        .label-port { font-size: 11px; font-weight: 900; fill: #71717a; text-transform: uppercase; }
        .actuator-title { font-size: 10px; font-weight: 800; fill: #a1a1aa; }
      `}</style>
      
      <svg viewBox="0 0 1000 800" className="w-full h-full max-w-5xl">
        <defs>
          <pattern id="grid-pro" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#111" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pro)" />

        {/* BOMBAs (17) */}
        <g transform="translate(150, 650)">
          <rect x="-70" y="-50" width="240" height="120" rx="8" fill="#09090b" stroke="#333" strokeWidth="2" />
          <text x="-60" y="-65" className="label-port" fill={COLORS.active}>BOMBA PRINCIPAL 320DL (17)</text>
          <circle cx="0" cy="0" r="40" fill="#18181b" stroke={engineRunning ? COLORS.active : "#3f3f46"} strokeWidth="2" />
          <text x="-10" y="5" className="tech-font" fill="#fff" style={{fontSize: '10px'}}>P1</text>
          <circle cx="100" cy="0" r="40" fill="#18181b" stroke={engineRunning ? COLORS.active : "#3f3f46"} strokeWidth="2" />
          <text x="90" y="5" className="tech-font" fill="#fff" style={{fontSize: '10px'}}>P2</text>
        </g>

        {/* Etiquetas de Pressão de Saída das Bombas */}
        <PressureBadge x={150} y={580} value={getPressure('MAIN')} label="SAÍDA P1" />
        <PressureBadge x={250} y={580} value={getPressure('MAIN')} label="SAÍDA P2" />

        {/* RESERVATÓRIO (24) */}
        <g transform="translate(850, 680)">
          <path d="M -60 0 H 60 V 80 H -60 Z" fill="#09090b" stroke="#333" strokeWidth="2" />
          <text x="-55" y="-20" className="label-port">RESERVATÓRIO (24)</text>
          <PressureBadge x={0} y={40} value={getPressure('RETURN')} label="RETORNO" />
        </g>

        {/* MCV (30) */}
        <g transform="translate(300, 220)">
          <rect x="0" y="0" width="480" height="300" rx="10" fill="#09090b" stroke="#333" strokeWidth="2" />
          <text x="15" y="28" className="label-port" fill="#a1a1aa">BLOCO DE CONTROLE PRINCIPAL (30)</text>
          
          {['TRANS_D', 'LANÇA_1', 'CAÇAMBA', 'LANÇA_2', 'GIRO', 'BRAÇO_1', 'BRAÇO_2', 'TRANS_E'].map((label, i) => {
            let isActive = false;
            if (label.includes('TRANS')) isActive = transActive;
            else if (label === 'CAÇAMBA') isActive = bucketActive;
            else if (label === 'GIRO') isActive = swingActive;
            else if (label.startsWith('LANÇA')) isActive = boomActive;
            else if (label.startsWith('BRAÇO')) isActive = stickActive;

            return (
              <g key={label} transform={`translate(${30 + i * 55}, 55)`}>
                <rect width="40" height="200" rx="3" fill="#18181b" stroke={isActive ? COLORS.active : "#222"} strokeWidth={isActive ? 2 : 1} />
                <text x="20" y="100" className="tech-font" transform="rotate(90, 20, 100)" textAnchor="middle" fill={isActive ? "#fff" : "#444"} style={{fontSize: '9px'}}>{label}</text>
              </g>
            );
          })}
        </g>

        {/* Pressão na Galeria MCV */}
        <PressureBadge x={540} y={490} value={getPressure('MAIN')} label="GALERIA PARALELA" />

        {/* ATUADORES */}
        <g transform="translate(820, 80)">
          <rect width="150" height="35" rx="4" fill="#09090b" stroke={boomActive ? COLORS.active : "#333"} strokeWidth="2" />
          <text x="0" y="-15" className="actuator-title">CILINDRO DA LANÇA (7)</text>
          <PressureBadge x={175} y={17} value={getPressure('BOOM')} label="LINHA A" />
        </g>

        <g transform="translate(820, 180)">
          <rect width="150" height="35" rx="4" fill="#09090b" stroke={stickActive ? COLORS.active : "#333"} strokeWidth="2" />
          <text x="0" y="-15" className="actuator-title">CILINDRO DO BRAÇO (9)</text>
          <PressureBadge x={175} y={17} value={getPressure('STICK')} label="LINHA B" />
        </g>

        <g transform="translate(820, 280)">
          <rect width="150" height="40" rx="4" fill="#09090b" stroke={swingActive ? COLORS.active : "#333"} strokeWidth="2" />
          <text x="0" y="-15" className="actuator-title">MOTOR DE GIRO (16)</text>
          <PressureBadge x={175} y={20} value={getPressure('SWING')} label="ALÍVIO GIRO" />
        </g>

        {/* CAMINHOS DE FLUXO */}
        {/* Saída Bombas para MCV */}
        <FlowPath d="M 150 600 V 450 H 300" active={engineRunning} color={getPressure('MAIN') === "34.300" ? COLORS.highPressure : COLORS.active} />
        <FlowPath d="M 250 600 V 450 H 300" active={engineRunning} color={getPressure('MAIN') === "34.300" ? COLORS.highPressure : COLORS.active} />

        {/* MCV para Lança */}
        <FlowPath d="M 380 220 V 97 H 820" active={boomActive} color={COLORS.highPressure} />
        {/* MCV para Braço */}
        <FlowPath d="M 605 220 V 197 H 820" active={stickActive} color={COLORS.highPressure} />
        {/* MCV para Giro */}
        <FlowPath d="M 550 220 V 300 H 820" active={swingActive} color={COLORS.active} />

        {/* Retorno */}
        <FlowPath d="M 780 400 H 850 V 680" active={engineRunning && isAnyAction} color={COLORS.return} />

        {isPaused && (
          <g transform="translate(500, 70)">
            <rect x="-160" y="-20" width="320" height="40" rx="20" fill={COLORS.active} />
            <text x="0" y="5" textAnchor="middle" fill="#000" className="font-black text-xs uppercase tracking-widest">ANÁLISE DE FLUXO ACUMULADO</text>
          </g>
        )}

        {!engineRunning && (
          <g transform="translate(500, 400)">
            <rect x="-200" y="-40" width="400" height="80" rx="10" fill="rgba(0,0,0,0.9)" stroke="#ef4444" strokeWidth="2" />
            <text x="0" y="5" textAnchor="middle" fill="#ef4444" className="font-black text-lg uppercase">SISTEMA DESLIGADO</text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default HydraulicSchematic;
