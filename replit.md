# Brain Tumor Classification Using Deep Learning

An educational MRI classification research prototype with real model/training
integration, MongoDB-backed prediction history, and analytics.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/brain-tumor-classifier` — React/Vite application
- `artifacts/api-server/src/routes` — API routes and validation
- `lib/api-spec/openapi.yaml` — API source of truth
- `train_model.py` and `backend/ml/predict.py` — real ML training/inference
- `dataset/`, `models/`, and `analytics/` — dataset and generated model output locations

## Architecture decisions

- Prediction outputs are unavailable until a trained Keras model exists; no fallback labels or confidence scores are generated.
- MongoDB stores prediction metadata only, never uploaded image bytes or patient identifiers.
- The managed Replit API workflow uses the shared TypeScript server for routing, while Python owns the TensorFlow training/inference pipeline.
- OpenAPI is the contract for generated client hooks and server validation.

## Product

Users can inspect the research methodology, check model/database readiness,
upload an MRI for real inference when trained assets are present, and review
actual stored predictions, analytics, and evaluation metrics.

## User preferences

- Never present this system as a medical diagnostic tool.
- Never fabricate predictions, confidence, analytics, or model performance.

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after OpenAPI changes.
- Model assets are intentionally ignored by git and must be generated from a licensed dataset.
- MongoDB is optional for startup but required for stored history and analytics.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
