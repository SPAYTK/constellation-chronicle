import { Navigation } from "@/components/Navigation";
import { ChapterCard } from "@/components/ChapterCard";
import { useChapters } from "@/hooks/useData";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/utils";

export default function Capitulos() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { chapters, loading, error } = useChapters();

  // Get unique axes from chapters
  const uniqueAxes = Array.from(
    new Map(chapters.map(c => [c.axis, { id: c.axis, name: c.axis }])).values()
  );

  const filteredChapters = activeFilter
    ? chapters.filter((c) => c.axis === activeFilter)
    : chapters;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Los 52 Capítulos
            </h1>
            <p className="text-lg text-muted-foreground">
              Cada espina narrativa contiene un resumen, un fragmento de diálogo socrático 
              y su conexión con el mapa conceptual del Sistema Lagrange.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveFilter(null)}
              className={cn(
                "px-4 py-2 rounded-full text-sm transition-all border",
                !activeFilter
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
              )}
            >
              Todos
            </button>
            {uniqueAxes.map((axis) => (
              <button
                key={axis.id}
                onClick={() => setActiveFilter(axis.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm transition-all border",
                  activeFilter === axis.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
                )}
              >
                {axis.name}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Cargando capítulos...</span>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
              <p className="text-destructive font-semibold">Error al cargar capítulos</p>
              <p className="text-sm text-destructive/80">{error.message}</p>
            </div>
          ) : (
            <>
              {/* Chapters Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredChapters.map((chapter, index) => (
                  <div
                    key={chapter.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ChapterCard chapter={chapter} />
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredChapters.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No hay capítulos para este eje.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {filteredChapters.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                No hay capítulos en este eje todavía.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
