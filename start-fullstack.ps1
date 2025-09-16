# Happy Paisa Full Stack Startup Script
Write-Host "🚀 Starting Happy Paisa Full Stack Application..." -ForegroundColor Green

# Function to check if a port is available
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $false  # Port is in use
    } catch {
        return $true   # Port is available
    }
}

# Kill any existing node processes to free up ports
Write-Host "🧹 Cleaning up existing processes..." -ForegroundColor Yellow
try { 
    Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
} catch {
    # Process cleanup failed, but continue
}

# Check ports
$backendPort = 3001
$frontendPort = 5173

if (-not (Test-Port $backendPort)) {
    Write-Host "⚠️  Port $backendPort is still in use. Trying to free it..." -ForegroundColor Yellow
    netstat -ano | findstr :$backendPort | ForEach-Object { 
        $pid = ($_ -split '\s+')[-1]
        if ($pid -match '^\d+$') {
            taskkill /F /PID $pid 2>$null
        }
    }
    Start-Sleep -Seconds 2
}

# Start Backend Server
Write-Host "🔧 Starting Backend Server (Port $backendPort)..." -ForegroundColor Cyan
$backendPath = "C:\Users\DELL\Desktop\happy-paisa-backend"

if (Test-Path $backendPath) {
    # Check if .env exists
    if (-not (Test-Path "$backendPath\.env")) {
        Write-Host "⚠️  No .env file found in backend. Creating minimal .env..." -ForegroundColor Yellow
        @"
# Database
DATABASE_URL="sqlite:./dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Stripe (optional - set your own keys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Server
PORT=3001
NODE_ENV=development
"@ | Out-File -FilePath "$backendPath\.env" -Encoding UTF8
    }

    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Server Starting...' -ForegroundColor Green; npm run dev" -WindowStyle Normal
    Write-Host "✅ Backend server starting on http://localhost:$backendPort" -ForegroundColor Green
} else {
    Write-Host "❌ Backend directory not found at $backendPath" -ForegroundColor Red
    Write-Host "🔄 Using mock backend instead..." -ForegroundColor Yellow
    
    # Start mock backend if main backend not found
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\mock-backend'; Write-Host 'Mock Backend Server Starting...' -ForegroundColor Green; npm start" -WindowStyle Normal
    Write-Host "✅ Mock backend server starting on http://localhost:$backendPort" -ForegroundColor Green
}

# Wait for backend to start
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Frontend Server  
Write-Host "🎨 Starting Frontend Server (Port $frontendPort)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'Frontend Server Starting...' -ForegroundColor Green; npm run dev" -WindowStyle Normal

# Wait for frontend to start
Write-Host "⏳ Waiting for frontend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Display status and instructions
Write-Host ""
Write-Host "🎉 HAPPY PAISA FULL STACK IS STARTING!" -ForegroundColor Green -BackgroundColor Black
Write-Host ""
Write-Host "📊 SERVERS:" -ForegroundColor White
Write-Host "   🔧 Backend API:  http://localhost:$backendPort" -ForegroundColor Cyan
Write-Host "   🎨 Frontend App: http://localhost:$frontendPort" -ForegroundColor Magenta
Write-Host ""
Write-Host "🌐 PREVIEW YOUR APP:" -ForegroundColor White
Write-Host "   🏠 Homepage:     http://localhost:$frontendPort" -ForegroundColor Green
Write-Host "   🔐 Sign In:      http://localhost:$frontendPort/signin" -ForegroundColor Blue
Write-Host "   🎮 Dashboard:    http://localhost:$frontendPort/dashboard" -ForegroundColor Purple
Write-Host "   💰 Wallet:      http://localhost:$frontendPort/dashboard/wallet" -ForegroundColor Yellow
Write-Host "   👤 Profile:     http://localhost:$frontendPath/dashboard/profile" -ForegroundColor Cyan
Write-Host ""
Write-Host "🤖 FEATURES TO TEST:" -ForegroundColor White
Write-Host "   • Mr. Happy AI Chat Widget (floating button)" -ForegroundColor Gray
Write-Host "   • Games with live reward system" -ForegroundColor Gray
Write-Host "   • Real-time leaderboard with backend data" -ForegroundColor Gray
Write-Host "   • Wallet balance and transaction history" -ForegroundColor Gray
Write-Host "   • User profile management" -ForegroundColor Gray
Write-Host ""
Write-Host "⚡ API ENDPOINTS AVAILABLE:" -ForegroundColor White
Write-Host "   GET  /api/health          - Server health check" -ForegroundColor Gray
Write-Host "   GET  /api/leaderboard     - Leaderboard data" -ForegroundColor Gray
Write-Host "   POST /api/games/play      - Submit game scores" -ForegroundColor Gray
Write-Host "   GET  /api/user/wallet     - User wallet info" -ForegroundColor Gray
Write-Host "   GET  /api/user/profile    - User profile data" -ForegroundColor Gray
Write-Host ""

# Try to open the browser automatically
Write-Host "🌐 Opening your app in browser..." -ForegroundColor Green
try {
    Start-Process "http://localhost:$frontendPort"
} catch {
    Write-Host "   👆 Please manually open: http://localhost:$frontendPort" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ Your Happy Paisa app with full backend integration is now running!" -ForegroundColor Green
Write-Host "   Press Ctrl+C in any terminal window to stop the servers." -ForegroundColor Gray
Write-Host ""

# Keep this script window open
Write-Host "Press any key to close this status window..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")