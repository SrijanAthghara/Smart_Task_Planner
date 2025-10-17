import React, { useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  Calendar, Clock, Tag, AlertCircle, Edit, Trash2, 
  CheckCircle, XCircle, PlayCircle, PauseCircle,
  RefreshCw, Plus, Filter
} from 'lucide-react';

const TaskList = ({ 
  tasks, 
  loading, 
  error, 
  onUpdateTask, 
  onDeleteTask, 
  onStatusUpdate, 
  onRefresh 
}) => {
  const [editingTask, setEditingTask] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <PlayCircle className="w-4 h-4" />;
      case 'pending': return <PauseCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingStatus(taskId);
    try {
      const result = await onStatusUpdate(taskId, newStatus);
      if (result.success) {
        toast.success(`Task status updated to ${newStatus}`);
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch (error) {
      toast.error('An error occurred while updating status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async (taskId, taskTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
      return;
    }

    try {
      const result = await onDeleteTask(taskId);
      if (result.success) {
        toast.success('Task deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete task');
      }
    } catch (error) {
      toast.error('An error occurred while deleting task');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-primary-500" />
          <span className="text-gray-600">Loading tasks...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Tasks</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Found</h3>
          <p className="text-gray-600 mb-4">
            You haven't created any tasks yet. Start by adding your first task!
          </p>
          <button
            onClick={() => window.location.href = '/create'}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Task</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
          <p className="text-gray-600">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Task Cards */}
      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Task Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-gray-600 text-sm">{task.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
                    title="Edit task"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(task._id, task.title)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Task Meta Info */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Priority Badge */}
                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                  <AlertCircle className="w-3 h-3" />
                  <span className="capitalize">{task.priority}</span>
                </span>

                {/* Status Badge */}
                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {getStatusIcon(task.status)}
                  <span className="capitalize">{task.status.replace('-', ' ')}</span>
                </span>

                {/* Category */}
                {task.category && (
                  <span className="inline-flex items-center space-x-1 text-xs text-gray-600">
                    <Tag className="w-3 h-3" />
                    <span>{task.category}</span>
                  </span>
                )}

                {/* Due Date */}
                <span className="inline-flex items-center space-x-1 text-xs text-gray-600">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.dueDate)}</span>
                </span>

                {/* Duration */}
                {task.estimatedDuration && (
                  <span className="inline-flex items-center space-x-1 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{task.estimatedDuration}m</span>
                  </span>
                )}
              </div>

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* AI Suggestions */}
              {task.aiSuggestions && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-1">AI Suggestions:</h4>
                  <p className="text-sm text-blue-800">{task.aiSuggestions}</p>
                </div>
              )}

              {/* Status Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-xs text-gray-500">
                  Created: {formatDate(task.createdAt)}
                </div>
                <div className="flex items-center space-x-2">
                  <label htmlFor={`status-${task._id}`} className="text-sm font-medium text-gray-700">
                    Status:
                  </label>
                  <select
                    id={`status-${task._id}`}
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    disabled={updatingStatus === task._id}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;