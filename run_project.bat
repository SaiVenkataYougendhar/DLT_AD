@echo off
title RadCortex AI - Launching Project
echo =====================================================================
echo           Starting RadCortex AI Clinical Suite
echo =====================================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting FastAPI Backend on Port 8001...
start "RadCortex AI - Backend API (Port 8001)" cmd /k "cd /d "%~dp0" && set PYTHONPATH=. && .venv\Scripts\python.exe -u backend\app\main.py"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Vite Frontend Dev Server on Port 5173...
start "RadCortex AI - Frontend (Port 5173)" cmd /k "cd /d "%~dp0artifacts\brain-tumor-classifier" && pnpm run dev"

timeout /t 4 /nobreak >nul

echo [3/3] Opening Browser at http://localhost:5173...
start http://localhost:5173

echo.
echo =====================================================================
echo All services launched!
echo - Web Dashboard:  http://localhost:5173
echo - Omni-AI Studio: http://localhost:5173/omni-ai-studio
echo - Studio Classify:http://localhost:5173/classify
echo - Backend API:    http://127.0.0.1:8001
echo - API Docs:       http://127.0.0.1:8001/docs
echo =====================================================================
echo Keep the opened terminal windows running while using the application.
pause
