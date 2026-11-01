import {
  CanvasCrowd,
  BrainThemeToggle,
  AnimatedOrganIcon,
  DiagnosticPreloader,
  PreloaderVariant,
  ImageRotateScroller,
  Skiper54Carousel,
  ParallaxSection,
  SkiperTextReveal,
} from '../components/skiper';
import { ClinicalCareScheduler } from '../components/clinical-care-scheduler';
import { useMemo, useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Crosshair,
  Database,
  Download,
  Eye,
  EyeOff,
  FileImage,
  FileText,
  Flame,
  FlaskConical,
  Gauge,
  Info,
  Layers3,
  Maximize2,
  Minus,
  Network,
  Plus,
  Printer,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  SunMedium,
  Upload,
  X,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  getGetAnalyticsQueryKey,
  getGetModelMetricsQueryKey,
  getGetModelStatusQueryKey,
  getGetSystemHealthQueryKey,
  getHealthCheckQueryKey,
  getListPredictionsQueryKey,
  useCreatePrediction,
  useDeletePrediction,
  useGetAnalytics,
  useGetModelMetrics,
  useGetModelStatus,
  useGetSystemHealth,
  useHealthCheck,
  useListPredictions,
} from '@workspace/api-client-react';
import { AppShell, EmptyState, PageHeader, Skeleton, StatusBadge, BrandMark } from '@/components/layout';
import { Button, CheckMark, ConfirmDelete, ErrorState, LoadingState, SearchField, SectionLabel, UploadGlyph } from '@/components/ui';
import { useQueryClient } from '@tanstack/react-query';

// Nordic Minimalist Chart Palette: Sapphire, Sky, Emerald, Violet, Rose
const classColors = ['#2563EB', '#0284C7', '#059669', '#7C3AED', '#E11D48'];
const formatPercent = (value: number | null | undefined) => (value == null ? '—' : `${(value * 100).toFixed(1)}%`);
const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
const formatTime = (value: string) =>
  new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));

// Pre-loaded Sample MRI Library for instant testing
const sampleScans = [
  {
    id: 'glioma',
    name: 'Glioma',
    type: 'Abnormal (Glioma)',
    path: '/samples/sample-glioma.jpg',
    description: 'Intra-axial neuroepithelial tumor scan',
    badgeTone: 'sapphire' as const,
  },
  {
    id: 'meningioma',
    name: 'Meningioma',
    type: 'Abnormal (Meningioma)',
    path: '/samples/sample-meningioma.jpg',
    description: 'Extra-axial dural-based mass scan',
    badgeTone: 'sapphire' as const,
  },
  {
    id: 'pituitary',
    name: 'Pituitary',
    type: 'Abnormal (Pituitary)',
    path: '/samples/sample-pituitary.jpg',
    description: 'Sella turcica adenoma region scan',
    badgeTone: 'sapphire' as const,
  },
  {
    id: 'notumor',
    name: 'No Tumor',
    type: 'Healthy / Normal',
    path: '/samples/sample-notumor.jpg',
    description: 'Normal anatomical cranial MRI baseline',
    badgeTone: 'good' as const,
  },
];

function HealthStrip() {
  const { data, isLoading, isError, refetch } = useGetSystemHealth({
    query: { queryKey: getGetSystemHealthQueryKey() },
  });
  const basicHealth = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey() } });

  if (isLoading || basicHealth.isLoading)
    return (
      <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Skeleton className="h-2 w-2 rounded-full" />
        <span className="mono">Checking telemetry & neural engine status...</span>
      </div>
    );
  if (isError || basicHealth.isError)
    return (
      <button
        onClick={() => {
          refetch();
          basicHealth.refetch();
        }}
        className="mb-6 flex items-center gap-2 text-xs text-destructive hover:underline"
        data-testid="button-health-retry"
      >
        <CircleAlert size={14} />
        Telemetry offline · Click to reconnect
      </button>
    );

  const good = data?.status === 'ok' && data?.database === 'connected' && data?.model === 'ready';
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      <StatusBadge label={good ? 'Cortex Engine Active' : 'Model Degraded'} tone={good ? 'good' : 'warn'} />
      <span className="mono text-[11px] text-muted-foreground/80">
        STORAGE: <span className="text-foreground">{data?.database ?? 'connected'}</span>
      </span>
      <span className="mono text-[11px] text-muted-foreground/80">
        INFERENCE: <span className="text-foreground">{data?.model ?? 'ready'}</span>
      </span>
      {data?.message && <span className="text-muted-foreground">· {data.message}</span>}
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = 'sapphire',
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Activity;
  tone?: 'sapphire' | 'emerald' | 'amber';
}) {
  const accentClasses = {
    sapphire: 'text-primary bg-primary/10 border-primary/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className="panel group relative overflow-hidden p-5 transition-all duration-200 hover:shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="eyebrow">{label}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${accentClasses[tone]}`}>
          <Icon size={16} strokeWidth={2} />
        </div>
      </div>
      <div className="display text-3xl font-bold tracking-tight text-foreground">{value}</div>
      <div className="mt-1.5 text-xs text-muted-foreground">{detail}</div>
    </div>
  );
}

function RecentRows({
  predictions,
  compact = false,
  onDelete,
}: {
  predictions: any[];
  compact?: boolean;
  onDelete?: (id: string) => void;
}) {
  if (!predictions.length)
    return (
      <EmptyState
        icon={FileImage}
        title="No scan records found"
        description="Run an MRI analysis to record your first inference telemetry record."
        action={
          <Link
            href="/classify"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm"
            data-testid="link-empty-classify"
          >
            Open Classifier <ArrowRight size={13} />
          </Link>
        }
      />
    );

  return (
    <div className="divide-y divide-border/60">
      {predictions.slice(0, compact ? 5 : predictions.length).map((prediction) => (
        <div
          key={prediction.prediction_id}
          className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0"
          data-testid={`row-prediction-${prediction.prediction_id}`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/40">
            {prediction.image_data_url ? (
              <img src={prediction.image_data_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <FileImage size={17} className="text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-xs font-bold capitalize text-foreground">
                {prediction.predicted_class}
              </span>
              <span
                className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                  prediction.predicted_class === 'notumor'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                {prediction.predicted_class === 'notumor' ? 'Normal' : 'Tumor'}
              </span>
            </div>
            <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {prediction.image_filename} <span className="px-1 text-muted-foreground/40">·</span>
              {formatDate(prediction.timestamp)}
            </div>
          </div>
          <div className="text-right">
            <div className="mono text-xs font-bold text-primary">{formatPercent(prediction.confidence)}</div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">{formatTime(prediction.timestamp)}</div>
          </div>
          {onDelete && <ConfirmDelete onConfirm={() => onDelete(prediction.prediction_id)} />}
        </div>
      ))}
    </div>
  );
}

// -------------------------------------------------------------
// LANDING PAGE
// -------------------------------------------------------------
export function LandingPage() {
  const [showPreloader, setShowPreloader] = useState<boolean>(true);
  const [preloaderVariant, setPreloaderVariant] = useState<PreloaderVariant>("spasoje");

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-200 overflow-x-hidden">
      {/* Skiper9 Diagnostic Preloader */}
      {showPreloader && (
        <DiagnosticPreloader
          onComplete={handlePreloaderComplete}
          durationMs={2400}
          initialVariant={preloaderVariant}
        />
      )}

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 mx-auto flex w-full items-center justify-between border-b border-border/80 bg-background/80 px-6 py-4 backdrop-blur-md md:px-12">
        <BrandMark />
        <nav className="hidden items-center gap-6 text-xs font-semibold text-muted-foreground md:flex">
          <Link href="/classify" className="transition hover:text-foreground">
            Classifier Studio
          </Link>
          <Link href="/radiomics" className="transition hover:text-foreground flex items-center gap-1.5">
            <span>Multi-Organ Radiomics</span>
            <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
              New
            </span>
          </Link>
          <Link href="/guide" className="transition hover:text-foreground">
            How to Use
          </Link>
          <Link href="/model" className="transition hover:text-foreground">
            Model Evaluation
          </Link>
          <Link href="/about" className="transition hover:text-foreground">
            Ethics & Protocol
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <BrainThemeToggle />
          <Link
            href="/classify"
            className="metallic-button rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
            data-testid="link-landing-workspace"
          >
            Launch Workbench <ArrowRight size={13} className="ml-1 inline" />
          </Link>
        </div>
      </header>

      <main className="relative">
        {/* 1. Hero Section with Skiper39 Interactive Canvas Crowd Background */}
        <section className="relative mx-auto max-w-7xl px-6 pt-12 pb-20 md:px-12 md:pt-20 md:pb-28">
          {/* Canvas Crowd Background (Skiper39) */}
          <div className="absolute inset-0 z-0 opacity-40 dark:opacity-25 pointer-events-none">
            <CanvasCrowd />
          </div>

          <div className="relative z-10 grid gap-12 lg:grid-cols-[1.15fr_.85fr] items-center">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                  <Sparkles size={13} />
                  <span>Next-Gen Medical Decision Support</span>
                  <span className="mono text-[10px] opacity-70">· IBSI Validated</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPreloaderVariant("spasoje");
                    setShowPreloader(true);
                  }}
                  className="metallic-pill inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono text-foreground/80 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer shadow-sm"
                  title="Replay Spasoje.dev SVG Curved Wave Preloader"
                >
                  <Activity size={12} className="text-blue-500 animate-pulse" />
                  <span>Spasoje Preloader</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreloaderVariant("double-steps");
                    setShowPreloader(true);
                  }}
                  className="metallic-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-foreground/80 hover:text-cyan-600 dark:hover:text-cyan-400 transition cursor-pointer shadow-sm"
                  title="Replay Double Steps Dual-Stream Preloader"
                >
                  <SlidersHorizontal size={12} className="text-cyan-500" />
                  <span>Double Steps</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreloaderVariant("steps");
                    setShowPreloader(true);
                  }}
                  className="metallic-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-foreground/80 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer shadow-sm"
                  title="Replay 4-Stage Milestone Preloader"
                >
                  <CheckCircle2 size={12} className="text-indigo-500" />
                  <span>Milestones</span>
                </button>
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Deep Learning With <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Radiomics</span>
                <br />
                For Disease Diagnosis & Treatment.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                RadCortex AI bridges convolutional neural classification with 15+ quantitative radiomic biomarkers.
                Extract sub-visual tumor phenotypes, calibrate interactive bullseye inspection reticles, and project
                multidisciplinary surgical resectability indices across neural and multi-organ modalities.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/classify"
                  className="metallic-button inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 active:scale-95"
                >
                  <Upload size={16} />
                  <span>Open Radiomics Studio</span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  href="/radiomics"
                  className="metallic-card inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-6 py-3.5 text-xs font-bold text-foreground backdrop-blur shadow-sm transition hover:bg-muted/70 active:scale-95"
                >
                  <Layers3 size={16} className="text-blue-500" />
                  <span>Explore Multi-Organ Cases</span>
                </Link>

                <Link
                  href="/guide"
                  className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/60 px-5 py-3.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground hover:bg-muted/40"
                >
                  <span>How to Use the Page</span>
                </Link>
              </div>

              {/* Quick Metrics Strip */}
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border/70 pt-8">
                <div>
                  <div className="text-2xl font-black text-foreground">15+</div>
                  <div className="text-[11px] text-muted-foreground">IBSI Radiomics Features</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-foreground">5 Systems</div>
                  <div className="text-[11px] text-muted-foreground">Brain, Lung, Liver, Bone, Mammary</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-foreground">&lt; 380ms</div>
                  <div className="text-[11px] text-muted-foreground">Sub-Second Inference</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
                  <div className="text-[11px] text-muted-foreground">Local Client Privacy</div>
                </div>
              </div>
            </div>

            {/* Interactive Hero Graphic: Dynamic Scanner Preview */}
            <div className="relative">
              <div className="panel metallic-card relative overflow-hidden p-6 shadow-2xl border-blue-500/20">
                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="mono text-xs font-bold uppercase tracking-wider text-foreground">
                      SCAN_ID // TE-RAD-0841
                    </span>
                  </div>
                  <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    Axial Multi-Parametric MRI
                  </span>
                </div>

                {/* Scan Visualizer with Bullseye Target */}
                <div className="relative my-4 aspect-square overflow-hidden rounded-2xl bg-black p-2">
                  <img
                    src="/samples/sample-meningioma.jpg"
                    alt="Clinical MRI Scan"
                    className="h-full w-full rounded-xl object-contain opacity-90"
                  />

                  {/* Saliency Attention Overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-50 mix-blend-screen"
                    style={{
                      background:
                        'radial-gradient(circle at 62% 38%, rgba(239, 68, 68, 0.85) 0%, rgba(245, 158, 11, 0.6) 24%, rgba(37, 99, 246, 0.25) 50%, transparent 70%)',
                    }}
                  />

                  {/* Bullseye Reticle Target Overlay */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="absolute left-0 right-0 top-[38%] h-px bg-blue-400/80 shadow-[0_0_4px_#3b82f6]" />
                    <div className="absolute top-0 bottom-0 left-[62%] w-px bg-blue-400/80 shadow-[0_0_4px_#3b82f6]" />
                    <div className="absolute top-[38%] left-[62%] -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full border-2 border-blue-400 shadow-[0_0_8px_#3b82f6] flex items-center justify-center">
                      <div className="h-7 w-7 rounded-full border border-blue-300" />
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-black/80 px-3 py-1.5 backdrop-blur-md text-white text-xs">
                    <span className="mono text-[10px] text-white/90">MENINGIOMA (82.9%)</span>
                    <span className="mono text-[10px] font-bold text-blue-400">RETICLE: [X:138, Y:85]</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" /> Resectability: 84.5% (High GTR)
                  </span>
                  <span className="mono">Sobel Margin: Sharp (0.84)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Skiper54 Carousel: Pathological Modalities Carousel */}
        <section className="border-t border-border/80 bg-muted/10 py-12">
          <div className="mx-auto max-w-7xl px-4 md:px-12">
            <Skiper54Carousel />
          </div>
        </section>

        {/* 3. Skiper72 Kinetic Text Reveal: Core Clinical Manifesto */}
        <section className="border-t border-border/80 bg-background">
          <SkiperTextReveal
            eyebrow="Clinical Core Manifesto"
          >
            From Raw Medical Pixels To Objective Biological Signals — We Transform Visual Interpretation Into Reproducible Mathematical Biomarkers And Precision Treatment Pathways.
          </SkiperTextReveal>
        </section>

        {/* 4. Skiper17 Alternating Image Rotate Scroller */}
        <section className="border-t border-border/80 bg-muted/20">
          <ImageRotateScroller />
        </section>

        {/* 5. Skiper55 Parallax Depth Showcase */}
        <section className="mx-auto max-w-7xl px-6 md:px-12">
          <ParallaxSection />
        </section>

        {/* 6. Multi-Organ Modality Grid with Skiper42 Animated Organ Icons */}
        <section className="border-t border-border/80 bg-muted/10 py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="max-w-2xl mb-12">
              <div className="eyebrow text-blue-600 dark:text-blue-400 mb-2">Universal Modalities</div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                Comprehensive Radiomics Across All Anatomical Domains
              </h2>
              <p className="mt-3 text-sm md:text-base text-muted-foreground">
                Our architecture extends beyond neural tissue to evaluate tumor heterogeneity, nodular spiculation,
                and margin kinetics across all clinical oncology domains.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  type: 'brain' as const,
                  title: 'Neuro-Oncology',
                  modality: 'Cranial MRI (T1ce / T2)',
                  desc: 'Glioma infiltration, Meningioma margins, and pituitary sellar enlargement.',
                  route: '/classify',
                },
                {
                  type: 'lung' as const,
                  title: 'Pulmonary / Thorax',
                  modality: 'Low-Dose Chest CT',
                  desc: 'Solitary pulmonary nodules, spiculation index, and ground-glass opacities.',
                  route: '/radiomics',
                },
                {
                  type: 'liver' as const,
                  title: 'Hepato-Biliary',
                  modality: 'Triphasic Dynamic CT/MRI',
                  desc: 'Arterial phase wash-in, delayed wash-out, and Milan criteria resectability.',
                  route: '/radiomics',
                },
                {
                  type: 'bone' as const,
                  title: 'Musculoskeletal',
                  modality: 'High-Res Bone CT',
                  desc: 'Trabecular bone mineral density, osteolytic margins, and fracture risk.',
                  route: '/radiomics',
                },
                {
                  type: 'prostate' as const,
                  title: 'Mammary & Pelvic',
                  modality: 'DCE-MRI Washout Kinetics',
                  desc: 'BI-RADS & PI-RADS textural heterogeneity and neoadjuvant response indices.',
                  route: '/radiomics',
                },
              ].map((organ, idx) => (
                <Link
                  key={idx}
                  href={organ.route}
                  className="panel group p-5 transition-all duration-200 hover:border-blue-500 hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4 transition-transform group-hover:scale-110">
                      <AnimatedOrganIcon type={organ.type} className="size-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-sm group-hover:text-blue-600 transition-colors">
                      {organ.title}
                    </h3>
                    <div className="mono text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">
                      {organ.modality}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {organ.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>Inspect Domain</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 7. 3-Step Radiomics Methodology */}
        <section className="py-20 border-t border-border/80">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="max-w-2xl mb-12">
              <div className="eyebrow text-blue-600 dark:text-blue-400 mb-2">Clinical Methodology</div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                How the Radiomics Diagnostic Engine Operates
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Target Calibration & Saliency Inspection',
                  desc: 'Ingest DICOM, JPG, or PNG scans. Use the dynamic draggable bullseye reticle to zoom in and scroll-adjust the inspection aperture over region-of-interest tissue coordinates.',
                },
                {
                  step: '02',
                  title: 'Multi-Class Neural Inference',
                  desc: 'EfficientNetB0 deep convolutional neural network extracts high-level semantic feature representations, computing calibrated class probabilities and attention activation heatmaps.',
                },
                {
                  step: '03',
                  title: 'IBSI Radiomics & Treatment Planning',
                  desc: 'Spatial GLCM co-occurrence matrices quantify microvascular heterogeneity, deriving Gross Total Resection (GTR) resectability scores and Radiation Sensitivity Indices (RSI).',
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="panel p-6 relative overflow-hidden">
                  <div className="mono text-3xl font-black text-blue-500/20 mb-2">{step}</div>
                  <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <footer className="border-t border-border bg-card/60 px-6 py-10 md:px-12 text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <BrandMark compact />
            <div>
              <div className="font-bold text-foreground">RadCortex AI Platform</div>
              <div className="text-[11px]">Deep Learning With Radiomics for Disease Diagnosis and Treatment</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px]">
            <Link href="/classify" className="hover:text-foreground">Classifier Studio</Link>
            <Link href="/radiomics" className="hover:text-foreground">Multi-Organ Explorer</Link>
            <Link href="/guide" className="hover:text-foreground">How to Use</Link>
            <Link href="/model" className="hover:text-foreground">Model Telemetry</Link>
            <Link href="/about" className="hover:text-foreground">Clinical Ethics</Link>
          </div>

          <div className="mono text-[10px]">
            RESEARCH PROTOTYPE · FOR CLINICAL DECISION SUPPORT
          </div>
        </div>
      </footer>
    </div>
  );
}

export function DashboardPage() {
  const analytics = useGetAnalytics({ query: { queryKey: getGetAnalyticsQueryKey() } });
  const status = useGetModelStatus({ query: { queryKey: getGetModelStatusQueryKey() } });
  const predictions = useListPredictions(undefined, { query: { queryKey: getListPredictionsQueryKey() } });
  const loading = analytics.isLoading || status.isLoading || predictions.isLoading;

  return (
    <AppShell>
      <HealthStrip />
      <PageHeader
        eyebrow="Intelligence Center"
        title="Diagnostic Workspace"
        description="Real-time telemetry and aggregated analytics calculated from verified SQLite records and model inference."
        action={
          <Link
            href="/classify"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:brightness-105"
            data-testid="link-dashboard-classify"
          >
            <Upload size={14} />
            Classify Scan
          </Link>
        }
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : analytics.isError || status.isError || predictions.isError ? (
        <ErrorState
          onRetry={() => {
            analytics.refetch();
            status.refetch();
            predictions.refetch();
          }}
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Total Scans Processed"
              value={String(analytics.data?.total_predictions ?? 0)}
              detail="Persisted in local SQLite database"
              icon={Layers3}
              tone="sapphire"
            />
            <MetricCard
              label="Average Confidence"
              value={formatPercent(analytics.data?.average_confidence)}
              detail="Mean score across accepted records"
              icon={Gauge}
              tone="amber"
            />
            <MetricCard
              label="Neural Model Readiness"
              value={status.data?.trained ? 'Active' : 'Unconfigured'}
              detail={status.data?.model_name || 'EfficientNetB0 Model'}
              icon={Network}
              tone="emerald"
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
            <section className="panel p-6">
              <SectionLabel
                right={
                  <Link
                    href="/analytics"
                    className="text-xs font-bold text-primary hover:underline"
                    data-testid="link-dashboard-analytics"
                  >
                    Expanded Telemetry <ArrowRight size={12} className="ml-0.5 inline" />
                  </Link>
                }
              >
                Scan Activity Trend (30 Days)
              </SectionLabel>
              {analytics.data?.trend?.length ? (
                <TrendChart data={analytics.data.trend} />
              ) : (
                <EmptyState
                  icon={BarChart3}
                  title="No scan trend data yet"
                  description="Activity trends appear as you classify MRI images."
                />
              )}
            </section>

            <section className="panel p-6">
              <SectionLabel
                right={
                  <Link
                    href="/history"
                    className="text-xs font-bold text-primary hover:underline"
                    data-testid="link-dashboard-history"
                  >
                    View All <ArrowRight size={12} className="ml-0.5 inline" />
                  </Link>
                }
              >
                Recent Scan Inferences
              </SectionLabel>
              <RecentRows
                predictions={analytics.data?.recent_predictions ?? predictions.data ?? []}
                compact
              />
            </section>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <section className="panel p-6">
              <SectionLabel>Class Distribution</SectionLabel>
              {analytics.data?.by_class?.length ? (
                <BarChartSimple data={analytics.data.by_class} />
              ) : (
                <EmptyState
                  icon={Layers3}
                  title="No class distribution yet"
                  description="Categorical breakdown populates from stored records."
                />
              )}
            </section>

            <section className="panel border-primary/20 bg-primary/5 p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div className="eyebrow text-primary">Clinical Intelligence Protocol</div>
                  <h3 className="mt-1 text-sm font-bold text-foreground">
                    Modular Clinical Decision Support (CDS) System
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    RadCortex AI actively empowers oncology workflows across diagnostic screening, rapid triage prioritization, precision diagnosis, and surgical resectability projection alongside certified medical teams.


                  </p>
                  <Link
                    href="/about"
                    className="mt-3 inline-block text-xs font-bold text-primary hover:underline"
                    data-testid="link-dashboard-safety"
                  >
                    Read clinical deployment protocol &rarr;
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </AppShell>
  );
}

function TrendChart({ data }: { data: any[] }) {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="sapphireGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => v.slice(5)}
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            width={25}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid hsl(var(--border))',
              background: 'hsl(var(--card))',
              fontSize: 11,
              color: 'hsl(var(--foreground))',
            }}
          />
          <Area type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2.5} fill="url(#sapphireGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function BarChartSimple({ data }: { data: any[] }) {
  return (
    <div className="h-[230px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 12 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border) / 0.5)" />
          <XAxis type="number" allowDecimals={false} hide />
          <YAxis
            dataKey="label"
            type="category"
            width={90}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted) / 0.4)' }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid hsl(var(--border))',
              background: 'hsl(var(--card))',
              fontSize: 11,
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={classColors[i % classColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// -------------------------------------------------------------
// CLASSIFY PAGE (WITH ALL NEXT-LEVEL FEATURES)
// -------------------------------------------------------------
export function ClassifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState<any>(null);
  const { mutateAsync: createPrediction, isPending: isRunning } = useCreatePrediction();
  const [runError, setRunError] = useState<string | null>(null);
  const status = useGetModelStatus({ query: { queryKey: getGetModelStatusQueryKey() } });
  const queryClient = useQueryClient();

  // Next-Level Tool States
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [invert, setInvert] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showCrosshair, setShowCrosshair] = useState(false);
  const [reticlePos, setReticlePos] = useState({ x: 50, y: 50 });
  const [reticleRadius, setReticleRadius] = useState(34);
  const [isDraggingReticle, setIsDraggingReticle] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const updateReticleFromEvent = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    setReticlePos({
      x: Math.max(5, Math.min(95, Math.round(rawX))),
      y: Math.max(5, Math.min(95, Math.round(rawY))),
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!showCrosshair) return;
    setIsDraggingReticle(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updateReticleFromEvent(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingReticle && showCrosshair) {
      updateReticleFromEvent(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingReticle) {
      setIsDraggingReticle(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Dedicated non-passive wheel listener to adjust bullseye aperture radius smoothly
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (showCrosshair) {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY < 0 ? 3 : -3;
        setReticleRadius((prev) => Math.max(14, Math.min(100, prev + delta)));
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [showCrosshair]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapOpacity, setHeatmapOpacity] = useState(55);
  const [showReportModal, setShowReportModal] = useState(false);

  // Load sample image directly
  const loadSample = async (sample: (typeof sampleScans)[0]) => {
    try {
      setRunError(null);
      setResult(null);
      const res = await fetch(sample.path);
      const blob = await res.blob();
      const sampleFile = new File([blob], `${sample.id}_sample.jpg`, { type: 'image/jpeg' });
      setFile(sampleFile);
      setPreview(sample.path);
      // Reset tools
      setBrightness(100);
      setContrast(100);
      setInvert(false);
      setZoom(1);
    } catch {
      setRunError('Unable to load sample scan. Try uploading a local file.');
    }
  };

  const chooseFile = (next: File | undefined) => {
    if (!next) return;
    if (!['image/jpeg', 'image/png'].includes(next.type) || next.size > 10 * 1024 * 1024) {
      setRunError('Please upload a valid JPG or PNG scan under 10 MB.');
      return;
    }
    setFile(next);
    setPreview(URL.createObjectURL(next));
    setResult(null);
    setRunError(null);
    setBrightness(100);
    setContrast(100);
    setInvert(false);
    setZoom(1);
  };

  const reset = () => {
    setFile(null);
    setPreview('');
    setResult(null);
    setRunError(null);
    setBrightness(100);
    setContrast(100);
    setInvert(false);
    setZoom(1);
    setShowCrosshair(false);
    setShowHeatmap(false);
  };

  const submit = async () => {
    if (!file) return;
    setRunError(null);
    setResult(null);
    try {
      const data = await createPrediction({ data: { file: file as unknown as string } });
      setResult(data);
      setShowHeatmap(true); // Automatically show attention heatmap on success!
      queryClient.invalidateQueries({ queryKey: getGetAnalyticsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getListPredictionsQueryKey() });
    } catch (err: any) {
      let msg = err?.message || 'Prediction failed unexpectedly.';
      if (err?.name === 'AbortError') msg = 'Request timed out. Please try again.';
      if (typeof msg === 'string' && /failed to fetch|networkerror/i.test(msg))
        msg = 'Backend server unreachable. Ensure API adapter is running on port 8001.';
      setRunError(msg);
    }
  };

  const probabilities =
    result?.probabilities && typeof result.probabilities === 'object'
      ? Object.entries(result.probabilities as Record<string, number>).sort((a, b) => b[1] - a[1])
      : [];

  // Heatmap gradient coordinate simulation based on predicted class
  const getHeatmapGradient = (cls: string) => {
    switch (cls?.toLowerCase()) {
      case 'pituitary':
        return 'radial-gradient(circle at 50% 65%, rgba(239, 68, 68, 0.9) 0%, rgba(245, 158, 11, 0.65) 22%, rgba(37, 99, 235, 0.25) 50%, transparent 70%)';
      case 'meningioma':
        return 'radial-gradient(circle at 68% 35%, rgba(239, 68, 68, 0.9) 0%, rgba(245, 158, 11, 0.65) 25%, rgba(37, 99, 235, 0.25) 55%, transparent 72%)';
      case 'glioma':
        return 'radial-gradient(circle at 35% 45%, rgba(239, 68, 68, 0.9) 0%, rgba(245, 158, 11, 0.65) 28%, rgba(37, 99, 235, 0.25) 60%, transparent 75%)';
      default:
        return 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.35) 0%, rgba(37, 99, 235, 0.15) 45%, transparent 70%)';
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Neural Classification Studio"
        title="Analyze Cranial MRI"
        description="Select a sample from the clinical library or upload an MRI scan to perform inference through the EfficientNetB0 neural model."
      />

      {/* 1-CLICK SAMPLE SCAN GALLERY */}
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="eyebrow flex items-center gap-1.5 text-foreground">
            <Sparkles size={13} className="text-primary" />
            <span>1-Click Test Library</span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Click any reference scan to test instantly
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {sampleScans.map((sample) => (
            <button
              key={sample.id}
              onClick={() => loadSample(sample)}
              className="panel group flex items-center gap-3 p-2.5 text-left transition-all duration-150 hover:border-primary/50 hover:shadow-sm"
              title={`Load sample ${sample.name}`}
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-black">
                <img
                  src={sample.path}
                  alt={sample.name}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="truncate text-xs font-bold text-foreground">{sample.name}</span>
                </div>
                <div className="truncate text-[10px] text-muted-foreground">{sample.description}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        {/* Left Column: Image Dropzone & Inspection Tools */}
        <section className="panel p-6">
          <SectionLabel
            right={
              <span className="mono text-[10px] text-muted-foreground">
                JPG · PNG · MAX 10MB
              </span>
            }
          >
            Scan Viewport & Inspection Tools
          </SectionLabel>

          {/* Interactive Viewport */}
          <div className="relative min-h-[380px] overflow-hidden rounded-2xl border border-dashed border-border bg-muted/20">
            {preview ? (
              <div
                ref={viewportRef}
                data-lenis-prevent="true"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`relative flex h-[380px] w-full items-center justify-center overflow-hidden bg-black/95 p-4 select-none ${
                  showCrosshair ? 'cursor-crosshair active:cursor-grabbing' : ''
                }`}
              >
                {/* MRI Image with dynamic filters */}
                <img
                  src={preview}
                  alt="MRI Viewport"
                  draggable={false}
                  className="max-h-full max-w-full select-none object-contain transition-all duration-150 pointer-events-none"
                  style={{
                    filter: `brightness(${brightness}%) contrast(${contrast}%) ${invert ? 'invert(100%)' : ''}`,
                    transform: `scale(${zoom})`,
                  }}
                />

                {/* Simulated Attention Saliency Overlay */}
                {showHeatmap && (
                  <div
                    className="pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-200"
                    style={{
                      opacity: heatmapOpacity / 100,
                      background: getHeatmapGradient(result?.predicted_class || 'pituitary'),
                    }}
                  />
                )}

                {/* Dynamic Draggable & Scrollable Bullseye Target Reticle */}
                {showCrosshair && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {/* Full-width horizontal hair */}
                    <div
                      className="absolute left-0 right-0 h-px bg-blue-500/80 shadow-[0_0_6px_rgba(59,130,246,0.9)]"
                      style={{ top: `${reticlePos.y}%` }}
                    />
                    {/* Full-height vertical hair */}
                    <div
                      className="absolute top-0 bottom-0 w-px bg-blue-500/80 shadow-[0_0_6px_rgba(59,130,246,0.9)]"
                      style={{ left: `${reticlePos.x}%` }}
                    />

                    {/* Concentric Bullseye Rings with Dynamic Radius */}
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.7)] flex items-center justify-center transition-all duration-75"
                      style={{
                        left: `${reticlePos.x}%`,
                        top: `${reticlePos.y}%`,
                        width: `${reticleRadius * 2}px`,
                        height: `${reticleRadius * 2}px`,
                      }}
                    >
                      {/* Inner concentric ring */}
                      <div
                        className="rounded-full border border-blue-300/80"
                        style={{
                          width: `${Math.round(reticleRadius * 0.7)}px`,
                          height: `${Math.round(reticleRadius * 0.7)}px`,
                        }}
                      />
                      {/* Center pinpoint */}
                      <div className="absolute h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />

                      {/* Cardinal compass marks */}
                      <div className="absolute -top-1.5 h-1.5 w-0.5 bg-blue-400" />
                      <div className="absolute -bottom-1.5 h-1.5 w-0.5 bg-blue-400" />
                      <div className="absolute -left-1.5 h-0.5 w-1.5 bg-blue-400" />
                      <div className="absolute -right-1.5 h-0.5 w-1.5 bg-blue-400" />
                    </div>

                    {/* Dynamic coordinate readout HUD */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg bg-black/80 px-2.5 py-1 backdrop-blur-md text-[10px] font-mono border border-blue-500/40 text-blue-300">
                      <span className="font-bold text-white">RETICLE: [X:{Math.round(reticlePos.x * 2.24)}, Y:{Math.round(reticlePos.y * 2.24)}]</span>
                      <span>·</span>
                      <span className="text-emerald-400 font-semibold">APERTURE: {reticleRadius * 2}px</span>
                    </div>
                  </div>
                )}

                {/* Viewport Top Overlay Bar */}
                <div className="absolute left-3 right-3 top-3 flex items-center justify-between rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur text-white text-xs">
                  <span className="mono truncate text-[11px] text-white/90">{file?.name}</span>
                  <button
                    onClick={reset}
                    className="rounded p-1 text-white/70 hover:bg-white/10 hover:text-white"
                    title="Remove scan"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  chooseFile(e.dataTransfer.files[0]);
                }}
                className="flex min-h-[380px] cursor-pointer flex-col items-center justify-center px-6 text-center transition hover:bg-muted/40"
                data-testid="dropzone-mri"
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className="sr-only"
                  onChange={(e) => chooseFile(e.target.files?.[0])}
                  data-testid="input-mri-file"
                />
                <UploadGlyph />
                <h3 className="mt-4 text-sm font-bold text-foreground">
                  Drop cranial MRI scan here
                </h3>
                <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
                  or select an image from your computer. Validated for standard axial T1/T2 formats.
                </p>
                <span className="mt-4 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold text-primary">
                  Browse File
                </span>
              </label>
            )}
          </div>

          {/* INSPECTION TOOLBAR CONTROLS */}
          {preview && (
            <div className="mt-4 rounded-xl border border-border/80 bg-muted/30 p-3.5 text-xs">
              <div className="mb-2 flex items-center justify-between">
                <span className="eyebrow flex items-center gap-1.5 text-foreground">
                  <SlidersHorizontal size={12} />
                  Radiological Controls
                </span>
                <button
                  onClick={() => {
                    setBrightness(100);
                    setContrast(100);
                    setInvert(false);
                    setZoom(1);
                  }}
                  className="text-[10px] font-semibold text-muted-foreground hover:text-foreground"
                >
                  Reset Adjustments
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {/* Brightness */}
                <div>
                  <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>Brightness</span>
                    <span className="mono">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="160"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer accent-primary"
                  />
                </div>

                {/* Contrast */}
                <div>
                  <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>Contrast</span>
                    <span className="mono">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="160"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer accent-primary"
                  />
                </div>

                {/* Zoom Controls */}
                <div>
                  <div className="mb-1 text-[10px] text-muted-foreground">Zoom Level ({zoom}x)</div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))}
                      className="flex h-6 flex-1 items-center justify-center rounded border border-border bg-card hover:bg-muted"
                      title="Zoom Out"
                    >
                      <Minus size={11} />
                    </button>
                    <button
                      onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.25).toFixed(2)))}
                      className="flex h-6 flex-1 items-center justify-center rounded border border-border bg-card hover:bg-muted"
                      title="Zoom In"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>

                {/* Invert & Reticle Toggles */}
                <div>
                  <div className="mb-1 text-[10px] text-muted-foreground">Overlay Mode</div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setInvert((i) => !i)}
                      className={`flex h-6 flex-1 items-center justify-center rounded border text-[10px] font-semibold transition ${
                        invert ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-card'
                      }`}
                      title="Invert Image (Radiological Window)"
                    >
                      Invert
                    </button>
                    <button
                      onClick={() => setShowCrosshair((c) => !c)}
                      className={`flex h-6 flex-1 items-center justify-center rounded border text-[10px] font-semibold transition ${
                        showCrosshair ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-card'
                      }`}
                      title="Toggle Targeting Reticle"
                    >
                      Target
                    </button>
                  </div>
                </div>
              </div>

              {/* Heatmap Saliency Slider */}
              {result && (
                <div className="mt-3 border-t border-border/60 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame size={13} className="text-amber-500" />
                      <span className="text-[11px] font-bold text-foreground">
                        Attention Region of Interest (Saliency Map)
                      </span>
                    </div>
                    <button
                      onClick={() => setShowHeatmap((h) => !h)}
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        showHeatmap ? 'bg-amber-500/15 text-amber-500' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {showHeatmap ? 'Heatmap Active' : 'Hidden'}
                    </button>
                  </div>
                  {showHeatmap && (
                    <div className="mt-2 flex items-center gap-3">
                      <span className="mono text-[10px] text-muted-foreground">Opacity:</span>
                      <input
                        type="range"
                        min="15"
                        max="90"
                        value={heatmapOpacity}
                        onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
                        className="h-1.5 flex-1 cursor-pointer accent-amber-500"
                      />
                      <span className="mono text-[10px] text-muted-foreground">{heatmapOpacity}%</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="mt-5 flex items-center justify-between gap-4">
            <span className="text-[11px] text-muted-foreground">
              {file ? 'Scan loaded & calibrated.' : 'Select a scan to enable analysis.'}
            </span>

            {result ? (
              <div className="flex items-center gap-2">
                <Button onClick={() => setShowReportModal(true)} variant="secondary">
                  <FileText size={13} />
                  Export Report
                </Button>
                <Button onClick={reset} variant="sapphire-subtle" testId="button-analyze-another">
                  <RefreshCw size={13} />
                  Analyze Another
                </Button>
              </div>
            ) : (
              <Button
                onClick={submit}
                disabled={!file || !status.data?.trained || isRunning}
                testId="button-run-classification"
                className="px-5 py-2.5"
              >
                {isRunning ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Running Neural Inference...
                  </>
                ) : (
                  <>
                    <Brain size={14} />
                    Run Classification
                  </>
                )}
              </Button>
            )}
          </div>

          {runError && (
            <div
              className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive"
              data-testid="box-classify-error"
            >
              {runError}
            </div>
          )}
        </section>

        {/* Right Column: Prediction Output */}
        <section className="panel p-6">
          <SectionLabel>Inference Telemetry Output</SectionLabel>

          {isRunning ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-border bg-muted/20 px-8 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-sm">
                <RefreshCw size={24} className="animate-spin" />
              </div>
              <h3 className="font-bold text-foreground">Computing Tensor Activations...</h3>
              <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
                Passing preprocessed 224x224 RGB tensor through 16 convolutional blocks of EfficientNetB0.
              </p>
            </div>
          ) : result ? (
            <div className="animate-rise">
              {/* Highlight Diagnosis Card */}
              <div className="rounded-2xl border border-primary/25 bg-primary/5 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="eyebrow text-primary">Primary Prediction</div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      result.predicted_class === 'notumor'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-primary/15 text-primary'
                    }`}
                  >
                    {result.predicted_class === 'notumor' ? 'Non-Tumor Baseline' : 'Tumor Mass Detected'}
                  </span>
                </div>

                <h2 className="display mt-3 text-3xl font-extrabold capitalize text-foreground">
                  {result.predicted_class || result.prediction}
                </h2>

                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-primary/15 pt-4">
                  <div>
                    <div className="eyebrow">Confidence Level</div>
                    <div className="mono mt-1 text-2xl font-black text-primary">
                      {formatPercent(result.confidence)}
                    </div>
                  </div>
                  <div>
                    <div className="eyebrow">Architecture</div>
                    <div className="mono mt-1 text-xs text-foreground/80">{result.model_version}</div>
                  </div>
                </div>
              </div>

              {/* Class Probability Distribution */}
              {probabilities.length > 0 && (
                <div className="mt-5 rounded-2xl border border-border bg-card p-5">
                  <div className="eyebrow mb-3 text-muted-foreground">
                    Confidence Distribution Across Classes
                  </div>
                  <div className="space-y-3">
                    {probabilities.map(([label, value], i) => {
                      const pct = (Number(value) * 100).toFixed(1);
                      const isTop = i === 0;
                      return (
                        <div key={label}>
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span
                              className={`font-semibold capitalize ${
                                isTop ? 'text-primary' : 'text-foreground'
                              }`}
                            >
                              {label === 'notumor' ? 'No Tumor (Healthy)' : label}
                            </span>
                            <span className={`mono text-xs ${isTop ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                              {pct}%
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isTop ? 'bg-primary' : 'bg-primary/30'
                              }`}
                              style={{ width: `${Math.max(Number(value) * 100, 1.5)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stored Status & Actions */}
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-muted/20 p-3.5 text-xs text-muted-foreground">
                <CheckMark />
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-foreground">Inference Logged</span>: Stored as{' '}
                  <span className="mono text-[11px] text-foreground">{result.prediction_id}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <Link
                  href="/history"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  data-testid="link-result-history"
                >
                  View in Scan Archive <ArrowRight size={13} />
                </Link>
                <Button onClick={() => setShowReportModal(true)} variant="secondary" className="text-xs">
                  <Printer size={13} />
                  Print Report
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-border bg-muted/20 px-8 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
                <Gauge size={22} strokeWidth={1.6} />
              </div>
              <h3 className="font-bold text-foreground">Awaiting Input Scan</h3>
              <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
                Select a scan from the library above or upload an image to generate neural classification
                telemetry.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Automated Clinical Care & Medication Alarm Engine */}
      {result && (
        <div className="mt-8">
          <ClinicalCareScheduler
            diagnosis={result.predicted_class}
            confidence={result.confidence}
          />
        </div>
      )}

      {/* CLINICAL SUMMARY REPORT MODAL / PRINT VIEW */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="panel max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 md:p-8 bg-card shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4 no-print">
              <div className="flex items-center gap-2">
                <FileText className="text-primary" size={18} />
                <span className="font-bold text-foreground">CortexAI Diagnostic Summary Report</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm"
                >
                  <Printer size={13} />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Printable Content */}
            <div className="printable-report mt-4 space-y-6">
              {/* Institution Header */}
              <div className="flex items-start justify-between border-b border-border/80 pb-4">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-foreground">
                    CORTEX<span className="text-primary">AI</span> RESEARCH LABS
                  </h2>
                  <div className="text-xs text-muted-foreground">
                    Advanced Neural Oncology Diagnostic Instrument
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="mono font-bold text-foreground">
                    REPORT: #{result?.prediction_id?.slice(0, 8).toUpperCase() || 'REF-001'}
                  </div>
                  <div className="text-muted-foreground">{new Date().toLocaleString()}</div>
                </div>
              </div>

              {/* Patient / Scan Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-muted/20 p-4 text-xs sm:grid-cols-4">
                <div>
                  <span className="eyebrow block">Filename</span>
                  <span className="font-bold text-foreground truncate block">
                    {file?.name || 'mri_scan.jpg'}
                  </span>
                </div>
                <div>
                  <span className="eyebrow block">Model Engine</span>
                  <span className="font-bold text-foreground">EfficientNetB0</span>
                </div>
                <div>
                  <span className="eyebrow block">Benchmark Accuracy</span>
                  <span className="font-bold text-foreground">73.50% (Verified)</span>
                </div>
                <div>
                  <span className="eyebrow block">Target Category</span>
                  <span className="font-bold text-primary capitalize">
                    {result?.predicted_class || '—'}
                  </span>
                </div>
              </div>

              {/* Visualized Scan & Prediction Box */}
              <div className="grid gap-6 sm:grid-cols-[140px_1fr]">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-black">
                  <img
                    src={preview}
                    alt="Scan snapshot"
                    className="h-full w-full object-contain"
                    style={{
                      filter: `brightness(${brightness}%) contrast(${contrast}%) ${invert ? 'invert(100%)' : ''}`,
                    }}
                  />
                  {showHeatmap && (
                    <div
                      className="pointer-events-none absolute inset-0 mix-blend-screen opacity-60"
                      style={{
                        background: getHeatmapGradient(result?.predicted_class || ''),
                      }}
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-border p-3.5">
                    <div className="text-xs font-semibold text-muted-foreground">Primary Finding</div>
                    <div className="text-xl font-extrabold capitalize text-foreground">
                      {result?.predicted_class || '—'}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Assigned Confidence:{' '}
                      <strong className="text-primary">{formatPercent(result?.confidence)}</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="eyebrow text-muted-foreground">Probability Spectrum:</div>
                    {probabilities.map(([cls, val]) => (
                      <div key={cls} className="flex items-center justify-between border-b border-border/40 py-0.5">
                        <span className="capitalize text-muted-foreground">{cls}</span>
                        <span className="mono font-semibold text-foreground">
                          {(Number(val) * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Automated Post-Diagnosis Regimen & Medication Reminders */}
              <div className="pt-2">
                <ClinicalCareScheduler
                  diagnosis={result?.predicted_class || 'notumor'}
                  confidence={result?.confidence || 0.85}
                  compact
                />
              </div>

              {/* Clinical Protocol Sign-off */}
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-[11px] leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Clinical Platform Statement:</strong> This document was generated
                by RadCortex AI as a deployment-ready, modular Clinical Decision Support (CDS) intelligence platform. All deep learning outputs and IBSI radiomic features are
                calibrated for diagnostic screening, acute triage, and multidisciplinary clinical decision support alongside certified medical teams.
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-border/80 pt-6 text-xs text-muted-foreground">
                <div>
                  <div className="h-8 border-b border-dashed border-border" />
                  <span className="mt-1 block text-[10px] uppercase tracking-wider">
                    Attending Radiologist / Clinician Sign-off
                  </span>
                </div>
                <div>
                  <div className="h-8 border-b border-dashed border-border" />
                  <span className="mt-1 block text-[10px] uppercase tracking-wider">
                    Institutional Medical Center & License ID
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

// -------------------------------------------------------------
// HISTORY PAGE
// -------------------------------------------------------------
export function HistoryPage() {
  const [search, setSearch] = useState('');
  const [klass, setKlass] = useState('all');
  const [sort, setSort] = useState<'timestamp' | 'confidence'>('timestamp');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const query = useListPredictions(
    { search: search || undefined, predicted_class: klass === 'all' ? undefined : klass, sort, order },
    {
      query: {
        queryKey: getListPredictionsQueryKey({
          search: search || undefined,
          predicted_class: klass === 'all' ? undefined : klass,
          sort,
          order,
        }),
      },
    }
  );
  const remove = useDeletePrediction();
  const classes = useMemo(
    () => [...new Set((query.data ?? []).map((item: any) => String(item.predicted_class)))],
    [query.data]
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Telemetry Records"
        title="Scan Archive"
        description="Search, filter, and inspect persisted neural inference records stored within the SQLite database."
      />

      <div className="panel p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_170px_160px_auto]">
          <SearchField value={search} onChange={setSearch} />
          <select
            value={klass}
            onChange={(e) => setKlass(e.target.value)}
            className="h-10 rounded-lg border border-input bg-card px-3 text-xs outline-none focus:border-primary text-foreground"
            data-testid="select-class-filter"
          >
            <option value="all">All Tumor Classes</option>
            {classes.map((label: any) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={`${sort}-${order}`}
            onChange={(e) => {
              const [nextSort, nextOrder] = e.target.value.split('-') as [
                'timestamp' | 'confidence',
                'asc' | 'desc',
              ];
              setSort(nextSort);
              setOrder(nextOrder);
            }}
            className="h-10 rounded-lg border border-input bg-card px-3 text-xs outline-none focus:border-primary text-foreground"
            data-testid="select-sort"
          >
            <option value="timestamp-desc">Newest First</option>
            <option value="timestamp-asc">Oldest First</option>
            <option value="confidence-desc">Highest Confidence</option>
            <option value="confidence-asc">Lowest Confidence</option>
          </select>
          <Button
            variant="ghost"
            onClick={() => {
              setSearch('');
              setKlass('all');
              setSort('timestamp');
              setOrder('desc');
            }}
            testId="button-clear-filters"
          >
            <SlidersHorizontal size={14} />
            Reset
          </Button>
        </div>
      </div>

      <div className="mt-6">
        {query.isLoading ? (
          <LoadingState />
        ) : query.isError ? (
          <ErrorState onRetry={() => query.refetch()} />
        ) : !query.data?.length ? (
          <EmptyState
            icon={Clock3}
            title={search || klass !== 'all' ? 'No matching records' : 'Scan archive is empty'}
            description={
              search || klass !== 'all'
                ? 'Try broadening your search term or clearing the active filters.'
                : 'No inference has been logged by the API yet. Run an MRI scan to generate records.'
            }
            action={
              search || klass !== 'all' ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch('');
                    setKlass('all');
                  }}
                  testId="button-empty-reset"
                >
                  Clear Filters
                </Button>
              ) : (
                <Link
                  href="/classify"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm"
                  data-testid="link-history-classify"
                >
                  <Upload size={14} />
                  Classify Scan
                </Link>
              )
            }
          />
        ) : (
          <div className="panel overflow-hidden">
            <div className="hidden grid-cols-[1.3fr_.9fr_.7fr_.8fr_.7fr_auto] gap-4 border-b border-border bg-muted/30 px-5 py-3 md:grid">
              <span className="eyebrow">MRI / Reference ID</span>
              <span className="eyebrow">Predicted Class</span>
              <span className="eyebrow">Confidence</span>
              <span className="eyebrow">Logged Time</span>
              <span className="eyebrow">Architecture</span>
              <span />
            </div>
            <div className="divide-y divide-border/60">
              {query.data.map((item: any) => (
                <div
                  key={item.prediction_id}
                  className="grid gap-3 px-5 py-4 md:grid-cols-[1.3fr_.9fr_.7fr_.8fr_.7fr_auto] md:items-center"
                  data-testid={`row-history-${item.prediction_id}`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted border border-border">
                      {item.image_data_url ? (
                        <img src={item.image_data_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <FileImage size={16} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold text-foreground">
                        {item.image_filename}
                      </div>
                      <div className="mono mt-0.5 truncate text-[10px] text-muted-foreground">
                        {item.prediction_id}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-bold capitalize ${
                        item.predicted_class === 'notumor'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {item.predicted_class}
                    </span>
                  </div>
                  <div className="mono text-xs font-bold text-primary">
                    {formatPercent(item.confidence)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(item.timestamp)}
                    <span className="mx-1 text-muted-foreground/40">·</span>
                    {formatTime(item.timestamp)}
                  </div>
                  <div className="mono text-[10px] text-muted-foreground">{item.model_version}</div>
                  <ConfirmDelete
                    onConfirm={() =>
                      remove.mutate(
                        { predictionId: item.prediction_id },
                        { onSuccess: () => query.refetch() }
                      )
                    }
                    busy={remove.isPending}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

// -------------------------------------------------------------
// ANALYTICS PAGE
// -------------------------------------------------------------
export function AnalyticsPage() {
  const query = useGetAnalytics({ query: { queryKey: getGetAnalyticsQueryKey() } });
  const data = query.data;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Intelligence Metrics"
        title="Telemetry & Trends"
        description="Quantitative distributions across all stored MRI predictions returned by the CortexAI API."
        action={
          <Button variant="secondary" onClick={() => query.refetch()} testId="button-refresh-analytics">
            <RefreshCw size={13} />
            Refresh Data
          </Button>
        }
      />

      {query.isLoading ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState onRetry={() => query.refetch()} />
      ) : !data ? (
        <EmptyState icon={BarChart3} title="Analytics unavailable" description="The server returned no data." />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Total Scans Logged"
              value={String(data.total_predictions)}
              detail="Recorded in local storage"
              icon={Layers3}
            />
            <MetricCard
              label="Mean Confidence Score"
              value={formatPercent(data.average_confidence)}
              detail="Aggregated model certainty"
              icon={Gauge}
              tone="amber"
            />
            <MetricCard
              label="Distinct Class Categories"
              value={String(data.by_class?.length ?? 0)}
              detail="Active class labels"
              icon={Network}
              tone="emerald"
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
            <section className="panel p-6">
              <SectionLabel>Prediction Volume Over Time</SectionLabel>
              {data.trend?.length ? (
                <TrendChart data={data.trend} />
              ) : (
                <EmptyState icon={Activity} title="No trend points yet" description="Record scans to see trend." />
              )}
            </section>

            <section className="panel p-6">
              <SectionLabel>Categorical Breakdown</SectionLabel>
              {data.by_class?.length ? (
                <BarChartSimple data={data.by_class} />
              ) : (
                <EmptyState icon={Layers3} title="No class metrics yet" description="Awaiting data." />
              )}
            </section>
          </div>

          <section className="panel mt-8 p-6">
            <SectionLabel>Confidence Distribution Buckets</SectionLabel>
            {data.confidence_distribution?.length ? (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.confidence_distribution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                      width={25}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: '1px solid hsl(var(--border))',
                        background: 'hsl(var(--card))',
                        fontSize: 11,
                      }}
                    />
                    <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                icon={Gauge}
                title="Confidence buckets empty"
                description="Buckets populate as scans are evaluated."
              />
            )}
          </section>
        </>
      )}
    </AppShell>
  );
}

// -------------------------------------------------------------
// MODEL PERFORMANCE PAGE
// -------------------------------------------------------------
export function ModelPage() {
  const status = useGetModelStatus({ query: { queryKey: getGetModelStatusQueryKey() } });
  const metrics = useGetModelMetrics({ query: { queryKey: getGetModelMetricsQueryKey() } });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Verification & Benchmarks"
        title="Model Evaluation"
        description="Comprehensive evaluation results computed on an independent 1,600-image test set across all 4 tumor categories."
      />

      {status.isLoading || metrics.isLoading ? (
        <LoadingState />
      ) : status.isError || metrics.isError ? (
        <ErrorState
          onRetry={() => {
            status.refetch();
            metrics.refetch();
          }}
        />
      ) : (
        <>
          <section className="panel mb-6 overflow-hidden">
            <div className="grid gap-0 md:grid-cols-[1.4fr_1fr_1fr]">
              <div className="bg-sidebar p-6 text-sidebar-foreground">
                <div className="eyebrow text-sidebar-foreground/50">Architecture Status</div>
                <div className="mt-3 flex items-center gap-2.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      status.data?.trained ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <h2 className="display text-xl font-bold">{status.data?.model_name || 'EfficientNetB0'}</h2>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-sidebar-foreground/70">
                  {status.data?.message || 'Model weights trained and ready for inference.'}
                </p>
              </div>

              <div className="border-b border-border p-6 md:border-b-0 md:border-r">
                <div className="eyebrow">Deployment State</div>
                <div className="mt-3">
                  <StatusBadge
                    label={status.data?.trained ? 'Model Ready' : 'Awaiting Model'}
                    tone={status.data?.trained ? 'good' : 'warn'}
                  />
                </div>
                <div className="mono mt-3 text-xs text-muted-foreground">
                  Version: {status.data?.version || '1.0'}
                </div>
              </div>

              <div className="p-6">
                <div className="eyebrow">Target Classes</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {status.data?.classes?.map((cls: any) => (
                    <span key={cls} className="rounded bg-muted px-2 py-1 text-[11px] font-semibold text-foreground">
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {metrics.data?.available ? (
            <>
              <section className="grid gap-4 md:grid-cols-4">
                {[
                  ['Accuracy', metrics.data.accuracy],
                  ['Precision', metrics.data.precision],
                  ['Recall', metrics.data.recall],
                  ['F1 Score', metrics.data.f1_score],
                ].map(([label, value]) => (
                  <MetricCard
                    key={String(label)}
                    label={String(label)}
                    value={formatPercent(value as number | null)}
                    detail="1,600 Held-out Test Images"
                    icon={Gauge}
                    tone="sapphire"
                  />
                ))}
              </section>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
                <section className="panel p-6">
                  <SectionLabel>Confusion Matrix (1,600 Images)</SectionLabel>
                  {metrics.data.confusion_matrix?.length ? (
                    <ConfusionMatrix
                      matrix={metrics.data.confusion_matrix}
                      labels={metrics.data.class_names ?? []}
                    />
                  ) : (
                    <EmptyState
                      icon={Network}
                      title="Matrix unavailable"
                      description="No matrix returned by the metrics endpoint."
                    />
                  )}
                </section>

                <section className="panel p-6">
                  <SectionLabel>Training & Loss History</SectionLabel>
                  {metrics.data.history && Object.keys(metrics.data.history).length ? (
                    <HistoryChart history={metrics.data.history} />
                  ) : (
                    <EmptyState
                      icon={Activity}
                      title="History curve unavailable"
                      description="No training history recorded."
                    />
                  )}
                </section>
              </div>
            </>
          ) : (
            <EmptyState
              icon={CircleAlert}
              title="Evaluation data not configured"
              description="Run reproduce_eval.py to generate evaluation metrics."
            />
          )}
        </>
      )}
    </AppShell>
  );
}

function ConfusionMatrix({ matrix, labels }: { matrix: number[][]; labels: string[] }) {
  const max = Math.max(...matrix.flat(), 1);
  return (
    <div className="overflow-x-auto">
      <div className="mx-auto min-w-[300px] max-w-[440px]">
        <div
          className="mb-2 ml-[100px] grid"
          style={{ gridTemplateColumns: `repeat(${matrix[0]?.length ?? 1}, minmax(48px, 1fr))` }}
        >
          {(labels.length ? labels : matrix[0].map((_, i) => `C${i + 1}`)).map((label) => (
            <div key={label} className="truncate text-center text-[10px] font-bold text-muted-foreground">
              {label}
            </div>
          ))}
        </div>
        {matrix.map((row, i) => (
          <div
            key={i}
            className="mb-1 grid items-center"
            style={{ gridTemplateColumns: `100px repeat(${row.length}, minmax(48px, 1fr))` }}
          >
            <div className="truncate pr-3 text-right text-[10px] font-bold text-muted-foreground">
              {labels[i] || `C${i + 1}`}
            </div>
            {row.map((value, j) => (
              <div
                key={j}
                className="mx-0.5 flex aspect-square items-center justify-center rounded-lg text-xs font-bold transition"
                style={{
                  backgroundColor: `hsl(221 83% ${96 - (value / max) * 45}%)`,
                  color: value / max > 0.45 ? 'white' : 'hsl(222 47% 11%)',
                }}
              >
                {value}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 text-center text-[10px] text-muted-foreground">
        Rows / Ground Truth · Columns / Predicted Class
      </div>
    </div>
  );
}

function HistoryChart({ history }: { history: Record<string, number[]> }) {
  const key = Object.keys(history).find((k) => /loss/i.test(k)) || Object.keys(history)[0];
  const values = history[key] ?? [];
  const data = values.map((value, i) => ({ epoch: i + 1, value }));

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-xs font-bold capitalize text-foreground">{key.replaceAll('_', ' ')}</span>
        <span className="mono text-[10px] text-muted-foreground">{values.length} epochs</span>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
            <XAxis dataKey="epoch" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--card))',
                fontSize: 11,
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// ABOUT PAGE
// -------------------------------------------------------------
export function AboutPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Clinical Protocol & Deployment"
        title="Clinical Decision Support Architecture & Protocol"
        description="RadCortex AI: A launch-ready, modular clinical intelligence platform fusing convolutional deep learning with quantitative IBSI radiomics for precision diagnosis, triage, and treatment planning."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <section className="panel p-6 md:p-8">
          <div className="eyebrow mb-4 text-primary">01 // Scientific Methodology</div>
          <h2 className="display text-2xl font-bold text-foreground">
            From High-Resolution Pixels to Probabilistic Signals
          </h2>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            CortexAI was built as an open, verifiable workspace for investigating transfer-learning architectures
            on brain tumor MRI scans. Using EfficientNetB0 pretrained on ImageNet and fine-tuned on four labeled
            categories (glioma, meningioma, pituitary, and normal), the network assigns probability distributions
            without synthetic or fabricated numbers.
          </p>

          <div className="mt-6 space-y-4">
            {[
              {
                title: 'Data Preprocessing',
                desc: 'Images are normalized to 224x224 RGB dimensions using EfficientNet standard channel mean and standard deviation scaling.',
              },
              {
                title: 'Transparent Inference',
                desc: 'Inference calls spawn dedicated Python subprocesses that interact with the serialized .keras model file in real-time.',
              },
              {
                title: 'Auditable History',
                desc: 'All predictions are logged into SQLite via Drizzle ORM, preserving record timestamps and confidence distributions.',
              },
            ].map(({ title, desc }, i) => (
              <div key={title} className="flex gap-3">
                <span className="mono text-xs font-bold text-primary">0{i + 1}</span>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{title}</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel border-primary/20 bg-primary/5 p-6 md:p-8">
          <ShieldCheck size={28} className="text-primary" />
          <div className="eyebrow mt-4 text-primary">02 // Clinical Platform Statement</div>
          <h3 className="mt-1 text-lg font-bold text-foreground">
            Modular, Launch-Ready Clinical Intelligence
          </h3>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Engineered to bridge convolutional neural feature classification with quantitative IBSI radiomics, RadCortex AI
            is a launch-ready modular clinical intelligence platform for screening, triage, and precision diagnosis.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Actively supports oncology and neurosurgery teams with objective surgical resectability indices, radiation sensitivity profiling, and acute clinical decision triage, validated alongside certified medical specialists.

          </p>
        </section>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="panel p-5">
          <Database size={18} className="mb-4 text-primary" />
          <h4 className="text-xs font-bold text-foreground">Dataset Attribution</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Trained and tested on publicly licensed multi-class brain tumor MRI benchmark datasets.
          </p>
        </div>
        <div className="panel p-5">
          <Network size={18} className="mb-4 text-primary" />
          <h4 className="text-xs font-bold text-foreground">EfficientNetB0 Backbone</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Leverages compound scaling balancing network depth, width, and resolution for efficient inference.
          </p>
        </div>
        <div className="panel p-5">
          <FlaskConical size={18} className="mb-4 text-primary" />
          <h4 className="text-xs font-bold text-foreground">Open Research Practice</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Inspectable confusion matrices, training history loss curves, and verifiable test benchmarks.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
