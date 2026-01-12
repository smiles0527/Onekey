# OneKey Student Volunteers

TODO:

- update JWT token
- firebase auth (postgres)?
- slideshow


## 🚀 Quick Start

### Development Mode (Local)

#### Windows
```bash
# Option 1: Use the Windows batch script
scripts\start-dev.bat

# Option 2: Use npm directly
npm start
```

#### Mac/Linux
```bash
# Start the application (Frontend + Backend)
npm start
```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Production Deployment

```bash
# Set up production deployment (Mac/Linux only)
npm run deploy:setup

# Start production server
npm run deploy:start
```

## 📚 **Documentation**

Complete documentation is available in the [`docs/`](./docs/) folder:

- **[📖 Documentation Index](./docs/README.md)** - Complete guide index
- **[🔧 Setup Guide](./docs/setup.md)** - Initial project setup  
- **[💻 Development Guide](./docs/DEVELOPMENT.md)** - Development workflow
- **[🔗 Integration Guide](./docs/INTEGRATION_GUIDE.md)** - Frontend-backend integration
- **[🎨 Tailwind Guide](./docs/TAILWIND_MIGRATION_GUIDE.md)** - Styling framework

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **State Management**: Zustand with persistence
- **Styling**: Tailwind CSS + custom CSS
- **Routing**: React Router DOM
- **API Integration**: Custom API service with automatic environment detection

### Backend (Node.js + Express)
- **Framework**: Express.js with TypeScript
- **Database**: SQLite with automatic migrations
- **Authentication**: JWT tokens
- **File Upload**: Multer with image processing
- **Security**: Helmet, CORS, rate limiting

### Key Features
- ✅ **Full Authentication System** - Login, registration, role-based access
- ✅ **Timeline Management** - Add, edit, delete events with photos
- ✅ **User Management** - Admin dashboard for user control
- ✅ **File Upload** - Image upload and processing
- ✅ **Responsive Design** - Works on all devices
- ✅ **Production Ready** - Single deployment with domain support

## 🔧 Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Install all dependencies (frontend + backend)
npm run setup

# Or step by step:
npm install
cd backend && npm install
```

### Available Scripts
```bash
# Development
npm start                      # Start both servers (recommended)
npm run dev                    # Alternative: Start both servers
scripts\start-dev.bat          # Windows: Use batch script
npm run dev:frontend           # Frontend only
npm run dev:backend            # Backend only

# Building
npm run build:all              # Build both frontend and backend
npm run build                  # Build frontend only

# Production
npm run deploy:setup           # Full production setup (Mac/Linux)
npm run deploy:start           # Start production server

# Testing & Debug
npm run test:integration       # Run integration tests
```

## 📁 Project Structure

```
OneKey/
├── docs/                   # 📚 All documentation
│   ├── README.md          # Documentation index
│   ├── setup.md           # Setup guide
│   ├── DEVELOPMENT.md     # Development guide
│   └── INTEGRATION_GUIDE.md # Integration details
├── scripts/               # 🔧 Deployment and utility scripts
│   ├── deploy.sh          # Production deployment
│   ├── start-dev.sh       # Development startup
│   └── test-integration.js # Integration tests
├── src/                   # ⚛️ Frontend React code
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── store/            # State management
│   ├── services/         # API services
│   └── styles/           # CSS styles
├── backend/              # 🔗 Backend Node.js code
│   ├── src/             # TypeScript source
│   ├── data/            # Database files
│   ├── uploads/         # Uploaded files
│   └── logs/            # Application logs
├── public/              # 📄 Static assets + debug tools
└── build/               # 📦 Frontend build output
```

## 🔧 Debug Tools

### Browser Console (Development Only)
At `http://localhost:3000`, open DevTools console:

```javascript
// Quick tests
login()                    // Test admin login
checkAuth()               // Check auth state
health()                  // Server health

// Full debug suite
OneKeyDebug.help()         // Show all functions
OneKeyDebug.runFullTest()  // Run complete test
```

## 🌐 Production Deployment

### With Your Domain

1. **Run the deployment script**:
   ```bash
   npm run deploy:setup
   ```

2. **Update domain configuration**:
   - Edit `backend/.env` and replace `yourdomain.com` with your actual domain

3. **Start the application**:
   ```bash
   npm run deploy:start
   ```

### Deployment Options

#### Option 1: Direct Node.js (Simple)
```bash
npm run deploy:start
```

#### Option 2: PM2 (Recommended for production)
```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

#### Option 3: With Nginx (Full production)
- Nginx configuration template generated during deployment
- SSL support with Let's Encrypt

## 🔐 Authentication

### Default Admin Account
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password in production!

### User Roles
- **Super Admin**: Full system access
- **Admin**: Timeline and user management
- **User**: Basic access to view content

## 🗄️ Database

The application uses SQLite for simplicity. Database files are stored in `backend/data/`.

### Automatic Backups
- Backups are stored in `backend/data/backups/`
- Automatic daily backups at 2 AM
- 30-day retention policy

### Manual Database Operations
```bash
# Reset database
cd backend && npm run migrate && npm run seed

# Access database directly
sqlite3 backend/data/onekey.db
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   lsof -ti:3001 | xargs kill -9
   ```

2. **Database issues**:
   ```bash
   cd backend && npm run migrate && npm run seed
   ```

3. **Permission denied**:
   ```bash
   chmod +x scripts/*.sh
   ```

### Debug Steps
1. Use browser console debug functions
2. Run integration tests: `npm run test:integration`
3. Check backend health: `curl http://localhost:3001/health`
4. Check documentation in `docs/` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email: on3keymusic@gmail.com

---

**Made with ❤️ by Curtis Wei and Ethan Xie**



