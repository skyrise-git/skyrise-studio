"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import DottedMap from "dotted-map";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

export default function WorldMap({
  dots = [],
  lineColor = "#0ea5e9",
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { theme } = useTheme();

  const map = new DottedMap({ height: 100, grid: "diagonal" });

  const svgMap = map.getSVG({
    radius: 0.22,
    color: theme === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
    shape: "circle",
    backgroundColor: "transparent",
  });

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div className="w-full aspect-[2/1] bg-transparent rounded-lg relative font-code overflow-visible group/map">
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full [mask-image:radial-gradient(circle,white_75%,transparent_100%)] pointer-events-none select-none opacity-80 transition-opacity duration-700 group-hover/map:opacity-100"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0 pointer-events-none select-none"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0" />
            <stop offset="20%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="80%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          const isHovered = hoveredIndex === i;

          return (
            <g 
              key={`path-group-${i}`}
              className="pointer-events-auto cursor-crosshair"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Invisible path for better hover target */}
              <path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="transparent"
                strokeWidth="20"
              />
              
              <path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                className="opacity-20"
              />
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth={isHovered ? "2.5" : "1.2"}
                filter={isHovered ? "url(#glow)" : "none"}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  delay: 0.5 * i,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />

              {/* Start Point */}
              <g>
                <circle cx={startPoint.x} cy={startPoint.y} r="1.5" fill={lineColor} />
                <circle cx={startPoint.x} cy={startPoint.y} r="1.5" fill={lineColor} opacity="0.5">
                  <animate attributeName="r" from="1.5" to="4" dur="2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                </circle>
                {dot.start.label && (
                  <text
                    x={startPoint.x}
                    y={startPoint.y - 8}
                    textAnchor="middle"
                    fill={isHovered ? lineColor : "rgba(255,255,255,0.4)"}
                    className={cn(
                      "text-[6px] transition-all duration-300 pointer-events-none uppercase tracking-widest",
                      isHovered ? "opacity-100 translate-y-[-2px] fill-white" : "opacity-0"
                    )}
                  >
                    {dot.start.label}
                  </text>
                )}
              </g>

              {/* End Point */}
              <g>
                <circle cx={endPoint.x} cy={endPoint.y} r="1.5" fill={lineColor} />
                <circle cx={endPoint.x} cy={endPoint.y} r="1.5" fill={lineColor} opacity="0.5">
                  <animate attributeName="r" from="1.5" to="4" dur="2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                </circle>
                {dot.end.label && (
                  <text
                    x={endPoint.x}
                    y={endPoint.y - 8}
                    textAnchor="middle"
                    fill={isHovered ? lineColor : "rgba(255,255,255,0.4)"}
                    className={cn(
                      "text-[6px] transition-all duration-300 pointer-events-none uppercase tracking-widest",
                      isHovered ? "opacity-100 translate-y-[-2px] fill-white" : "opacity-0"
                    )}
                  >
                    {dot.end.label}
                  </text>
                )}
              </g>
            </g>
          );
        })}
      </svg>

      {/* Persistent Info Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-2 rounded-sm space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[8px] uppercase tracking-widest text-white/60">Network Status: Optimized</span>
          </div>
          <div className="text-[10px] text-primary font-bold uppercase tracking-tighter">
            {hoveredIndex !== null ? (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                Link Established: {dots[hoveredIndex].start.label} <span className="text-white/40 mx-1">→</span> {dots[hoveredIndex].end.label}
              </motion.div>
            ) : "Scan connections for node data"}
          </div>
        </div>
      </div>
    </div>
  );
}
