import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Code, Moon, Sun, MessageCircle, Settings, Download } from 'lucide-react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { AnalysisProvider } from './contexts/AnalysisContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'chat' | 'main'>('main');

  const handleExportProject = () => {
    // Simulate export functionality
    const blob = new Blob(['// Code optimisé exporté\nconsole.log("Projet optimisé");'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projet-optimise-${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnalysisProvider>
      <div className="h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
        {/* Global Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 py-2 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-3 h-3 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 dark:text-white">FORGE-OPTIMIZER</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Assistant IA d'optimisation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {/* Export Button */}
              <button
                onClick={handleExportProject}
                className="hidden sm:flex items-center space-x-1 px-2 py-1 bg-green-600 text-white rounded text-xs font-medium"
              >
                <Download className="w-3 h-3" />
                <span>Exporter</span>
              </button>
              
              {/* Mobile Export Button */}
              <button
                onClick={handleExportProject}
                className="sm:hidden p-1 bg-green-600 text-white rounded"
              >
                <Download className="w-3 h-3" />
              </button>

              {/* Mobile Tab Switcher */}
              <div className="flex sm:hidden bg-gray-100 dark:bg-gray-700 rounded p-0.5">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                    activeTab === 'chat'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Chat</span>
                </button>
                <button
                  onClick={() => setActiveTab('main')}
                  className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                    activeTab === 'main'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Settings className="w-3 h-3" />
                  <span>Projets</span>
                </button>
              </div>
              
              <button
                onClick={toggleTheme}
                className="p-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop: Side by side, Mobile: Tabbed - Chat élargi encore plus */}
          <div className={`${activeTab === 'chat' ? 'flex' : 'hidden'} sm:flex flex-col w-full sm:w-[480px]`}>
            <Sidebar />
          </div>
          
          <div className={`${activeTab === 'main' ? 'flex' : 'hidden'} sm:flex flex-1 flex-col min-w-0`}>
            <MainContent />
          </div>
        </div>

        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              border: '1px solid var(--toast-border)',
              fontSize: '12px',
            },
          }}
        />
      </div>
    </AnalysisProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;