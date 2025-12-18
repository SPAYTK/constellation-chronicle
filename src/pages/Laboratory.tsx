
import { useState, useEffect } from "react";
import { llmClient } from "../lib/llmClient";
import { Navigation } from "@/components/Navigation";
// Utilidades para cargar archivos .md
async function fetchMarkdown(path: string): Promise<string> {
  const res = await fetch(path);
  return res.ok ? res.text() : '';
}


export default function Laboratory() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [corpus, setCorpus] = useState<string>("");
  const [episodios, setEpisodios] = useState<{id:string,title:string,content:string}[]>([]);
  const [selectedEpisodio, setSelectedEpisodio] = useState<string>("");

  // Cargar corpus y episodios .md al montar
  useEffect(() => {
    fetchMarkdown('/src/data/corpus/critica_socratica_lagrange.me').then(setCorpus);
    // Lista de episodios .md (puedes automatizar esto si tienes un endpoint)
    const episodiosList = [
      { id: 'E01', title: 'El miedo como frontera', path: '/episodes/E01.md' },
      { id: 'E02', title: 'Control sin rostro', path: '/episodes/E02.md' },
      { id: 'E03', title: 'La salud mental invisible', path: '/episodes/E03.md' },
      { id: 'E04', title: 'Legitimidad en disputa', path: '/episodes/E04.md' },
      { id: 'E05', title: 'Responsabilidad sin testigos', path: '/episodes/E05.md' }
    ];
    Promise.all(
      episodiosList.map(async ep => ({
        id: ep.id,
        title: ep.title,
        content: await fetchMarkdown(ep.path)
      }))
    ).then(setEpisodios);
  }, []);

  function getPrompt() {
    let contexto = '';
    if (corpus) contexto += `CORPUS:\n${corpus}\n`;
    if (selectedEpisodio) {
      const ep = episodios.find(e => e.id === selectedEpisodio);
      if (ep) contexto += `EPISODIO:\n${ep.content}\n`;
    }
    if (input) contexto += `USUARIO:\n${input}\n`;
    return contexto;
  }

  async function analizar() {
    setLoading(true);
    setOutput("");
    const prompt = getPrompt();
    const result = await llmClient.analizar(prompt);
    setOutput(result);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Laboratorio IA</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Herramientas de análisis crítico, prompts, contradicciones y propuesta de nodos. Selecciona contexto y lanza tu análisis.
          </p>
          <div className="bg-card border border-border rounded-lg p-6 shadow-md">
            <label className="block mb-4">
              <span className="font-semibold">Selecciona episodio como contexto:</span>
              <select
                value={selectedEpisodio}
                onChange={e => setSelectedEpisodio(e.target.value)}
                className="mt-2 block w-full rounded border border-border bg-background px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">(Ninguno)</option>
                {episodios.map(ep => (
                  <option key={ep.id} value={ep.id}>{ep.title}</option>
                ))}
              </select>
            </label>
            <label className="block mb-4">
              <span className="font-semibold">Texto para análisis crítico:</span>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Introduce texto, pregunta o hipótesis..."
                rows={5}
                className="mt-2 block w-full rounded border border-border bg-background px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <button
              onClick={analizar}
              disabled={loading || (!input && !selectedEpisodio)}
              className="w-full py-2 px-4 rounded bg-primary text-white font-semibold hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? 'Analizando...' : 'Analizar con IA'}
            </button>
          </div>
          {output && (
            <div className="mt-8 bg-muted border border-border rounded-lg p-6 shadow-inner">
              <h2 className="font-semibold mb-2 text-primary">Resultado IA</h2>
              <div className="whitespace-pre-wrap text-base text-foreground">{output}</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
