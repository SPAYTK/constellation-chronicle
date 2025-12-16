// Tipos para el agente IA del Sistema Lagrange

export interface AgentInput {
  corpus: string;
  narrativeMatrix?: any;
  currentEpisode?: any;
  angle: string;
}

export interface AgentOutput {
  affirmation: string;
  contradiction: string;
  openQuestion: string;
  suggestedNodes?: string[];
}

export interface AgentError {
  message: string;
  code?: string;
}
