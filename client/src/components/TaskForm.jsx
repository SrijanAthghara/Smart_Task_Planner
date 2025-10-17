import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Calendar, Tag, Clock, AlertCircle, Save, ArrowLeft } from 'lucide-react';

const TaskForm = ({ task = null, onSubmit, title = "Task Form" }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      status: task?.status || 'pending',
      category: task?.category || '',
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      estimatedDuration: task?.estimatedDuration || '',
      tags: task?.tags?.join(', ') || ''
    }
  });

  const watchedPriority = watch('priority');

  const onFormSubmit = async (data) => {
    setLoading(true);
    
    try {
      // Process tags
      const processedData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        estimatedDuration: data.estimatedDuration ? parseInt(data.estimatedDuration) : undefined,
        dueDate: data.dueDate || undefined
      };

      const result = await onSubmit(processedData);
      
      if (result.success) {
        toast.success(task ? 'Task updated successfully!' : 'Task created successfully!');
        reset();
        navigate('/');
      } else {
        toast.error(result.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Title *
          </label>
          <input
            type="text"
            {...register('title', { 
              required: 'Task title is required',
              maxLength: { value: 100, message: 'Title cannot exceed 100 characters' }
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter task title..."
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description', {
              maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
            })}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe your task in detail..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Priority and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Priority
            </label>
            <select
              {...register('priority')}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                getPriorityColor(watchedPriority)
              }`}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Category and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Category
            </label>
            <input
              type="text"
              {...register('category', {
                maxLength: { value: 50, message: 'Category cannot exceed 50 characters' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Work, Personal, Study..."
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              {...register('tags')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="tag1, tag2, tag3..."
            />
            <p className="mt-1 text-xs text-gray-500">Separate multiple tags with commas</p>
          </div>
        </div>

        {/* Due Date and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Due Date
            </label>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Estimated Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              {...register('estimatedDuration', {
                min: { value: 1, message: 'Duration must be at least 1 minute' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 60"
            />
            {errors.estimatedDuration && (
              <p className="mt-1 text-sm text-red-600">{errors.estimatedDuration.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;