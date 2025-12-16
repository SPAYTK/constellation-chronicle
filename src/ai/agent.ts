// Agente IA para análisis crítico del Sistema Lagrange

import { AgentInput, AgentOutput, AgentError } from "./types";
import { PROMPT_BASE } from "./prompts";

/**
 * Ejecuta el agente de análisis crítico
 * No dialoga - solo analiza y genera fricción
 */
export async function runAgent(input: AgentInput): Promise<AgentOutput> {
  try {
    // TODO: Integrar con API real (OpenAI, Anthropic, etc.)
    // Por ahora, retorna estructura mock para desarrollo
    
    const mockOutput: AgentOutput = {
      affirmation: `El corpus sostiene que "${input.angle}" es una estructura de control.`,
      contradiction: `Sin embargo, la misma estructura que se critica es la que permite formular la crítica.`,
      openQuestion: `¿Es posible salir del sistema sin usar las herramientas del sistema?`,
      suggestedNodes: ["control", "legitimidad", "conciencia"]
    };

    // Simular latencia de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    return mockOutput;

    // Implementación futura con API real:
    /*
    const payload = {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: PROMPT_BASE
        },
        {
          role: "user",
          content: JSON.stringify(input)
        }
      ],
      response_format: { type: "json_object" }
    };

    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("El agente ha decidido no colaborar hoy.");
    }

    const data = await res.json();
    return JSON.parse(data.choices[0].message.content);
    */
  } catch (error) {
    const err: AgentError = {
      message: error instanceof Error ? error.message : "Error desconocido",
      code: "AGENT_ERROR"
    };
    throw err;
  }
}

/**
 * Versión simplificada para análisis rápido
 */
export async function quickAnalysis(text: string, angle: string): Promise<AgentOutput> {
  return runAgent({
    corpus: text,
    narrativeMatrix: {},
    angle
  });
}
