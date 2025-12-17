# Estructura de carpetas y archivos según Prompt Maestro Rector

src/
├── pages/ (vistas principales)
├── components/ (componentes reutilizables)
├── data/ (corpus, episodios, capítulos, mapa, ejes)
├── services/ (lógica de negocio y conexión externa)
├── control/ (matrices narrativas, protocolos de calidad)
├── styles/
├── utils/
└── main.tsx

scripts/
├── sync-episodes.cjs
├── generate-script.ipynb
├── text-to-audio.js
└── deploy.sh

Toda nueva funcionalidad debe ubicarse en la carpeta correspondiente y respetar la modularidad.