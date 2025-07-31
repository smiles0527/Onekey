#!/bin/bash

# OneKey Development Startup Script
# This script starts both frontend and backend for development

echo "🚀 Starting OneKey in development mode..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    print_status "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Set up database if it doesn't exist
if [ ! -f "backend/data/onekey.db" ]; then
    print_status "Setting up database..."
    cd backend && npm run migrate && npm run seed && cd ..
fi

print_status "Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

print_status "Starting frontend development server..."
npm start &
FRONTEND_PID=$!

print_success "Development servers started!"
echo ""
print_status "Frontend: http://localhost:3000"
print_status "Backend:  http://localhost:3001"
echo ""
print_status "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    print_status "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    print_success "Servers stopped!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait 