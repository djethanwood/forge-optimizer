import React, { useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle, Zap, Shield, Code, BarChart3 } from 'lucide-react';
import { useAnalysis } from '../../contexts/AnalysisContext';

const AnalysisTab: React.FC = () => {
  const { state, startAnalysis } = useAnalysis();

  useEffect(() => {
    if (state.files.length > 0 && !state.isAnalyzing && state.issues.length === 0) {
      startAnalysis();
    }
  }, [state.files, state.isAnalyzing, state.issues.length, startAnalysis]);

  const tools = [
    { name: 'ESLint', description: 'Analyse statique du code', icon: Code, status: state.analysisProgress > 25 ? 'completed' : state.currentTool === 'ESLint' ? 'running' : 'pending' },
    { name: 'Prettier', description: 'Formatage du code', icon: BarChart3, status: state.analysisProgress > 50 ? 'completed' : state.currentTool === 'Prettier' ? 'running' : 'pending' },
    { name: 'CodeLlama 13B', description: 'Analyse IA avancée', icon: Zap, status: state.analysisProgress > 75 ? 'completed' : state.currentTool === 'CodeLlama 13B' ? 'running' : 'pending' },
    { name: 'Madge', description: 'Analyse des dépendances', icon: Shield, status: state.analysisProgress === 100 ? 'completed' : state.currentTool === 'Madge' ? 'running' : 'pending' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'running':
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'running':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'pending':
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analyse en Cours
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Analyse de {state.files.length} fichier(s) avec nos outils professionnels
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progression globale
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(state.analysisProgress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${state.analysisProgress}%` }}
            />
          </div>
        </div>

        {/* Current Tool */}
        {state.isAnalyzing && state.currentTool && (
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-300">
                  Analyse en cours avec {state.currentTool}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Détection des problèmes et optimisations possibles...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tools Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.name}
                className={`p-6 border rounded-xl transition-all duration-300 ${getStatusColor(tool.status)}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {tool.name}
                    </h3>
                  </div>
                  {getStatusIcon(tool.status)}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {tool.description}
                </p>
                {tool.status === 'running' && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                      <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Project Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informations du Projet
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{state.files.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fichiers</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{state.projectType}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Type de projet</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{state.language}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Langage principal</p>
            </div>
          </div>
        </div>

        {/* Analysis Complete */}
        {!state.isAnalyzing && state.analysisProgress === 100 && (
          <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-300">
                Analyse Terminée !
              </h3>
            </div>
            <p className="text-green-700 dark:text-green-400 mb-4">
              L'analyse de votre code est terminée. {state.issues.length} problème(s) détecté(s) et {state.suggestions.length} suggestion(s) d'optimisation générée(s).
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {state.issues.filter(i => i.severity === 'warning').length} avertissements
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {state.issues.filter(i => i.severity === 'error').length} erreurs
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {state.suggestions.length} optimisations
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisTab;