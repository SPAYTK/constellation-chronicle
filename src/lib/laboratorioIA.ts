import { LABORATORIO_PROMPT } from "../ai/laboratorioPrompt";
import lagrangeMap from "../data/lagrange_map.json";
import { pilares, getPilaresPorConcepto } from "../data/pilares";

export interface LaboratorioInput {
  texto: string;
  preguntaId?: string;
  fragmentoCorpus?: string;
  episodioId?: string;
  ejes: string[];
  nivel: "individual" | "institucional" | "sistémico";
  tension: "ética" | "política" | "psicológica" | "simbólica";
  pilarId?: number; // Análisis enfocado en un pilar específico
}

export interface LaboratorioOutput {
  supuesto: string;
  contradiccion: string;
  eje: string;
  tension: string;
  preguntaEvita: string;
  narrativa: string; // Respuesta narrativa de 2 líneas
  pilaresRelacionados?: number[]; // IDs de pilares fundamentales relacionados
  recomendacionPilar?: string; // Recomendación basada en pilares
}

/**
 * Genera el prompt para el motor IA del Laboratorio, integrando input de usuario y contexto del sistema.
 * Ahora incluye contexto de pilares fundamentales.
 */
export function buildLaboratorioPrompt(input: LaboratorioInput): string {
  let contexto = "";
  
  if (input.preguntaId) {
    const pregunta = lagrangeMap.preguntas.find(q => q.id === input.preguntaId);
    if (pregunta) contexto += `Pregunta socrática: ${pregunta.id} - ${pregunta.eje}\n`;
  }
  
  if (input.fragmentoCorpus) {
    contexto += `Fragmento corpus: ${input.fragmentoCorpus}\n`;
  }
  
  if (input.episodioId) {
    contexto += `Episodio: ${input.episodioId}\n`;
  }
  
  contexto += `Ejes: ${input.ejes.join(", ")}\nNivel: ${input.nivel}\nTensión: ${input.tension}\n`;
  
  // Agregar contexto de pilares
  const pilaresRelacionados = input.ejes.flatMap(eje => getPilaresPorConcepto(eje));
  if (pilaresRelacionados.length > 0) {
    contexto += `\nPILARES FUNDAMENTALES RELACIONADOS:\n`;
    pilaresRelacionados.forEach(pilar => {
      contexto += `${pilar.id}. ${pilar.nombre}: ${pilar.principio}\n`;
    });
  }
  
  if (input.pilarId) {
    const pilar = pilares.find(p => p.id === input.pilarId);
    if (pilar) {
      contexto += `\nENFOQUE EN PILAR ${pilar.id}: ${pilar.nombre}\n`;
      contexto += `Objetivo: ${pilar.objetivo_estrategico}\n`;
    }
  }
  
  contexto += `\nTexto usuario: ${input.texto}\n`;
  
  return `${LABORATORIO_PROMPT}\n---\nContexto de análisis:\n${contexto}`;
}
