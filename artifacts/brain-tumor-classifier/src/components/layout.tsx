import { Link, useLocation } from 'wouter';
import {
  Activity,
  BarChart3,
  Brain,
  ChevronRight,
  Database,
  FileImage,
  History,
  Info,
  Menu,
  Network,
  Upload,
  Sparkles,
  BookOpen,
  Layers,
  X,
  ShieldCheck,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { useState, type ComponentType, type ReactNode } from 'react';
import { BrainThemeToggle } from './skiper/theme-toggle';
import { AnimatedOrganIcon } from './skiper/animated-icons';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Activity },
  { href: '/classify', label: 'Studio Classifier', icon: Upload, highlight: true },
  { href: '/omni-ai-studio', label: 'Omni-AI Studio', icon: Sparkles, isOmni: true },
  { href: '/radiomics', label: 'Multi-Organ Radiomics', icon: Layers, isNew: true },
  { href: '/backend-neural-networking', label: 'Neural Network Engine', icon: Cpu, isDev: true },
  { href: '/guide', label: 'Clinical User Guide', icon: BookOpen },
  { href: '/history', label: 'Scan Archive', icon: History },
  { href: '/analytics', label: 'Telemetry & Trends', icon: BarChart3 },
  { href: '/model', label: 'Model Evaluation', icon: Network },
];

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" data-testid="link-brand">
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md border border-primary/25 transition-transform duration-200 group-hover:scale-105">
        <Brain size={22} strokeWidth={2.2} />
        <span className="absolute -right-1 -top-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-background bg-accent" />
        </span>
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5 text-[15px] font-black tracking-tight text-foreground font-serif">
            <span>RadCortex</span>
            <span className="rounded bg-accent/15 border border-accent/30 px-1.5 py-0.2 text-[11px] font-black tracking-normal text-accent">
              AI
            </span>
          </div>
          <span className="mt-0.5 block text-[8.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground truncate max-w-[170px]">
            Savile Clinical Suite
          </span>
        </div>
      )}
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell flex min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[265px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 no-print md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[72px] items-center border-b border-sidebar-border px-5">
          <BrandMark />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-5">
          <div className="eyebrow mb-2.5 px-2 text-[10px] font-bold tracking-widest text-sidebar-foreground/50 uppercase">
            Workspaces & Modalities
          </div>
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon, highlight, isNew, isDev, isOmni }: any) => {
              const active = location === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  }`}
                  data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}
                >
                  <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                  <span>{label}</span>
                  {isOmni && !active && (
                    <span className="ml-auto rounded-full bg-purple-500/15 px-1.5 py-0.5 text-[9px] font-black text-purple-400 border border-purple-500/30">
                      5 AI
                    </span>
                  )}
                  {isNew && !active && (
                    <span className="ml-auto rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                      Multi-Organ
                    </span>
                  )}
                  {isDev && !active && (
                    <span className="ml-auto rounded-full bg-indigo-500/15 px-1.5 py-0.5 text-[9px] font-bold text-indigo-500 border border-indigo-500/30">
                      Dev Live
                    </span>
                  )}
                  {highlight && !active && !isNew && (
                    <span className="ml-auto rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[9px] font-bold text-blue-600 dark:text-blue-400">
                      Live
                    </span>
                  )}
                  {active && <ChevronRight size={14} className="ml-auto opacity-80" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-7">
            <div className="eyebrow mb-2.5 px-2 text-[10px] font-bold tracking-widest text-sidebar-foreground/50 uppercase">
              Clinical Protocol
            </div>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              data-testid="link-nav-about"
            >
              <Info size={15} />
              <span>Research Ethics & Guidelines</span>
            </Link>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="mono text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/80">
                  Dual Engines Active
                </span>
              </div>
              <span className="mono text-[9px] text-sidebar-foreground/50">v2.4 (IBSI)</span>
            </div>
            <p className="mt-1 text-[10px] leading-relaxed text-sidebar-foreground/60">
              EfficientNetB0 + IBSI Radiomics (15+ Biomarkers)
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between px-1 text-[10px] text-sidebar-foreground/45">
            <span className="mono flex items-center gap-1.5">
              <Database size={11} /> SQLite Connected
            </span>
            <span className="mono">CLINICAL SUITE</span>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {open && (
        <button
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          data-testid="button-close-navigation"
        />
      )}

      {/* Main Content Area */}
      <main className="min-w-0 flex-1 md:ml-[265px] flex flex-col justify-between">
        <div>
          <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/80 bg-background/85 px-5 backdrop-blur-md no-print md:px-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setOpen(true)}
                className="rounded-lg border border-border p-2 text-muted-foreground transition hover:bg-muted md:hidden"
                aria-label="Open navigation"
                data-testid="button-open-navigation"
              >
                <Menu size={19} />
              </button>
              <div className="hidden items-center gap-2.5 text-xs text-muted-foreground sm:flex">
                <span className="flex h-2 w-2 rounded-full bg-blue-500" />
                <span className="mono text-[11px] font-semibold tracking-wide text-foreground">
                  RADCORTEX // DEEP LEARNING WITH RADIOMICS
                </span>
                <span className="text-[10px] rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
                  DISEASE DIAGNOSIS & TREATMENT
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/omni-ai-studio"
                className="hidden xl:inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-bold text-purple-400 hover:bg-purple-500/20 transition"
              >
                <Sparkles size={13} className="text-purple-400 animate-pulse" />
                <span>Omni-AI Studio (5 Engines)</span>
              </Link>
              {/* Brain Synaptic Theme Toggle (Skiper4 + Skiper26) */}
              <BrainThemeToggle />

              {location !== '/classify' && (
                <Link
                  href="/classify"
                  className="hidden items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 sm:inline-flex"
                >
                  <Sparkles size={13} />
                  <span>Scan Studio</span>
                </Link>
              )}
            </div>
          </header>

          <div className="px-5 py-8 md:px-10 md:py-10">{children}</div>
        </div>

        {/* Global Clinical Footer */}
        <footer className="mt-20 border-t border-border/70 bg-card/60 px-6 py-10 md:px-10 text-xs text-muted-foreground no-print">
          <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Brain size={18} className="text-blue-600" />
                <span>RadCortex Clinical Suite</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Deep Learning With Radiomics for Disease Diagnosis and Treatment. Bridging convolutional neural classification with IBSI-standardized quantitative phenotypic biomarkers.
              </p>
              <div className="flex items-center gap-2 text-[10px] mono text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={12} /> HIPAA-Ready Local Persistence
              </div>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-3 text-xs uppercase tracking-wider">
                Clinical Modalities
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li><Link href="/classify" className="hover:text-foreground">Neuro-Oncology (Cranial MRI)</Link></li>
                <li><Link href="/radiomics" className="hover:text-foreground">Thoracic & Pulmonary (Chest CT)</Link></li>
                <li><Link href="/radiomics" className="hover:text-foreground">Hepato-Biliary (Liver MRI / CT)</Link></li>
                <li><Link href="/radiomics" className="hover:text-foreground">Musculoskeletal & Trabecular</Link></li>
                <li><Link href="/radiomics" className="hover:text-foreground">Pelvic & Breast Dynamic DCE-MRI</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-3 text-xs uppercase tracking-wider">
                Documentation & Guides
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li><Link href="/guide" className="hover:text-foreground">Step-by-Step Clinical Manual</Link></li>
                <li><Link href="/guide#interactive-bullseye" className="hover:text-foreground">Target Reticle Inspection</Link></li>
                <li><Link href="/guide#quantitative-radiomics" className="hover:text-foreground">GLCM Texture Mathematics</Link></li>
                <li><Link href="/guide#treatment-planning" className="hover:text-foreground">Surgical Resectability Index</Link></li>
                <li><Link href="/about" className="hover:text-foreground">Ethics & AI Bias Guidelines</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-3 text-xs uppercase tracking-wider">
                System Telemetry
              </h4>
              <div className="rounded-xl border border-border bg-background p-3 space-y-2 text-[10px] mono">
                <div className="flex justify-between">
                  <span>Inference:</span>
                  <span className="text-emerald-500 font-bold">EfficientNetB0 (Active)</span>
                </div>
                <div className="flex justify-between">
                  <span>Radiomics:</span>
                  <span className="text-blue-500 font-bold">15+ Biomarkers IBSI</span>
                </div>
                <div className="flex justify-between">
                  <span>Persistence:</span>
                  <span className="text-foreground">SQLite (Encrypted)</span>
                </div>
                <div className="flex justify-between">
                  <span>Port Binding:</span>
                  <span className="text-muted-foreground">API :8001 / UI :5173</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px]">
            <div>
              &copy; {new Date().getFullYear()} RadCortex AI. Built for Academic Research & Clinical Decision Support.
            </div>
            <div className="flex items-center gap-4">
              <span>FDA Class II Investigational Software</span>
              <span>·</span>
              <span>ISO 13485 Principles</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <div className="eyebrow mb-2 text-blue-600 dark:text-blue-400 font-bold">{eyebrow}</div>
        <h1 className="display text-3xl font-extrabold tracking-tight md:text-4xl text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function StatusBadge({ label, tone = 'good' }: { label: string; tone?: 'good' | 'warn' | 'neutral' }) {
  const tones = {
    good: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    warn: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    neutral: 'bg-muted text-muted-foreground border-border',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${tone === 'good' ? 'bg-emerald-500 animate-pulse' : tone === 'warn' ? 'bg-amber-500' : 'bg-muted-foreground'}`} />
      {label}
    </span>
  );
}

export function SectionLabel({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-2">
      <h3 className="eyebrow text-xs font-bold uppercase tracking-wider text-foreground">
        {children}
      </h3>
      {right}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: any;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
        <Icon size={22} />
      </div>
      <h4 className="text-sm font-bold text-foreground">{title}</h4>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Failed to load telemetry",
  description = "Could not synchronize state with backend server.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 text-center">
      <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400">{title}</h4>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
}

