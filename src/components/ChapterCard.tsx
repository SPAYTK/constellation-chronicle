import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Chapter } from "@/data/chapters";

interface ChapterCardProps {
  chapter: Chapter;
}

export function ChapterCard({ chapter }: ChapterCardProps) {
  return (
    <Link to={`/capitulos/${chapter.slug}`}>
      <article className="group relative bg-card border border-border rounded-lg p-6 hover:border-primary/40 transition-all duration-300 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40 group-hover:border-primary node-glow transition-all">
                <span className="font-display text-sm text-primary font-bold">
                  {chapter.id.toString().padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs text-primary/80 uppercase tracking-wider font-medium">
                {chapter.lagrangeTag}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
          
          {/* Title */}
          <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
            {chapter.title}
          </h3>
          
          {/* Summary */}
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {chapter.summary}
          </p>
          
          {/* Dialogue preview */}
          {chapter.dialogue && (
            <div className="border-l-2 border-primary/30 pl-4 py-2 bg-secondary/30 rounded-r">
              <p className="text-xs text-foreground/80 italic line-clamp-2">
                {chapter.dialogue.split('\n')[0]}
              </p>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
