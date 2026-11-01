# RadCortex AI: 5 Main Application Page Screenshots

This visual documentation provides the **5 primary screenshots of the main application pages**, showcasing both the **live high-resolution Retina captures** from the operational application server (`http://localhost:5173`) and the **official college project report reference screenshots** from Chapter 5.2.

---

## 1. Interactive Visual Carousel

````carousel
![01. Home Page / Landing Hero](/C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/01_home_page.png)
<!-- slide -->
![02. Clinical Dashboard](/C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/02_dashboard_page.png)
<!-- slide -->
![03. Studio Classifier & Reticle HUD](/C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/03_classifier_studio_page.png)
<!-- slide -->
![04. Analytics & Longitudinal Telemetry](/C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/04_analytics_telemetry_page.png)
<!-- slide -->
![05. Model Evaluation & Architecture](/C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/05_model_evaluation_page.png)
````

---

## 2. Granular Page-by-Page Breakdown

### Page 1: Home Page / Landing Hero (`/`)
- **Route**: `http://localhost:5173/`
- **Primary Function**: Clinical gateway, institutional branding, system telemetry badges, and multi-format drag-and-drop file ingestion zone with zero file-size restrictions.
- **Key Elements**:
  - Live API status pill (`FastAPI Port 8001: Operational`)
  - Floating GSAP kinetic ribbon and institutional credentials
  - Multi-sequence guidance (T1w, T2w, T2-FLAIR, T1-CE)
  - Quick action buttons to launch diagnostic workflows

| Live Retina Capture (Port 5173) | Report Reference Figure (Chapter 5.2.1) |
| :---: | :---: |
| [![01 Home Page](/C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/01_home_page.png)](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/01_home_page.png) | [![Fig 5.2.1 Home Page](/C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/image10.jpeg)](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/image10.jpeg) |
| [01_home_page.png](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/01_home_page.png) (382 KB) | [image10.jpeg](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/image10.jpeg) (56 KB) |

---

### Page 2: Clinical Dashboard (`/dashboard`)
- **Route**: `http://localhost:5173/dashboard`
- **Primary Function**: Central operational dashboard providing high-level KPIs, historical patient distributions, confidence calibration buckets, and quick-launch diagnostic tools.
- **Key Elements**:
  - Four key metric counters (Total Scans, Mean Accuracy, Mean Turnaround Latency, Database Status)
  - Pathology classification breakdown (Glioma, Meningioma, Pituitary, Normal)
  - Confidence calibration distribution tiers ($90-100\%$, $80-89\%$, $70-79\%$, $60-69\%$, $<60\%$)
  - Recent diagnostic records audit table

| Live Retina Capture (Port 5173) | Report Reference Figure (Chapter 5.2.2) |
| :---: | :---: |
| [![02 Dashboard Page](/C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/02_dashboard_page.png)](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/02_dashboard_page.png) | [![Fig 5.2.2 Dashboard](/C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/image11.jpeg)](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/image11.jpeg) |
| [02_dashboard_page.png](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/02_dashboard_page.png) (207 KB) | [image11.jpeg](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/image11.jpeg) (53 KB) |

---

### Page 3: Studio Classifier & Reticle HUD (`/classify`)
- **Route**: `http://localhost:5173/classify`
- **Primary Function**: Core radiological workstation interface for scan submission, real-time crosshair coordinate tracking, dynamic window/level adjustments, and classification output display.
- **Key Elements**:
  - HTML5 Canvas 2D Reticle HUD with sub-pixel $(X, Y)$ coordinate tracking
  - Continuous zoom ($100\%$ to $800\%$) and pan matrix controls
  - Softmax classification confidence bars for all 4 clinical classes
  - Actionable clinical recommendations and surgical resectability indicators

| Live Retina Capture (Port 5173) | Report Reference Figure (Chapter 5.2.5) |
| :---: | :---: |
| [![03 Classifier Studio](/C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/03_classifier_studio_page.png)](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/03_classifier_studio_page.png) | [![Fig 5.2.5 Classification](/C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/image14.jpeg)](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/image14.jpeg) |
| [03_classifier_studio_page.png](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/03_classifier_studio_page.png) (193 KB) | [image14.jpeg](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/image14.jpeg) (61 KB) |

---

### Page 4: Analytics & Longitudinal Telemetry (`/analytics`)
- **Route**: `http://localhost:5173/analytics`
- **Primary Function**: In-depth radiological analysis and telemetry interface, rendering quantitative IBSI radiomic radar plots, texture matrices, and surgical prognosis scores.
- **Key Elements**:
  - 15+ IBSI quantitative texture biomarkers (GLCM contrast, dissimilarity, energy, homogeneity, entropy, Sobel gradients)
  - Multi-axis polygonal radiomic radar charts
  - Prospective Gross Total Resection (GTR) Feasibility Index
  - Radiation Sensitivity Index (RSI) and Chemotherapy Response Index

| Live Retina Capture (Port 5173) | Report Reference Figure (Chapter 5.2.3) |
| :---: | :---: |
| [![04 Analytics Page](/C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/04_analytics_telemetry_page.png)](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/04_analytics_telemetry_page.png) | [![Fig 5.2.3 Analysis Page](/C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/image12.jpeg)](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/image12.jpeg) |
| [04_analytics_telemetry_page.png](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/04_analytics_telemetry_page.png) (138 KB) | [image12.jpeg](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/image12.jpeg) (58 KB) |

---

### Page 5: Model Evaluation & Neural Network Architecture (`/model`)
- **Route**: `http://localhost:5173/model`
- **Primary Function**: Scientific auditing and performance benchmarking suite, displaying training/validation loss trajectories, classification accuracy curves, and the $1,600$-scan confusion matrix.
- **Key Elements**:
  - Training vs. Validation Loss convergence curves across 50 epochs
  - Multi-class Confusion Matrix heatmap for $N = 1,600$ held-out test scans
  - Class-by-class precision, recall, and F1-score breakdown
  - Network layer architecture specifications (EfficientNet-B0 compound scaling)

| Live Retina Capture (Port 5173) | Report Reference Figure (Chapter 5.2.4) |
| :---: | :---: |
| [![05 Model Evaluation](/C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/05_model_evaluation_page.png)](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/05_model_evaluation_page.png) | [![Fig 5.2.4 Model Evaluation](/C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/image13.jpeg)](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/image13.jpeg) |
| [05_model_evaluation_page.png](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/05_model_evaluation_page.png) (168 KB) | [image13.jpeg](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/image13.jpeg) (67 KB) |

---

## 3. Storage Locations Summary
- **Live Retina Captures Directory**: [`docs/main_pages_screenshots/`](file:///C:/Users/Hp/Downloads/DLT_AD/docs/main_pages_screenshots)
- **Artifact Local Directory**: [`b49693b4-a133-4648-90eb-3c76e4ca3448/`](file:///C:/Users/Hp/.gemini/antigravity/brain/b49693b4-a133-4648-90eb-3c76e4ca3448/)
- **College Report Document**: [PROJECT_REPORT.md (Section 5.2)](file:///C:/Users/Hp/Downloads/DLT_AD/docs/PROJECT_REPORT.md#52-screenshots-of-application)
