// Cliente LLM para análisis crítico y generación

export const llmClient = {
	 analizar: async (prompt: string) => {
		 // Usar el proxy local para Gemini
		 const res = await fetch('/api/gemini', {
			 method: 'POST',
			 headers: { 'Content-Type': 'application/json' },
			 body: JSON.stringify({ prompt })
		 });
		 if (!res.ok) throw new Error('Error en la llamada al proxy Gemini');
		 const data = await res.json();
		 return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta IA.';
	 }
};
