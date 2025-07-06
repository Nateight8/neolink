# NeoLink

![NeoLink Preview](public/preview.jpg)

A competitive social gaming platform where users can challenge friends to fun games, starting with fully integrated chess. Built with Next.js and Node.js, NeoLink combines social networking with engaging gameplay experiences.

## 🚀 Features

- **Multiplayer Gaming**: Challenge friends to real-time games
- **Chess Integration**: Full-featured chess with move validation and game history
- **Social Network**: Connect with friends, send challenges, and track scores
- **Real-time Updates**: Live game state and notifications
- **Responsive Design**: Play on any device, anywhere
- **Secure Authentication**: JWT-based user authentication

## 🚀 Live Demo

Experience NeoLink live: [neolink-tawny.vercel.app](https://neolink-tawny.vercel.app)

## 🛠 Technology Stack

### Frontend

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Query](https://tanstack.com/query) - Data fetching and state management
- [Chess.js](https://github.com/jhlywa/chess.js) - Chess move generation and validation
- [React Chessboard](https://github.com/Clariity/react-chessboard) - Interactive chess board component

### Backend

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express](https://expressjs.com/) - Web framework
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud NoSQL database for game state and user data
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [Socket.IO](https://socket.io/) - Real-time game state synchronization
- [Chess.js](https://github.com/jhlywa/chess.js) - Server-side move validation

### DevOps

- [Docker](https://www.docker.com/) - Containerization
- [Docker Compose](https://docs.docker.com/compose/) - Multi-container orchestration
- [GitHub Actions](https://github.com/features/actions) - CI/CD

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 18+
- pnpm (for frontend)
- npm (for backend)

### 🐳 Quick Start with Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/Nateight8/neolink.git
   cd neolink
   ```

2. **Set up environment variables**

   ```bash
   # Copy example environment files
   cp web/.env.example web/.env
   cp backend/.env.example backend/.env
   ```

   Update the environment variables in both files with your configuration.

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

## 🔧 Environment Variables

### Frontend (web/.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_STREAM_KEY=your_stream_chat_key
# Add other frontend environment variables here
```

### Backend (backend/.env)

```env
PORT=5001
NODE_ENV=development
# Get your MongoDB Atlas connection string from: https://cloud.mongodb.com/
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_here
STREAM_API_KEY=your_stream_chat_api_key
STREAM_API_SECRET=your_stream_chat_api_secret
CORS_ORIGIN=http://localhost:3000
```

## 🐳 Docker Commands

| Command                                | Description                         |
| -------------------------------------- | ----------------------------------- |
| `docker-compose up -d`                 | Start all services in detached mode |
| `docker-compose down`                  | Stop and remove all containers      |
| `docker-compose logs -f`               | View logs in real-time              |
| `docker-compose up --build -d`         | Rebuild and restart services        |
| `docker-compose exec backend npm test` | Run backend tests                   |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by NATE
- Special thanks to all contributors and open-source maintainers
- Inspired by modern social networking platforms
