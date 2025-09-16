# Happy Paisa Full Stack Preview Script
Write-Host "🚀 Starting Happy Paisa Full Stack Preview" -ForegroundColor Green

# Start backend server
Write-Host "📡 Starting Mock Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoProfile", "-Command", "cd '$PWD\mock-backend'; npm start" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server
Write-Host "🎨 Starting Frontend Development Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoProfile", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal

# Wait for servers to initialize
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🎯 Full Stack Preview Ready!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Server Information:" -ForegroundColor Cyan
Write-Host "  🔗 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  🔗 Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "  📡 WebSocket: ws://localhost:3001/leaderboard/updates" -ForegroundColor White
Write-Host ""
Write-Host "🎮 Available Pages:" -ForegroundColor Cyan
Write-Host "  🏠 Home: http://localhost:5173/" -ForegroundColor White
Write-Host "  🎯 Games Dashboard: http://localhost:5173/dashboard" -ForegroundColor White
Write-Host "  🏆 Leaderboard Demo: http://localhost:5173/leaderboard-demo" -ForegroundColor White
Write-Host ""
Write-Host "🔥 Features to Test:" -ForegroundColor Cyan
Write-Host "  ✅ Real-time leaderboard updates" -ForegroundColor White
Write-Host "  ✅ WebSocket connection status" -ForegroundColor White
Write-Host "  ✅ Bonus reward system" -ForegroundColor White
Write-Host "  ✅ Interactive filters and charts" -ForegroundColor White
Write-Host "  ✅ Admin panel controls" -ForegroundColor White
Write-Host ""
Write-Host "🎲 The backend automatically simulates score updates every 30 seconds!" -ForegroundColor Magenta
Write-Host ""
Write-Host "Press any key to open the browsers..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open browsers
Start-Process "http://localhost:5173/dashboard"
Start-Process "http://localhost:3001/api/health"

Write-Host ""
Write-Host "🌐 Browsers opened! Check both frontend and backend." -ForegroundColor Green
Write-Host "Press Ctrl+C in the server windows to stop the servers." -ForegroundColor Yellow