# NeoLink

A modern social networking platform built with Next.js and Node.js, containerized with Docker for easy development and deployment.

## 🚀 Features

- **Frontend**: Next.js with modern React
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Containerization**: Docker with multi-stage builds
- **Real-time Chat**: Stream Chat integration

## 🛠 Prerequisites

- Docker & Docker Compose
- Node.js (for local development without Docker)
- pnpm (for frontend development)
- npm (for backend development)

## 🐳 Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd neolink
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env` in both `web` and `backend` directories
   - Update the environment variables with your configuration

3. **Start the application**
   ```bash
   # Build and start all services in detached mode
   docker-compose up --build -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 🛠 Development

### Frontend Development

```bash
cd web
pnpm install
pnpm dev
```

### Backend Development

```bash
cd backend
npm install
npm run dev
```

## 🌐 Services

- **Frontend**: Next.js application on port 3000
- **Backend**: Node.js API on port 5001
- **MongoDB**: Database service
- **Stream Chat**: Real-time chat functionality

## 🔧 Environment Variables

### Frontend (web/.env)
```
NEXT_PUBLIC_API_URL=http://localhost:5001
# Add other frontend environment variables here
```

### Backend (backend/.env)
```
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STREAM_API_KEY=your_stream_chat_api_key
STREAM_API_SECRET=your_stream_chat_api_secret
CORS_ORIGIN=http://localhost:3000
```

## 🐳 Docker Commands

- Start services: `docker-compose up -d`
- Stop services: `docker-compose down`
- View logs: `docker-compose logs -f`
- Rebuild containers: `docker-compose up --build -d`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
