@echo off
echo 🚀 Starting Onekey Development Environment...
echo.

echo 📦 Installing dependencies if needed...
call npm run install:all

echo.
echo 🔧 Starting Backend and Frontend...
echo.
echo 📱 Frontend will be available at: http://localhost:3000
echo 🔌 Backend API will be available at: http://localhost:3001
echo.
echo ⏹️  Press Ctrl+C to stop all servers
echo.

call npm run dev

pause 