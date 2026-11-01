# RadCortex AI - PowerShell Quick Launcher
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "          Starting RadCortex AI Clinical Suite" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $rootDir

Write-Host "[1/3] Starting FastAPI Backend on Port 8001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir'; `$env:PYTHONPATH='.'; .venv\Scripts\python.exe -u backend\app\main.py"

Start-Sleep -Seconds 3

Write-Host "[2/3] Starting Vite Frontend on Port 5173..." -ForegroundColor Yellow
$frontendDir = Join-Path $rootDir "artifacts\brain-tumor-classifier"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; pnpm run dev"

Start-Sleep -Seconds 4

Write-Host "[3/3] Opening Web Browser at http://localhost:5173..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "All services are running!" -ForegroundColor Green
Write-Host "Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "Omni-AI:   http://localhost:5173/omni-ai-studio" -ForegroundColor White
Write-Host "Classify:  http://localhost:5173/classify" -ForegroundColor White
Write-Host "Backend:   http://127.0.0.1:8001" -ForegroundColor White
Write-Host "API Docs:  http://127.0.0.1:8001/docs" -ForegroundColor White
Write-Host "=====================================================================" -ForegroundColor Cyan
