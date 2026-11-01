import React from "react";
import { Link } from "wouter";
import {
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
  Crosshair,
  Sliders,
  FileText,
  Microscope,
  Info,
  CheckCircle2,
  ArrowRight,
  MousePointer,
  HelpCircle,
  Cpu,
  Dna,
  GitBranch,
  Database,
  Share2,
  Layers3,
} from "lucide-react";
import { AppShell } from "../components/layout";
import { Skiper60, type TermItem } from "../components/skiper/side-scroll-nav";

const guideTerms: TermItem[] = [
  {
    id: "quick-start",
    title: "Quick-Start: 4-Step Diagnostic Workflow",
    subtitle: "Simple, step-by-step summary for first-time clinicians and researchers",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          RadCortex AI is built for instant, intuitive clinical decision support. Follow these 4 straightforward steps to analyze any scan:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
          <div className="metallic-card rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-white font-mono font-bold text-xs">
                1
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">Ingest Scan</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Open <strong>Classifier Studio</strong>. Choose one of four pre-loaded reference scans (Meningioma, Glioma, Pituitary, Normal) or upload a local JPG/PNG image up to 10 MB.
            </p>
          </div>

          <div className="metallic-card rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-white font-mono font-bold text-xs">
                2
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">Target & Calibrate</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Activate <strong>Target</strong> mode in Radiological Controls. Drag the bullseye over the lesion. <strong>Scroll mouse wheel</strong> to expand or contract the aperture radius.
            </p>
          </div>

          <div className="metallic-card rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-white font-mono font-bold text-xs">
                3
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">Run Dual Inference</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Click <strong>Run Radiomics & Neural Inference</strong>. In &lt;380ms, the model yields classification confidence, Grad-CAM attention heatmap, and 15+ IBSI radiomic metrics.
            </p>
          </div>

          <div className="metallic-card rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-white font-mono font-bold text-xs">
                4
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">Review & Export</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Inspect surgical Gross Total Resection (GTR) feasibility and Radiation Sensitivity (RSI). Click <strong>Export Report</strong> to print a formal clinical summary.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "objective-scope",
    title: "1. Clinical Objective & Dual Architecture",
    subtitle: "High-level overview of deep learning and radiomics synergy",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong>RadCortex AI</strong> bridges deep convolutional neural classification with quantitative mathematical
          phenotyping (radiomics). While traditional radiological diagnosis depends heavily on subjective visual pattern
          matching, our dual-engine architecture computes sub-visual statistical variations in voxel intensity, gray-level
          co-occurrences, and margin infiltration.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
          <div className="metallic-card rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-3.5">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
              <Cpu size={14} /> Convolutional Neural Network
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              EfficientNetB0 deep CNN fine-tuned on curated clinical MRI scans, extracting high-level semantic representation and generating Grad-CAM visual heatmaps.
            </p>
          </div>
          <div className="metallic-card rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-3.5">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
              <Layers3 size={14} /> IBSI Quantitative Radiomics Suite
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              15+ mathematical biomarkers including 16-level spatial GLCM contrast, Shannon informational entropy, and Sobel edge sharpness gradients.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "interactive-bullseye",
    title: "2. Operating the Dynamic Bullseye Reticle",
    subtitle: "Dragging, clicking, and mouse-wheel scrolling for ROI inspection",
    content: (
      <div className="space-y-4">
        <div className="metallic-card rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-2">
            <Crosshair size={15} /> Precision Target Reticle Controls
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            When <strong>Target</strong> mode is toggled ON in Radiological Controls, an interactive concentric bullseye 
            reticle overlays the scan viewport.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-bold">
              A
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white text-xs md:text-sm">Click or Drag to Reposition:</strong>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Click anywhere on the scan or drag the bullseye to smoothly place the reticle center over suspicious focal lesions, dural tails, or edema margins.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-bold">
              B
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white text-xs md:text-sm">Mouse-Wheel Scrolling to Adjust Aperture:</strong>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Scroll your mouse wheel up or down directly over the scan (or use the Aperture Size slider) to dynamically resize the bullseye ring from 14px (micro-calcification focus) up to 100px (whole-lesion macro-texture assessment).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-bold">
              C
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white text-xs md:text-sm">Real-Time Coordinate HUD:</strong>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                The reticle badge <code className="mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">RETICLE: [X:..., Y:...] · APERTURE: ...px</code> dynamically computes tensor coordinates matching neural inference input tensors.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "radiomics-cheatsheet",
    title: "3. How to Read Radiomic Indicators",
    subtitle: "Clinical cheat-sheet for translating mathematical metrics into physiological insight",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Our IBSI radiomics engine computes quantitative biomarkers that correspond directly to biological tumor properties:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
          <div className="metallic-card rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 bg-card">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">GLCM Contrast & Dissimilarity</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              <strong>High:</strong> Signifies intense cellular necrosis, hemorrhage, or chaotic microvascular proliferation (typical in High-Grade Glioblastoma).<br />
              <strong>Low:</strong> Indicates homogeneous cellular architecture (typical in healthy brain tissue).
            </p>
          </div>

          <div className="metallic-card rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 bg-card">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Shannon Informational Entropy</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              <strong>High (&gt; 0.85):</strong> Reflects elevated genomic and spatial heterogeneity; strongly correlates with malignant aggressiveness.<br />
              <strong>Moderate:</strong> Characteristic of well-differentiated benign lesions.
            </p>
          </div>

          <div className="metallic-card rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 bg-card">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Sobel Margin Sharpness Gradient</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              <strong>Sharp (&gt; 0.80):</strong> Clear, non-infiltrative boundary with healthy brain tissue (Meningioma, Pituitary Adenoma).<br />
              <strong>Diffuse (&lt; 0.60):</strong> Microscopic infiltration along white matter tracts (Glioma).
            </p>
          </div>

          <div className="metallic-card rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 bg-card">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Resectability & RSI Indices</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              <strong>Resectability (&gt; 75%):</strong> High feasibility of complete Gross Total Resection (GTR).<br />
              <strong>RSI (Radiation Sensitivity Index):</strong> Stratifies standard fractionated radiosurgery vs targeted escalation.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "multi-organ-modalities",
    title: "4. Multi-Organ Universal Modalities",
    subtitle: "Applying radiomics beyond neurology into thoracic, abdominal, and musculoskeletal domains",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          RadCortex AI is not restricted to brain MRI. Navigate to <strong>Multi-Organ Radiomics</strong> (<Link href="/radiomics" className="text-blue-600 dark:text-blue-400 underline font-semibold">/radiomics</Link>) to explore 5 oncology domains:
        </p>

        <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm text-slate-600 dark:text-slate-400">
          <li><strong>Neuro-Oncology (Cranial T1ce/T2):</strong> Glioblastoma, Meningioma, Pituitary Adenoma, and Healthy parenchyma.</li>
          <li><strong>Thoracic & Pulmonary (Chest CT):</strong> Solitary pulmonary nodules (SPN), ground-glass opacities (GGO), and peripheral spiculation indices.</li>
          <li><strong>Hepato-Biliary & Abdominal (Dynamic CT/MRI):</strong> Arterial phase wash-in, delayed venous wash-out, and Milan criteria resectability.</li>
          <li><strong>Musculoskeletal & Orthopedic (High-Res Bone CT):</strong> Trabecular Bone Score (TBS), cortical permeability, and osteolytic margin metrics.</li>
          <li><strong>Pelvic & Mammary (DCE-MRI):</strong> Dynamic contrast enhancement washout kinetics, BI-RADS/PI-RADS textural heterogeneity.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "future-advancements",
    title: "5. Strategic Roadmap: Future AI Advancements",
    subtitle: "Next-generation enhancements and clinical features planned for the RadCortex AI architecture",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          The following advancements are actively designed for integration to elevate RadCortex AI into a hospital-wide enterprise platform:
        </p>

        <div className="space-y-3.5 my-3">
          <div className="metallic-card rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-card">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
                I
              </span>
              <strong className="text-slate-900 dark:text-white text-sm">3D Automated Volumetric Segmentation (nnU-Net / V-Net)</strong>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Transitioning from 2D axial slice evaluation to automated 3D volume voxelization. Deep segmentation networks automatically delineate enhancing tumor cores, non-enhancing necrosis, and peritumoral vasogenic edema across continuous 3D DICOM volumes, calculating precise volumetric metrics in cubic centimeters ($cm^3$).
            </p>
          </div>

          <div className="metallic-card rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-card">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                II
              </span>
              <strong className="text-slate-900 dark:text-white text-sm">Genomic-Radiomic Cross-Correlation (Radiogenomics)</strong>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Correlating macro-radiomic textural phenotypes directly with microscopic genetic alterations. Pre-operatively predicting IDH1/IDH2 mutation status, 1p/19q codeletion, and MGMT promoter methylation without requiring invasive stereotactic brain biopsies.
            </p>
          </div>

          <div className="metallic-card rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-card">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                III
              </span>
              <strong className="text-slate-900 dark:text-white text-sm">Longitudinal Delta-Radiomics & Response Monitoring</strong>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Automated rigid and deformable image registration comparing baseline pre-operative MRI with 48-hour post-op and serial quarterly follow-up scans. Delta-radiomics tracks subtle texture changes to definitively differentiate true tumor recurrence from radiation necrosis and immunotherapy pseudoprogression.
            </p>
          </div>

          <div className="metallic-card rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-card">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">
                IV
              </span>
              <strong className="text-slate-900 dark:text-white text-sm">Hospital PACS & FHIR Cloud Connector</strong>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Direct connection to hospital Picture Archiving and Communication Systems (PACS) using DICOMweb (WADO-RS, QIDO-RS, STOW-RS). Automatic export of structured DICOM SR (Structured Reporting) objects and HL7 FHIR Observation resources back into Electronic Health Records (EHR).
            </p>
          </div>

          <div className="metallic-card rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-card">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs">
                V
              </span>
              <strong className="text-slate-900 dark:text-white text-sm">Medical Diffusion Models for Rare Pathology Augmentation</strong>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Conditioned latent diffusion models synthesize physiologically plausible rare pathology variations (e.g. atypical teratoid/rhabdoid tumors, chordomas) with controllable radiomic parameters to expand clinical training datasets and eliminate algorithmic bias.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "export-audit",
    title: "6. Clinical Export & Audit Logging",
    subtitle: "Generating multi-modal PDF reports and SQLite persistence",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Every diagnostic run is automatically logged with an immutable UUID in the local SQLite database. Clinicians can click 
          <strong>Export Report</strong> to produce a formal, printable multi-modal diagnostic summary including:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm text-slate-600 dark:text-slate-400">
          <li>Patient and scan session metadata (timestamp, filename, image resolution).</li>
          <li>Primary neural prediction with full confidence breakdown.</li>
          <li>Quantitative radiomics table with 15+ IBSI-standardized biomarkers.</li>
          <li>Prognostic surgical and radiation treatment recommendations.</li>
          <li>Automated post-diagnosis medication & supportive care regimen with real-time audio/voice alarms.</li>
          <li>Attending clinician signature lines and Clinical Decision Support (CDS) platform statements.</li>
        </ul>
      </div>
    ),
  },
];

export function ClinicalGuidePage() {
  return (
    <AppShell>
      <Skiper60
        title="Clinical User Guide & Radiomics Protocol"
        subtitle="Complete operating manual for radiological calibration, dynamic bullseye targeting, neural inference, and multi-organ treatment planning."
        terms={guideTerms}
      />
    </AppShell>
  );
}
