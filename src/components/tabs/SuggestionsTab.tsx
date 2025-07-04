import React, { useState } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle, Zap, Shield, Code, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useAnalysis } from '../../contexts/AnalysisContext';

const SuggestionsTab: React.FC = () => {
  const { state, approveSuggestion, rejectSuggestion, setCurrentStep } = useAnalysis();
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'performance' | 'security' | 'style' | 'complexity' | 'maintainability'>('all');

  const filteredSuggestions = state.suggestions.filter(s => 
    filter === 'all' || s.category === filter
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'security':
        return <Shield className="w-5 h-5 text-red-500" />;
      case 'style':
        return <Code className="w-5 h-5 text-blue-500" />;
      case 'complexity':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'maintainability':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Code className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const categoryStats = {
    performance: state.suggestions.filter(s => s.category === 'performance').length,
    security: state.suggestions.filter(s => s.category === 'security').length,
    style: state.suggestions.filter(s => s.category === 'style').length,
    complexity: state.suggestions.filter(s => s.category === 'complexity').length,
    maintainability: state.suggestions.filter(s => s.category === 'maintainability').length,
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Suggestions d'Optimisation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {state.suggestions.length} suggestion(s) d'amélioration détectée(s)
          </p>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Complexité</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{state.metrics.complexity}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                state.metrics.complexity >= 80 ? 'bg-green-100 dark:bg-green-900' : 
                state.metrics.complexity >= 60 ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-red-100 dark:bg-red-900'
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  state.metrics.complexity >= 80 ? 'text-green-600' : 
                  state.metrics.complexity >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Performance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{state.metrics.performance}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                state.metrics.performance >= 80 ? 'bg-green-100 dark:bg-green-900' : 
                state.metrics.performance >= 60 ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-red-100 dark:bg-red-900'
              }`}>
                <Zap className={`w-6 h-6 ${
                  state.metrics.performance >= 80 ? 'text-green-600' : 
                  state.metrics.performance >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sécurité</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{state.metrics.security}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                state.metrics.security >= 80 ? 'bg-green-100 dark:bg-green-900' : 
                state.metrics.security >= 60 ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-red-100 dark:bg-red-900'
              }`}>
                <Shield className={`w-6 h-6 ${
                  state.metrics.security >= 80 ? 'text-green-600' : 
                  state.metrics.security >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Qualité</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{state.metrics.codeQuality}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                state.metrics.codeQuality >= 80 ? 'bg-green-100 dark:bg-green-900' : 
                state.metrics.codeQuality >= 60 ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-red-100 dark:bg-red-900'
              }`}>
                <Code className={`w-6 h-6 ${
                  state.metrics.codeQuality >= 80 ? 'text-green-600' : 
                  state.metrics.codeQuality >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Toutes ({state.suggestions.length})
            </button>
            <button
              onClick={() => setFilter('performance')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'performance'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Performance ({categoryStats.performance})
            </button>
            <button
              onClick={() => setFilter('security')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'security'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Sécurité ({categoryStats.security})
            </button>
            <button
              onClick={() => setFilter('style')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'style'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Style ({categoryStats.style})
            </button>
          </div>
        </div>

        {/* Suggestions List */}
        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    {getCategoryIcon(suggestion.category)}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {suggestion.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {suggestion.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          📁 {suggestion.file}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(suggestion.impact)}`}>
                          Impact: {suggestion.impact}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getEffortColor(suggestion.effort)}`}>
                          Effort: {suggestion.effort}
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {suggestion.estimatedImprovement}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setExpandedSuggestion(
                        expandedSuggestion === suggestion.id ? null : suggestion.id
                      )}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {expandedSuggestion === suggestion.id ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {suggestion.status === 'pending' && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => approveSuggestion(suggestion.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approuver</span>
                    </button>
                    <button
                      onClick={() => rejectSuggestion(suggestion.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Rejeter</span>
                    </button>
                    <button
                      onClick={() => setCurrentStep('validation')}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Voir le diff</span>
                    </button>
                  </div>
                )}

                {suggestion.status !== 'pending' && (
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                    suggestion.status === 'approved' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {suggestion.status === 'approved' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <span>{suggestion.status === 'approved' ? 'Approuvé' : 'Rejeté'}</span>
                  </div>
                )}
              </div>

              {expandedSuggestion === suggestion.id && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="p-4 bg-red-50 dark:bg-red-900/10">
                      <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                        Code Original
                      </h4>
                      <pre className="text-sm bg-white dark:bg-gray-900 p-3 rounded border overflow-x-auto">
                        <code className="text-gray-800 dark:text-gray-200">
                          {suggestion.originalCode}
                        </code>
                      </pre>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/10">
                      <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                        Code Optimisé
                      </h4>
                      <pre className="text-sm bg-white dark:bg-gray-900 p-3 rounded border overflow-x-auto">
                        <code className="text-gray-800 dark:text-gray-200">
                          {suggestion.optimizedCode}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredSuggestions.length === 0 && (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune suggestion trouvée
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Aucune suggestion d'optimisation pour ce filtre.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestionsTab;