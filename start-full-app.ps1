# Happy Paisa - Complete App Startup Script
# This script starts both frontend and backend servers

Write-Host "🎮 Happy Paisa - Starting Complete Application" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# Check if directories exist
$frontendPath = "C:\Users\DELL\Desktop\happy-paisa-frontend"
$backendPath = "C:\Users\DELL\Desktop\happy-paisa-backend"

if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Frontend directory not found at: $frontendPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $backendPath)) {
    Write-Host "❌ Backend directory not found at: $backendPath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found frontend at: $frontendPath" -ForegroundColor Green
Write-Host "✅ Found backend at: $backendPath" -ForegroundColor Green
Write-Host ""

# Function to start backend
function Start-Backend {
    Write-Host "🚀 Starting Backend Server (Port 3001)..." -ForegroundColor Yellow
    Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '🔧 Happy Paisa Backend Server' -ForegroundColor Blue; npm run dev" -WindowStyle Normal
    Start-Sleep 3
}

# Function to start frontend  
function Start-Frontend {
    Write-Host "🚀 Starting Frontend Server (Port 5173)..." -ForegroundColor Yellow
    Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '⚡ Happy Paisa Frontend Server' -ForegroundColor Magenta; npm run dev" -WindowStyle Normal
    Start-Sleep 3
}

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

Write-Host "🔍 Checking if servers are already running..." -ForegroundColor Yellow

# Check for existing processes
$backendRunning = Test-Port 3001
$frontendRunning = Test-Port 5173

if ($backendRunning) {
    Write-Host "⚠️  Backend already running on port 3001" -ForegroundColor Yellow
} else {
    Start-Backend
}

if ($frontendRunning) {
    Write-Host "⚠️  Frontend already running on port 5173" -ForegroundColor Yellow  
} else {
    Start-Frontend
}

Write-Host ""
Write-Host "🎯 Application Status:" -ForegroundColor Cyan
Write-Host "=" * 30 -ForegroundColor Cyan

# Wait and check if servers started successfully
Start-Sleep 5

$backendStatus = if (Test-Port 3001) { "✅ RUNNING" } else { "❌ FAILED" }
$frontendStatus = if (Test-Port 5173) { "✅ RUNNING" } else { "❌ FAILED" }

Write-Host "Backend (Port 3001):  $backendStatus" -ForegroundColor $(if (Test-Port 3001) { "Green" } else { "Red" })
Write-Host "Frontend (Port 5173): $frontendStatus" -ForegroundColor $(if (Test-Port 5173) { "Green" } else { "Red" })

Write-Host ""
Write-Host "🌐 Access Your App:" -ForegroundColor Cyan
Write-Host "=" * 20 -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "Backend:  http://localhost:3001/api/health" -ForegroundColor Green

Write-Host ""
Write-Host "📖 Quick Test Guide:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "2. Try Demo Mode: email 'demo@example.com' + any password" -ForegroundColor White  
Write-Host "3. Or Sign Up for real account with Supabase backend" -ForegroundColor White
Write-Host "4. Play games, check wallet, update profile!" -ForegroundColor White

Write-Host ""
Write-Host "🎮 Happy Gaming! Your full-stack app is ready!" -ForegroundColor Green
Write-Host ""

# Keep this window open
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")