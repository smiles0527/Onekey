#!/bin/bash

# OneKey Production Deployment Script
# This script builds and deploys the full application

set -e  # Exit on any error

echo "🚀 Starting OneKey Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Step 1: Install dependencies
print_status "Installing frontend dependencies..."
npm install

print_status "Installing backend dependencies..."
cd backend && npm install && cd ..

# Step 2: Build frontend
print_status "Building frontend..."
npm run build

# Step 3: Build backend
print_status "Building backend..."
cd backend && npm run build && cd ..

# Step 4: Set up database
print_status "Setting up database..."
cd backend && npm run migrate && npm run seed && cd ..

# Step 5: Create production environment file
print_status "Creating production environment configuration..."
cat > backend/.env << EOF
# Production Environment Configuration
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database Configuration
DB_PATH=./data/onekey.db
DB_BACKUP_PATH=./data/backups/

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# File Upload Configuration
UPLOAD_PATH=./uploads/
MAX_FILE_SIZE=10485760
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/gif

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration - Update this with your actual domain
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
CORS_CREDENTIALS=true

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Backup Configuration
BACKUP_RETENTION_DAYS=30
AUTO_BACKUP_ENABLED=true
AUTO_BACKUP_SCHEDULE=0 2 * * *

# Admin Default Configuration
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_EMAIL=on3keymusic@gmail.com
DEFAULT_ADMIN_PASSWORD=admin123
EOF

print_success "Production environment file created!"

# Step 6: Create startup script
print_status "Creating startup script..."
cat > start-production.sh << 'EOF'
#!/bin/bash

# OneKey Production Startup Script

echo "🚀 Starting OneKey in production mode..."

# Set production environment
export NODE_ENV=production

# Start the backend server (which will also serve the frontend)
cd backend && npm start
EOF

chmod +x start-production.sh

print_success "Startup script created!"

# Step 7: Create PM2 configuration for production
print_status "Creating PM2 configuration..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'onekey',
    script: './backend/dist/server.js',
    cwd: './backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
EOF

print_success "PM2 configuration created!"

# Step 8: Create nginx configuration template
print_status "Creating nginx configuration template..."
cat > nginx.conf.template << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration (you'll need to add your SSL certificates)
    # ssl_certificate /path/to/your/certificate.crt;
    # ssl_certificate_key /path/to/your/private.key;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Proxy to Node.js application
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve static files directly
    location /uploads/ {
        alias /path/to/your/onekey/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

print_success "Nginx configuration template created!"

# Step 9: Create deployment instructions
print_status "Creating deployment instructions..."
cat > DEPLOYMENT.md << 'EOF'
# OneKey Production Deployment Guide

## Quick Start

1. **Update Domain Configuration**
   - Edit `backend/.env` and replace `yourdomain.com` with your actual domain
   - Update the nginx configuration in `nginx.conf.template`

2. **Start the Application**
   ```bash
   # Option 1: Direct start
   ./start-production.sh

   # Option 2: Using PM2 (recommended for production)
   npm install -g pm2
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

3. **Set up Nginx (Optional but Recommended)**
   - Copy `nginx.conf.template` to your nginx sites-available
   - Update the domain and SSL certificate paths
   - Enable the site and restart nginx

## Environment Variables

Update these in `backend/.env`:

- `CORS_ORIGIN`: Your domain(s) for CORS
- `JWT_SECRET`: A strong secret key
- `DEFAULT_ADMIN_PASSWORD`: Change the default admin password

## SSL Certificate

For HTTPS, you'll need SSL certificates. You can get free ones from Let's Encrypt:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Database Backup

The application automatically backs up the database. Backups are stored in `backend/data/backups/`.

## Monitoring

- Health check: `https://yourdomain.com/health`
- API info: `https://yourdomain.com/api`

## Default Admin Credentials

- Username: `admin`
- Password: `admin123` (change this in production!)

## Troubleshooting

1. Check logs: `pm2 logs onekey`
2. Restart: `pm2 restart onekey`
3. Check database: `sqlite3 backend/data/onekey.db`
EOF

print_success "Deployment instructions created!"

print_success "🎉 Deployment setup complete!"
echo ""
print_status "Next steps:"
echo "1. Update the domain in backend/.env"
echo "2. Run: ./start-production.sh"
echo "3. Visit your domain to see the application"
echo ""
print_warning "Don't forget to change the default admin password!"
echo ""
print_status "For detailed instructions, see DEPLOYMENT.md" 