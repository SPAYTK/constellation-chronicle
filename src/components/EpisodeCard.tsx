import { Play } from "lucide-react";
import { Button } from "./ui/button";
import type { Episode } from "@/hooks/useData";

interface EpisodeCardProps {
  episode: Episode | any;  // Accept Episode interface or Episode data type
  onClick?: () => void;
}

export function EpisodeCard({ episode, onClick }: EpisodeCardProps) {
  // Format duration if it exists
  const duration = episode.duration || "00:00";
  const season = episode.season || 1;
  const episodeNumber = episode.id?.toString().padStart(2, "0") || "01";
  
  return (
    <article 
      className="group bg-card border border-border rounded-lg p-5 hover:border-primary/30 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30 group-hover:border-primary/50 transition-colors shrink-0">
          <span className="font-display text-lg text-primary font-bold">
            {episodeNumber}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Temporada {season}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              {duration}
            </span>
          </div>
          
          <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
            {episode.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {episode.description || episode.summary || "Sin descripción disponible"}
          </p>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-primary"
        >
          <Play className="h-5 w-5" />
        </Button>
      </div>
    </article>
  );
}
