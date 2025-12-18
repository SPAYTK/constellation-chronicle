import React, { useEffect, useState } from "react";

interface Fragmento {
  titulo: string;
  texto: string;
  eje: string;
}

interface Pregunta {
  id: number;
  question: string;
  axis: string;
}

const corpusArchivos = [
  { file: "miedo_al_miedo.me", titulo: "Miedo al miedo", eje: "Miedo" },
  { file: "salud_mental_y_dependencia.me", titulo: "Salud mental y dependencia", eje: "Salud Mental" },
];

export default function Corpus() {
  const [fragmentos, setFragmentos] = useState<Fragmento[]>([]);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);

  useEffect(() => {
    Promise.all(
      corpusArchivos.map(async ({ file, titulo, eje }) => {
        const res = await fetch(`/src/data/corpus/${file}`);
        const texto = await res.text();
        return { titulo, texto, eje };
      })
    ).then(setFragmentos);
    fetch("/src/data/corpus/socratic_questions.json")
      .then(res => res.json())
      .then(setPreguntas);
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="font-display text-3xl font-bold mb-4">Corpus Socrático</h1>
      <p className="mb-8 text-muted-foreground">Lectura y exploración del corpus crítico, con preguntas socráticas asociadas por eje.</p>
      {fragmentos.map(frag => (
        <div key={frag.titulo} className="mb-8 p-4 border rounded bg-card">
          <h2 className="font-semibold text-xl mb-2">{frag.titulo} <span className="text-primary">[{frag.eje}]</span></h2>
          <pre className="whitespace-pre-line mb-2 text-sm">{frag.texto}</pre>
          <div className="mb-1 font-bold text-primary">Preguntas socráticas:</div>
          <ul className="list-disc ml-6">
            {preguntas.filter(p => p.axis === frag.eje).map(p => (
              <li key={p.id} className="text-sm">{p.question}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
