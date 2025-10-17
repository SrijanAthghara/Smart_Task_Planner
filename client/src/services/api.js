import axios from 'axios';

// Use environment variable for production or default to development server
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:3002/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor for adding auth headers (if needed in future)
api.interceptors.request.use(
  (config) => {
    // Add auth token here if using authentication
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// Task API functions
export const taskApi = {
  // Get all tasks with optional filters
  getTasks: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return api.get(`/tasks?${params.toString()}`);
  },

  // Get a specific task
  getTask: (id) => api.get(`/tasks/${id}`),

  // Create a new task
  createTask: (taskData) => api.post('/tasks', taskData),

  // Update a task
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),

  // Delete a task
  deleteTask: (id) => api.delete(`/tasks/${id}`),

  // Update task status
  updateTaskStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
};

// AI API functions
export const aiApi = {
  // Get AI suggestions for a task
  getSuggestions: (task, context = '') => 
    api.post('/ai/suggest', { task, context }),

  // Generate tasks from description
  generateTasks: (description, projectContext = '') => 
    api.post('/ai/generate-tasks', { description, projectContext }),

  // Analyze workload
  analyzeWorkload: (tasks) => 
    api.post('/ai/analyze-workload', { tasks }),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;