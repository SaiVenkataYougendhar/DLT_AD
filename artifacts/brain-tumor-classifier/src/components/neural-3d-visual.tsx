import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Maximize2, RotateCcw, Activity } from "lucide-react";

interface Node3D {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  color: string;
  isTumorCluster?: boolean;
}

interface SynapsePulse {
  sourceIdx: number;
  targetIdx: number;
  progress: number;
  speed: number;
}

interface Neural3DVisualProps {
  mode?: "glioma" | "meningioma" | "pituitary" | "notumor" | "interactive";
  width?: number;
  height?: number;
  showControls?: boolean;
  className?: string;
}

export const Neural3DVisual: React.FC<Neural3DVisualProps> = ({
  mode = "interactive",
  width = 460,
  height = 360,
  showControls = true,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotX, setRotX] = useState(0.2);
  const [rotY, setRotY] = useState(0.3);
  const [isHovered, setIsHovered] = useState(false);
  const [activeMode, setActiveMode] = useState<string>(mode);

  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const nodesRef = useRef<Node3D[]>([]);
  const pulsesRef = useRef<SynapsePulse[]>([]);
  const animFrameId = useRef<number | null>(null);

  // Initialize 3D Fibonacci Sphere Nodes
  useEffect(() => {
    const totalNodes = 96;
    const radius = 135;
    const nodes: Node3D[] = [];

    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < totalNodes; i++) {
      const y = 1 - (i / (totalNodes - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Assign colors based on English Palette (Oxford Blue, British Racing Green, Westminster Gold)
      const isTopQuarter = y > 0.4 && x > 0.2;
      const isTumor = (activeMode === "glioma" || activeMode === "meningioma") && isTopQuarter;

      nodes.push({
        x: x * radius,
        y: y * radius * 0.88, // slightly oval cranial shape
        z: z * radius,
        baseRadius: isTumor ? 4.5 : Math.random() * 2 + 1.8,
        color: isTumor ? "#D4A017" : i % 3 === 0 ? "#1B4D3E" : i % 2 === 0 ? "#2563EB" : "#C5A059",
        isTumorCluster: isTumor,
      });
    }

    nodesRef.current = nodes;

    // Initialize Synaptic Pulses
    const pulses: SynapsePulse[] = [];
    for (let i = 0; i < 14; i++) {
      pulses.push({
        sourceIdx: Math.floor(Math.random() * totalNodes),
        targetIdx: Math.floor(Math.random() * totalNodes),
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.012,
      });
    }
    pulsesRef.current = pulses;
  }, [activeMode]);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let localRotX = rotX;
    let localRotY = rotY;

    const render = () => {
      // Auto-rotation when not dragging
      if (!isDragging.current) {
        localRotY += 0.006;
        localRotX += 0.0015;
      }

      ctx.clearRect(0, 0, width, height);

      const fov = 380;
      const cx = width / 2;
      const cy = height / 2;

      // Transform nodes with 3D rotation matrices
      const cosX = Math.cos(localRotX);
      const sinX = Math.sin(localRotX);
      const cosY = Math.cos(localRotY);
      const sinY = Math.sin(localRotY);

      interface ProjectedNode {
        px: number;
        py: number;
        scale: number;
        z: number;
        orig: Node3D;
        idx: number;
      }

      const projected: ProjectedNode[] = [];

      nodesRef.current.forEach((n, idx) => {
        // Rotate around Y
        const x1 = n.x * cosY - n.z * sinY;
        const z1 = n.z * cosY + n.x * sinY;

        // Rotate around X
        const y2 = n.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + n.y * sinX;

        // Project onto 2D viewport
        const scale = fov / (fov + z2);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;

        projected.push({ px, py, scale, z: z2, orig: n, idx });
      });

      // Depth sort: render farthest nodes first
      projected.sort((a, b) => b.z - a.z);

      // Draw Axon Interconnects
      ctx.lineWidth = 0.7;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].px - projected[j].px;
          const dy = projected[i].py - projected[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 48) {
            const alpha = (1 - dist / 48) * 0.35 * Math.min(projected[i].scale, projected[j].scale);
            ctx.strokeStyle = projected[i].orig.isTumorCluster ? `rgba(212, 160, 23, ${alpha * 1.5})` : `rgba(37, 99, 235, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.stroke();
          }
        }
      }

      // Draw Synaptic Impulses
      pulsesRef.current.forEach((p) => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          p.sourceIdx = Math.floor(Math.random() * projected.length);
          p.targetIdx = Math.floor(Math.random() * projected.length);
        }

        const s = projected.find((item) => item.idx === p.sourceIdx);
        const t = projected.find((item) => item.idx === p.targetIdx);
        if (s && t) {
          const ix = s.px + (t.px - s.px) * p.progress;
          const iy = s.py + (t.py - s.py) * p.progress;

          ctx.fillStyle = "#D4A017";
          ctx.beginPath();
          ctx.arc(ix, iy, 2.2 * s.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Nodes
      projected.forEach((node) => {
        const radius = node.orig.baseRadius * node.scale;
        const alpha = Math.max(0.2, (node.scale - 0.4) * 1.6);

        // Glow for tumor cluster
        if (node.orig.isTumorCluster) {
          ctx.shadowColor = "#D4A017";
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = node.orig.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(node.px, node.py, Math.max(1, radius), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      });

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [width, height, rotX, rotY]);

  // Mouse drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    prevMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - prevMouse.current.x;
    const dy = e.clientY - prevMouse.current.y;
    setRotY((prev) => prev + dx * 0.01);
    setRotX((prev) => prev + dy * 0.01);
    prevMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-card/90 to-card/50 backdrop-blur-xl shadow-xl transition-all ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        isDragging.current = false;
      }}
    >
      {/* 3D Viewport Header */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground bg-card/70 px-2 py-0.5 rounded-full border border-border/60 pointer-events-auto">
              3D Holographic Cortex // 60 FPS
            </span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={() => {
                setRotX(0.2);
                setRotY(0.3);
              }}
              className="flex h-6 w-6 items-center justify-center rounded-md border border-border bg-card/80 text-muted-foreground hover:bg-muted hover:text-foreground text-[10px]"
              title="Reset 3D Angle"
            >
              <RotateCcw size={11} />
            </button>
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-auto cursor-grab active:cursor-grabbing block"
      />

      {/* Footer Mode Indicators */}
      {showControls && (
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[10px] font-mono text-muted-foreground pointer-events-none">
          <span className="bg-card/70 px-2 py-0.5 rounded border border-border/60">
            Drag to Orbit · 96 Synaptic Nodes
          </span>
          <span className="text-accent font-semibold">
            {activeMode === "glioma" ? "Infiltrative Core Active" : activeMode === "meningioma" ? "Dural Base Active" : "Full Cranial Lattice"}
          </span>
        </div>
      )}
    </div>
  );
};

