import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowLeft, Copy, Download } from 'lucide-react';

interface DiffViewerProps {
  optimization: any;
  onValidation: (optimizationId: string, status: 'approved' | 'rejected') => void;
  language: string;
  theme: 'light' | 'dark';
}

const translations = {
  en: {
    title: 'Code Diff Viewer',
    subtitle: 'Review the proposed optimization changes',
    original: 'Original Code',
    optimized: 'Optimized Code',
    description: 'Description',
    impact: 'Impact',
    file: 'File',
    approve: 'Approve',
    reject: 'Reject',
    approved: 'Approved',
    rejected: 'Rejected',
    pending: 'Pending Review',
    copyCode: 'Copy Code',
    downloadDiff: 'Download Diff',
    backToAnalyzer: 'Back to Analyzer',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    performance: 'Performance',
    security: 'Security',
    style: 'Style',
    structure: 'Structure'
  },
  fr: {
    title: 'Visionneuse de différences de code',
    subtitle: 'Examiner les modifications d\'optimisation proposées',
    original: 'Code original',
    optimized: 'Code optimisé',
    description: 'Description',
    impact: 'Impact',
    file: 'Fichier',
    approve: 'Approuver',
    reject: 'Rejeter',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    pending: 'En attente de révision',
    copyCode: 'Copier le code',
    downloadDiff: 'Télécharger les différences',
    backToAnalyzer: 'Retour à l\'analyseur',
    high: 'Élevé',
    medium: 'Moyen',
    low: 'Faible',
    performance: 'Performance',
    security: 'Sécurité',
    style: 'Style',
    structure: 'Structure'
  },
  es: {
    title: 'Visor de diferencias de código',
    subtitle: 'Revisar los cambios de optimización propuestos',
    original: 'Código original',
    optimized: 'Código optimizado',
    description: 'Descripción',
    impact: 'Impacto',
    file: 'Archivo',
    approve: 'Aprobar',
    reject: 'Rechazar',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    pending: 'Pendiente de revisión',
    copyCode: 'Copiar código',
    downloadDiff: 'Descargar diferencias',
    backToAnalyzer: 'Volver al analizador',
    high: 'Alto',
    medium: 'Medio',
    low: 'Bajo',
    performance: 'Rendimiento',
    security: 'Seguridad',
    style: 'Estilo',
    structure: 'Estructura'
  }
};

const DiffViewer: React.FC<DiffViewerProps> = ({ optimization, onValidation, language, theme }) => {
  const [copied, setCopied] = useState(false);
  const t = translations[language as keyof typeof translations];

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColorDark = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-900 text-green-300';
      case 'rejected':
        return 'bg-red-900 text-red-300';
      case 'pending':
        return 'bg-yellow-900 text-yellow-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColorDark = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-900 text-red-300';
      case 'medium':
        return 'bg-yellow-900 text-yellow-300';
      case 'low':
        return 'bg-green-900 text-green-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  // Simple diff highlighting
  const highlightDifferences = (original: string, optimized: string) => {
    const originalLines = original.split('\n');
    const optimizedLines = optimized.split('\n');
    
    return {
      originalHighlighted: originalLines.map((line, index) => ({
        line,
        type: optimizedLines[index] !== line ? 'removed' : 'unchanged',
        lineNumber: index + 1
      })),
      optimizedHighlighted: optimizedLines.map((line, index) => ({
        line,
        type: originalLines[index] !== line ? 'added' : 'unchanged',
        lineNumber: index + 1
      }))
    };
  };

  const { originalHighlighted, optimizedHighlighted } = highlightDifferences(
    optimization.originalCode,
    optimization.optimizedCode
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => window.history.back()}
          className={`flex items-center space-x-2 mb-4 px-4 py-2 rounded-lg transition-colors duration-200 ${
            theme === 'dark'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToAnalyzer}</span>
        </button>
        
        <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {t.title}
        </h1>
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {t.subtitle}
        </p>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-6`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {optimization.file}
            </h2>
            <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {optimization.description}
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t.impact}:
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  theme === 'dark' 
                    ? getImpactColorDark(optimization.impact) 
                    : getImpactColor(optimization.impact)
                }`}>
                  {t[optimization.impact as keyof typeof t]}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Status:
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  theme === 'dark' 
                    ? getStatusColorDark(optimization.status) 
                    : getStatusColor(optimization.status)
                }`}>
                  {t[optimization.status as keyof typeof t] || t.pending}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCopy(optimization.optimizedCode)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={t.copyCode}
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={t.downloadDiff}
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {optimization.status === 'pending' && (
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => onValidation(optimization.id, 'approved')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{t.approve}</span>
            </button>
            <button
              onClick={() => onValidation(optimization.id, 'rejected')}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <XCircle className="w-4 h-4" />
              <span>{t.reject}</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
          <div className="px-6 py-4 bg-red-50 border-b">
            <h3 className="text-lg font-semibold text-red-800">{t.original}</h3>
          </div>
          <div className="relative">
            <pre className={`p-4 text-sm overflow-x-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <code className={theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}>
                {originalHighlighted.map((line, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      line.type === 'removed' 
                        ? 'bg-red-100 text-red-800' 
                        : theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                    }`}
                  >
                    <span className={`inline-block w-8 text-right pr-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {line.lineNumber}
                    </span>
                    <span className="flex-1 pl-2">{line.line}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
          <div className="px-6 py-4 bg-green-50 border-b">
            <h3 className="text-lg font-semibold text-green-800">{t.optimized}</h3>
          </div>
          <div className="relative">
            <pre className={`p-4 text-sm overflow-x-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <code className={theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}>
                {optimizedHighlighted.map((line, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      line.type === 'added' 
                        ? 'bg-green-100 text-green-800' 
                        : theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                    }`}
                  >
                    <span className={`inline-block w-8 text-right pr-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {line.lineNumber}
                    </span>
                    <span className="flex-1 pl-2">{line.line}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>

      {copied && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Code copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default DiffViewer;