import React, { useState } from "react";
import { Link } from "wouter";
import {
  Activity,
  Layers,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  FileText,
  Microscope,
  Info,
  Maximize2,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { AppShell, PageHeader } from "../components/layout";
import { AnimatedOrganIcon } from "../components/skiper/animated-icons";

interface OrganModality {
  id: string;
  name: string;
  iconType: "brain" | "lung" | "liver" | "bone" | "prostate";
  organSystem: string;
  imagingModality: string;
  targetConditions: string[];
  keyBiomarkers: string[];
  sampleImage: string;
  radiomicsProfile: Array<{ feature: string; score: number; fullMark: number }>;
  treatmentPathway: {
    surgicalGuidance: string;
    radiationSensitivity: string;
    systemicTherapy: string;
    monitoringCadence: string;
  };
}

const organModalities: OrganModality[] = [
  {
    id: "neuro",
    name: "Neuro-Oncology",
    iconType: "brain",
    organSystem: "Central Nervous System",
    imagingModality: "Cranial T1ce / T2-FLAIR MRI",
    targetConditions: ["Glioblastoma Multiforme", "Meningioma", "Pituitary Macroadenoma", "Benign Normal"],
    keyBiomarkers: ["GLCM Dissimilarity", "Sobel Margin Sharpness", "Entropy of Attenuation", "Lesion Area Ratio"],
    sampleImage: "/samples/sample-meningioma.jpg",
    radiomicsProfile: [
      { feature: "Entropy", score: 85, fullMark: 100 },
      { feature: "Contrast", score: 78, fullMark: 100 },
      { feature: "Homogeneity", score: 42, fullMark: 100 },
      { feature: "Energy", score: 35, fullMark: 100 },
      { feature: "Margin Sharpness", score: 88, fullMark: 100 },
      { feature: "Resectability", score: 84, fullMark: 100 },
    ],
    treatmentPathway: {
      surgicalGuidance: "Gross Total Resection (GTR) indicated; clean dural margin assessment supports radical excision.",
      radiationSensitivity: "Intermediate RSI (0.42) - standard stereotactic fractionated regimen recommended.",
      systemicTherapy: "Adjuvant Temozolomide alongside MGMT methylation status profiling.",
      monitoringCadence: "Post-op baseline MRI at 48 hours, followed by quarterly T1ce volumetric surveillance.",
    },
  },
  {
    id: "thoracic",
    name: "Thoracic & Pulmonary",
    iconType: "lung",
    organSystem: "Respiratory / Broncho-Pulmonary",
    imagingModality: "Low-Dose High-Resolution Chest CT",
    targetConditions: ["Solitary Pulmonary Nodule (SPN)", "Adenocarcinoma in situ", "Ground-Glass Opacity (GGO)", "Hamartoma"],
    keyBiomarkers: ["Spiculation Index", "Mean Attenuation (HU)", "Volume Doubling Time", "Sphericity"],
    sampleImage: "/samples/sample-glioma.jpg",
    radiomicsProfile: [
      { feature: "Entropy", score: 92, fullMark: 100 },
      { feature: "Contrast", score: 65, fullMark: 100 },
      { feature: "Homogeneity", score: 38, fullMark: 100 },
      { feature: "Energy", score: 29, fullMark: 100 },
      { feature: "Margin Sharpness", score: 71, fullMark: 100 },
      { feature: "Resectability", score: 76, fullMark: 100 },
    ],
    treatmentPathway: {
      surgicalGuidance: "Video-Assisted Thoracoscopic Surgery (VATS) anatomical segmentectomy if solid component > 5mm.",
      radiationSensitivity: "Stereotactic Body Radiotherapy (SBRT/SABR) for medically inoperable primary stage I nodules.",
      systemicTherapy: "Targeted tyrosine kinase inhibitors (EGFR/ALK) upon molecular NGS biopsy confirmation.",
      monitoringCadence: "Fleischner Society protocol: serial thin-slice CT at 3, 6, and 12 months.",
    },
  },
  {
    id: "hepatic",
    name: "Hepato-Biliary & Abdominal",
    iconType: "liver",
    organSystem: "Gastrointestinal / Hepatic",
    imagingModality: "Triphasic Dynamic Liver CT / Eovist MRI",
    targetConditions: ["Hepatocellular Carcinoma (HCC)", "Hepatic Hemangioma", "Cholangiocarcinoma", "Focal Nodular Hyperplasia"],
    keyBiomarkers: ["Arterial Wash-In Gradient", "Delayed Portal Wash-Out", "Capsule Enhancing Regularity", "Kurtosis"],
    sampleImage: "/samples/sample-pituitary.jpg",
    radiomicsProfile: [
      { feature: "Entropy", score: 79, fullMark: 100 },
      { feature: "Contrast", score: 82, fullMark: 100 },
      { feature: "Homogeneity", score: 45, fullMark: 100 },
      { feature: "Energy", score: 41, fullMark: 100 },
      { feature: "Margin Sharpness", score: 64, fullMark: 100 },
      { feature: "Resectability", score: 68, fullMark: 100 },
    ],
    treatmentPathway: {
      surgicalGuidance: "Milan criteria evaluation: anatomical non-cirrhotic liver resection vs trans-arterial chemoembolization (TACE).",
      radiationSensitivity: "Selective Internal Radiation Therapy (SIRT) with Yttrium-90 microspheres.",
      systemicTherapy: "First-line Atezolizumab plus Bevacizumab immunotherapy combination.",
      monitoringCadence: "AFP serum biomarker correlation and dynamic contrast MRI every 3 months.",
    },
  },
  {
    id: "musculoskeletal",
    name: "Musculoskeletal & Orthopedic",
    iconType: "bone",
    organSystem: "Skeletal / Trabecular Matrix",
    imagingModality: "High-Resolution Quantitative CT / MRI",
    targetConditions: ["Osteolytic Lesions", "Osteosarcoma", "Trabecular Bone Loss", "Atypical Lipomatous Tumor"],
    keyBiomarkers: ["Trabecular Bone Score (TBS)", "Cortical Permeability", "Run-Length Non-Uniformity", "Fracture Vulnerability"],
    sampleImage: "/samples/sample-notumor.jpg",
    radiomicsProfile: [
      { feature: "Entropy", score: 58, fullMark: 100 },
      { feature: "Contrast", score: 89, fullMark: 100 },
      { feature: "Homogeneity", score: 52, fullMark: 100 },
      { feature: "Energy", score: 48, fullMark: 100 },
      { feature: "Margin Sharpness", score: 91, fullMark: 100 },
      { feature: "Resectability", score: 90, fullMark: 100 },
    ],
    treatmentPathway: {
      surgicalGuidance: "Limb-sparing wide resection with endoprosthetic reconstruction or prophylactic stabilization.",
      radiationSensitivity: "Proton beam radiotherapy for chordomas and osteo-margin sparing radiation.",
      systemicTherapy: "Bisphosphonate or Denosumab therapy to inhibit RANKL-mediated osteoclast destruction.",
      monitoringCadence: "Dual-energy X-ray absorptiometry and localized MRI at 6-month intervals.",
    },
  },
  {
    id: "pelvic",
    name: "Pelvic & Mammary Radiomics",
    iconType: "prostate",
    organSystem: "Genitourinary & Breast Oncology",
    imagingModality: "Multiparametric Dynamic Contrast DCE-MRI",
    targetConditions: ["Prostate Adenocarcinoma (PI-RADS 4/5)", "Invasive Ductal Carcinoma", "Fibroadenoma", "Ductal Carcinoma In Situ"],
    keyBiomarkers: ["Ktrans Transfer Constant", "Washout Rate (Kep)", "ADC Diffusion Restriction", "Co-occurrence Energy"],
    sampleImage: "/samples/sample-meningioma.jpg",
    radiomicsProfile: [
      { feature: "Entropy", score: 88, fullMark: 100 },
      { feature: "Contrast", score: 75, fullMark: 100 },
      { feature: "Homogeneity", score: 36, fullMark: 100 },
      { feature: "Energy", score: 32, fullMark: 100 },
      { feature: "Margin Sharpness", score: 78, fullMark: 100 },
      { feature: "Resectability", score: 82, fullMark: 100 },
    ],
    treatmentPathway: {
      surgicalGuidance: "Robot-Assisted Laparoscopic Radical Prostatectomy / Oncoplastic lumpectomy with sentinel node biopsy.",
      radiationSensitivity: "External Beam Radiation Therapy (EBRT) with intensity modulation and fiducial tracking.",
      systemicTherapy: "Androgen Deprivation Therapy (ADT) or Neoadjuvant HER2-targeted pertuzumab/trastuzumab.",
      monitoringCadence: "PSA velocity surveillance / Contrast mammography monitoring every 6 months.",
    },
  },
];

export function MultiOrganRadiomicsPage() {
  const [selectedOrgan, setSelectedOrgan] = useState<OrganModality>(organModalities[0]);
  const [activeTab, setActiveTab] = useState<"biomarkers" | "treatment" | "imaging">("biomarkers");

  return (
    <AppShell>
      <PageHeader
        eyebrow="Universal Quantitative Biomarker Engine"
        title="Multi-Organ Radiomics Explorer"
        description="Explore how our deep learning radiomics architecture transcends neuro-imaging to extract quantitative phenotype biomarkers across thoracic, abdominal, musculoskeletal, and pelvic oncological modalities."
      />

      {/* Organ Selector Ribbon */}
      <section className="mb-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {organModalities.map((organ) => {
            const isSelected = selectedOrgan.id === organ.id;
            return (
              <button
                key={organ.id}
                onClick={() => setSelectedOrgan(organ)}
                className={`panel group flex flex-col items-start p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-md ring-2 ring-blue-500/20"
                    : "hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex w-full items-center justify-between mb-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/40"
                    }`}
                  >
                    <AnimatedOrganIcon type={organ.iconType} className="size-5" />
                  </div>
                  {isSelected && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {organ.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {organ.imagingModality}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Analysis Display */}
      <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
        {/* Left Column: Modality Profile & Quantitative Radar */}
        <div className="space-y-6">
          <div className="panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="eyebrow text-blue-600 dark:text-blue-400">
                  {selectedOrgan.organSystem}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedOrgan.name} Phenotypic Signature
                </h2>
              </div>
              <div className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {selectedOrgan.imagingModality}
              </div>
            </div>

            {/* Target Pathologies Pills */}
            <div className="mt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Validated Clinical Indications
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedOrgan.targetConditions.map((cond, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 size={12} className="text-blue-500" />
                    {cond}
                  </span>
                ))}
              </div>
            </div>

            {/* Radiomics Multi-Dimensional Radar Profile */}
            <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Activity size={14} className="text-blue-500" />
                  Quantitative Texture Radar (GLCM + Morphological)
                </span>
                <span className="text-[10px] mono text-slate-400">IBSI-Compliant</span>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={selectedOrgan.radiomicsProfile}>
                    <PolarGrid stroke="rgba(100, 116, 139, 0.2)" />
                    <PolarAngleAxis
                      dataKey="feature"
                      tick={{ fill: "currentColor", fontSize: 11 }}
                      className="text-slate-600 dark:text-slate-400 font-semibold"
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(100, 116, 139, 0.2)" />
                    <Radar
                      name={selectedOrgan.name}
                      dataKey="score"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.35}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Radiomic Biomarkers Checklist */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {selectedOrgan.keyBiomarkers.map((bm, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3"
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Feature 0{i + 1}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    {bm}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Second-order spatial dependency matrix
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Treatment Planning & Diagnostic Integration */}
        <div className="space-y-6">
          <div className="panel p-6">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Microscope size={18} className="text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Radiomics-Guided Treatment Planning
              </h3>
            </div>

            <div className="mt-4 space-y-4">
              {/* Surgical Guidance */}
              <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  <TrendingUp size={14} /> Surgical Resectability Guidance
                </div>
                <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedOrgan.treatmentPathway.surgicalGuidance}
                </p>
              </div>

              {/* Radiation Sensitivity Index */}
              <div className="rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                  <Activity size={14} /> Radiation Sensitivity Index (RSI)
                </div>
                <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedOrgan.treatmentPathway.radiationSensitivity}
                </p>
              </div>

              {/* Systemic Therapy Protocol */}
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  <ShieldAlert size={14} /> Adjuvant & Systemic Therapy
                </div>
                <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedOrgan.treatmentPathway.systemicTherapy}
                </p>
              </div>

              {/* Surveillance Cadence */}
              <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  <FileText size={14} /> Recommended Monitoring Cadence
                </div>
                <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedOrgan.treatmentPathway.monitoringCadence}
                </p>
              </div>
            </div>

            {/* Launch Classifier CTA */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Link
                href="/classify"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
              >
                Analyze Scan in Radiomics Classifier Studio <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

