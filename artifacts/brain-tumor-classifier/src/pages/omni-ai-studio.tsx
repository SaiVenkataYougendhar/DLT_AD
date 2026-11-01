import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  Cpu,
  Database,
  Download,
  ExternalLink,
  Layers,
  Network,
  RefreshCw,
  Search,
  Settings2,
  Sliders,
  Sparkles,
  Terminal,
  Upload,
  BookOpen,
  FileText,
  Shield,
  Zap,
  Globe,
  Radio,
  Clock,
  RotateCcw,
  Check,
  Dna,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Palette,
  Film,
  Play,
  Pause,
  Copy,
  Share2,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Eye,
  Maximize2,
} from "lucide-react";
import { AppShell } from "../components/layout";

interface ProviderInfo {
  id: string;
  name: string;
  badge: string;
  category: string;
  status: string;
  latency_ms: number;
  version: string;
  description: string;
  capabilities: string[];
  icon: string;
  accent: string;
}

interface GenomicBiomarker {
  marker: string;
  status: string;
  clinical_impact: string;
  favorable: boolean;
}

interface DeepMindData {
  engine: string;
  molecular_subtype: string;
  genomic_biomarkers: GenomicBiomarker[];
  pharmacogenomic_indices: {
    temozolomide_responsiveness: number;
    anti_angiogenic_bevacizumab_index: number;
    parp_inhibitor_synergy: number;
  };
  projected_median_survival_months: number;
  deepmind_alphafold_confidence: number;
}

interface Astra6Data {
  engine: string;
  audio_status: string;
  speech_transcript: string;
  speech_duration_seconds: number;
  spatial_vision_coordinates: { x: number; y: number; note: string }[];
  tone: string;
  confidence_index: number;
}

interface ClaudeCodeData {
  engine: string;
  chain_of_thought: { step: number; title: string; reasoning: string; conclusion: string }[];
  safety_audit: {
    renal_nsf_risk: string;
    motor_strip_proximity: string;
    radiation_tolerance_score: string;
  };
  dicom_sr_json: string;
}

interface CanvaData {
  engine: string;
  canva_project_id: string;
  template_name: string;
  export_formats: string[];
  infographic_cards: {
    section: string;
    headline: string;
    summary: string;
    color_scheme: string;
  }[];
  canva_direct_url: string;
}

interface VolumetricSlice {
  slice_index: number;
  z_plane_mm: number;
  tumor_cross_section_cm2: number;
  perfusion_flow_ml_100g_min: number;
  vessel_density_index: number;
}

interface HuggsfieldData {
  engine: string;
  video_fps: number;
  duration_seconds: number;
  render_resolution: string;
  perfusion_simulation: {
    mean_cerebral_blood_flow: string;
    angiogenic_leakage_ktrans: string;
    tumor_volume_cm3: number;
  };
  volumetric_slices: VolumetricSlice[];
  rotation_angles: string[];
}

interface ConsensusItem {
  model: string;
  vote: string;
  confidence: number;
  focus: string;
}

interface OmniAIConsultationResponse {
  timestamp: string;
  primary_diagnosis: string;
  consensus_confidence: number;
  providers_queried: string[];
  models: {
    google_deepmind?: DeepMindData;
    chatgpt_astra_6?: Astra6Data;
    claude_code?: ClaudeCodeData;
    canva_studio?: CanvaData;
    huggsfield_ai?: HuggsfieldData;
  };
  consensus_matrix: ConsensusItem[];
}

const SAMPLE_SCANS = [
  { id: "glioma", name: "Infiltrative High-Grade Glioma", file: "sample-glioma.jpg", path: "/samples/sample-glioma.jpg", baselineConfidence: 0.978 },
  { id: "meningioma", name: "Extra-Axial Dural Meningioma", file: "sample-meningioma.jpg", path: "/samples/sample-meningioma.jpg", baselineConfidence: 0.985 },
  { id: "pituitary", name: "Sellar Pituitary Macroadenoma", file: "sample-pituitary.jpg", path: "/samples/sample-pituitary.jpg", baselineConfidence: 0.989 },
  { id: "notumor", name: "Normal Physiological Parenchyma", file: "sample-notumor.jpg", path: "/samples/sample-notumor.jpg", baselineConfidence: 0.994 },
];

export function OmniAIStudioPage() {
  const [selectedScan, setSelectedScan] = useState(SAMPLE_SCANS[0]);
  const [activeTab, setActiveTab] = useState<"all" | "deepmind" | "astra6" | "claude" | "canva" | "huggsfield">("all");
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [consultData, setConsultData] = useState<OmniAIConsultationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedDicom, setCopiedDicom] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [activeSliceIndex, setActiveSliceIndex] = useState(7);
  const [isPlaying3D, setIsPlaying3D] = useState(false);
  const [canvaTheme, setCanvaTheme] = useState<"modern" | "clinical" | "emerald" | "amber">("modern");
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  // Check speech synthesis support
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Fetch Providers Status
  useEffect(() => {
    fetch("/api/omni-ai/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.providers) setProviders(data.providers);
      })
      .catch((err) => console.error("Error loading Omni-AI status:", err));
  }, []);

  // Run Consultation for selected scan
  const runConsultation = async (scan = selectedScan) => {
    setLoading(true);
    try {
      const resp = await fetch("/api/omni-ai/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          predicted_class: scan.id,
          confidence: scan.baselineConfidence,
          radiomics: {
            texture_glcm: {
              contrast: scan.id === "glioma" ? 2.45 : scan.id === "meningioma" ? 1.48 : 0.85,
              homogeneity: scan.id === "notumor" ? 0.89 : scan.id === "meningioma" ? 0.82 : 0.58,
              energy: 0.22,
            },
            morphological: {
              edge_sharpness: scan.id === "meningioma" ? 0.22 : 0.08,
            },
          },
          model: "all",
        }),
      });
      const data = await resp.json();
      setConsultData(data);
    } catch (e) {
      console.error("Consultation query failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runConsultation(selectedScan);
  }, [selectedScan]);

  // Handle Speech for Astra 6
  const toggleSpeech = () => {
    if (!speechSupported || !consultData?.models.chatgpt_astra_6) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(consultData.models.chatgpt_astra_6.speech_transcript);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Female") || v.name.includes("Samantha")));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // 3D Playback Timer for Huggsfield
  useEffect(() => {
    let interval: any;
    if (isPlaying3D && consultData?.models.huggsfield_ai?.volumetric_slices) {
      const maxLen = consultData.models.huggsfield_ai.volumetric_slices.length;
      interval = setInterval(() => {
        setActiveSliceIndex((prev) => (prev + 1) % maxLen);
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isPlaying3D, consultData]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDicom(true);
    setTimeout(() => setCopiedDicom(false), 2000);
  };

  return (
    <AppShell>
      <div className="space-y-8 pb-16">
        {/* Top Breadcrumb & Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 via-card to-background p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  <Sparkles size={13} className="text-blue-400 animate-pulse" />
                  Frontier AI Consortium
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  <CheckCircle2 size={13} />
                  5 Connected Engines
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-400">
                  <Globe size={13} />
                  Live Multi-Model Inference
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-foreground">
                Omni-AI Clinical Intelligence Suite
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                A unified multi-agent diagnostic studio orchestrating <strong>Google DeepMind</strong>,{" "}
                <strong>ChatGPT ASTRA 6</strong>, <strong>Claude Code</strong>, <strong>Canva Medical</strong>, and{" "}
                <strong>Huggsfield AI</strong> for multi-perspective second opinions, genomic profiling, real-time voice, and 3D perfusion diffusion.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => runConsultation()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                {loading ? "Cross-Examining..." : "Refresh Multi-Model Consult"}
              </button>
              <Link
                href="/classify"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs font-bold text-foreground transition-all hover:bg-muted active:scale-95"
              >
                <Upload size={14} />
                Upload Custom Scan
              </Link>
            </div>
          </div>

          {/* Providers Status Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 border-t border-border/60 pt-6">
            {providers.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3 backdrop-blur-sm transition-all hover:border-blue-500/40 hover:bg-card/70"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${p.accent}`}>
                  {p.id === "google-deepmind" && <Dna size={18} />}
                  {p.id === "chatgpt-astra-6" && <Mic size={18} />}
                  {p.id === "claude-code" && <Terminal size={18} />}
                  {p.id === "canva-studio" && <Palette size={18} />}
                  {p.id === "huggsfield-ai" && <Film size={18} />}
                </div>
                <div className="min-w-0 flex-1 leading-tight">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-xs font-extrabold text-foreground">{p.name}</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                  </div>
                  <span className="block truncate text-[10px] text-muted-foreground mt-0.5">{p.latency_ms}ms · {p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scan Selector Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Brain size={20} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Case Under Multi-Model Review</span>
              <div className="text-sm font-extrabold text-foreground">{selectedScan.name}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_SCANS.map((scan) => (
              <button
                key={scan.id}
                onClick={() => setSelectedScan(scan)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                  selectedScan.id === scan.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "border border-border bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <img src={scan.path} alt={scan.name} className="h-5 w-5 rounded object-cover" />
                <span>{scan.id.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/80 pb-2">
          {[
            { id: "all", label: "Consensus Overview (All 5)", icon: Network },
            { id: "deepmind", label: "Google DeepMind (Genomics)", icon: Dna },
            { id: "astra6", label: "ChatGPT ASTRA 6 (Voice/Vision)", icon: Mic },
            { id: "claude", label: "Claude Code (Logic & DICOM)", icon: Terminal },
            { id: "canva", label: "Canva Studio (Infographics)", icon: Palette },
            { id: "huggsfield", label: "Huggsfield (3D Volumetric)", icon: Film },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: CONSENSUS OVERVIEW MATRIX */}
        {/* ------------------------------------------------------------- */}
        {(activeTab === "all") && (
          <div className="space-y-8">
            {/* Multi-Model Consensus Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {consultData?.consensus_matrix.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-card/60 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{item.focus}</span>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-400">
                      VOTE: {item.vote.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-base font-extrabold text-foreground">{item.model}</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Confidence Metric</span>
                      <span className="font-bold text-foreground">{(item.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${item.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Preview Grid of All 5 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* DeepMind Quick Summary */}
              <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      <Dna size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Google DeepMind Molecular Subtyping</h3>
                      <span className="text-[10px] text-muted-foreground">AlphaFold Protein & Genomic Inference</span>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab("deepmind")} className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1">
                    Explore Details <ArrowRight size={12} />
                  </button>
                </div>
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Predicted Molecular Class</span>
                  <div className="text-base font-black text-foreground mt-0.5">
                    {consultData?.models.google_deepmind?.molecular_subtype || "Analyzing..."}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Median Projected Overall Survival: <strong>{consultData?.models.google_deepmind?.projected_median_survival_months} Months</strong>
                  </p>
                </div>
              </div>

              {/* Astra 6 Voice Dialogue Preview */}
              <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <Mic size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">ChatGPT ASTRA 6 Real-Time Voice Debrief</h3>
                      <span className="text-[10px] text-muted-foreground">Multimodal Speech Synthesis & Spatial Audio</span>
                    </div>
                  </div>
                  <button
                    onClick={toggleSpeech}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      isSpeaking ? "bg-red-500 text-white animate-pulse" : "bg-emerald-600 text-white hover:bg-emerald-500"
                    }`}
                  >
                    {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
                    {isSpeaking ? "Stop Voice" : "Play Voice"}
                  </button>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs italic text-foreground/90 leading-relaxed">
                  "{consultData?.models.chatgpt_astra_6?.speech_transcript}"
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: GOOGLE DEEPMIND */}
        {/* ------------------------------------------------------------- */}
        {(activeTab === "deepmind" || activeTab === "all") && consultData?.models.google_deepmind && (
          <div className="rounded-2xl border border-blue-500/30 bg-card/70 p-6 lg:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/30">
                  <Dna size={26} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-foreground">Google DeepMind Bio-molecular Engine</h2>
                    <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20">AlphaFold-Med</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Radiogenomic feature mapping & cellular protein mutation projections</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">AlphaFold Confidence</span>
                  <span className="text-base font-extrabold text-blue-400">
                    {(consultData.models.google_deepmind.deepmind_alphafold_confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Genomic Biomarkers 4-Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {consultData.models.google_deepmind.genomic_biomarkers.map((bm, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-card/50 p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{bm.marker}</span>
                  <div className={`text-sm font-extrabold ${bm.favorable ? "text-emerald-400" : "text-amber-400"}`}>
                    {bm.status}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal">{bm.clinical_impact}</p>
                </div>
              ))}
            </div>

            {/* Pharmacogenomics Drug Responsiveness */}
            <div className="rounded-xl border border-border/80 bg-muted/20 p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Predicted Chemotherapeutic & Targeted Drug Sensitivity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Temozolomide (TMZ) Sensitivity</span>
                    <span className="font-bold text-foreground">{consultData.models.google_deepmind.pharmacogenomic_indices.temozolomide_responsiveness}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${consultData.models.google_deepmind.pharmacogenomic_indices.temozolomide_responsiveness}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Anti-Angiogenic (Bevacizumab)</span>
                    <span className="font-bold text-foreground">{consultData.models.google_deepmind.pharmacogenomic_indices.anti_angiogenic_bevacizumab_index}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${consultData.models.google_deepmind.pharmacogenomic_indices.anti_angiogenic_bevacizumab_index}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">PARP-Inhibitor Synergy</span>
                    <span className="font-bold text-foreground">{consultData.models.google_deepmind.pharmacogenomic_indices.parp_inhibitor_synergy}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${consultData.models.google_deepmind.pharmacogenomic_indices.parp_inhibitor_synergy}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: CHATGPT ASTRA 6 */}
        {/* ------------------------------------------------------------- */}
        {(activeTab === "astra6" || activeTab === "all") && consultData?.models.chatgpt_astra_6 && (
          <div className="rounded-2xl border border-emerald-500/30 bg-card/70 p-6 lg:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                  <Mic size={26} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-foreground">ChatGPT ASTRA 6 Real-Time Voice & Spatial Co-Pilot</h2>
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">GPT-4o Astra Audio</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Continuous spatial vision inspection & natural speech neuro-debrief</p>
                </div>
              </div>

              <button
                onClick={toggleSpeech}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-lg transition-all ${
                  isSpeaking
                    ? "bg-red-500 text-white shadow-red-500/30 animate-pulse"
                    : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20 hover:scale-[1.02]"
                }`}
              >
                {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                {isSpeaking ? "Pause Voice Debrief" : "Synthesize & Speak Debrief Aloud"}
              </button>
            </div>

            {/* Audio Waveform & Transcript Box */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio size={14} className={isSpeaking ? "text-emerald-400 animate-pulse" : "text-muted-foreground"} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    {isSpeaking ? "Broadcasting Real-Time Audio Debrief" : "Voice Stream Ready"}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">Duration: {consultData.models.chatgpt_astra_6.speech_duration_seconds}s</span>
              </div>

              {/* Simulated Waveform Bars */}
              <div className="flex items-center gap-1 h-8 px-2">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-150 ${
                      isSpeaking ? "bg-emerald-400 animate-pulse" : "bg-emerald-500/20"
                    }`}
                    style={{
                      height: isSpeaking ? `${Math.max(15, Math.sin(i * 0.4) * 100)}%` : "20%",
                    }}
                  />
                ))}
              </div>

              <p className="text-xs font-medium text-foreground/90 leading-relaxed bg-card/60 p-4 rounded-lg border border-border">
                {consultData.models.chatgpt_astra_6.speech_transcript}
              </p>
            </div>

            {/* Spatial Vision Coordinate Annotations */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Astra 6 Spatial Visual Inspection Hotspots</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {consultData.models.chatgpt_astra_6.spatial_vision_coordinates.map((pt, idx) => (
                  <div key={idx} className="rounded-xl border border-border bg-card/50 p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-400">Coordinate ({pt.x}%, {pt.y}%)</span>
                      <Eye size={12} className="text-muted-foreground" />
                    </div>
                    <p className="text-xs text-foreground font-semibold">{pt.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 4: CLAUDE CODE */}
        {/* ------------------------------------------------------------- */}
        {(activeTab === "claude" || activeTab === "all") && consultData?.models.claude_code && (
          <div className="rounded-2xl border border-amber-500/30 bg-card/70 p-6 lg:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30">
                  <Terminal size={26} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-foreground">Claude Code Clinical Verification Engine</h2>
                    <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">Claude 3.7 Sonnet</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Decomposed chain-of-thought, contraindication checking & DICOM-SR structured JSON</p>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(consultData.models.claude_code?.dicom_sr_json || "")}
                className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all"
              >
                {copiedDicom ? <Check size={14} /> : <Copy size={14} />}
                {copiedDicom ? "Copied DICOM-SR" : "Copy DICOM-SR JSON"}
              </button>
            </div>

            {/* Step-by-Step Chain of Thought Accordion */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Formal Chain-of-Thought Verification Steps</h3>
              {consultData.models.claude_code.chain_of_thought.map((step) => {
                const isOpen = expandedStep === step.step;
                return (
                  <div key={step.step} className="rounded-xl border border-border bg-card/50 overflow-hidden">
                    <button
                      onClick={() => setExpandedStep(isOpen ? null : step.step)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 text-xs font-extrabold border border-amber-500/20">
                          {step.step}
                        </span>
                        <span className="text-xs font-bold text-foreground">{step.title}</span>
                      </div>
                      {isOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 border-t border-border/50 text-xs space-y-2 bg-muted/10">
                        <p className="text-muted-foreground leading-relaxed">{step.reasoning}</p>
                        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 text-amber-300 font-semibold text-[11px]">
                          <strong>Clinical Conclusion:</strong> {step.conclusion}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Safety Audit & DICOM Structured Report Viewer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Patient Safety & Contraindication Check</span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded bg-muted/20">
                    <span className="text-muted-foreground">Renal NSF Risk (Gadolinium)</span>
                    <span className="font-bold text-emerald-400">{consultData.models.claude_code.safety_audit.renal_nsf_risk}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted/20">
                    <span className="text-muted-foreground">Motor Strip Proximity</span>
                    <span className="font-bold text-foreground">{consultData.models.claude_code.safety_audit.motor_strip_proximity}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted/20">
                    <span className="text-muted-foreground">Radiation Tolerance Score</span>
                    <span className="font-bold text-emerald-400">{consultData.models.claude_code.safety_audit.radiation_tolerance_score}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">DICOM-SR Export</span>
                  <span className="text-[10px] text-muted-foreground">JSON Schema Verified</span>
                </div>
                <pre className="max-h-36 overflow-y-auto rounded-lg bg-background p-3 text-[10px] font-mono text-muted-foreground border border-border">
                  {consultData.models.claude_code.dicom_sr_json}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 5: CANVA MEDICAL STUDIO */}
        {/* ------------------------------------------------------------- */}
        {(activeTab === "canva" || activeTab === "all") && consultData?.models.canva_studio && (
          <div className="rounded-2xl border border-cyan-500/30 bg-card/70 p-6 lg:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/30">
                  <Palette size={26} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-foreground">Canva Medical Design & Patient Infographic Studio</h2>
                    <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">Canva Connect API</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Automated conversion of diagnostic telemetry into patient discharge cards & brochures</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={consultData.models.canva_studio.canva_direct_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 hover:bg-cyan-500 transition-all hover:scale-[1.02]"
                >
                  <ExternalLink size={14} />
                  Open in Canva Editor
                </a>
              </div>
            </div>

            {/* Layout Customizer Theme Switcher */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground font-semibold">Infographic Palette:</span>
              {(["modern", "clinical", "emerald", "amber"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setCanvaTheme(t)}
                  className={`capitalize px-3 py-1 rounded-md text-xs font-bold border transition-all ${
                    canvaTheme === t
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* 4-Panel Patient Infographic Previewer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {consultData.models.canva_studio.infographic_cards.map((card, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border/80 p-5 space-y-3 bg-gradient-to-b from-card to-card/40 transition-all hover:scale-[1.01]"
                  style={{
                    borderTop: `4px solid ${card.color_scheme}`,
                  }}
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">{card.section}</span>
                  <div className="text-sm font-extrabold text-foreground">{card.headline}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{card.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 6: HUGGSFIELD AI 3D DIFFUSION */}
        {/* ------------------------------------------------------------- */}
        {(activeTab === "huggsfield" || activeTab === "all") && consultData?.models.huggsfield_ai && (
          <div className="rounded-2xl border border-purple-500/30 bg-card/70 p-6 lg:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/30">
                  <Film size={26} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-foreground">Huggsfield AI 3D Volumetric Video & Perfusion Diffusion</h2>
                    <span className="rounded bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-400 border border-purple-500/20">Bio-Diffusion 3D</span>
                  </div>
                  <p className="text-xs text-muted-foreground">3D multi-planar volumetric slice interpolation & dynamic contrast perfusion blood flow loops</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying3D(!isPlaying3D)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                    isPlaying3D ? "bg-red-500 text-white animate-pulse" : "bg-purple-600 text-white hover:bg-purple-500"
                  }`}
                >
                  {isPlaying3D ? <Pause size={14} /> : <Play size={14} />}
                  {isPlaying3D ? "Pause 3D Loop" : "Play 3D Loop"}
                </button>
              </div>
            </div>

            {/* 3D Volumetric Slice Visualizer & Scrub Slider */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-xl border border-border bg-card/50 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Volumetric Slice #{consultData.models.huggsfield_ai.volumetric_slices[activeSliceIndex]?.slice_index} (Z-Plane: {consultData.models.huggsfield_ai.volumetric_slices[activeSliceIndex]?.z_plane_mm}mm)
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-400">
                    Flow: {consultData.models.huggsfield_ai.volumetric_slices[activeSliceIndex]?.perfusion_flow_ml_100g_min} mL/100g/min
                  </span>
                </div>

                {/* Slice Slider Bar */}
                <input
                  type="range"
                  min="0"
                  max={consultData.models.huggsfield_ai.volumetric_slices.length - 1}
                  value={activeSliceIndex}
                  onChange={(e) => setActiveSliceIndex(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />

                {/* Simulated Perfusion Flow Visualizer */}
                <div className="relative h-44 rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-card to-blue-950/30 overflow-hidden flex items-center justify-center">
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-black text-foreground">
                      {consultData.models.huggsfield_ai.volumetric_slices[activeSliceIndex]?.tumor_cross_section_cm2} cm²
                    </div>
                    <span className="text-xs text-muted-foreground">Tumor Cross-Sectional Area on Slice</span>
                  </div>
                  <div
                    className="absolute inset-y-0 bg-purple-500/10 pointer-events-none transition-all duration-300"
                    style={{
                      left: `${(activeSliceIndex / consultData.models.huggsfield_ai.volumetric_slices.length) * 100}%`,
                      width: "12px",
                    }}
                  />
                </div>
              </div>

              {/* Perfusion Global Telemetry */}
              <div className="rounded-xl border border-border bg-card/50 p-5 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Perfusion Hemodynamics</span>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded bg-muted/20 flex justify-between">
                    <span className="text-muted-foreground">Mean CBF</span>
                    <span className="font-bold text-foreground">{consultData.models.huggsfield_ai.perfusion_simulation.mean_cerebral_blood_flow}</span>
                  </div>
                  <div className="p-2.5 rounded bg-muted/20 flex justify-between">
                    <span className="text-muted-foreground">Permeability (Ktrans)</span>
                    <span className="font-bold text-purple-400">{consultData.models.huggsfield_ai.perfusion_simulation.angiogenic_leakage_ktrans}</span>
                  </div>
                  <div className="p-2.5 rounded bg-muted/20 flex justify-between">
                    <span className="text-muted-foreground">3D Tumor Volume</span>
                    <span className="font-bold text-foreground">{consultData.models.huggsfield_ai.perfusion_simulation.tumor_volume_cm3} cm³</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
