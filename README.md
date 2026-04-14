# LiquidHub 💰

Financial Graphics Dashboard - Create beautiful profitability and liquidity forecasts from business data.

## 🎯 Features

- **Profitability Forecast**: Visualize revenue, costs, and profit trends
- **Liquidity Dashboard**: Track cash position and liquidity forecasts
- **Data Input**: Manual entry or CSV/JSON file import
- **Beautiful Charts**: Interactive, responsive visualizations
- **Full-Stack App**: React frontend + Node.js backend

## 🏗️ Project Structure

```
liquidhub/
├── frontend/              # React + TypeScript application
│   ├── src/
│   │   ├── components/   # Chart and form components
│   │   ├── pages/        # Dashboard page
│   │   ├── styles/       # CSS files
│   │   ├── types/        # TypeScript types
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
│   ├── Dockerfile        # Frontend container
│   ├── nginx.conf        # Nginx configuration
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
├── backend/               # Node.js/Express API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   └── index.ts      # Server setup
│   ├── Dockerfile        # Backend container
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── .github/workflows/     # GitHub Actions
│   └── deploy.yml         # Auto-deploy workflow
├── docker-compose.yml     # Docker orchestration
├── README.md
└── .gitignore
```

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 18+
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:3000

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on: http://localhost:5000

### Build for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
npm start
```

## 🌐 Production Deployment

### Option 1: Docker (Recommended)
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t liquidhub-frontend ./frontend
docker build -t liquidhub-backend ./backend
docker-compose up -d
```

### Option 2: Direct Deployment
```bash
# Install PM2 globally
npm install -g pm2

# Deploy backend
cd backend
npm ci
npm run build
pm2 start dist/index.js --name liquidhub-backend

# Deploy frontend
cd frontend
npm ci
npm run build
npm run preview
pm2 start npm --name liquidhub-frontend -- run preview
```

### DNS Configuration for zdkg.de
Add these DNS records in your Hetzner DNS console:

```
Type: A
Name: @
Value: 188.245.172.75
TTL: 3600

Type: A
Name: www
Value: 188.245.172.75
TTL: 3600
```

### Server Setup (Hetzner)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
git clone https://github.com/lucasterix/liquidhub.git /opt/liquidhub
cd /opt/liquidhub

# Start with Docker Compose
docker-compose up -d

# Install nginx (optional, for reverse proxy)
sudo apt install nginx -y
```

### GitHub Actions Auto-Deploy
The repository includes a GitHub Actions workflow that automatically deploys on every push to main.

**Required Secrets in GitHub:**
- `SERVER_HOST`: 188.245.172.75
- `SERVER_USER`: your-server-username
- `SERVER_SSH_KEY`: SSH private key for server access
- `SERVER_PORT`: 22 (optional, default)

## 📊 Features Roadmap

- [ ] Advanced data import (multiple formats)
- [ ] Forecast algorithms (linear regression, exponential smoothing)
- [ ] Export to PDF/PNG
- [ ] Real-time data sync
- [ ] User authentication
- [ ] Data persistence (database)
- [ ] More chart types (bar, pie, waterfall)
- [ ] Custom themes

## 🛠️ Technology Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Chart.js
- React Router

**Backend:**
- Node.js
- Express
- TypeScript

**Deployment:**
- Docker
- Docker Compose
- Nginx
- PM2 (alternative)

## 📝 License

MIT

## 👤 Author

Created for financial data visualization# liquidhub