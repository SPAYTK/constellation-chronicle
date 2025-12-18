# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
**Use GitHub Codespaces**

- Navigate to the main page of your repository.
## What technologies are used for this project?

This project is built with:

- Vite
## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)


# Lagrange en Llamas

Sistema narrativo interactivo, modular y extensible, gobernado por corpus crítico estructurado.

## Estructura
- SPA como grafo navegable (no menú lineal)
- Podcast, Mapa Lagrange, Capítulos, Laboratorio IA, Auth
- Separación clara entre corpus, narrativa, presentación y automatización

## Scripts
- sync-episodes.cjs: sincroniza episodios
- generate-script.ipynb: generación de guiones con IA
- text-to-audio.js: conversión texto a audio
- deploy.sh: despliegue automatizado

## Control de calidad
- Toda entrada revisada por humano antes de publicación
- IA solo como asistente, nunca publicador automático

## Prompt Maestro Rector
Ver src/control/prompt_maestro.ts
