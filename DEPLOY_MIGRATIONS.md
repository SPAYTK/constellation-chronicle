# 📋 Instrucciones para Deploy de Migrations a Supabase

## Opción 1: Dashboard de Supabase (Recomendado)

1. **Abre el Dashboard:**
   - Ve a [https://app.supabase.com](https://app.supabase.com)
   - Selecciona proyecto: `cadavbabblukuabioekc`
   - Click en "SQL Editor" (izquierda)

2. **Ejecuta la primera migration (Schema):**
   - Click "New Query"
   - Copia el contenido completo de `/supabase/migrations/20251218_initial_schema.sql`
   - Pega en el editor
   - Click "RUN"
   - Espera a que se complete (creará 13 tablas)

3. **Ejecuta la segunda migration (Seed Data):**
   - Click "New Query"
   - Copia el contenido completo de `/supabase/migrations/20251218_seed_data.sql`
   - Pega en el editor
   - Click "RUN"
   - Espera a que se complete (insertará 18 episodios, 5 axes, 18 questions)

4. **Verifica en "Table Editor":**
   - Debajo de "SQL Editor", ves "Table Editor"
   - Selecciona tabla `episodes` → debería haber 18 registros
   - Selecciona tabla `axes` → debería haber 5 registros
   - Selecciona tabla `questions` → debería haber 18 registros

## Opción 2: CLI (si tienes Supabase CLI instalado)

```bash
# En la raíz del proyecto
cd /workspaces/constellation-chronicle

# Link al proyecto Supabase
supabase link --project-ref cadavbabblukuabioekc

# Push migrations
supabase db push

# Verifica el status
supabase migration list
```

## Opción 3: Conexión Directa via psql

```bash
# Obtén la connection string del dashboard:
# Dashboard → Project Settings → Database → Connection string (psql)

# Reemplaza con tu connection string:
psql "postgresql://postgres:[password]@[host]:[port]/postgres" < supabase/migrations/20251218_initial_schema.sql
psql "postgresql://postgres:[password]@[host]:[port]/postgres" < supabase/migrations/20251218_seed_data.sql
```

---

## ✅ Validación Post-Deploy

Después de ejecutar las migrations, valida que todo funcione:

```bash
# 1. Verifica que las tablas existan
# En Dashboard → SQL Editor, ejecuta:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

# 2. Verifica datos
SELECT COUNT(*) FROM episodes;        -- Debería: 18
SELECT COUNT(*) FROM axes;             -- Debería: 5
SELECT COUNT(*) FROM questions;        -- Debería: 18
SELECT COUNT(*) FROM chapters;         -- Debería: 5

# 3. Verifica RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

---

## 🐛 Troubleshooting

### Error: "permission denied"
- Asegúrate de que usas un usuario con permisos SUPERUSER o OWNER
- En Supabase, usa la contraseña del usuario `postgres`

### Error: "relation already exists"
- Las migrations ya fueron ejecutadas previamente
- No es un error, solo significa que el schema ya está

### Error: "RLS policy not found"
- Ejecuta la migration de schema ANTES que la de seed data
- El schema debe existir para poder insertar datos

---

## 📊 Estructura de Datos Creada

```
┌─────────────────────────────┐
│      PUBLIC TABLES          │
├─────────────────────────────┤
│ ✓ profiles                  │
│ ✓ axes (5 filas)            │
│ ✓ questions (18 filas)      │
│ ✓ episodes (18 filas)       │
│ ✓ chapters (5 filas)        │
│ ✓ map_nodes (52 filas)      │
│ ✓ map_connections           │
│ ✓ episode_questions         │
│ ✓ chapter_episodes          │
│ ✓ audio_files               │
│ ✓ search_index              │
└─────────────────────────────┘
```

---

## 🔐 RLS Policies Habilitadas

- `episodes` → READ público, WRITE solo editores
- `chapters` → READ público, WRITE solo editores
- `questions` → READ público, WRITE solo editores
- `axes` → READ público, WRITE solo editores
- `map_nodes` → READ público, WRITE solo editores
- `audio_files` → READ público, WRITE solo editores

---

## Próximo Paso

Una vez completadas las migrations:

1. Actualiza `.env.local` con credenciales Supabase (si no existen)
2. Ejecuta `npm run dev` en el terminal
3. Las páginas comenzarán a conectarse a la base de datos
4. Continúa con el paso 7 del plan: "Actualizar pages para useData hooks"

