
export type Vec2 = { x: number; y: number };

export type ControlState = {
  engineRunning: boolean;
  // Valores em tempo real (do mouse/drag)
  realtime: {
    leftJoystick: Vec2;
    rightJoystick: Vec2;
    leftPedal: number;
    rightPedal: number;
  };
  // Valores travados (fixos após Espaço)
  locked: {
    leftJoystick: Vec2 | null;
    rightJoystick: Vec2 | null;
    leftPedal: number | null;
    rightPedal: number | null;
  };
};

export type HydraulicAction = 
  | 'IDLE'
  | 'BOOM_UP' | 'BOOM_DOWN'
  | 'STICK_IN' | 'STICK_OUT'
  | 'BUCKET_OPEN' | 'BUCKET_CLOSE'
  | 'SWING_LEFT' | 'SWING_RIGHT'
  | 'TRAVEL_FORWARD' | 'TRAVEL_BACKWARD'
  | 'TRAVEL_LEFT' | 'TRAVEL_RIGHT'
  | 'ENGINE_OFF'
  | 'LOCKED_STATE';

export interface ComponentData {
  id: number;
  name: string;
  schematicLoc: string;
  machineLoc: number;
  partNumber?: string;
  description?: string;
  technicalSpecs?: Record<string, string>;
}
