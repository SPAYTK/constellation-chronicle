import { useState } from "react";
import { buildLaboratorioPrompt, LaboratorioInput, LaboratorioOutput } from "../lib/laboratorioIA";

/**
 * Hook para ejecutar el análisis crítico del Laboratorio Lagrange vía IA.
 * Puede conectarse a un endpoint real o simular respuesta para desarrollo.
 */
export function useLaboratorioIA() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<LaboratorioOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function analizar(input: LaboratorioInput) {
    setLoading(true);
    setError(null);
    setOutput(null);
    const prompt = buildLaboratorioPrompt(input);
    
    try {
      const GOOGLE_API_KEY = "AIzaSyATvjH8T6OT5vwWKncAMVp1NTHntVUpBZE";
      
      if (!GOOGLE_API_KEY) {
        throw new Error("API key no configurada. Define VITE_GOOGLE_API_KEY en .env.local");
      }

<<<<<<< HEAD
      const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
      
      const response = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
=======
      // --- MOCK PARA DESARROLLO ---
      await new Promise(r => setTimeout(r, 1200));
      setOutput({
        supuesto: "El usuario asume que el control es siempre externo.",
        contradiccion: "Busca protección pero rechaza vigilancia.",
        eje: input.ejes[0] || "miedo",
        tension: input.tension,
        preguntaEvita: "¿Qué parte del control es autoimpuesta?",
        narrativa: [
          "El sistema detecta un patrón recursivo: quien pide protección institucional termina vigilándose a sí mismo.",
          "La jaula no necesita guardias cuando el prisionero asume el rol.",
          "El miedo a la vigilancia se convierte en auto-vigilancia, perpetuando la paradoja.",
          "¿Qué mecanismos internos refuerzan la sumisión bajo la apariencia de protección?"
        ].join("\n")
>>>>>>> 4151c41 (Fix: actualiza modelo Gemini a gemini-pro, amplía respuesta IA a 4 líneas, repara despliegue y compatibilidad API)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${errorData?.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (!text) {
        throw new Error("Respuesta vacía de la API");
      }

      // Extraer JSON de la respuesta
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error(`No se pudo parsear JSON. Respuesta: ${text.substring(0, 200)}`);
      }

      const result = JSON.parse(jsonMatch[0]);
      setOutput(result as LaboratorioOutput);
      
    } catch (e: any) {
      console.error("Error en análisis:", e);
      setError(e.message || "Error al analizar el input.");
    } finally {
      setLoading(false);
    }
  }

  return { analizar, output, loading, error };
}
