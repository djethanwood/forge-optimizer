import React, { useState, useRef } from 'react';
import { Upload, Github, FileText, Zap, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadInterfaceProps {
  onProjectUpload: (project: any) => void;
  language: string;
  theme: 'light' | 'dark';
}

const translations = {
  en: {
    title: 'Upload Your Project',
    subtitle: 'Drag & drop your project files or connect via GitHub',
    dropZone: 'Drop files here or click to browse',
    supportedFormats: 'Supported formats: ZIP, TAR, GitHub repositories',
    githubUrl: 'GitHub Repository URL',
    githubPlaceholder: 'https://github.com/username/repository',
    uploadButton: 'Upload Project',
    analyzing: 'Analyzing project structure...',
    detectingType: 'Detecting project type...',
    ready: 'Project ready for optimization!',
    features: {
      title: 'Optimization Features',
      performance: 'Performance optimization',
      security: 'Security vulnerability detection',
      style: 'Code style improvements',
      structure: 'Architecture recommendations'
    }
  },
  fr: {
    title: 'Télécharger votre projet',
    subtitle: 'Glissez-déposez vos fichiers ou connectez via GitHub',
    dropZone: 'Déposez les fichiers ici ou cliquez pour parcourir',
    supportedFormats: 'Formats supportés : ZIP, TAR, dépôts GitHub',
    githubUrl: 'URL du dépôt GitHub',
    githubPlaceholder: 'https://github.com/username/repository',
    uploadButton: 'Télécharger le projet',
    analyzing: 'Analyse de la structure du projet...',
    detectingType: 'Détection du type de projet...',
    ready: 'Projet prêt pour l\'optimisation !',
    features: {
      title: 'Fonctionnalités d\'optimisation',
      performance: 'Optimisation des performances',
      security: 'Détection des vulnérabilités de sécurité',
      style: 'Améliorations du style de code',
      structure: 'Recommandations d\'architecture'
    }
  },
  es: {
    title: 'Subir tu proyecto',
    subtitle: 'Arrastra y suelta tus archivos o conecta vía GitHub',
    dropZone: 'Suelta archivos aquí o haz clic para explorar',
    supportedFormats: 'Formatos soportados: ZIP, TAR, repositorios GitHub',
    githubUrl: 'URL del repositorio GitHub',
    githubPlaceholder: 'https://github.com/username/repository',
    uploadButton: 'Subir proyecto',
    analyzing: 'Analizando estructura del proyecto...',
    detectingType: 'Detectando tipo de proyecto...',
    ready: '¡Proyecto listo para optimización!',
    features: {
      title: 'Características de optimización',
      performance: 'Optimización de rendimiento',
      security: 'Detección de vulnerabilidades de seguridad',
      style: 'Mejoras en el estilo del código',
      structure: 'Recomendaciones de arquitectura'
    }
  }
};

const UploadInterface: React.FC<UploadInterfaceProps> = ({ onProjectUpload, language, theme }) => {
  const [dragActive, setDragActive] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'detecting' | 'ready'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[language as keyof typeof translations];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    setUploading(true);
    setProgress(0);
    setStatus('analyzing');

    // Simulate file upload and analysis
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('ready');
          
          // Create mock project
          const project = {
            id: Date.now().toString(),
            name: file.name.replace(/\.[^/.]+$/, ""),
            type: detectProjectType(file.name),
            language: 'TypeScript',
            status: 'ready' as const,
            files: Math.floor(Math.random() * 100) + 10,
            progress: 100,
            uploadedAt: new Date(),
            optimizations: generateMockOptimizations()
          };
          
          setTimeout(() => {
            onProjectUpload(project);
            setUploading(false);
          }, 1000);
          
          return 100;
        }
        
        if (prev === 30) setStatus('detecting');
        return prev + 5;
      });
    }, 100);
  };

  const handleGithubUpload = () => {
    if (!githubUrl) return;
    
    setUploading(true);
    setProgress(0);
    setStatus('analyzing');

    // Simulate GitHub repository analysis
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('ready');
          
          const repoName = githubUrl.split('/').pop() || 'repository';
          const project = {
            id: Date.now().toString(),
            name: repoName,
            type: 'React',
            language: 'TypeScript',
            status: 'ready' as const,
            files: Math.floor(Math.random() * 200) + 50,
            progress: 100,
            uploadedAt: new Date(),
            optimizations: generateMockOptimizations()
          };
          
          setTimeout(() => {
            onProjectUpload(project);
            setUploading(false);
          }, 1000);
          
          return 100;
        }
        
        if (prev === 30) setStatus('detecting');
        return prev + 5;
      });
    }, 100);
  };

  const detectProjectType = (fileName: string): string => {
    if (fileName.includes('react') || fileName.includes('jsx')) return 'React';
    if (fileName.includes('vue')) return 'Vue';
    if (fileName.includes('angular')) return 'Angular';
    if (fileName.includes('node')) return 'Node.js';
    if (fileName.includes('python') || fileName.includes('.py')) return 'Python';
    return 'JavaScript';
  };

  const generateMockOptimizations = () => {
    return [
      {
        id: '1',
        file: 'src/components/Header.tsx',
        type: 'performance' as const,
        description: 'Optimize React component re-renders',
        impact: 'high' as const,
        status: 'pending' as const,
        originalCode: 'const Header = () => {\n  return <div>Header</div>;\n};',
        optimizedCode: 'const Header = React.memo(() => {\n  return <div>Header</div>;\n});'
      },
      {
        id: '2',
        file: 'src/utils/api.ts',
        type: 'security' as const,
        description: 'Add input validation for API endpoints',
        impact: 'high' as const,
        status: 'pending' as const,
        originalCode: 'const fetchData = (url) => {\n  return fetch(url);\n};',
        optimizedCode: 'const fetchData = (url: string) => {\n  if (!isValidUrl(url)) throw new Error(\'Invalid URL\');\n  return fetch(url);\n};'
      }
    ];
  };

  const statusMessages = {
    analyzing: t.analyzing,
    detecting: t.detectingType,
    ready: t.ready
  };

  const features = [
    { icon: Zap, title: t.features.performance, color: 'text-yellow-500' },
    { icon: AlertCircle, title: t.features.security, color: 'text-red-500' },
    { icon: FileText, title: t.features.style, color: 'text-blue-500' },
    { icon: CheckCircle, title: t.features.structure, color: 'text-green-500' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {t.title}
        </h1>
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            {!uploading ? (
              <div className="space-y-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : theme === 'dark'
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className={`mx-auto h-12 w-12 mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                  <p className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {t.dropZone}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t.supportedFormats}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".zip,.tar,.tar.gz"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-2 ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                      OR
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Github className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                    <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {t.githubUrl}
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder={t.githubPlaceholder}
                      className={`flex-1 px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    <button
                      onClick={handleGithubUpload}
                      disabled={!githubUrl}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {t.uploadButton}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    status === 'ready' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {status === 'ready' ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                  <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {statusMessages[status] || t.analyzing}
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        status === 'ready' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {progress}% complete
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.features.title}
            </h3>
            <div className="space-y-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {feature.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadInterface;