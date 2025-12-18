import React, { useEffect, useState } from "react";
import { buildLaboratorioPrompt } from "../lib/laboratorioIA";
import { llmClient } from "../lib/llmClient";

export function SocraticQuestionsLab() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [axis, setAxis] = useState("Todos");
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [input, setInput] = useState("");
  const [nivel, setNivel] = useState("individual");
  const [tension, setTension] = useState("psicológica");
  const [respuesta, setRespuesta] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/src/data/socratic_questions.json")
      .then((res) => res.json())
      .then(setQuestions);
  }, []);

  const axes = [
    "Todos",
    ...Array.from(new Set(questions.map((q: any) => q.axis)))
  ];

  const filtered = axis === "Todos"
    ? questions
    : questions.filter((q: any) => q.axis === axis);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRespuesta("");
    const pregunta = questions.find((q) => q.id === Number(selectedQuestion));
    const prompt = buildLaboratorioPrompt({
      texto: input,
      preguntaId: pregunta ? pregunta.question : undefined,
      ejes: axis === "Todos" ? [] : [axis],
      nivel: nivel as any,
      tension: tension as any,
    });
    try {
      const resp = await llmClient.analizar(prompt);
      setRespuesta(resp);
    } catch (err) {
      setRespuesta("Error al consultar Gemini");
    }
    setLoading(false);
  };

  return (
    <section className="mb-16">
      <h2 className="font-display text-2xl font-semibold mb-4">Laboratorio Socrático (IA)</h2>
      <form className="mb-6 space-y-4" onSubmit={handleSubmit}>
        <div className="flex gap-2 flex-wrap">
          <select value={axis} onChange={e => setAxis(e.target.value)} className="border rounded px-2 py-1">
            {axes.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select value={selectedQuestion} onChange={e => setSelectedQuestion(e.target.value)} className="border rounded px-2 py-1">
            <option value="">Selecciona pregunta</option>
            {filtered.map((q: any) => (
              <option key={q.id} value={q.id}>{q.question}</option>
            ))}
          </select>
          <select value={nivel} onChange={e => setNivel(e.target.value)} className="border rounded px-2 py-1">
            <option value="individual">Individual</option>
            <option value="institucional">Institucional</option>
            <option value="sistémico">Sistémico</option>
          </select>
          <select value={tension} onChange={e => setTension(e.target.value)} className="border rounded px-2 py-1">
            <option value="psicológica">Psicológica</option>
            <option value="política">Política</option>
            <option value="ética">Ética</option>
            <option value="simbólica">Simbólica</option>
          </select>
        </div>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={3}
          placeholder="Describe tu caso, dilema o reflexión..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold disabled:opacity-50"
          disabled={loading || !input || !selectedQuestion}
        >
          {loading ? "Consultando IA..." : "Analizar con Gemini"}
        </button>
      </form>
      {respuesta && (
        <div className="p-4 border rounded bg-muted">
          <div className="font-bold mb-2 text-primary">Respuesta IA:</div>
          <div className="whitespace-pre-line">{respuesta}</div>
        </div>
      )}
    </section>
  );
}
