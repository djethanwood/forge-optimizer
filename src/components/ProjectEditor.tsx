import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, FolderTree, Eye, Code, BarChart3, ChevronRight, ChevronDown,
  Play, Pause, Settings, Copy, Download, RefreshCw, GitBranch, Share2,
  PanelLeftClose, PanelLeftOpen, Maximize2, Minimize2, MoreHorizontal,
  Edit3, Trash2, FileText, Archive, ExternalLink, Smartphone, Tablet, Monitor
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  type: string;
  language: string;
  files: number;
  status: 'draft' | 'analyzing' | 'ready' | 'optimized';
  createdAt: Date;
  lastModified: Date;
  progress?: number;
}

interface ProjectEditorProps {
  project: Project;
  onBack: () => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, onBack }) => {
  const [activeView, setActiveView] = useState<'files' | 'preview' | 'analysis'>('files');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentTool, setCurrentTool] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'components', 'utils']));
  const [hoveredFile, setHoveredFile] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('src/components/Header.tsx');
  const [showFileMenu, setShowFileMenu] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const fileStructure = [
    { 
      name: 'src/', 
      type: 'folder', 
      path: 'src',
      children: [
        { 
          name: 'components/', 
          type: 'folder', 
          path: 'src/components',
          children: [
            { name: 'Header.tsx', type: 'file', status: 'optimized', path: 'src/components/Header.tsx' },
            { name: 'Sidebar.tsx', type: 'file', status: 'warning', path: 'src/components/Sidebar.tsx' },
            { name: 'MainContent.tsx', type: 'file', status: 'clean', path: 'src/components/MainContent.tsx' },
            { name: 'ProjectEditor.tsx', type: 'file', status: 'error', path: 'src/components/ProjectEditor.tsx' },
          ]
        },
        { 
          name: 'utils/', 
          type: 'folder', 
          path: 'src/utils',
          children: [
            { name: 'api.ts', type: 'file', status: 'error', path: 'src/utils/api.ts' },
            { name: 'helpers.ts', type: 'file', status: 'clean', path: 'src/utils/helpers.ts' },
            { name: 'constants.ts', type: 'file', status: 'warning', path: 'src/utils/constants.ts' },
          ]
        },
        { name: 'App.tsx', type: 'file', status: 'warning', path: 'src/App.tsx' },
        { name: 'index.tsx', type: 'file', status: 'clean', path: 'src/index.tsx' },
        { name: 'styles.css', type: 'file', status: 'clean', path: 'src/styles.css' },
      ]
    },
    { name: 'public/', type: 'folder', path: 'public', children: [
      { name: 'index.html', type: 'file', status: 'clean', path: 'public/index.html' },
      { name: 'favicon.ico', type: 'file', status: 'clean', path: 'public/favicon.ico' },
    ]},
    { name: 'package.json', type: 'file', status: 'clean', path: 'package.json' },
    { name: 'tsconfig.json', type: 'file', status: 'clean', path: 'tsconfig.json' },
    { name: 'README.md', type: 'file', status: 'clean', path: 'README.md' },
  ];

  const analysisTools = [
    'ESLint - Analyse statique',
    'Prettier - Formatage',
    'TypeScript - Vérification types',
    'CodeLlama 13B - IA Analysis',
    'Madge - Dépendances',
    'Bundle Analyzer - Optimisation'
  ];

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    let toolIndex = 0;
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        const newProgress = prev + (100 / analysisTools.length);
        
        if (toolIndex < analysisTools.length) {
          setCurrentTool(analysisTools[toolIndex]);
          toolIndex++;
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setCurrentTool('');
          return 100;
        }
        return newProgress;
      });
    }, 800);
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const getFileStatusColor = (status: string) => {
    switch (status) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'optimized':
        return 'text-green-500';
      case 'clean':
        return 'text-gray-500 dark:text-gray-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  const getFileStatusBadge = (status: string) => {
    switch (status) {
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'optimized':
        return 'bg-green-500';
      case 'clean':
        return 'bg-gray-300 dark:bg-gray-600';
      default:
        return 'bg-gray-300 dark:bg-gray-600';
    }
  };

  const handleFileAction = (action: string, filePath: string) => {
    setShowFileMenu(null);
    switch (action) {
      case 'rename':
        const newName = prompt('Nouveau nom:', filePath.split('/').pop());
        if (newName) {
          console.log('Renommer:', filePath, 'vers', newName);
        }
        break;
      case 'delete':
        if (confirm('Supprimer ce fichier ?')) {
          console.log('Supprimer:', filePath);
        }
        break;
      case 'copy':
        navigator.clipboard.writeText('Code du fichier ' + filePath);
        break;
      case 'export':
        console.log('Exporter:', filePath);
        break;
      case 'archive':
        console.log('Archiver:', filePath);
        break;
    }
  };

  const openPreviewInNewTab = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Preview - ${project.name}</title>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              .preview-container { max-width: 800px; margin: 0 auto; }
              .placeholder { background: #f0f0f0; padding: 40px; text-align: center; border-radius: 8px; }
            </style>
          </head>
          <body>
            <div class="preview-container">
              <h1>Preview - ${project.name}</h1>
              <div class="placeholder">
                <h2>Application Preview</h2>
                <p>Aperçu de l'application en cours de développement</p>
              </div>
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const getPreviewSize = () => {
    switch (previewMode) {
      case 'mobile':
        return 'max-w-sm';
      case 'tablet':
        return 'max-w-2xl';
      case 'desktop':
        return 'max-w-full';
      default:
        return 'max-w-full';
    }
  };

  const renderFileTree = (files: any[], level = 0) => {
    return files.map((file, index) => (
      <div key={index}>
        <div 
          className={`flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-1 py-1 cursor-pointer group relative ${
            selectedFile === file.path ? 'bg-blue-50 dark:bg-blue-900/20' : ''
          }`}
          style={{ marginLeft: `${level * 12}px` }}
          onMouseEnter={() => setHoveredFile(file.path)}
          onMouseLeave={() => setHoveredFile(null)}
          onClick={() => {
            if (file.type === 'folder') {
              toggleFolder(file.path);
            } else {
              setSelectedFile(file.path);
            }
          }}
        >
          <div className="flex items-center space-x-1 min-w-0 flex-1">
            {file.type === 'folder' && (
              <button className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded flex-shrink-0">
                {expandedFolders.has(file.path) ? (
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                )}
              </button>
            )}
            <span className={`text-xs ${getFileStatusColor(file.status)} flex-shrink-0`}>
              {file.type === 'folder' ? '📁' : '📄'}
            </span>
            <span className="text-xs text-gray-900 dark:text-white truncate">
              {file.name}
            </span>
            {file.status && file.type === 'file' && (
              <div className={`w-1.5 h-1.5 rounded-full ${getFileStatusBadge(file.status)} flex-shrink-0`}></div>
            )}
          </div>
          
          {/* Context Menu Button */}
          {file.type === 'file' && hoveredFile === file.path && (
            <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="relative">
                <button 
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFileMenu(showFileMenu === file.path ? null : file.path);
                  }}
                >
                  <MoreHorizontal className="w-3 h-3" />
                </button>
                
                {/* Dropdown Menu */}
                {showFileMenu === file.path && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 min-w-[120px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('rename', file.path);
                      }}
                      className="flex items-center space-x-2 w-full px-2 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Renommer</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('copy', file.path);
                      }}
                      className="flex items-center space-x-2 w-full px-2 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copier</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('export', file.path);
                      }}
                      className="flex items-center space-x-2 w-full px-2 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Download className="w-3 h-3" />
                      <span>Exporter</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('archive', file.path);
                      }}
                      className="flex items-center space-x-2 w-full px-2 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Archive className="w-3 h-3" />
                      <span>Archiver</span>
                    </button>
                    <hr className="border-gray-200 dark:border-gray-600" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('delete', file.path);
                      }}
                      className="flex items-center space-x-2 w-full px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {file.children && file.type === 'folder' && expandedFolders.has(file.path) && 
          renderFileTree(file.children, level + 1)
        }
      </div>
    ));
  };

  // Simulate real-time analysis updates
  useEffect(() => {
    if (isAnalyzing && currentTool) {
      const event = new CustomEvent('analysisUpdate', {
        detail: {
          tool: currentTool,
          progress: analysisProgress,
          message: `🔍 Analyse en cours avec ${currentTool}...`
        }
      });
      window.dispatchEvent(event);
    }
  }, [currentTool, analysisProgress, isAnalyzing]);

  // Close file menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowFileMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <button
              onClick={onBack}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {project.name}
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {project.type} • {project.files} fichiers
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 flex-shrink-0">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            {!isAnalyzing ? (
              <button
                onClick={startAnalysis}
                className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium"
              >
                <Play className="w-3 h-3" />
                <span>Analyser</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAnalyzing(false)}
                className="flex items-center space-x-1 px-2 py-1 bg-red-600 text-white rounded text-xs font-medium"
              >
                <Pause className="w-3 h-3" />
                <span>Arrêter</span>
              </button>
            )}
          </div>
        </div>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-blue-900 dark:text-blue-300">
                {currentTool || 'Analyse en cours...'}
              </span>
              <span className="text-xs text-blue-700 dark:text-blue-400">
                {Math.round(analysisProgress)}%
              </span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1">
              <div 
                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - File Tree */}
        <div className={`${sidebarCollapsed ? 'w-0' : 'w-48'} transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden`}>
          <div className="h-full overflow-y-auto">
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <FolderTree className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-xs font-medium text-gray-900 dark:text-white">
                    Arborescence
                  </h3>
                </div>
              </div>
              
              {/* File Status Legend */}
              <div className="mb-2 p-1 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                <div className="grid grid-cols-2 gap-1">
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Erreurs</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Warnings</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Optimisé</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <span className="text-gray-600 dark:text-gray-400">Propre</span>
                  </div>
                </div>
              </div>

              <div className="space-y-0.5">
                {renderFileTree(fileStructure)}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* View Tabs */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 py-1">
            <div className="flex space-x-1 overflow-x-auto">
              {[
                { id: 'files', label: 'Fichiers', icon: Code },
                { id: 'preview', label: 'Aperçu', icon: Eye },
                { id: 'analysis', label: 'Analyse', icon: BarChart3 },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id as any)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                      activeView === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {activeView === 'files' && (
              <div className="h-full flex flex-col bg-gray-900 m-1">
                <div className="flex items-center justify-between p-2 border-b border-gray-700">
                  <h3 className="text-sm font-semibold text-white">
                    {selectedFile}
                  </h3>
                </div>
                <div className="flex-1 overflow-auto">
                  <div className="flex">
                    {/* Line Numbers */}
                    <div className="bg-gray-800 text-gray-500 text-xs p-2 select-none">
                      {Array.from({ length: 25 }, (_, i) => (
                        <div key={i} className="leading-5 text-right pr-2">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    {/* Code Content */}
                    <div className="flex-1">
                      <pre className="text-green-400 text-xs p-2 leading-5">
{`import React from 'react';
import { useState } from 'react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <h1>Mon Application</h1>
        <nav>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            Menu
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'preview' && (
              <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-700 m-1">
                <div className="p-2 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Aperçu de l'Application
                  </h3>
                  <div className="flex items-center space-x-2">
                    {/* Responsive Controls */}
                    <div className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-600 rounded p-1">
                      <button
                        onClick={() => setPreviewMode('mobile')}
                        className={`p-1 rounded ${previewMode === 'mobile' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}
                        title="Mobile"
                      >
                        <Smartphone className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setPreviewMode('tablet')}
                        className={`p-1 rounded ${previewMode === 'tablet' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}
                        title="Tablette"
                      >
                        <Tablet className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setPreviewMode('desktop')}
                        className={`p-1 rounded ${previewMode === 'desktop' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}
                        title="Desktop"
                      >
                        <Monitor className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <button
                      onClick={openPreviewInNewTab}
                      className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded text-xs"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Nouvel onglet</span>
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className={`text-center transition-all duration-300 ${getPreviewSize()}`}>
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Aperçu de l'application en cours de développement
                    </p>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow-sm mx-auto">
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Mode: {previewMode}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'analysis' && (
              <div className="h-full overflow-y-auto p-2">
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white dark:bg-gray-800 rounded p-2">
                      <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Performance
                      </h4>
                      <div className="text-lg font-bold text-green-600">85/100</div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                        <div className="bg-green-600 h-1 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded p-2">
                      <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Sécurité
                      </h4>
                      <div className="text-lg font-bold text-yellow-600">72/100</div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                        <div className="bg-yellow-600 h-1 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded p-2">
                      <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Qualité
                      </h4>
                      <div className="text-lg font-bold text-blue-600">91/100</div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                        <div className="bg-blue-600 h-1 rounded-full" style={{ width: '91%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded p-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Suggestions d'Optimisation
                    </h4>
                    <div className="space-y-2">
                      <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-xs">
                              Optimiser les re-rendus React
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Utiliser React.memo dans Header.tsx
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <button className="px-2 py-1 bg-green-600 text-white rounded text-xs">
                              ✓
                            </button>
                            <button className="px-2 py-1 bg-red-600 text-white rounded text-xs">
                              ✗
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-xs">
                              Corriger la vulnérabilité XSS
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Sanitiser les entrées utilisateur dans api.ts
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <button className="px-2 py-1 bg-green-600 text-white rounded text-xs">
                              ✓
                            </button>
                            <button className="px-2 py-1 bg-red-600 text-white rounded text-xs">
                              ✗
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor;