#!/bin/bash

# Kill background processes on exit
trap "kill 0" EXIT

echo "🚀 Starting Patient Form RPA Application..."

# Start Backend
echo "📡 Starting Backend on port 8080..."
cd backend && npm run dev &

# Start Frontend
echo "💻 Starting Frontend on port 300..."
cd ../frontend && npm run dev &

# Keep the script running
wait
