// Hooks para manejo de datos desde Supabase
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Episode {
  id: number;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  duration?: string;
  published_at?: string;
  season?: number;
  audio_url?: string;
}

export interface Chapter {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  theory?: string;
  dialogue?: string;
  axis?: string;
  axis_id?: string;
}

// Hook para obtener episodes
export function useEpisodes() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEpisodes() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('episodes')
          .select('*')
          .order('published_at', { ascending: false });

        if (fetchError) throw fetchError;
        setEpisodes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchEpisodes();
  }, []);

  return { episodes, loading, error };
}

// Hook para obtener un episode por slug
export function useEpisodeBySlug(slug: string | undefined) {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    async function fetchEpisode() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('episodes')
          .select('*')
          .eq('slug', slug)
          .single();

        if (fetchError) throw fetchError;
        setEpisode(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchEpisode();
  }, [slug]);

  return { episode, loading, error };
}

// Hook para obtener chapters
export function useChapters() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchChapters() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('chapters')
          .select('*')
          .order('id', { ascending: true });

        if (fetchError) throw fetchError;
        setChapters(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchChapters();
  }, []);

  return { chapters, loading, error };
}

// Hook para obtener un chapter por slug
export function useChapterBySlug(slug: string | undefined) {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    async function fetchChapter() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('chapters')
          .select('*')
          .eq('slug', slug)
          .single();

        if (fetchError) throw fetchError;
        setChapter(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchChapter();
  }, [slug]);

  return { chapter, loading, error };
}

// Hook para búsqueda
export function useSearch(query: string) {
  const [results, setResults] = useState<{ episodes: Episode[]; chapters: Chapter[] }>({
    episodes: [],
    chapters: [],
  });
  const [loading, setLoading] = useState(false);

  const search = useCallback(async () => {
    if (!query) {
      setResults({ episodes: [], chapters: [] });
      return;
    }

    try {
      setLoading(true);
      const [episodesData, chaptersData] = await Promise.all([
        supabase
          .from('episodes')
          .select('*')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`),
        supabase
          .from('chapters')
          .select('*')
          .or(`title.ilike.%${query}%,summary.ilike.%${query}%`),
      ]);

      setResults({
        episodes: episodesData.data || [],
        chapters: chaptersData.data || [],
      });
    } catch (err) {
      console.error('Search error:', err);
      setResults({ episodes: [], chapters: [] });
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      search();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, search]);

  return { results, loading };
}