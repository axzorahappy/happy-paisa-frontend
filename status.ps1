# Quick Status Check for Happy Paisa App
Write-Host "🔍 Happy Paisa - App Status Check" -ForegroundColor Cyan
Write-Host ("=" * 35) -ForegroundColor Cyan

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

# Check Backend
$backendStatus = Test-Port 3001
$backendText = if ($backendStatus) { "✅ RUNNING" } else { "❌ STOPPED" }
$backendColor = if ($backendStatus) { "Green" } else { "Red" }

# Check Frontend  
$frontendStatus = Test-Port 5173
$frontendText = if ($frontendStatus) { "✅ RUNNING" } else { "❌ STOPPED" }
$frontendColor = if ($frontendStatus) { "Green" } else { "Red" }

Write-Host "Backend (Port 3001):  $backendText" -ForegroundColor $backendColor
Write-Host "Frontend (Port 5173): $frontendText" -ForegroundColor $frontendColor

if ($backendStatus -and $frontendStatus) {
    Write-Host ""
    Write-Host "🎉 Full App Ready! Access at:" -ForegroundColor Green
    Write-Host "👉 http://localhost:5173" -ForegroundColor Yellow
} elseif ($frontendStatus) {
    Write-Host ""
    Write-Host "⚡ Frontend only (Supabase mode) at:" -ForegroundColor Yellow  
    Write-Host "👉 http://localhost:5173" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "⚠️ Servers need to be started" -ForegroundColor Yellow
    Write-Host "Run start-full-app.ps1 script" -ForegroundColor White
}