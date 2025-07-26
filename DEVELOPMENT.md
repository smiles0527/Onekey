# 🚀 Onekey Development Guide

This guide shows you how to run both the frontend and backend together for development.

## Quick Start

### Option 1: Simple Concurrent Script (Recommended)
```bash
npm run dev
```
This runs both frontend and backend simultaneously.

### Option 2: Custom Development Server
```bash
npm run dev:custom
```
This uses a custom Node.js script that provides better logging and process management.

### Option 3: Sequential Startup (Backend First)
```bash
npm run dev:full
```
This starts the backend first, waits for it to be ready, then starts the frontend.

## Individual Commands

### Frontend Only
```bash
npm run dev:frontend
# or
npm start
```

### Backend Only
```bash
npm run dev:backend
# or
cd backend && npm run dev
```

## VS Code Integration

### Debug Configurations
1. Open VS Code
2. Go to Run and Debug (Ctrl+Shift+D)
3. Select one of these configurations:
   - **Launch Full Stack (Backend + Frontend)** - Runs both with custom server
   - **Full Stack Debug** - Runs both in separate debug sessions
   - **Launch Backend Only** - Debug backend only
   - **Launch Frontend Only** - Debug frontend only

### Quick Debug
- Press F5 to start debugging
- Use breakpoints in both frontend and backend code
- Hot reload works for both servers

## Initial Setup

### First Time Setup
```bash
npm run setup
```
This will:
1. Install all dependencies (frontend + backend)
2. Run database migrations
3. Seed initial data

### Manual Setup
```bash
# Install dependencies
npm run install:all

# Setup database
cd backend
npm run migrate
npm run seed

# Start development
npm run dev
```

## Development URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Default Login

- **Username**: `admin`
- **Password**: `admin123`

## Environment Variables

### Backend (.env file in backend folder)
```env
PORT=3001
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend
The frontend automatically connects to `http://localhost:3001` for the API.

## Troubleshooting

### Port Already in Use
If you get "port already in use" errors:
```bash
# Kill processes on ports 3000 and 3001
npx kill-port 3000 3001
```

### Database Issues
```bash
cd backend
npm run migrate
npm run seed
```

### Dependencies Issues
```bash
npm run install:all
```

## File Structure

```
Onekey/
├── src/                    # Frontend React code
├── backend/               # Backend Node.js/Express code
├── dev-server.js         # Custom development server
├── package.json          # Frontend dependencies
└── backend/package.json  # Backend dependencies
```

## Hot Reload

Both frontend and backend support hot reload:
- **Frontend**: Changes to React components auto-reload
- **Backend**: Changes to TypeScript files auto-reload (with ts-node-dev)

## Logging

### Custom Server Logging
The custom development server (`dev-server.js`) provides:
- Color-coded output for each process
- Clear process identification
- Error handling and reporting

### Backend Logging
- API requests logged with Morgan
- Database operations logged
- Error handling with detailed messages

### Frontend Logging
- React development tools
- Console logging for debugging
- Network requests in browser dev tools

## Production Build

```bash
# Build frontend
npm run build

# Start production backend
cd backend
npm start
```

## Database Management

### View Database
```bash
cd backend
sqlite3 data/onekey.db
```

### Backup Database
```bash
cd backend
npm run backup
```

### Reset Database
```bash
cd backend
rm data/onekey.db
npm run migrate
npm run seed
```

## API Documentation

The backend API is documented in `backend/README.md` with all available endpoints and their usage.

---

Happy coding! 🎉 