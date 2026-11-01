import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Activity, Layers, Radio, Waves, Zap, Compass, ShieldCheck } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface WaveformPoint {
  frequency: string;
  amplitude: number;
  label: string;
  biomarker: string;
  significance: string;
}

const diagnosticFrequencies: WaveformPoint[] = [
  {
    frequency: "0.12 - 0.48 Hz",
    amplitude: 88,
    label: "Low-Frequency Dural Profile",
    biomarker: "Meningioma Dural Tail Matrix",
    significance: "Sharp circumscribed margin gradient (Sobel 0.84)",
  },
  {
    frequency: "0.75 - 1.82 Hz",
    amplitude: 64,
    label: "Intermediate Microvascular Spectrum",
    biomarker: "Peritumoral Vasogenic Edema",
    significance: "FLAIR hyperintensity diffusion perimeter",
  },
  {
    frequency: "2.40 - 5.10 Hz",
    amplitude: 94,
    label: "High-Frequency Glioma Texture",
    biomarker: "Infiltrative Glioblastoma Core",
    significance: "GLCM entropy elevation (0.89) & microvascular chaos",
  },
  {
    frequency: "5.80 - 8.40 Hz",
    amplitude: 72,
    label: "Hyper-Fine Sellar Attenuation",
    biomarker: "Pituitary Micro-Adenoma Boundary",
    significance: "Optic chiasm compression vector identification",
  },
];

export const GsapRadiomicRibbon: React.FC<{ className?: string }> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const velocityGaugeRef = useRef<HTMLSpanElement>(null);
  const [activeFrequencyIdx, setActiveFrequencyIdx] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Horizontal scrubbed movement tied to scroll progression
      gsap.fromTo(
        trackRef.current,
        { x: "12%" },
        {
          x: "-35%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
            onUpdate: (self) => {
              // Update progress bar
              if (progressLineRef.current) {
                progressLineRef.current.style.width = `${(self.progress * 100).toFixed(1)}%`;
              }
              // Calculate velocity in px/s
              const v = Math.round(Math.abs(self.getVelocity() / 15));
              setScrollVelocity(v);
              if (velocityGaugeRef.current) {
                velocityGaugeRef.current.innerText = `${v} px/s`;
              }
              // Pick active frequency card based on scroll position
              const idx = Math.min(
                diagnosticFrequencies.length - 1,
                Math.floor(self.progress * diagnosticFrequencies.length)
              );
              setActiveFrequencyIdx(idx);
            },
          },
        }
      );

      // 2. Continuous subtle pulsing animation on nodes
      gsap.to(".gsap-pulse-dot", {
        scale: 1.35,
        opacity: 0.6,
        repeat: -1,
        yoyo: true,
        duration: 1.4,
        ease: "sine.inOut",
        stagger: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden border-t border-b border-border/80 bg-gradient-to-b from-card/40 via-muted/20 to-card/40 py-20 ${className}`}
    >
      {/* Background Subtle Waveform Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4af3710_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Section Header */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-primary mb-3">
              <Sparkles size={13} className="text-accent animate-pulse" />
              <span>DYNAMIC SIGNAL DECOMPOSITION // GSAP SCROLLTRIGGER ENGINE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-serif tracking-tight text-foreground">
              Multi-Parametric Tensor & Kinetic Biomarker Spectrum
            </h2>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-muted-foreground">
              Continuous hardware-accelerated scroll-scrubbed feature activation maps. As you navigate the viewport,
              our GSAP ScrollTrigger pipeline transforms raw voxel matrices into calibrated sub-visual texture vectors in real time.
            </p>
          </div>

          {/* Real-Time Kinetic Velocity Readout */}
          <div className="panel metallic-card p-4 rounded-2xl flex items-center gap-4 shrink-0 border-border/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 border border-accent/30 text-accent">
              <Compass size={20} className="animate-spin" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Scroll Scrub Velocity
              </div>
              <div className="flex items-center gap-2">
                <span ref={velocityGaugeRef} className="mono text-lg font-black text-foreground">
                  {scrollVelocity} px/s
                </span>
                <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Scrub Progress Bar */}
        <div className="mt-8 h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
          <div
            ref={progressLineRef}
            className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-75"
            style={{ width: "15%" }}
          />
        </div>
      </div>

      {/* GSAP-Scrubbed Horizontal Ribbon Track */}
      <div className="relative w-full overflow-hidden py-6">
        <div ref={trackRef} className="flex gap-6 will-change-transform select-none">
          {diagnosticFrequencies.map((freq, idx) => {
            const isHighlighted = activeFrequencyIdx === idx;
            return (
              <div
                key={idx}
                className={`w-[340px] md:w-[420px] shrink-0 rounded-3xl border p-6 transition-all duration-300 shadow-xl ${
                  isHighlighted
                    ? "border-accent ring-2 ring-accent/30 bg-card shadow-accent/10"
                    : "border-border/80 bg-card/80 opacity-85 hover:opacity-100"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/70 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="gsap-pulse-dot h-2.5 w-2.5 rounded-full bg-accent" />
                    <span className="mono text-xs font-bold uppercase tracking-wider text-foreground">
                      BAND 0{idx + 1} // {freq.frequency}
                    </span>
                  </div>
                  <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] font-mono font-bold text-primary">
                    VOLUMETRIC
                  </span>
                </div>

                {/* Simulated Waveform Visualizer */}
                <div className="h-16 w-full rounded-xl bg-black/90 p-3 mb-4 flex items-end justify-between gap-1 border border-border/60">
                  {Array.from({ length: 28 }).map((_, barIdx) => {
                    const heightPercent = Math.max(
                      15,
                      Math.round(Math.sin((barIdx + idx * 4) * 0.45) * 40 + freq.amplitude * 0.45)
                    );
                    return (
                      <div
                        key={barIdx}
                        className={`w-full rounded-t transition-all duration-300 ${
                          isHighlighted ? "bg-accent" : "bg-primary/50"
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    );
                  })}
                </div>

                <h3 className="font-serif text-base font-bold text-foreground mb-1">
                  {freq.label}
                </h3>
                <div className="mono text-xs font-bold text-accent mb-2">
                  {freq.biomarker}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {freq.significance}
                </p>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>ACTIVATION: {freq.amplitude}%</span>
                  <span className="text-secondary font-bold">IBSI STANDARD v2</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Information Ribbon */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 mt-6">
        <div className="rounded-2xl border border-border/80 bg-background/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-secondary shrink-0" />
            <span>HARLEY STREET AUDITABLE PROTOCOL: Continuous Gabor wavelets & spatial GLCM co-occurrence calculation</span>
          </div>
          <span className="text-accent font-bold text-[11px]">
            SCROLL TO SHIFT FREQUENCY DOMAIN
          </span>
        </div>
      </div>
    </div>
  );
};
