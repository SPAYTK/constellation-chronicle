// Tipos para el agente IA del Sistema Lagrange

import { Pilar } from "@/data/pilares";

export interface AgentInput {
  corpus: string;
  narrativeMatrix?: any;
  currentEpisode?: any;
  angle: string;
  pilares?: Pilar[]; // Contexto de pilares fundamentales para análisis
}

export interface AgentOutput {
  affirmation: string;
  contradiction: string;
  openQuestion: string;
  suggestedNodes?: string[];
  pilaresRelacionados?: number[]; // IDs de pilares relacionados con el análisis
}

export interface AgentError {
  message: string;
  code?: string;
}

/**
 * Input para análisis específico de pilares
 */
export interface PilarAnalysisInput {
  texto: string;
  contexto?: string;
  pilarId?: number; // Para análisis enfocado en un pilar específico
}

/**
 * Output de análisis de pilares
 */
export interface PilarAnalysisOutput {
  pilarPrincipal: number; // ID del pilar más relevante
  pilaresSecundarios: number[]; // IDs de pilares secundarios relacionados
  tension: string; // Tensión identificada según pilares
  recomendacion: string; // Acción sugerida basada en pilares
  contradiccion?: string; // Contradicción encontrada respecto a pilares
}
