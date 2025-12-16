// Prompts para el agente crítico del Sistema Lagrange

import { Pilar } from "@/data/pilares";

// PROMPT_BASE ha sido reemplazado por SYSTEM_PROMPT (ver systemPrompt.ts)
// Usar SYSTEM_PROMPT para toda integración IA o automatización central.
export const PROMPT_BASE = "[DEPRECATED] Usar SYSTEM_PROMPT de systemPrompt.ts";

export const PROMPT_EPISODE_ANALYSIS = `
Analiza el siguiente episodio bajo el marco del Sistema Lagrange.
Identifica:
1. Qué afirmación central hace
2. Qué contradicción subyace
3. Qué pregunta queda sin responder

Responde solo con JSON válido.
`;

export const PROMPT_CORPUS_FRICTION = `
Lee el corpus proporcionado.
Genera fricción intelectual:
- No resumas
- No simplifiques
- Encuentra la tensión
- Formula la pregunta incómoda

Responde solo con JSON válido.
`;

/**
 * Genera prompt para análisis de pilares
 */
export function buildPilarAnalysisPrompt(texto: string, pilares: Pilar[], pilarEspecifico?: number): string {
  const pilarContext = pilarEspecifico 
    ? pilares.find(p => p.id === pilarEspecifico)
    : null;

  const pilaresInfo = pilares.map(p => 
    `${p.id}. ${p.nombre}: ${p.principio}`
  ).join('\n');

  return `
Eres un analista del Sistema Lagrange. Tu objetivo es identificar qué pilares fundamentales están en tensión o son relevantes en el texto proporcionado.

PILARES FUNDAMENTALES:
${pilaresInfo}

${pilarContext ? `ENFOQUE ESPECÍFICO EN PILAR ${pilarContext.id}: ${pilarContext.nombre}` : ''}

TEXTO A ANALIZAR:
${texto}

Responde SOLO con JSON válido siguiendo esta estructura:
{
  "pilarPrincipal": <número del pilar más relevante>,
  "pilaresSecundarios": [<array de IDs de otros pilares relacionados>],
  "tension": "<describe la tensión identificada en relación a los pilares>",
  "recomendacion": "<qué acción o reflexión sugiere el análisis>",
  "contradiccion": "<opcional: contradicción encontrada respecto a los principios>"
}
`;
}

/**
 * Genera prompt para análisis crítico con contexto de pilares
 */
export function buildAgentPromptWithPilares(corpus: string, angle: string, pilares: Pilar[]): string {
  const pilaresInfo = pilares.map(p => 
    `${p.id}. ${p.nombre}: ${p.objetivo_estrategico}`
  ).join('\n');

  return `
CONTEXTO DE ANÁLISIS CRÍTICO - SISTEMA LAGRANGE

PILARES FUNDAMENTALES DEL PROYECTO:
${pilaresInfo}

CORPUS:
${corpus}

ÁNGULO DE ANÁLISIS: ${angle}

Tu tarea:
1. Identifica qué pilares están en tensión con el corpus
2. Detecta contradicciones entre lo que se afirma y lo que los pilares proponen
3. Formula una pregunta socrática que exponga el desencaje

Responde SOLO con JSON válido:
{
  "affirmation": "<lo que el corpus afirma>",
  "contradiction": "<la contradicción identificada>",
  "openQuestion": "<pregunta socrática incómoda>",
  "pilaresRelacionados": [<IDs de pilares relevantes>]
}
`;
}
