import { useState, useMemo } from "react";
import { chapters, lagrangeAxes, type Chapter } from "@/data/chapters";

interface Node {
  id: number;
  x: number;
  y: number;
  chapter: Chapter;
  axisId: string;
}

interface Connection {
  from: number;
  to: number;
  axisId: string;
}

export function LagrangeMap() {
  const [activeAxis, setActiveAxis] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const { nodes, connections } = useMemo(() => {
    const nodePositions: Node[] = [];
    const lineConnections: Connection[] = [];
    
    // Create constellation layout
    const centerX = 400;
    const centerY = 300;
    const radius = 220;
    
    chapters.forEach((chapter, index) => {
      const angle = (index / chapters.length) * 2 * Math.PI - Math.PI / 2;
      const jitter = Math.sin(index * 1.5) * 30;
      
      nodePositions.push({
        id: chapter.id,
        x: centerX + Math.cos(angle) * (radius + jitter),
        y: centerY + Math.sin(angle) * (radius + jitter),
        chapter,
        axisId: chapter.axis,
      });
    });

    // Create connections within axes
    lagrangeAxes.forEach((axis) => {
      const axisChapters = axis.chapters.sort((a, b) => a - b);
      for (let i = 0; i < axisChapters.length - 1; i++) {
        lineConnections.push({
          from: axisChapters[i],
          to: axisChapters[i + 1],
          axisId: axis.id,
        });
      }
    });

    return { nodes: nodePositions, connections: lineConnections };
  }, []);

  const getNodeById = (id: number) => nodes.find((n) => n.id === id);

  return (
    <div className="relative w-full aspect-[4/3] max-w-4xl mx-auto">
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 max-w-xs">
        <h4 className="font-display text-sm font-semibold mb-3 text-primary">Ejes Narrativos</h4>
        <div className="space-y-2">
          {lagrangeAxes.map((axis) => (
            <button
              key={axis.id}
              className={`flex items-center gap-2 text-xs w-full text-left transition-all p-1.5 rounded ${
                activeAxis === axis.id 
                  ? "bg-primary/20 text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onMouseEnter={() => setActiveAxis(axis.id)}
              onMouseLeave={() => setActiveAxis(null)}
            >
              <span 
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: axis.color }}
              />
              <span className="truncate">{axis.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SVG Map */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 20px rgba(0,0,0,0.5))" }}
      >
        {/* Background glow */}
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(38, 92%, 50%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(38, 92%, 50%)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connections */}
        <g className="connections">
          {connections.map((conn, idx) => {
            const fromNode = getNodeById(conn.from);
            const toNode = getNodeById(conn.to);
            if (!fromNode || !toNode) return null;
            
            const axis = lagrangeAxes.find((a) => a.id === conn.axisId);
            const isActive = activeAxis === conn.axisId || !activeAxis;
            
            return (
              <line
                key={idx}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={axis?.color || "hsl(38, 60%, 35%)"}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 0.6 : 0.15}
                className="transition-all duration-300"
                filter={isActive ? "url(#glow)" : undefined}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g className="nodes">
          {nodes.map((node) => {
            const axis = lagrangeAxes.find((a) => a.id === node.axisId);
            const isActive = activeAxis === node.axisId || !activeAxis;
            const isHovered = hoveredNode === node.id;
            
            return (
              <g
                key={node.id}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  opacity: isActive ? 1 : 0.3,
                  transform: isHovered ? "scale(1.2)" : "scale(1)",
                  transformOrigin: `${node.x}px ${node.y}px`,
                }}
              >
                {/* Glow circle */}
                {isHovered && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={25}
                    fill="url(#nodeGlow)"
                    className="animate-pulse-slow"
                  />
                )}
                
                {/* Main node */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 12 : 8}
                  fill={axis?.color || "hsl(38, 92%, 50%)"}
                  stroke="hsl(222, 47%, 5%)"
                  strokeWidth={2}
                  filter="url(#glow)"
                  className="transition-all duration-200"
                />
                
                {/* Node number */}
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="hsl(222, 47%, 5%)"
                  fontSize={isHovered ? "8" : "6"}
                  fontWeight="bold"
                  fontFamily="var(--font-display)"
                  className="pointer-events-none"
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredNode && (
        <div 
          className="absolute z-20 bg-card border border-primary/40 rounded-lg p-3 shadow-lg max-w-xs pointer-events-none animate-scale-in"
          style={{
            left: `${(getNodeById(hoveredNode)?.x || 0) / 8 + 5}%`,
            top: `${(getNodeById(hoveredNode)?.y || 0) / 6}%`,
          }}
        >
          <p className="text-xs text-primary uppercase tracking-wider mb-1">
            {getNodeById(hoveredNode)?.chapter.lagrangeTag}
          </p>
          <h4 className="font-display font-semibold text-sm">
            {getNodeById(hoveredNode)?.chapter.title}
          </h4>
        </div>
      )}
    </div>
  );
}
