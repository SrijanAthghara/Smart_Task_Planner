# Smart Task Planner

A full-stack intelligent task management application that leverages AI to help you organize, prioritize, and optimize your productivity. Built with React.js, Node.js, MongoDB, and OpenAI API integration.

## ✨ Features

### Core Functionality
- **Task Management**: Create, update, delete, and organize tasks with detailed information
- **Smart Filtering**: Filter tasks by status, priority, category, and custom criteria
- **Status Tracking**: Track task progress through different stages (pending, in-progress, completed, cancelled)
- **Priority System**: Four-level priority system (low, medium, high, urgent) with visual indicators

### AI-Powered Features
- **Task Suggestions**: Get AI-powered recommendations for task optimization and breakdown
- **Auto Task Generation**: Generate multiple related tasks from project descriptions
- **Workload Analysis**: AI analysis of your task workload with productivity recommendations
- **Smart Insights**: Context-aware suggestions based on task details and patterns

### User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Instant UI updates with optimistic loading states
- **Visual Feedback**: Color-coded priorities, status indicators, and progress tracking
- **Intuitive Interface**: Clean, modern design with easy navigation

## 🏗️ Architecture

```
smart-task-planner/
├── client/                 # React.js Frontend (Vite)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   └── ...
│   └── package.json
├── server/                 # Node.js Backend (Express)
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   └── package.json
├── package.json           # Root package manager
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **OpenAI API Key** (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-task-planner
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```
   This command installs dependencies for root, client, and server.

3. **Set up environment variables**

   **Server Environment** (`server/.env`):
   ```env
   MONGODB_URI=mongodb://localhost:27017/smart-task-planner
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

   **Client Environment** (`client/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**
   - Local: Ensure MongoDB service is running
   - Atlas: Update MONGODB_URI with your connection string

5. **Run the application**
   ```bash
   npm run dev
   ```
   This starts both client (http://localhost:3000) and server (http://localhost:5000) concurrently.

## 📋 Available Scripts

### Root Level
- `npm run dev` - Start both client and server in development mode
- `npm run install:all` - Install dependencies for all packages
- `npm run client:dev` - Start only the React client
- `npm run server:dev` - Start only the Node.js server
- `npm run client:build` - Build the React app for production

### Client (`/client`)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server (`/server`)
- `npm start` - Start server in production mode
- `npm run dev` - Start server with nodemon (development)

## 🔧 Configuration

### Database Setup
1. **Local MongoDB**: Install MongoDB and start the service
2. **MongoDB Atlas**: Create a cluster and get the connection string
3. Update `MONGODB_URI` in server environment variables

### OpenAI API Setup
1. Sign up at [OpenAI](https://platform.openai.com/)
2. Generate an API key
3. Add the key to `OPENAI_API_KEY` in server environment variables
4. Ensure you have sufficient quota for API calls

### Environment Variables

**Server Environment Variables**:
- `MONGODB_URI`: MongoDB connection string
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (development/production)

**Client Environment Variables**:
- `VITE_API_URL`: Backend API base URL

## 🌐 API Endpoints

### Task Management
- `GET /api/tasks` - Get all tasks with optional filtering
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status

### AI Features
- `POST /api/ai/suggest` - Get AI suggestions for task optimization
- `POST /api/ai/generate-tasks` - Generate tasks from description
- `POST /api/ai/analyze-workload` - Analyze task workload

### System
- `GET /api/health` - Health check endpoint

## 📁 Project Structure Details

### Frontend (`/client`)
```
client/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation header
│   │   ├── TaskList.jsx        # Task display and management
│   │   ├── TaskForm.jsx        # Task creation/editing form
│   │   └── AIAssistant.jsx     # AI-powered sidebar features
│   ├── services/
│   │   └── api.js              # API client and service functions
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles with Tailwind
├── index.html                  # HTML template
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── package.json               # Frontend dependencies
```

### Backend (`/server`)
```
server/
├── models/
│   └── Task.js                 # MongoDB task schema
├── routes/
│   ├── tasks.js               # Task CRUD operations
│   └── ai.js                  # AI integration endpoints
├── index.js                   # Express server setup
├── .env.example              # Environment template
└── package.json              # Backend dependencies
```

## 🎯 Usage Guide

### Creating Tasks
1. Click "New Task" in the navigation
2. Fill in task details (title is required)
3. Set priority, category, due date, and estimated duration
4. Use tags for better organization
5. Save the task

### Using AI Features
1. **Task Suggestions**: Enter task details in AI Assistant sidebar to get optimization tips
2. **Task Generation**: Describe a project to automatically generate related tasks
3. **Workload Analysis**: Analyze your current tasks for productivity insights

### Managing Tasks
1. **Filter Tasks**: Use the filter bar to view specific subsets of tasks
2. **Update Status**: Change task status directly from the task list
3. **Edit Tasks**: Click the edit icon to modify task details
4. **Delete Tasks**: Remove tasks with confirmation

### Priority System
- 🔴 **Urgent**: Critical tasks requiring immediate attention
- 🟠 **High**: Important tasks with near-term deadlines
- 🟡 **Medium**: Standard priority tasks (default)
- 🟢 **Low**: Tasks that can be done when time permits

## 🔒 Security Features

- **Input Validation**: Comprehensive validation on both client and server
- **Rate Limiting**: API rate limiting to prevent abuse
- **Security Headers**: Helmet.js for security headers
- **Error Handling**: Structured error responses without sensitive information
- **Environment Variables**: Secure configuration management

## 🚀 Deployment

### Prerequisites for Production
- Node.js hosting service (Heroku, Vercel, Railway, etc.)
- MongoDB Atlas account (or managed MongoDB service)
- OpenAI API account with sufficient quota

### Environment Setup
1. Set production environment variables on your hosting platform
2. Update `NODE_ENV=production`
3. Configure CORS settings for your production domain
4. Set up proper MongoDB indexes for performance

### Build and Deploy
1. Build the client: `cd client && npm run build`
2. Deploy server code to your hosting platform
3. Ensure environment variables are configured
4. Start the server: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Error**:
- Verify MongoDB is running (local) or connection string is correct (Atlas)
- Check network connectivity and firewall settings

**OpenAI API Errors**:
- Verify API key is correct and has sufficient quota
- Check API key permissions and billing status

**Port Already in Use**:
- Change PORT in server environment variables
- Kill processes using the ports: `npx kill-port 3000 5000`

**Build Errors**:
- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
- Ensure Node.js version compatibility (v16+)

### Performance Optimization
- Use MongoDB indexes for large datasets
- Implement pagination for large task lists
- Cache frequent AI API requests
- Optimize bundle size with code splitting

## 📞 Support

For questions, issues, or contributions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Join community discussions
4. Review documentation and troubleshooting guide

---

**Happy task managing! 🎯✨**