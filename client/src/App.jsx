import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import AIAssistant from './components/AIAssistant';
import { taskApi } from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: ''
  });

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, [filters]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskApi.getTasks(filters);
      setTasks(response.data.data || []);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await taskApi.createTask(taskData);
      setTasks(prev => [response.data.data, ...prev]);
      return { success: true };
    } catch (err) {
      console.error('Error creating task:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to create task' 
      };
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const response = await taskApi.updateTask(id, taskData);
      setTasks(prev => prev.map(task => 
        task._id === id ? response.data.data : task
      ));
      return { success: true };
    } catch (err) {
      console.error('Error updating task:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to update task' 
      };
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskApi.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting task:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to delete task' 
      };
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await taskApi.updateTaskStatus(id, status);
      setTasks(prev => prev.map(task => 
        task._id === id ? response.data.data : task
      ));
      return { success: true };
    } catch (err) {
      console.error('Error updating status:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to update status' 
      };
    }
  };

  const handleGeneratedTasks = (generatedTasks) => {
    // Add generated tasks to the task list
    generatedTasks.forEach(taskData => {
      handleCreateTask(taskData);
    });
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Routes>
                <Route path="/" element={
                  <div>
                    {/* Task Filters */}
                    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold mb-4">Filter Tasks</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
                          value={filters.status}
                          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        
                        <select
                          value={filters.priority}
                          onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">All Priority</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                        
                        <input
                          type="text"
                          placeholder="Filter by category"
                          value={filters.category}
                          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    {/* Task List */}
                    <TaskList
                      tasks={tasks}
                      loading={loading}
                      error={error}
                      onUpdateTask={handleUpdateTask}
                      onDeleteTask={handleDeleteTask}
                      onStatusUpdate={handleStatusUpdate}
                      onRefresh={loadTasks}
                    />
                  </div>
                } />
                <Route path="/create" element={
                  <TaskForm 
                    onSubmit={handleCreateTask}
                    title="Create New Task"
                  />
                } />
              </Routes>
            </div>

            {/* AI Assistant Sidebar */}
            <div className="lg:col-span-1">
              <AIAssistant 
                tasks={tasks}
                onGeneratedTasks={handleGeneratedTasks}
              />
            </div>
          </div>
        </main>

        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;