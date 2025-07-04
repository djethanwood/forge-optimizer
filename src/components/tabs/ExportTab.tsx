import React, { useState } from 'react';
import { Download, FileText, Archive, CheckCircle, Code, Zap } from 'lucide-react';
import { useAnalysis } from '../../contexts/AnalysisContext';
import toast from 'react-hot-toast';

const ExportTab: React.FC = () => {
  const { state, resetAnalysis } = useAnalysis();
  const [exportFormat, setExportFormat] = useState<'zip' | 'individual'>('zip');
  const [includeReport, setIncludeReport] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const approvedSuggestions = state.suggestions.filter(s => s.status === 'approved');
  const totalImprovements = approvedSuggestions.length;

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    toast.loading('Génération du code optimisé...', { id: 'export' });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a simple text file with optimized code
    const optimizedCode = approvedSuggestions.map(s => 
      `// File: ${s.file}\n// Optimization: ${s.title}\n${s.optimizedCode}\n\n`
    ).join('');
    
    const blob = new Blob([optimizedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized-code-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
    toast.success('Code optimisé exporté avec succès !', { id: 'export' });
  };

  const handleNewAnalysis = () => {
    resetAnalysis();
    toast.success('Nouvelle analyse initialisée');
  };

  const calculateImprovements = () => {
    const performanceGain = approvedSuggestions
      .filter(s => s.category === 'performance')
      .reduce((acc, s) => acc + parseInt(s.estimatedImprovement.match(/\d+/)?.[0] || '0'), 0);
    
    const securityIssuesFixed = approvedSuggestions.filter(s => s.category === 'security').length;
    const codeQualityImproved = approvedSuggestions.filter(s => s.category === 'style').length;
    
    return { performanceGain, securityIssuesFixed, codeQualityImproved };
  };

  const improvements = calculateImprovements();

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Export du Code Optimisé
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Téléchargez votre code optimisé avec toutes les améliorations approuvées
          </p>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Optimisation Terminée !
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Votre code a été analysé et optimisé avec succès. Voici un résumé des améliorations apportées :
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-gray-900 dark:text-white">Performance</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">+{improvements.performanceGain}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Amélioration moyenne</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900 dark:text-white">Sécurité</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{improvements.securityIssuesFixed}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Problèmes corrigés</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Code className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900 dark:text-white">Qualité</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{improvements.codeQualityImproved}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Améliorations style</p>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Options d'Export
          </h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Format d'export
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value="zip"
                    checked={exportFormat === 'zip'}
                    onChange={(e) => setExportFormat(e.target.value as 'zip')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <Archive className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 dark:text-white">Archive ZIP complète</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value="individual"
                    checked={exportFormat === 'individual'}
                    onChange={(e) => setExportFormat(e.target.value as 'individual')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 dark:text-white">Fichiers individuels</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={includeReport}
                  onChange={(e) => setIncludeReport(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900 dark:text-white">Inclure le rapport d'optimisation</span>
              </label>
            </div>
          </div>
        </div>

        {/* Approved Changes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Modifications Approuvées ({totalImprovements})
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {approvedSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{suggestion.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{suggestion.file}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">
                  {suggestion.estimatedImprovement}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleExport}
            disabled={isExporting || totalImprovements === 0}
            className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Download className="w-5 h-5" />
            <span>{isExporting ? 'Export en cours...' : 'Télécharger le Code Optimisé'}</span>
          </button>
          
          <button
            onClick={handleNewAnalysis}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Code className="w-5 h-5" />
            <span>Nouvelle Analyse</span>
          </button>
        </div>

        {totalImprovements === 0 && (
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune optimisation approuvée
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Retournez à l'onglet Validation pour approuver des suggestions d'optimisation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportTab;