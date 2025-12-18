// Cliente LLM para análisis crítico y generación
export const llmClient = {
	analizar: async (prompt: string) => {
		// Llamada real a Gemini API (ejemplo, sustituye la clave y endpoint por los tuyos)
		const apiKey = process.env.VITE_GEMINI_API_KEY || '';
		const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
		const body = {
			contents: [{ parts: [{ text: prompt }] }],
			generationConfig: {
				temperature: 0.8,
				topK: 40,
				topP: 0.95,
				maxOutputTokens: 1024,
			}
		};
		const res = await fetch(`${url}?key=${apiKey}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		if (!res.ok) throw new Error('Error en la llamada a Gemini');
		const data = await res.json();
		return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta IA.';
	}
};
