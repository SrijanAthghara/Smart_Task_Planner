import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Brain, Lightbulb, Zap, BarChart3, Loader, Plus, MessageSquare } from 'lucide-react';
import { aiApi } from '../services/api';

const AIAssistant = ({ tasks, onGeneratedTasks }) => {
  const [activeTab, setActiveTab] = useState('suggest');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    suggestions: null,
    generatedTasks: null,
    analysis: null
  });

  // Task suggestion form state
  const [suggestionForm, setSuggestionForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    context: ''
  });

  // Task generation form state
  const [generationForm, setGenerationForm] = useState({
    description: '',
    projectContext: ''
  });

  const handleGetSuggestions = async () => {
    if (!suggestionForm.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    setLoading(true);
    try {
      const response = await aiApi.getSuggestions(
        {
          title: suggestionForm.title,
          description: suggestionForm.description,
          priority: suggestionForm.priority,
          category: suggestionForm.category
        },
        suggestionForm.context
      );

      setResults(prev => ({
        ...prev,
        suggestions: response.data.data.suggestions
      }));
      
      toast.success('AI suggestions generated!');
    } catch (error) {
      console.error('Error getting suggestions:', error);
      toast.error(error.response?.data?.error || 'Failed to get AI suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTasks = async () => {
    if (!generationForm.description.trim()) {
      toast.error('Please enter a project description');
      return;
    }

    setLoading(true);
    try {
      const response = await aiApi.generateTasks(
        generationForm.description,
        generationForm.projectContext
      );

      const generatedTasks = response.data.data.tasks;
      
      setResults(prev => ({
        ...prev,
        generatedTasks
      }));

      toast.success(`Generated ${generatedTasks.length} tasks!`);
    } catch (error) {
      console.error('Error generating tasks:', error);
      toast.error(error.response?.data?.error || 'Failed to generate tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeWorkload = async () => {
    if (tasks.length === 0) {
      toast.error('No tasks to analyze');
      return;
    }

    setLoading(true);
    try {
      const response = await aiApi.analyzeWorkload(tasks);
      
      setResults(prev => ({
        ...prev,
        analysis: response.data.data.analysis
      }));

      toast.success('Workload analysis complete!');
    } catch (error) {
      console.error('Error analyzing workload:', error);
      toast.error(error.response?.data?.error || 'Failed to analyze workload');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGeneratedTasks = () => {
    if (results.generatedTasks && onGeneratedTasks) {
      onGeneratedTasks(results.generatedTasks);
      toast.success('Tasks added to your list!');
      setResults(prev => ({ ...prev, generatedTasks: null }));
      setGenerationForm({ description: '', projectContext: '' });
    }
  };

  const tabs = [
    { id: 'suggest', label: 'Task Suggestions', shortLabel: 'Suggestions', icon: Lightbulb },
    { id: 'generate', label: 'Generate Tasks', shortLabel: 'Generate', icon: Zap },
    { id: 'analyze', label: 'Workload Analysis', shortLabel: 'Analysis', icon: BarChart3 }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-primary-500" />
          <h3 className="font-semibold text-gray-900">AI Assistant</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Get smart suggestions and insights for your tasks
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-1 px-2 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline lg:hidden">{tab.shortLabel}</span>
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Task Suggestions Tab */}
        {activeTab === 'suggest' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Task title..."
                value={suggestionForm.title}
                onChange={(e) => setSuggestionForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              
              <textarea
                placeholder="Task description (optional)..."
                value={suggestionForm.description}
                onChange={(e) => setSuggestionForm(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={suggestionForm.priority}
                  onChange={(e) => setSuggestionForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>

                <input
                  type="text"
                  placeholder="Category..."
                  value={suggestionForm.category}
                  onChange={(e) => setSuggestionForm(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <textarea
                placeholder="Additional context (optional)..."
                value={suggestionForm.context}
                onChange={(e) => setSuggestionForm(prev => ({ ...prev, context: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            <button
              onClick={handleGetSuggestions}
              disabled={loading || !suggestionForm.title.trim()}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Lightbulb className="w-4 h-4" />
              )}
              <span>{loading ? 'Analyzing...' : 'Get AI Suggestions'}</span>
            </button>

            {results.suggestions && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <h4 className="flex items-center space-x-1 font-medium text-blue-900 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>AI Suggestions:</span>
                </h4>
                <div className="text-sm text-blue-800 whitespace-pre-wrap">
                  {results.suggestions}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generate Tasks Tab */}
        {activeTab === 'generate' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <textarea
                placeholder="Describe your project or goal..."
                value={generationForm.description}
                onChange={(e) => setGenerationForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              
              <textarea
                placeholder="Additional context (optional)..."
                value={generationForm.projectContext}
                onChange={(e) => setGenerationForm(prev => ({ ...prev, projectContext: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            <button
              onClick={handleGenerateTasks}
              disabled={loading || !generationForm.description.trim()}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span>{loading ? 'Generating...' : 'Generate Tasks'}</span>
            </button>

            {results.generatedTasks && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Generated Tasks:</h4>
                  <button
                    onClick={handleAddGeneratedTasks}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add All</span>
                  </button>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {results.generatedTasks.map((task, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded text-sm">
                      <div className="font-medium text-gray-900">{task.title}</div>
                      {task.description && (
                        <div className="text-gray-600 mt-1">{task.description}</div>
                      )}
                      <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded ${
                          task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                        {task.category && <span>• {task.category}</span>}
                        {task.estimatedDuration && <span>• {task.estimatedDuration}m</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Workload Analysis Tab */}
        {activeTab === 'analyze' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Analyze your current task workload and get recommendations for better organization.
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm">
                <div className="font-medium text-gray-900">Current Tasks: {tasks.length}</div>
                {tasks.length > 0 && (
                  <div className="mt-2 space-y-1 text-xs text-gray-600">
                    <div>Pending: {tasks.filter(t => t.status === 'pending').length}</div>
                    <div>In Progress: {tasks.filter(t => t.status === 'in-progress').length}</div>
                    <div>Completed: {tasks.filter(t => t.status === 'completed').length}</div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleAnalyzeWorkload}
              disabled={loading || tasks.length === 0}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <BarChart3 className="w-4 h-4" />
              )}
              <span>{loading ? 'Analyzing...' : 'Analyze Workload'}</span>
            </button>

            {results.analysis && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <h4 className="flex items-center space-x-1 font-medium text-blue-900 mb-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Workload Analysis:</span>
                </h4>
                <div className="text-sm text-blue-800 whitespace-pre-wrap">
                  {results.analysis}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;