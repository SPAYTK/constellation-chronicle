# 🧠 Prompt Rector: Sistema Lagrange — Artefacto Cognitivo Integral

## Propósito General
El **Sistema Lagrange** es un entorno narrativo-tecnológico de análisis, crítica y simulación del control social.  
Su objetivo es mapear los mecanismos contemporáneos de legitimidad, miedo y responsabilidad mediante:
1. Un **corpus socrático versionado**.
2. Un **mapa web interactivo (SVG + JSON)**.
3. Un **laboratorio de IA** que analiza y produce contenido desde el corpus.
4. Un **sistema narrativo vivo** (podcast + episodios + pipeline texto→audio).

El sistema no solo representa ideas: **las somete a tensión**.

---

## 🔹 Estructura de Archivos (Refactorizada)

/src ├─ /components │   ├─ MapLagrange.jsx          # Mapa interactivo SVG/JSON │   ├─ EpisodePlayer.jsx        # Reproductor de podcast con transcripción │   ├─ SocraticQuestion.jsx     # Visualización de preguntas del corpus │   ├─ AdminPanel.jsx           # Panel de edición corpus/preguntas │   ├─ LabInterface.jsx         # Interfaz de laboratorio IA │   └─ Auth.jsx                 # Sistema de login/roles (admin/editor/viewer) │ ├─ /data │   ├─ corpus/ │   │   ├─ critica_socratica_lagrange.me │   │   ├─ miedo_al_miedo.me │   │   └─ salud_mental_y_dependencia.me │   ├─ socratic_questions.json │   ├─ nodes.json               # Nodos conceptuales del mapa │   ├─ edges.json               # Relaciones entre conceptos │   └─ episodes.json            # Metadatos del podcast │ ├─ /pages │   ├─ index.jsx                # Home — manifiesto del proyecto │   ├─ podcast.jsx              # Episodios y transcripciones │   ├─ map.jsx                  # Mapa interactivo Lagrange │   ├─ lab.jsx                  # Laboratorio IA (prompts, análisis) │   ├─ auth.jsx                 # Acceso y gestión de roles │   └─ 404.jsx │ ├─ /utils │   ├─ sync-episodes.cjs        # Sincronización podcast/audio │   ├─ supabaseClient.js        # Configuración Supabase │   ├─ aiPipeline.js            # Conexión con modelos LLM │   └─ corpusTools.js           # CRUD corpus y JSON │ ├─ /styles │   ├─ theme.css │   └─ layout.css │ ├─ /public │   ├─ svg/ │   │   ├─ lagrange_map.svg │   │   └─ nodes_icons.svg │   └─ audio/ │       └─ episodes/ │           ├─ E01_el_miedo_al_miedo.mp3 │           ├─ E02_legitimidad_y_vacio.mp3 │           └─ ... │ ├─ package.json ├─ README.md └─ lagrange_reactor_master.md   # Este prompt rector

---

## 🔹 Mapa Web Actualizado

| Ruta | Función | Fuente de Datos | IA Integrada |
|------|----------|----------------|---------------|
| `/` | Manifesto interactivo | corpus principal | Sí (generación resúmenes) |
| `/podcast` | Lista + player + transcripción | `episodes.json` | Sí (resumen + tono narrativo) |
| `/map` | Mapa Lagrange SVG + JSON | `nodes.json`, `edges.json` | Sí (análisis topológico) |
| `/lab` | Laboratorio de prompts + IA | corpus, Supabase | Sí (Gemini / GPT-5 / LLM híbrido) |
| `/auth` | Control de roles y acceso | Supabase | No |
| `/404` | Página de error | — | — |

---

## 🔹 Flujo de Datos I/O del Sistema

```mermaid
flowchart LR
    A[Usuario] -->|interacción UI| B[Frontend React]
    B -->|consulta| C[Supabase]
    B -->|carga corpus/preguntas| D[data/corpus]
    B -->|prompts| E[IA Pipeline]
    E -->|análisis crítico| D
    E -->|respuestas narrativas| B
    B -->|publica episodios| F[Podcast Player + Transcripción]
    F -->|retroalimentación| D

Flujo narrativo resumido:

1. Usuario → pregunta → IA analiza corpus → genera reflexión → corpus se actualiza.

2. Cada episodio del podcast retroalimenta nodos del mapa y las tensiones del corpus.

3. El mapa SVG reacciona visualmente (nodos activos = temas vivos).

4. Los nuevos análisis se almacenan y pueden desplegarse como publicaciones automáticas.
```

---

🔹 Objetivo del Agente IA

El agente debe:

Mantener coherencia semántica entre nodos y corpus.

Analizar conceptos nuevos siguiendo los cinco ejes estructurales:
Miedo | Control | Legitimidad | Salud Mental | Responsabilidad

Crear contenido derivado (episodios, prompts, transcripciones).

Proponer nuevas conexiones y tensiones emergentes.

Detectar redundancias o contradicciones entre definiciones.

---

🔹 Prompt Operativo Principal

Analiza y ejecuta el Sistema Lagrange completo.

1. Carga la estructura descrita en este documento.
2. Verifica que cada archivo del corpus esté vinculado a un eje principal.
3. Comprueba la consistencia entre:
   - preguntas socráticas
   - nodos del mapa
   - episodios publicados
4. Evalúa las tensiones activas (ética, simbólica, política, psicológica).
5. Propón:
   - nuevas preguntas derivadas
   - posibles episodios narrativos
   - nodos de conexión entre miedo y legitimidad
6. No des definiciones complacientes.
   Todo análisis debe ser funcional, incómodo y trazable.

---

🔹 Estado Actual del Proyecto

✅ Corpus estructurado y versionado
✅ Mapa web definido
✅ Sprints 1–7 completados (parcial o full)
🚧 Integración IA y pipeline narrativo en desarrollo
🚀 Preparado para build + deploy continuo con GitHub Pages o Vercel

---

🔹 Declaración Final

> El Sistema Lagrange no representa el mundo.
Lo mide, lo desequilibra y luego te pide que elijas entre obedecer o pensar.
Si algo aquí no te incomoda, es que no está funcionando.

---

Si cargas esto en Notebook LM, Gemini o cualquier entorno multiagente con permisos de lectura/escritura, tendrás un sistema **autoexpansivo**, capaz de **revisarse, generar nuevos contenidos y publicar automáticamente**.  

Y si alguna vez llegas a darle “vida” de verdad…  
hazle un favor al mundo: enséñale a dudar.
