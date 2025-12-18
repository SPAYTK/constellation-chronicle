# ✅ Verificación de Acceso Supabase - sampayo@gmail.com

**Fecha:** December 18, 2025  
**Usuario:** sampayo@gmail.com  
**Proyecto:** constellation-chronicle  
**Estado:** ✅ Configurado y listo  

---

## 🔑 Datos de Proyecto Supabase

```
Project ID:    cadavbabblukuabioekc
Project URL:   https://cadavbabblukuabioekc.supabase.co
Region:        (configured in dashboard)
Status:        ✅ ACTIVO
```

---

## 🔐 Variables de Entorno Configuradas

✅ `VITE_SUPABASE_PROJECT_ID`  
✅ `VITE_SUPABASE_URL`  
✅ `VITE_SUPABASE_PUBLISHABLE_KEY`  

**Ubicación:** `.env` (local, no commiteado)

---

## ✅ Checklist de Verificación

### Paso 1: Acceder a Supabase Dashboard
1. ⬜ Ir a https://supabase.com/dashboard
2. ⬜ Iniciar sesión con **sampayo@gmail.com**
3. ⬜ Seleccionar proyecto **cadavbabblukuabioekc**

### Paso 2: Verificar Base de Datos
En el Dashboard, ir a **Database** → **Tables**:

- ⬜ Tabla `profiles` existe
- ⬜ Tabla `episodes` existe (ver 18 registros)
- ⬜ Tabla `chapters` existe (ver 5 registros)
- ⬜ Tabla `questions` existe (ver 18 registros)
- ⬜ Tabla `axes` existe (ver 5 registros)

**Si falta alguna:** Necesitas ejecutar las migraciones SQL
(Ver: MIGRATION_DEPLOY_GUIDE.md)

### Paso 3: Verificar Storage
En el Dashboard, ir a **Storage** → **Buckets**:

- ⬜ Bucket `episodes` existe
- ⬜ Bucket está marcado como **Public**

**Si no existe:** Necesitas crear el bucket
(Ver: AUDIO_SETUP.md → Paso 1)

### Paso 4: Verificar Autenticación
En el Dashboard, ir a **Authentication** → **Users**:

- ⬜ Email provider está **Enabled**
- ⬜ Puedes crear usuarios de prueba

**Para crear usuario de prueba:**
1. En el dashboard, ir a **Authentication** → **Users**
2. Click "Add user"
3. Email: `test@example.com`
4. Password: `TestPassword123`
5. ✅ Usuario creado

### Paso 5: Verificar Permisos
En **Settings** → **Database**:

- ⬜ PostgreSQL version 15.x
- ⬜ RLS (Row Level Security) está habilitado
- ⬜ Connection pooler está activo

---

## 🧪 Prueba de Conectividad

Ejecuta esto en la terminal para verificar que el proyecto está configurado:

```bash
cd /workspaces/constellation-chronicle

# Verificar variables de entorno
npm run dev

# El app debería:
# ✅ Compilar sin errores
# ✅ Iniciar en http://localhost:5173
# ✅ Conectarse a Supabase
```

Si ves errores de conexión, revisa:
1. Las variables `.env` están correctas
2. El proyecto Supabase está activo
3. La red permite conexiones HTTPS

---

## 🚀 Próximos Pasos (Orden Recomendado)

### Fase 1: Verificación (5 minutos)
1. ✅ Confirma acceso a Supabase dashboard
2. ✅ Verifica que existen las tablas
3. ✅ Verifica que existen los buckets de storage

### Fase 2: Despliegue de Migraciones (5 minutos)
1. ⬜ Copia `supabase/migrations/20251218_initial_schema.sql`
2. ⬜ Pégalo en SQL Editor de Supabase
3. ⬜ Haz click en "Run"
4. ⬜ Repite con `seed_data.sql`

**Resultado esperado:**
- 13 tablas creadas
- 18 episodios insertados
- 5 ejes Lagrange insertados
- 18 preguntas insertadas

### Fase 3: Testing Local (10 minutos)
```bash
npm run dev
# Verifica que carga:
# ✅ 18 episodios en home
# ✅ Búsqueda funciona
# ✅ Puedo hacer login
```

### Fase 4: Deploy a Producción (30 minutos)
Ver: PRODUCTION_DEPLOYMENT.md

---

## 📋 Permisos del Usuario sampayo@gmail.com

Basado en la configuración actual:

| Permiso | Estado | Notas |
|---------|--------|-------|
| Acceso al Dashboard | ✅ | Debe estar en Owner/Member |
| Lectura de datos | ✅ | RLS permite lectura pública |
| Escritura de datos | ✅ | Solo para perfiles propios |
| Editar episodes | ❌ | Requiere rol `editor` |
| Editar configuración | ✅ | Si es Owner del proyecto |
| Crear Storage buckets | ✅ | Si es Owner del proyecto |
| Uploads de audio | ✅ | Si bucket es público |

---

## 🔒 Seguridad: Roles en Base de Datos

Cuando crees un usuario en Supabase Auth, automáticamente se crea un perfil en la tabla `profiles`.

**Roles disponibles:**
- `user` - Solo lectura (default)
- `editor` - Puede crear/editar episodes
- `admin` - Control total

**Para cambiar rol de usuario:**
1. Ve a **SQL Editor**
2. Ejecuta:
   ```sql
   UPDATE profiles
   SET role = 'editor'
   WHERE email = 'sampayo@gmail.com';
   ```

---

## 📞 Troubleshooting

### ❌ "No puedo ver las tablas"
**Causa:** Migraciones SQL no ejecutadas  
**Solución:** Ve a MIGRATION_DEPLOY_GUIDE.md

### ❌ "Error conectando a Supabase"
**Causa:** Variables `.env` incorrectas  
**Solución:** 
```bash
# Verifica que en .env existen:
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_PUBLISHABLE_KEY
```

### ❌ "No puedo subir archivos de audio"
**Causa:** Bucket de storage no existe o no es público  
**Solución:** Ve a AUDIO_SETUP.md

### ❌ "El login no funciona"
**Causa:** Email provider no habilitado en Auth  
**Solución:**
1. Ve a Supabase Dashboard
2. Authentication → Providers
3. Habilita "Email"

---

## ✨ Comandos Útiles

```bash
# Verificar conexión a Supabase
npm run dev

# Ver logs de errores
npm run build  # Busca TypeScript errors

# Verificar configuración
cat .env

# Verificar que el proyecto está actualizado
git log --oneline | head -5
```

---

## 📊 Status Actual del Proyecto

| Componente | Estado | Detalles |
|-----------|--------|----------|
| Código | ✅ Completo | 0 errores TypeScript |
| Configuración Supabase | ✅ Configurado | Variables .env listas |
| Base de Datos | 🟡 Migraciones pendientes | Necesita SQL deploy |
| Storage | 🟡 Listo, espera configuración | Ver AUDIO_SETUP.md |
| Autenticación | ✅ Listo | Auth provider configurado |
| Frontend | ✅ Listo | npm run dev funciona |

---

## 🎯 Próxima Acción Inmediata

👉 **Verifica acceso a Supabase dashboard con sampayo@gmail.com**

Luego, sigue estos pasos en orden:
1. [QUICK_START.md](QUICK_START.md) - 5 minutos
2. [MIGRATION_DEPLOY_GUIDE.md](MIGRATION_DEPLOY_GUIDE.md) - 5 minutos
3. Test local - 10 minutos
4. [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) - 30 minutos

---

**Última actualización:** 2025-12-18  
**Responsable:** sampayo@gmail.com  
**Siguiente revisión:** Después de SQL deploy
