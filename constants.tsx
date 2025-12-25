
import { ComponentData } from './types';

export const COMPONENT_DATA: ComponentData[] = [
  { 
    id: 17, 
    name: "Bomba Hidráulica Principal (P1/P2)", 
    schematicLoc: "B-2", 
    machineLoc: 17, 
    partNumber: "279-4954",
    technicalSpecs: {
      "Vazão Máx": "2 x 212 L/min",
      "Pressão de Alívio": "35.000 kPa",
      "Tipo": "Pistão Axial Variável"
    }
  },
  { 
    id: 30, 
    name: "Válvula de Controle Principal (MCV)", 
    schematicLoc: "C-2", 
    machineLoc: 30, 
    partNumber: "308-4100",
    technicalSpecs: {
      "Carretéis": "Bloco de 9 Estágios",
      "Lógica": "Controle de Fluxo Negativo (NFC)",
      "Válvula de Alívio": "34.300 kPa"
    }
  },
  { 
    id: 24, 
    name: "Reservatório de Óleo Hidráulico", 
    schematicLoc: "A-5", 
    machineLoc: 24, 
    partNumber: "279-4921",
    technicalSpecs: {
      "Capacidade": "120 L",
      "Total do Sistema": "260 L",
      "Pressurização": "Automática"
    }
  },
  { 
    id: 7, 
    name: "Cilindro da Lança (Boom)", 
    schematicLoc: "F-1", 
    machineLoc: 7, 
    partNumber: "272-3401",
    technicalSpecs: {
      "Diâmetro": "120 mm",
      "Curso": "1.260 mm"
    }
  },
  { 
    id: 16, 
    name: "Motor de Giro (Swing)", 
    schematicLoc: "F-5", 
    machineLoc: 16, 
    partNumber: "281-3522",
    technicalSpecs: {
      "Alívio de Giro": "24.500 kPa",
      "Freio": "Aplicado por Mola"
    }
  }
];

export const COLORS = {
  active: '#FFCD11', // Amarelo CAT
  inactive: '#1a1a1a',
  pilot: '#3b82f6', // Azul Piloto
  return: '#10b981', // Verde Retorno
  highPressure: '#f97316', // Laranja Alta Pressão
  background: '#050505',
  solenoid: '#ef4444'
};
