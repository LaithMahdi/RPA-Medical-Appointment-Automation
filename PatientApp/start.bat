@echo off
echo 🚀 Starting Patient Form RPA Application...

start cmd /k "cd backend && npm run dev"
start cmd /k "cd frontend && npm run dev"

echo 📡 Backend starting on port 8080...
echo 💻 Frontend starting on port 300...
echo.
echo Both servers are starting in separate windows.
pause
