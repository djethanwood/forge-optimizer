import React, { useState } from 'react';
import { 
  Plus, FolderOpen, Code, Settings, Trash2, Edit3, Play, Eye, Copy, 
  GitBranch, Share2, Download, RefreshCw, Archive, X, Upload, Folder, Github
} from 'lucide-react';
import { useAnalysis } from '../contexts/AnalysisContext';
import ProjectEditor from './ProjectEditor';
import toast from 'react-hot-toast';

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
  description?: string;
}

const MainContent: React.FC = () => {
  const { state, uploadFiles, startAnalysis } = useAnalysis();
  const [currentView, setCurrentView] = useState<'projects' | 'editor'>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    files: [] as File[],
    githubUrl: ''
  });
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Mon App React',
      type: 'React',
      language: 'TypeScript',
      files: 24,
      status: 'ready',
      createdAt: new Date('2024-01-15'),
      lastModified: new Date('2024-01-20'),
      description: 'Application React moderne avec TypeScript'
    },
    {
      id: '2',
      name: 'API Node.js',
      type: 'Node.js',
      language: 'JavaScript',
      files: 12,
      status: 'optimized',
      createdAt: new Date('2024-01-10'),
      lastModified: new Date('2024-01-18'),
      description: 'API REST avec Express et MongoDB'
    },
    {
      id: '3',
      name: 'Dashboard Vue',
      type: 'Vue.js',
      language: 'TypeScript',
      files: 18,
      status: 'analyzing',
      createdAt: new Date('2024-01-22'),
      lastModified: new Date('2024-01-22'),
      progress: 65,
      description: 'Dashboard administrateur avec Vue 3'
    },
  ]);

  const handleNewProject = () => {
    setShowNewProject(true);
    setNewProjectData({ name: '', description: '', files: [], githubUrl: '' });
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('editor');
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success('Projet supprimé');
    }
  };

  const handleDuplicateProject = (project: Project) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      name: `${project.name} (Copie)`,
      status: 'draft' as const,
      createdAt: new Date(),
      lastModified: new Date(),
    };
    setProjects(prev => [newProject, ...prev]);
    toast.success('Projet dupliqué');
  };

  const handleArchiveProject = (projectId: string) => {
    toast.success('Projet archivé');
  };

  const handleRenameProject = (projectId: string, newName: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, name: newName, lastModified: new Date() } : p
    ));
    toast.success('Projet renommé');
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files).filter(file => 
        file.name.endsWith('.js') || 
        file.name.endsWith('.ts') || 
        file.name.endsWith('.tsx') || 
        file.name.endsWith('.jsx') ||
        file.name.endsWith('.vue') ||
        file.name.endsWith('.py') ||
        file.name.endsWith('.java')
      );
      
      setNewProjectData(prev => ({ ...prev, files: fileArray }));
      toast.success(`${fileArray.length} fichier(s) ajouté(s)`);
    }
  };

  const handleGithubImport = async () => {
    if (!newProjectData.githubUrl.trim()) {
      toast.error('Veuillez saisir une URL GitHub valide');
      return;
    }

    try {
      // Simulate GitHub import
      toast.loading('Import du projet GitHub...', { id: 'github-import' });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const repoName = newProjectData.githubUrl.split('/').pop() || 'repository';
      const mockFiles = [
        new File(['// Mock file content'], 'src/App.tsx', { type: 'text/plain' }),
        new File(['// Mock file content'], 'src/index.tsx', { type: 'text/plain' }),
        new File(['// Mock file content'], 'package.json', { type: 'text/plain' }),
      ];
      
      setNewProjectData(prev => ({ 
        ...prev, 
        name: repoName,
        files: mockFiles,
        description: `Projet importé depuis GitHub: ${newProjectData.githubUrl}`
      }));
      
      toast.success('Projet GitHub importé avec succès !', { id: 'github-import' });
    } catch (error) {
      toast.error('Erreur lors de l\'import GitHub', { id: 'github-import' });
    }
  };

  const detectProjectType = (files: File[]): { type: string; language: string } => {
    const hasPackageJson = files.some(f => f.name === 'package.json');
    const hasReactFiles = files.some(f => f.name.includes('react') || f.name.endsWith('.jsx') || f.name.endsWith('.tsx'));
    const hasVueFiles = files.some(f => f.name.endsWith('.vue'));
    const hasAngularFiles = files.some(f => f.name.includes('angular'));
    const hasPythonFiles = files.some(f => f.name.endsWith('.py'));
    const hasTypeScript = files.some(f => f.name.endsWith('.ts') || f.name.endsWith('.tsx'));

    if (hasReactFiles) return { type: 'React', language: hasTypeScript ? 'TypeScript' : 'JavaScript' };
    if (hasVueFiles) return { type: 'Vue.js', language: hasTypeScript ? 'TypeScript' : 'JavaScript' };
    if (hasAngularFiles) return { type: 'Angular', language: 'TypeScript' };
    if (hasPythonFiles) return { type: 'Python', language: 'Python' };
    if (hasPackageJson) return { type: 'Node.js', language: hasTypeScript ? 'TypeScript' : 'JavaScript' };
    
    return { type: 'JavaScript', language: hasTypeScript ? 'TypeScript' : 'JavaScript' };
  };

  const handleCreateProject = async () => {
    if (!newProjectData.name.trim()) {
      toast.error('Veuillez saisir un nom de projet');
      return;
    }

    if (newProjectData.files.length === 0) {
      toast.error('Veuillez sélectionner au moins un fichier ou importer depuis GitHub');
      return;
    }

    const { type, language } = detectProjectType(newProjectData.files);

    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectData.name,
      type,
      language,
      files: newProjectData.files.length,
      status: 'draft',
      createdAt: new Date(),
      lastModified: new Date(),
      description: newProjectData.description || `Projet ${type} avec ${language}`,
    };

    setProjects(prev => [newProject, ...prev]);
    setShowNewProject(false);
    toast.success('Projet créé avec succès !');

    // Auto-upload files and start analysis
    try {
      await uploadFiles(newProjectData.files);
      setTimeout(() => {
        startAnalysis();
      }, 1000);
    } catch (error) {
      toast.error('Erreur lors de l\'upload des fichiers');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'analyzing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'ready':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'optimized':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'analyzing':
        return 'Analyse en cours';
      case 'ready':
        return 'Prêt à optimiser';
      case 'optimized':
        return 'Optimisé';
      default:
        return status;
    }
  };

  if (currentView === 'editor' && selectedProject) {
    return (
      <ProjectEditor 
        project={selectedProject} 
        onBack={() => setCurrentView('projects')}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-3 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Gestionnaire de Projets
              </h1>
              <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400">
                Créez, gérez et optimisez vos projets de code
              </p>
            </div>
            <button
              onClick={handleNewProject}
              className="mt-4 md:mt-0 flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              <span>Nouveau Projet</span>
            </button>
          </div>

          {/* New Project Modal */}
          {showNewProject && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      Créer un Nouveau Projet
                    </h3>
                    <button
                      onClick={() => setShowNewProject(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Project Info */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nom du projet *
                        </label>
                        <input
                          type="text"
                          value={newProjectData.name}
                          onChange={(e) => setNewProjectData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Mon Super Projet"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description (optionnel)
                        </label>
                        <textarea
                          value={newProjectData.description}
                          onChange={(e) => setNewProjectData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description de votre projet..."
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* GitHub Import */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Importer depuis GitHub
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="url"
                          value={newProjectData.githubUrl}
                          onChange={(e) => setNewProjectData(prev => ({ ...prev, githubUrl: e.target.value }))}
                          placeholder="https://github.com/username/repository"
                          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={handleGithubImport}
                          disabled={!newProjectData.githubUrl.trim()}
                          className="px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                          <Github className="w-4 h-4" />
                          <span className="hidden sm:inline">Importer</span>
                        </button>
                      </div>
                    </div>

                    {/* OR Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                          OU
                        </span>
                      </div>
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fichiers de code *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Glissez vos fichiers ici ou cliquez pour sélectionner
                        </p>
                        <input
                          type="file"
                          multiple
                          accept=".js,.ts,.tsx,.jsx,.vue,.py,.java"
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="hidden"
                          id="project-files"
                        />
                        <label
                          htmlFor="project-files"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors text-sm"
                        >
                          <Folder className="w-4 h-4 mr-2" />
                          Sélectionner des fichiers
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Formats supportés: .js, .ts, .tsx, .jsx, .vue, .py, .java
                        </p>
                      </div>

                      {/* Selected Files */}
                      {newProjectData.files.length > 0 && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Fichiers sélectionnés ({newProjectData.files.length})
                          </h4>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {newProjectData.files.map((file, index) => (
                              <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <Code className="w-4 h-4" />
                                <span className="truncate">{file.name}</span>
                                <span className="text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Auto-detection info */}
                    {newProjectData.files.length > 0 && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">
                              Détection automatique
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-400">
                              Le type de projet et le langage seront détectés automatiquement à partir de vos fichiers.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3 pt-4">
                      <button
                        onClick={handleCreateProject}
                        disabled={!newProjectData.name.trim() || newProjectData.files.length === 0}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        Créer et Analyser
                      </button>
                      <button 
                        onClick={() => setShowNewProject(false)}
                        className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Code className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {project.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          {project.type} • {project.language}
                        </p>
                      </div>
                    </div>
                    
                    {/* Actions Menu */}
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleRenameProject(project.id, prompt('Nouveau nom:') || project.name)}
                        className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors rounded"
                        title="Renommer"
                      >
                        <Edit3 className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicateProject(project)}
                        className="p-1.5 text-gray-400 hover:text-green-500 transition-colors rounded"
                        title="Dupliquer"
                      >
                        <Copy className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      <button
                        onClick={() => handleArchiveProject(project.id)}
                        className="p-1.5 text-gray-400 hover:text-yellow-500 transition-colors rounded"
                        title="Archiver"
                      >
                        <Archive className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="mb-3 md:mb-4">
                    <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>{project.files} fichiers</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                    
                    {project.status === 'analyzing' && project.progress && (
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <p>Créé: {project.createdAt.toLocaleDateString()}</p>
                    <p>Modifié: {project.lastModified.toLocaleDateString()}</p>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleProjectSelect(project)}
                      className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs md:text-sm font-medium"
                    >
                      <Eye className="w-3 h-3 md:w-4 md:h-4" />
                      <span>Ouvrir l'éditeur</span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {project.status === 'ready' && (
                        <button className="flex items-center justify-center space-x-1 px-2 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs">
                          <Play className="w-3 h-3" />
                          <span>Optimiser</span>
                        </button>
                      )}
                      <button className="flex items-center justify-center space-x-1 px-2 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs">
                        <GitBranch className="w-3 h-3" />
                        <span>Branches</span>
                      </button>
                      <button className="flex items-center justify-center space-x-1 px-2 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs">
                        <Share2 className="w-3 h-3" />
                        <span>Partager</span>
                      </button>
                      <button className="flex items-center justify-center space-x-1 px-2 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs">
                        <Download className="w-3 h-3" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 md:w-20 md:h-20 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-medium text-gray-900 dark:text-white mb-2">
                Aucun projet
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6">
                Créez votre premier projet pour commencer l'optimisation
              </p>
              <button
                onClick={handleNewProject}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Créer un Projet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;