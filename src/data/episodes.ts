/**
 * episodes.ts
 * Utilidades para consumir episodes.json (fuente única de verdad).
 *
 * - No definir episodios aquí, solo consumir y tipar.
 * - episodes.json debe ser versionado y alineado con episodeStructurePrompt.ts.
 * - Los guiones markdown deben existir en public/episodes/ y ser referenciados por episodes.json.
 */
import episodesJson from './episodes.json';

export interface Episode {
  id: string;
  titulo: string;
  pregunta_base: string;
  eje: string;
  angulo: string;
  guion_md: string;
  audio: string | null;
  estado: 'borrador' | 'publicado';
}

export const episodes: Episode[] = episodesJson as Episode[];

export const getEpisodesByEstado = (estado: 'borrador' | 'publicado'): Episode[] =>
  episodes.filter(e => e.estado === estado);

export const getLatestEpisodes = (count: number = 3): Episode[] => {
  return episodes.slice(0, count);
};
