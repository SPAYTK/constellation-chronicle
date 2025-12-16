// Tipos y datos para los Pilares Fundamentales del Proyecto Lagrange

import pilaresJson from "./pilares.json";

/**
 * Estructura de un Pilar Fundamental del Sistema Lagrange
 */
export interface Pilar {
  id: number;
  nombre: string;
  principio: string;
  herramientas: string[];
  objetivo_estrategico: string;
}

/**
 * Estructura completa del sistema de pilares
 */
export interface SistemaPilares {
  proyecto: string;
  meta_objetivo: string;
  filosofia_operativa: string;
  pilares_fundamentales: Pilar[];
}

/**
 * Datos completos del sistema de pilares
 */
export const sistemaPilares: SistemaPilares = pilaresJson as SistemaPilares;

/**
 * Array de pilares fundamentales
 */
export const pilares: Pilar[] = sistemaPilares.pilares_fundamentales;

/**
 * Obtiene un pilar por su ID
 */
export const getPilarById = (id: number): Pilar | undefined => {
  return pilares.find((pilar) => pilar.id === id);
};

/**
 * Busca pilares que contengan una palabra clave en nombre, principio u objetivo
 */
export const buscarPilares = (query: string): Pilar[] => {
  const lowerQuery = query.toLowerCase();
  return pilares.filter((pilar) => {
    return (
      pilar.nombre.toLowerCase().includes(lowerQuery) ||
      pilar.principio.toLowerCase().includes(lowerQuery) ||
      pilar.objetivo_estrategico.toLowerCase().includes(lowerQuery) ||
      pilar.herramientas.some((h) => h.toLowerCase().includes(lowerQuery))
    );
  });
};

/**
 * Obtiene pilares relacionados con un concepto específico
 */
export const getPilaresPorConcepto = (concepto: string): Pilar[] => {
  const conceptosMap: Record<string, number[]> = {
    miedo: [1, 3, 6], // Redistribución Cognitiva, Identidad Sin Tribalismo, Justicia Restaurativa
    control: [2, 4, 5], // Meritocracia, Tecnología, Economía
    "salud_mental": [1, 3, 7], // Redistribución Cognitiva, Identidad, Corresponsabilidad
    legitimidad: [1, 4, 6], // Redistribución Cognitiva, Tecnología, Justicia
    responsabilidad: [6, 7, 8], // Justicia, Corresponsabilidad, Retroalimentación
  };

  const pilarIds = conceptosMap[concepto] || [];
  return pilarIds.map((id) => getPilarById(id)).filter((p): p is Pilar => p !== undefined);
};

/**
 * Obtiene todos los pilares excepto el Metaprincipio (útil para vistas separadas)
 */
export const getPilaresOperativos = (): Pilar[] => {
  return pilares.filter((p) => p.id !== 8);
};

/**
 * Obtiene el Metaprincipio (Pilar 8: Retroalimentación Constante)
 */
export const getMetaprincipio = (): Pilar | undefined => {
  return getPilarById(8);
};

/**
 * Exporta el meta-objetivo del sistema
 */
export const metaObjetivo = sistemaPilares.meta_objetivo;

/**
 * Exporta la filosofía operativa
 */
export const filosofiaOperativa = sistemaPilares.filosofia_operativa;
