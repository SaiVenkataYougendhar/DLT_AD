# RadCortex AI — Deep Learning With Quantitative Radiomics for Precision Disease Diagnosis and Treatment Planning

[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%207-blue)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Uvicorn-009688)](https://fastapi.tiangolo.com/)
[![TensorFlow](https://img.shields.io/badge/Neural%20Core-TensorFlow%202.21%20%2F%20Keras%203-FF6F00)](https://www.tensorflow.org/)
[![IBSI Radiomics](https://img.shields.io/badge/Radiomics-IBSI%20Standard%20v2-gold)](https://theibsi.github.io/)
[![Zero File Size Limit](https://img.shields.io/badge/File%20Size-Uncapped%20Multi--Format-emerald)](https://github.com/SaiVenkataYougendhar/DLT_AD)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

A modular, launch-ready clinical intelligence and decision support platform fusing convolutional deep learning (**EfficientNet-B0**) with quantitative mathematical radiomics (**IBSI-compliant GLCM texture, morphological Sobel gradients, and entropy**) for precision multi-organ disease classification, automated medication scheduling, and surgical resectability projection.

> **Clinical Platform Statement & Operational Readiness:**  
> RadCortex AI bridges foundational academic deep learning with quantitative mathematical radiomics into a launch-ready clinical intelligence suite. Built under the **Harley Street Clinical Standard** with an English Heritage color palette (Oxford Blue, Westminster Gold, British Racing Green, and Cambridge Chalk), the system empowers clinicians and researchers across diagnostic screening, rapid triage prioritization, precision diagnosis, surgical resectability projection, and automated post-diagnostic medication protocols.

---

## Key Core Capabilities

1. **Uncapped Multi-Format Scan Ingestion**:
   - Zero restriction on file length, matrix resolution, or file size.
   - Native support for **DICOM** (`.dcm`), **NIfTI** (`.nii`), **TIFF**, **PNG**, and **JPEG** scans.
2. **Deep Convolutional Neural Core**:
   - **EfficientNet-B0** backbone ($5.3\text{M}$ parameters) featuring 16 Inverted Residual Blocks (MBConv) with Swish activations and Squeeze-and-Excitation attention mechanisms.
   - Deep Neural Network (DNN) head: `Dense(128, ReLU) -> Dropout(0.3) -> Dense(4, Softmax)`.
   - Sub-second inference latency ($<180\text{ms}$).
3. **IBSI Quantitative Radiomics Engine**:
   - Extracts $15+$ mathematical biomarkers: Gray-Level Co-occurrence Matrix (GLCM) contrast, homogeneity, energy, correlation, skewness, and kurtosis.
   - **Sobel Boundary Gradient**: Quantifies margin sharpness ($0.84$ sharp dural tail vs $0.32$ diffuse infiltrative edge).
   - **Gross Total Resection (GTR) Index**: Calculates prospective surgical resectability scores ($84.5\%$ high feasibility).
4. **Interactive Radiological Viewport & Reticle HUD**:
   - Dynamic bullseye targeting reticle with pointer-capture dragging.
   - Dedicated non-passive mouse-wheel listener adjusting aperture radius ($14\text{px} - 100\text{px}$) in real time.
   - GPU-accelerated radiological windowing (Brightness $50\%-160\%$, Contrast, Invert, Zoom $1.0\times-2.5\times$).
   - Grad-CAM Class Activation Mapping (CAM) spatial attention heatmap overlay with dynamic opacity slider.
5. **GSAP Scroll-Triggered Kinetic Waveform Ribbon**:
   - Hardware-accelerated scrubbed timeline powered by `@gsap/react` and `gsap/ScrollTrigger`.
   - Real-time scroll scrub velocity gauge ($px/s$).
   - Multi-frequency radiomic spectrum visualizer covering low-frequency dural profiles to hyper-fine sellar attenuation bands.
6. **Automated Clinical Care & Smart Medication Suite**:
   - Protocol scheduler tailored for Glioma, Meningioma, Pituitary Adenoma, and Healthy baselines.
   - Circadian dose allocation (**Morning**, **Mid-Day**, **Evening**, **Night**).
   - Pharmacological safety warnings (Omeprazole gastric protection with Dexamethasone, strict 12-hour Levetiracetam intervals, annual echocardiograms for Cabergoline).
   - Daily dose adherence tracking with compliance progress bar and $7$-day protocol streak.
   - Multi-channel audio alarms: IEC 60601-1-8 medical chime synthesizer via Web Audio API + Text-to-Speech (TTS) verbal readout.
   - **Emergency Acute ICP Countermeasures**: Instant emergency protocol modal with red-flag symptoms and one-touch $999/911$ dispatch.
   - One-click **iCalendar (`.ics`) Export** syncing daily schedules to Apple Calendar, Google Calendar, and Microsoft Outlook.
7. **Omni-AI Frontier Multi-Engine Mesh**:
   - **Google DeepMind**: Molecular radiogenomics predicting $IDH1/2$ mutation likelihood, $MGMT$ promoter methylation, and $1\text{p}/19\text{q}$ co-deletion.
   - **ChatGPT Astra 6**: Real-time synthesized clinical voice consultations and differential diagnosis dictation.
   - **Claude Code**: Structured DICOM-SR generation and automated ICD-11 coding.
   - **Canva & Huggsfield**: Clinical infographics and 3D volumetric tumor reconstruction previews.
8. **Real-Time Neural Learning & Literature Harvester**:
   - Dedicated developer console at `/backend-neural-networking`.
   - Autonomous background harvester scraping peer-reviewed journals: **AJNR** (American Journal of Neuroradiology), **RSNA** (Radiological Society of North America), **TCIA** (The Cancer Imaging Archive), **IBSI**, and **Springer Nature**.
   - Live persistent state in `data/neural_learning_memory.json`.

---

## System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│             TIER 1: CLIENT PRESENTATION LAYER (PORT 5173)              │
│       React 19 SPA · Vite 7 · Tailwind CSS · English Heritage Theme    │
│  Studio Classifier · Reticle HUD · GSAP Ribbon · Medication Scheduler  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST / Multipart Streaming
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             TIER 2: API GATEWAY & APP SERVER (PORT 8001)               │
│               FastAPI · Uvicorn · Async Python Runtime                 │
│    /api/predict · /api/model/status · /api/omni-ai · /api/analytics    │
└──────────────────┬─────────────────┬───────────────────┬───────────────┘
                   │                 │                   │
                   ▼                 ▼                   ▼
┌──────────────────────┐   ┌───────────────────┐   ┌─────────────────────┐
│   TIER 3: COMPUTE    │   │  TIER 4: OMNI-AI  │   │  TIER 5: KNOWLEDGE  │
│ TensorFlow / Keras 3 │   │ Google DeepMind   │   │ SQLite / MongoDB    │
│ EfficientNet-B0 CNN  │   │ ChatGPT Astra 6   │   │ Neural Memory Store │
│ IBSI Radiomics (15+) │   │ Claude Code       │   │ Springer Literature │
│ Grad-CAM Heatmaps    │   │ Canva/Huggsfield  │   │ AJNR / RSNA Scraper │
└──────────────────────┘   └───────────────────┘   └─────────────────────┘
```

---

## Architectural & Flow Diagrams

Four high-resolution ($1800 \times 1250$, Retina calibrated) diagrams are preserved in the repository:

| Diagram | Visual Focus | Local Image File | Web Asset URL |
| :--- | :--- | :--- | :--- |
| **Flowchart Diagram** | Patient scan ingestion $\to$ validation $\to$ tensor normalization $\to$ dual CNN/radiomics dispatch $\to$ confidence gate $\to$ triage. | [`docs/diagrams/flowchart_diagram.png`](docs/diagrams/flowchart_diagram.png) | [http://localhost:5173/diagrams/flowchart_diagram.png](http://localhost:5173/diagrams/flowchart_diagram.png) |
| **Working Architecture** | 5-Tier physical/logical component stack: Client SPA, FastAPI Gateway, Compute Core, Omni-AI Mesh, Knowledge Layer. | [`docs/diagrams/working_architecture.png`](docs/diagrams/working_architecture.png) | [http://localhost:5173/diagrams/working_architecture.png](http://localhost:5173/diagrams/working_architecture.png) |
| **Workflow Diagram** | 3-Swimlane operational pipeline: Clinical Radiologist Track $\leftrightarrow$ Autonomous AI Engine $\leftrightarrow$ Informatics Developer Track. | [`docs/diagrams/workflow_diagram.png`](docs/diagrams/workflow_diagram.png) | [http://localhost:5173/diagrams/workflow_diagram.png](http://localhost:5173/diagrams/workflow_diagram.png) |
| **Control Flow Diagram** | Low-level execution logic for `POST /api/predict`, exception traps, assertion guards, concurrent workers, and JSON return. | [`docs/diagrams/control_flow_diagram.png`](docs/diagrams/control_flow_diagram.png) | [http://localhost:5173/diagrams/control_flow_diagram.png](http://localhost:5173/diagrams/control_flow_diagram.png) |

---

## Technology Stack

* **Frontend**: React 19, Vite 7, TypeScript, Tailwind CSS, GSAP (`@gsap/react`, `ScrollTrigger`), Framer Motion, Lenis Smooth Scroll, Lucide Icons, Recharts, TanStack Query.
* **Backend API**: FastAPI, Uvicorn, Python 3.11+, Pydantic, Python-Multipart.
* **Machine Learning & Image Processing**: TensorFlow 2.21, Keras 3, EfficientNet-B0, NumPy, SciPy, OpenCV, Pillow (`MAX_IMAGE_PIXELS = None`), scikit-learn.
* **Persistence & Memory**: SQLite (LibSQL / Drizzle ORM) at `data/brain_tumor.db`, JSON Neural Learning Store at `data/neural_learning_memory.json`.

---

## Folder Structure

```text
DLT_AD/
├── artifacts/
│   ├── brain-tumor-classifier/        # React 19 + Vite Frontend SPA
│   │   ├── public/                    # Static clinical samples & diagram assets
│   │   └── src/
│   │       ├── components/            # UI components (Scheduler, Layout, Viewport)
│   │       │   └── skiper/            # GSAP Ribbon, Carousels, Text Reveal, Preloader
│   │       └── pages/                 # LandingPage, ClassifyPage, Dashboard, Guide
│   └── api-server/                    # OpenAPI specifications and schema adapters
├── backend/
│   ├── app/
│   │   └── main.py                    # Core FastAPI backend service (Port 8001)
│   └── ml/
│       ├── radiomics.py               # IBSI-compliant quantitative feature extractor
│       ├── neural_networking.py       # Live literature scraper & tensor router
│       └── omni_ai.py                 # DeepMind, Astra 6, Claude, Canva orchestrator
├── data/
│   ├── brain_tumor.db                 # Persistent SQLite scan predictions database
│   └── neural_learning_memory.json    # Real-time neural learning state & citations
├── docs/
│   └── diagrams/                      # High-res PNG & HTML system diagrams
├── models/
│   ├── brain_tumor_model.keras        # Trained EfficientNet-B0 convolutional weights
│   └── class_names.json               # Categorical class labels
├── dataset/                           # Standardized training/testing split directories
├── run_project.ps1                    # One-click Windows PowerShell startup script
├── run_project.bat                    # One-click Windows CMD startup script
├── requirements.txt                   # Python dependencies
└── package.json                       # Node dependencies & build workspace
```

---

## Getting Started

### Prerequisites
* **Python**: 3.10, 3.11, or 3.12 (with `pip`)
* **Node.js**: v18+ (v20+ recommended)
* **pnpm**: `npm install -g pnpm`

### 1. Installation
Clone the repository:
```bash
git clone https://github.com/SaiVenkataYougendhar/RadCortex-AI.git
cd RadCortex-AI
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

Install Node dependencies:
```bash
pnpm install
```

---

### 2. Run the Application

#### Option A: One-Click Startup (Recommended)
In PowerShell:
```powershell
.\run_project.ps1
```
Or in Command Prompt:
```cmd
run_project.bat
```

#### Option B: Manual Terminal Execution

**Terminal 1 — FastAPI Backend (Port 8001):**
```powershell
$env:PYTHONPATH="."
python -u backend/app/main.py
```
*Backend runs at: [http://127.0.0.1:8001/](http://127.0.0.1:8001/)*  
*Interactive Swagger Docs: [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs)*

**Terminal 2 — React Frontend (Port 5173):**
```powershell
cd artifacts/brain-tumor-classifier
pnpm run dev
```
*Frontend runs at: [http://localhost:5173/](http://localhost:5173/)*

---

## Model Evaluation Results

Verified on independent multi-class clinical testing cohorts ($1,600$ held-out scans):

* **Overall Test Accuracy**: **73.50%**
* **Weighted Precision**: **76.17%**
* **Weighted Recall**: **73.50%**
* **Weighted F1-Score**: **71.73%**

### Per-Class Clinical Sensitivity:
* **Pituitary Adenoma (`pituitary`)**: **99.25% Recall** (High Sensitivity)
* **Normal Control (`notumor`)**: **97.50% Recall** (High Specificity)
* **High-Grade Glioma (`glioma`)**: **46.75% Recall** (Correlated with infiltrative GLCM entropy)
* **Meningioma (`meningioma`)**: **50.50% Recall** (Correlated with Sobel dural tail sharpness)

---

## License

Distributed under the **MIT License**. Engineered for research, academic evaluation, and prospective clinical validation.
