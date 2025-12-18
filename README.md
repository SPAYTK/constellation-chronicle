# Sistema Lagrange 🌌

Un podcast filosófico que explora 52 puntos de equilibrio entre el miedo y la conciencia a través de diálogos socráticos. Una arquitectura conceptual de la crítica sistémica, visualizada como una constelación interactiva.

## 📖 Visión

El Sistema Lagrange es una plataforma que examina cómo los sistemas de poder utilizar mecanismos biológicos y psicológicos para mantener el control. A través de 18 episodios de podcast (en expansión hacia 52), explora temas como:

- **Miedo → Control → Legitimidad**: El ciclo del miedo como instrumento de control
- **Culpa → Obediencia → Repetición**: Cómo la culpa genera patrones repetitivos
- **Tecnología → Vigilancia → Fe en el sistema**: La tecnología como amplificador de control
- **Fatiga → Delegación → Alienación**: La erosión de la capacidad moral
- **Conciencia → Rebelión → Silencio**: El despertar y su supresión

## 🏗️ Arquitectura Fullstack

```
┌─────────────────────────────────────────────────────┐
│         Frontend (React + TypeScript + Vite)        │
│   - 6 páginas principales (Home, Podcast, Mapa...)  │
│   - Componentes interactivos (MapNode, Audio...)    │
│   - Hooks de datos (useEpisodes, useChapters...)    │
└──────────────────┬──────────────────────────────────┘
                   │ API REST / RLS Policies
┌──────────────────▼──────────────────────────────────┐
│      Backend (Supabase + PostgreSQL)                │
│   - Authentication (JWT + roles)                    │
│   - Episodes, Chapters, Questions                   │
│   - Map data (nodes, connections)                   │
│   - Audio file storage (Storage API)                │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│   Database (PostgreSQL) + Storage (S3-compatible)   │
└─────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

```bash
# Clone and install
git clone <YOUR_GIT_URL>
cd constellation-chronicle
npm install

# Environment variables
cp .env.example .env  # Already configured with Supabase

# Run dev server
npm run dev

# Deploy Supabase migrations
supabase db push
```

## 📁 Estructura del Proyecto

```
src/
├── pages/                    # 6 páginas principales
│   ├── Home.tsx             # Página de inicio
│   ├── Podcast.tsx          # Lista de episodios
│   ├── Episode.tsx          # Detalle de episodio
│   ├── Chapters.tsx         # Capítulos
│   ├── ChapterDetail.tsx    # Detalle de capítulo
│   ├── LagrangeMap.tsx      # Mapa interactivo
│   └── Laboratory.tsx       # Laboratorio de análisis
├── components/              # Componentes React
│   ├── LagrangeMap.tsx      # Mapa SVG interactivo
│   ├── MapNode.tsx          # Nodos del mapa
│   ├── AudioPlayer.tsx      # Reproductor de audio
│   ├── Navigation.tsx       # Navegación global
│   └── ui/                  # shadcn/ui components
├── hooks/
│   ├── useData.ts           # Hooks para datos (Supabase)
│   ├── useLagrangeData.ts   # Hook para mapa Lagrange
│   └── useAuth.tsx          # Hook de autenticación
├── services/
│   ├── podcastService.ts    # Supabase queries (episodes/chapters)
│   ├── mapService.ts        # Supabase queries (map data)
│   ├── iaClient.ts          # LLM integration
│   └── authService.ts       # Authentication logic
├── data/
│   ├── corpus/              # Textos filosóficos
│   ├── podcast/             # Metadata de episodios y capítulos
│   └── lagrange/            # Datos del mapa interactivo
└── integrations/
    └── supabase/            # Supabase client config

supabase/
├── migrations/              # SQL migrations
│   ├── 20251218_initial_schema.sql
│   └── 20251218_seed_data.sql
└── config.toml

public/
└── episodes/                # Audio files (MP3/M4A)
```

## 🔧 Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime (opcional)
- **Storage**: Supabase Storage (audio files)
- **Auth**: Supabase Auth + JWT
- **State**: React Context + Hooks
- **Build**: Vite

## 📊 Base de Datos

### Tables principales:
- `episodes` - Episodios de podcast
- `chapters` - Capítulos temáticos
- `questions` - Preguntas socráticas
- `axes` - Ejes Lagrange (5)
- `map_nodes` - Nodos del mapa
- `map_connections` - Relaciones entre nodos
- `audio_files` - Metadata de archivos de audio
- `profiles` - Perfiles de usuarios

### Relaciones:
- `episode_questions` - N:M episodes ↔ questions
- `chapter_episodes` - N:M chapters ↔ episodes

## 🎯 Funcionalidades Implementadas

✅ **Frontend**
- [x] Navegación multi-página completa
- [x] Mapa interactivo (SVG) con nodos y conexiones
- [x] Reproductor de audio integrado
- [x] Flujo convergente (Podcast → Episode, Mapa → Episode, Capítulos → Episode)
- [x] Componentes reutilizables

✅ **Backend**
- [x] Schema PostgreSQL completo
- [x] RLS Policies para seguridad
- [x] Seeders con datos iniciales (18 episodios)
- [x] Índices de performance

🟡 **En Progreso**
- [ ] Actualizar pages para usar hooks `useData`
- [ ] Implementar búsqueda full-text
- [ ] Configurar audio storage
- [ ] Sistema de autenticación completo

⏳ **Próximo**
- [ ] E2E tests
- [ ] CI/CD pipeline
- [ ] Deploy a producción
- [ ] LLM integration para análisis automático

## 🔐 Seguridad

- RLS Policies en todas las tablas públicas
- JWT para autenticación
- Roles: user, editor, admin
- CORS configurado para Supabase

## 📈 Próximos Pasos

1. **Ejecutar migrations** en Supabase:
   ```bash
   supabase link --project-ref cadavbabblukuabioekc
   supabase db push
   ```

2. **Actualizar componentes** para usar `useData` hooks en lugar de datos locales

3. **Implementar búsqueda** con full-text search de PostgreSQL

4. **Configurar audio storage** y streaming

5. **Testing E2E** con Playwright

6. **Deploy** a Vercel

## 🤝 Contribuir

El proyecto está en desarrollo activo. Las areas principales para contribución:

- Migración completa a Supabase (en curso)
- Tests automatizados
- Optimizaciones de performance
- Documentación adicional

## 📝 Notas Técnicas

### Mapa Lagrange
- 52 nodos (preguntas socráticas)
- Posicionadas en SVG viewport
- Conexiones dinámicas basadas en relaciones
- Click en nodo → navega a episodio asociado

### Flujo de Datos
```
Supabase ← (SELECT queries via hooks)
   ↓
React Hooks (useEpisodes, useChapterBySlug...)
   ↓
Estado local en componentes
   ↓
UI actualizada
```

### Autenticación
- JWT tokens de Supabase
- Roles: user (default), editor (CUD), admin
- Protección de rutas sensibles (editor dashboard)

## 🌍 Deployment

### Verificación pre-deploy:
```bash
npm run build
npm run preview
```

### Deploy a Vercel:
```bash
vercel deploy --prod
```

---

**Última actualización**: 2025-12-18  
**Status**: MVP arquitectura complete, data layer en transición a Supabase
