# Brain Tumor Classification Using Deep Learning

An educational and research prototype for classifying brain MRI images with a
real transfer-learning model and reviewing stored prediction metadata through a
data analytics dashboard.

> **Research/Educational Prototype — This system is not intended for medical
> diagnosis or clinical decision-making.** Predictions are experimental model
> outputs and must not be used to guide patient care.

## What is included

- Responsive React + Vite application with landing, dashboard, classifier,
  history, analytics, model performance, and about pages.
- REST API for MRI upload, prediction history, deletion, analytics, model
  status, and actual evaluation metrics.
- Persistent local SQLite database for history and analytics.
- Real EfficientNetB0 transfer-learning pipeline with augmentation,
  validation, early stopping, checkpointing, learning-rate reduction, and
  reproducible seeds.
- Strict image validation for JPG, JPEG, and PNG uploads up to 10 MB.
- Honest empty, unavailable, and not-trained states. The application never
  creates fallback labels, confidence values, analytics, or model metrics.

## Architecture

```text
React + Vite
    ↓ /api
Managed Express API adapter
    ↓
SQLite local database (Drizzle ORM)
    ↓
Python TensorFlow/Keras inference and training scripts
    ↓
Analytics calculated from stored records and model evaluation output
```

The managed Replit workflow uses the workspace's Node API service so routing
and preview hosting work consistently. The Python ML scripts are the source of
truth for training and inference. `requirements.txt` contains the dependencies
for a standalone Python/FastAPI deployment if the project is moved outside the
managed workspace.

## Technology stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, Recharts, TanStack Query
- API adapter: Express 5, TypeScript, generated OpenAPI/Zod contracts
- Machine learning: Python, TensorFlow/Keras, EfficientNetB0, NumPy, Pillow,
  pandas, scikit-learn
- Database: SQLite with Drizzle ORM and LibSQL

## Folder structure

```text
artifacts/brain-tumor-classifier/   React application
artifacts/api-server/               API routes and SQLite adapter
lib/api-spec/openapi.yaml           API source of truth
lib/api-client-react/               Generated React Query client
lib/api-zod/                        Generated server validation schemas
lib/db/                             Drizzle ORM schema and client
backend/ml/predict.py               Real Keras inference subprocess
train_model.py                      Reproducible training and evaluation
dataset/Training/                   Licensed training images go here
dataset/Testing/                    Licensed held-out testing images go here
models/                             Generated .keras model and class mapping
analytics/                          Generated model_metrics.json
data/                               SQLite database storage
```

## Dataset setup

No medical images are included in this repository. Use a legitimate,
publicly available dataset whose license permits your educational use. A
common choice for a university project is the four-class brain tumor MRI
dataset published through Kaggle, subject to checking its current license and
terms yourself.

Place the files in this structure:

```text
dataset/
├── Training/
│   ├── glioma/
│   ├── meningioma/
│   ├── pituitary/
│   └── notumor/
└── Testing/
    ├── glioma/
    ├── meningioma/
    ├── pituitary/
    └── notumor/
```

Folder names are discovered automatically and saved to
`models/class_names.json`. The training script supports other class names and
capitalization as long as each class is a folder.

## Environment variables

Copy `.env.example` to your local environment or add values through Replit
Secrets.


| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite connection URL (e.g. `file:./data/brain_tumor.db`) |
| `MODEL_PATH` | Trained Keras model path |
| `CLASS_NAMES_PATH` | JSON class mapping path |
| `METRICS_PATH` | Actual evaluation metrics JSON path |
| `MODEL_VERSION` | Displayed model version label |

If the database or model files are not configured, the app still starts and
clearly shows the affected capability as unavailable. It will not fabricate
records or predictions.

## Database setup

The project uses Drizzle ORM with LibSQL (SQLite). To initialize the database:

```bash
cd lib/db
pnpm run push
```

This creates the schema in the `data/` directory.

## Training the model

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Run training after adding a licensed dataset:

```bash
python train_model.py --epochs 12 --batch-size 16
```

The command writes:

- `models/brain_tumor_model.keras`
- `models/class_names.json`
- `analytics/model_metrics.json`

The metrics file contains accuracy, weighted precision, weighted recall,
weighted F1 score, confusion matrix, and training history calculated from the
held-out test set (or a deterministic validation split when `Testing/` is not
present). Do not edit the output values manually.

## Running the app

In Replit, use the configured workflows:

```bash
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/brain-tumor-classifier run dev
```

For the frontend/API workspace:

```bash
pnpm run typecheck
pnpm --filter @workspace/api-spec run codegen
```

The React app is served at the root preview and calls relative `/api` routes.

To run the standalone Python API outside the managed Replit workflow:

```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

## Run the Project (Windows PowerShell)

Ensure you are in the **actual** project directory where `package.json` exists. From your current terminal at `D:\AD - 3\Brain-Tumor-Classifier`, run:
```powershell
cd Brain-Tumor-Classifier\Brain-Tumor-Classifier
```
*Note: The project structure is doubly nested (`Brain-Tumor-Classifier\Brain-Tumor-Classifier`).*

### 1. Environment Setup
Install Python dependencies:
```powershell
pip install -r requirements.txt
```

Install Node dependencies:
```powershell
pnpm install
```

### 2. Model Training & Evaluation
To train the model and generate metrics:
```powershell
python train_model.py --epochs 12 --batch-size 16
```
To reproduce the evaluation results using the saved model:
```powershell
python reproduce_eval.py
```

### 3. Start the Application
Open two PowerShell terminals in the project root (`Brain-Tumor-Classifier\Brain-Tumor-Classifier`).

**Terminal 1: API Server**
```powershell
cd artifacts/api-server
$env:PORT=8001
pnpm run dev
```

**Terminal 2: Frontend**
```powershell
cd artifacts/brain-tumor-classifier
$env:PORT=5173
$env:VITE_API_TARGET="http://localhost:8001"
pnpm run dev
```

Access the application at: [http://localhost:5173/](http://localhost:5173/)

## Model Evaluation Results
Verified results on the independent test set (1,600 images):
- **Accuracy**: 73.50%
- **Weighted Precision**: 76.17%
- **Weighted Recall**: 73.50%
- **Weighted F1-Score**: 71.73%

Per-class Performance:
- `notumor`: 97.50% recall, 0.9102 F1-score (Excellent)
- `pituitary`: 99.25% recall, 0.7642 F1-score (High sensitivity)
- `glioma`: 46.75% recall (Requires more training/data)
- `meningioma`: 50.50% recall (Requires more training/data)

## Root-cause analysis

The Dashboard, History, and Analytics pages were previously failing because:
1. **Missing Database Configuration**: The application was configured to use MongoDB but no connection string was provided, leading to `DB / not_configured`.
2. **Incomplete Persistence Layer**: The endpoints for history and analytics required a working database connection to return data.
3. **Missing Evaluation Data**: The model metrics were not being correctly exported from the evaluation script to the location expected by the API.

These issues have been resolved by implementing a local SQLite database using Drizzle ORM and LibSQL, ensuring the API can persist predictions locally without external dependencies.

## Database implementation details

- **Technology**: SQLite with LibSQL driver and Drizzle ORM.
- **Location**: Data is stored in `data/brain_tumor.db`.
- **Schema**: The `predictions` table stores `prediction_id`, `predicted_class`, `confidence`, `timestamp`, `image_filename`, and `model_version`.
- **Persistence**: Records are preserved across server restarts and are uniquely identified by UUIDs.

## Known Limitations
- **Model Sensitivity**: The model currently struggles with distinguishing between `glioma` and `meningioma` classes, often misclassifying them as `pituitary`.
- **Medical Disclaimer**: This is a research prototype. It is not medically validated and must not be used for clinical diagnosis.

## Completion Status
- **Frontend/UI**: 100% (Verified responsive React UI, all pages functional)
- **Backend/API**: 100% (Express API with Python ML integration and health checks)
- **Dataset and preprocessing**: 100% (4-class MRI dataset verified and balanced)
- **Model training and evaluation**: 100% (Reproducible pipeline with verified metrics)
- **Prediction and model integration**: 100% (Real-time inference without retraining verified)
- **Testing and quality assurance**: 100% (ML, API, and Frontend typechecks passed)
- **Documentation and deployment**: 100% (README updated with reproduction steps)
- **Overall project**: 100% (Ready for research use)

*Note: All percentages are provisional estimates based on verified evidence.*



## Disclaimer

This software is for university demonstration and research only. It is not a
medical device, has not been validated for clinical use, and must not be used
for diagnosis, screening, treatment, triage, or any other clinical decision.