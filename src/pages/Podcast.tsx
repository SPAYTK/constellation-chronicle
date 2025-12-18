import { Navigation } from "@/components/Navigation";
import { EpisodeCard } from "@/components/EpisodeCard";
import { EpisodeMarkdown } from "@/components/EpisodeMarkdown";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
import { useEpisodes, useSearch } from "@/hooks/useData";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/utils";

export default function Podcast() {
  const navigate = useNavigate();
  const { episodes, loading: episodesLoading, error: episodesError } = useEpisodes();
  const { results: searchResults, loading: searchLoading, search } = useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEje, setSelectedEje] = useState<string | null>(null);

  // Filter episodes based on search
  const displayedEpisodes = searchQuery 
    ? searchResults 
    : episodes;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      search(query);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Podcast
            </h1>
            <p className="text-lg text-muted-foreground">
              Temporada 1 — 52 episodios que trazan el mapa del pensamiento a través de diálogos socráticos y reflexiones sobre la condición humana.
            </p>
          </div>

          {/* Search */}
          <div className="mb-8 relative max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar episodios..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
            {searchLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Loading / Error States */}
          {episodesLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Cargando episodios...</span>
            </div>
          ) : episodesError ? (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
              <p className="text-destructive font-semibold">Error al cargar episodios</p>
              <p className="text-sm text-destructive/80">{episodesError.message}</p>
            </div>
          ) : displayedEpisodes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-2">No se encontraron episodios</p>
              {searchQuery && (
                <p className="text-sm text-muted-foreground/60">
                  Intenta con otra búsqueda
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Episodes Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {displayedEpisodes.map((episode) => (
                  <EpisodeCard 
                    key={episode.id} 
                    episode={episode} 
                    onClick={() => navigate(`/podcast/${episode.slug}`)} 
                  />
                ))}
              </div>

              {/* Pagination Info */}
              <div className="text-center text-sm text-muted-foreground py-8 border-t border-border/50">
                Mostrando {displayedEpisodes.length} episodio{displayedEpisodes.length !== 1 ? 's' : ''}
              </div>
            </>
          )}

          {/* Coming Soon */}
          {!searchQuery && (
            <div className="mt-12 text-center py-12 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">
                Más episodios próximamente...
              </p>
              <p className="text-sm text-muted-foreground/60 mt-2">
                52 espinas narrativas por explorar
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
