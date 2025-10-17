import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, CheckSquare, Plus, Home } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-500 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Smart Task Planner</h1>
              <p className="text-sm text-gray-500">AI-Powered Task Management</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/create"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/create') 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </Link>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <CheckSquare className="w-4 h-4" />
              <span>Ready to boost your productivity</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;