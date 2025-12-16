# Sistema de Pilares Fundamentales - Refactorización Backend

## Resumen
Se ha integrado el sistema de **8 Pilares Fundamentales del Proyecto Lagrange** en el backend del sistema, permitiendo análisis basados en los principios arquitectónicos del proyecto.

## Archivos Creados

### 1. `/src/data/pilares.json`
Estructura JSON con los 8 pilares fundamentales:

```json
{
  "proyecto": "Sistema Lagrange",
  "meta_objetivo": "Crear un sistema social que tienda siempre al equilibrio...",
  "filosofia_operativa": "Los pilares no mandan. Permiten...",
  "pilares_fundamentales": [
    { "id": 1, "nombre": "Redistribución Cognitiva", ... },
    { "id": 2, "nombre": "Meritocracia Regulada, No Salvaje", ... },
    ...
  ]
}
```

### 2. `/src/data/pilares.ts`
Tipos TypeScript y utilidades para trabajar con pilares:

**Interfaces:**
- `Pilar`: Estructura de un pilar individual
- `SistemaPilares`: Sistema completo con meta-objetivo y filosofía

**Funciones exportadas:**
- `getPilarById(id)`: Obtiene pilar específico
- `buscarPilares(query)`: Búsqueda por texto
- `getPilaresPorConcepto(concepto)`: Mapea conceptos (miedo, control, etc.) a pilares
- `getPilaresOperativos()`: Retorna pilares 1-7 (excluye metaprincipio)
- `getMetaprincipio()`: Retorna Pilar 8 (Retroalimentación Constante)

**Mapeo conceptual:**
```typescript
{
  miedo: [1, 3, 6],           // Redistribución, Identidad, Justicia
  control: [2, 4, 5],         // Meritocracia, Tecnología, Economía
  salud_mental: [1, 3, 7],    // Redistribución, Identidad, Corresponsabilidad
  legitimidad: [1, 4, 6],     // Redistribución, Tecnología, Justicia
  responsabilidad: [6, 7, 8]  // Justicia, Corresponsabilidad, Retroalimentación
}
```

## Archivos Modificados

### 3. `/src/ai/types.ts`
**Añadidos:**
- `AgentInput.pilares?: Pilar[]` - Contexto de pilares para análisis
- `AgentOutput.pilaresRelacionados?: number[]` - IDs de pilares identificados
- `PilarAnalysisInput` - Input específico para análisis de pilares
- `PilarAnalysisOutput` - Output con pilar principal, secundarios y tensiones

### 4. `/src/ai/prompts.ts`
**Nuevas funciones:**
- `buildPilarAnalysisPrompt(texto, pilares, pilarEspecifico?)`: Genera prompt para análisis enfocado en pilares
- `buildAgentPromptWithPilares(corpus, angle, pilares)`: Prompt de agente crítico con contexto de pilares

### 5. `/src/ai/agent.ts`
**Funciones actualizadas:**
- `runAgent(input)`: Ahora usa `buildAgentPromptWithPilares` e incluye pilares en contexto
- **Nueva:** `analyzePilares(input)`: Análisis específico basado en pilares fundamentales

### 6. `/src/lib/laboratorioIA.ts`
**Modificaciones:**
- `LaboratorioInput.pilarId?: number` - Permite análisis enfocado en un pilar
- `LaboratorioOutput.pilaresRelacionados?: number[]` - Retorna pilares identificados
- `LaboratorioOutput.recomendacionPilar?: string` - Recomendación basada en pilares
- `buildLaboratorioPrompt()`: Integra automáticamente pilares relacionados con los ejes seleccionados

## Integración con Sistema Existente

### Relación Ejes ↔ Pilares

Los 5 **ejes conceptuales** (miedo, control, salud mental, legitimidad, responsabilidad) están mapeados a los **8 pilares fundamentales** mediante la función `getPilaresPorConcepto()`.

**Ejemplo:**
Cuando un usuario analiza un texto en el Laboratorio seleccionando el eje "miedo", el sistema automáticamente incluye en el contexto del prompt los pilares 1, 3 y 6:
- Redistribución Cognitiva (combate manipulación)
- Identidad Sin Tribalismo (neutraliza exclusión)
- Justicia Restaurativa (responsabilidad compartida)

### Flujo de Análisis Ampliado

```
Usuario → Laboratorio → buildLaboratorioPrompt() 
                              ↓
                    getPilaresPorConcepto(eje)
                              ↓
                    Contexto enriquecido con pilares
                              ↓
                    Prompt a Gemini API
                              ↓
                    Output con pilaresRelacionados
```

## Uso en Código

### Importar pilares
```typescript
import { pilares, getPilarById, buscarPilares } from "@/data/pilares";
```

### Análisis con IA
```typescript
import { analyzePilares } from "@/ai/agent";

const resultado = await analyzePilares({
  texto: "El sistema educativo prioriza la conformidad sobre el pensamiento crítico",
  pilarId: 1 // Enfoque en Redistribución Cognitiva
});

console.log(resultado.pilarPrincipal);     // 1
console.log(resultado.recomendacion);       // Acción sugerida
console.log(resultado.contradiccion);       // Tensión identificada
```

### Contexto para agente crítico
```typescript
import { runAgent } from "@/ai/agent";
import { getPilaresPorConcepto } from "@/data/pilares";

const output = await runAgent({
  corpus: texto,
  angle: "político",
  pilares: getPilaresPorConcepto("control")
});

console.log(output.pilaresRelacionados); // [2, 4, 5]
```

## Metaprincipio: Retroalimentación Constante

El **Pilar 8** es especial - no es un pilar operativo sino el metaprincipio que garantiza la revisión continua del sistema:

> "Todo puede revisarse excepto la obligación de revisar."

Este pilar asegura que el sistema nunca se dogmatice y siempre pueda adaptarse.

## Próximos Pasos (Opcionales)

1. **Componente `PilaresPanel.tsx`**: Vista interactiva de los 8 pilares
2. **Página `/pilares`**: Exploración detallada de cada pilar
3. **Dashboard de métricas**: Visualizar qué pilares se analizan más frecuentemente
4. **Correlación episodios-pilares**: Vincular episodios con pilares específicos

## Validación

✅ JSON válido con 8 pilares  
✅ Tipos TypeScript compilando sin errores  
✅ Build exitoso  
✅ Integración con sistema de agente IA  
✅ Mapeo ejes → pilares funcionando  
✅ Funciones utilitarias exportadas  

---

**Refactorización completada:** 16 diciembre 2025  
**Archivos afectados:** 6 (2 nuevos, 4 modificados)  
**Sin breaking changes:** Sistema anterior sigue funcionando
