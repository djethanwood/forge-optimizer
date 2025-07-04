import React, { useState } from 'react';
import { FileText, AlertTriangle, Zap, Shield, Code, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';

interface CodeAnalyzerProps {
  project: any;
  onOptimizationSelect: (optimization: any) => void;
  language: string;
  theme: 'light' | 'dark';
}

const translations = {
  en: {
    title: 'Code Analysis Results',
    subtitle: 'Review optimization suggestions for your project',
    filters: 'Filters',
    allTypes: 'All Types',
    performance: 'Performance',
    security: 'Security',
    style: 'Style',
    structure: 'Structure',
    allImpacts: 'All Impacts',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    allStatuses: 'All Statuses',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    viewDiff: 'View Diff',
    impact: 'Impact',
    status: 'Status',
    file: 'File',
    description: 'Description',
    optimizationsFound: 'optimizations found',
    summary: {
      totalOptimizations: 'Total Optimizations',
      performanceGains: 'Performance Gains',
      securityIssues: 'Security Issues',
      codeQuality: 'Code Quality'
    }
  },
  fr: {
    title: 'Résultats d\'analyse du code',
    subtitle: 'Examiner les suggestions d\'optimisation pour votre projet',
    filters: 'Filtres',
    allTypes: 'Tous les types',
    performance: 'Performance',
    security: 'Sécurité',
    style: 'Style',
    structure: 'Structure',
    allImpacts: 'Tous les impacts',
    high: 'Élevé',
    medium: 'Moyen',
    low: 'Faible',
    allStatuses: 'Tous les statuts',
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    viewDiff: 'Voir les différences',
    impact: 'Impact',
    status: 'Statut',
    file: 'Fichier',
    description: 'Description',
    optimizationsFound: 'optimisations trouvées',
    summary: {
      totalOptimizations: 'Optimisations totales',
      performanceGains: 'Gains de performance',
      securityIssues: 'Problèmes de sécurité',
      codeQuality: 'Qualité du code'
    }
  },
  es: {
    title: 'Resultados del análisis de código',
    subtitle: 'Revisar sugerencias de optimización para tu proyecto',
    filters: 'Filtros',
    allTypes: 'Todos los tipos',
    performance: 'Rendimiento',
    security: 'Seguridad',
    style: 'Estilo',
    structure: 'Estructura',
    allImpacts: 'Todos los impactos',
    high: 'Alto',
    medium: 'Medio',
    low: 'Bajo',
    allStatuses: 'Todos los estados',
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    viewDiff: 'Ver diferencias',
    impact: 'Impacto',
    status: 'Estado',
    file: 'Archivo',
    description: 'Descripción',
    optimizationsFound: 'optimizaciones encontradas',
    summary: {
      totalOptimizations: 'Optimizaciones totales',
      performanceGains: 'Ganancias de rendimiento',
      securityIssues: 'Problemas de seguridad',
      codeQuality: 'Calidad del código'
    }
  }
};

const CodeAnalyzer: React.FC<CodeAnalyzerProps> = ({ project, onOptimizationSelect, language, theme }) => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [impactFilter, setImpactFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const t = translations[language as keyof typeof translations];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'security':
        return <Shield className="w-5 h-5 text-red-500" />;
      case 'style':
        return <Code className="w-5 h-5 text-blue-500" />;
      case 'structure':
        return <FileText className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredOptimizations = project.optimizations.filter((opt: any) => {
    const typeMatch = typeFilter === 'all' || opt.type === typeFilter;
    const impactMatch = impactFilter === 'all' || opt.impact === impactFilter;
    const statusMatch = statusFilter === 'all' || opt.status === statusFilter;
    return typeMatch && impactMatch && statusMatch;
  });

  const summaryStats = [
    {
      title: t.summary.totalOptimizations,
      value: project.optimizations.length,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: t.summary.performanceGains,
      value: project.optimizations.filter((opt: any) => opt.type === 'performance').length,
      icon: Zap,
      color: 'text-yellow-600'
    },
    {
      title: t.summary.securityIssues,
      value: project.optimizations.filter((opt: any) => opt.type === 'security').length,
      icon: Shield,
      color: 'text-red-600'
    },
    {
      title: t.summary.codeQuality,
      value: project.optimizations.filter((opt: any) => opt.type === 'style').length,
      icon: Code,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {t.title}
        </h1>
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg mb-6`}>
        <div className="p-6 border-b border-gray-200">
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t.filters}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">{t.allTypes}</option>
                <option value="performance">{t.performance}</option>
                <option value="security">{t.security}</option>
                <option value="style">{t.style}</option>
                <option value="structure">{t.structure}</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.impact}
              </label>
              <select
                value={impactFilter}
                onChange={(e) => setImpactFilter(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">{t.allImpacts}</option>
                <option value="high">{t.high}</option>
                <option value="medium">{t.medium}</option>
                <option value="low">{t.low}</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.status}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">{t.allStatuses}</option>
                <option value="pending">{t.pending}</option>
                <option value="approved">{t.approved}</option>
                <option value="rejected">{t.rejected}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {filteredOptimizations.length} {t.optimizationsFound}
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredOptimizations.map((optimization: any) => (
            <div key={optimization.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getTypeIcon(optimization.type)}
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {optimization.file}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      theme === 'dark' 
                        ? getImpactColorDark(optimization.impact) 
                        : getImpactColor(optimization.impact)
                    }`}>
                      {t[optimization.impact as keyof typeof t]}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(optimization.status)}
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t[optimization.status as keyof typeof t]}
                      </span>
                    </div>
                  </div>
                  <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {optimization.description}
                  </p>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t.type}: {t[optimization.type as keyof typeof t]} • {t.impact}: {t[optimization.impact as keyof typeof t]}
                  </div>
                </div>
                <button
                  onClick={() => onOptimizationSelect(optimization)}
                  className="ml-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <span className="text-sm font-medium">{t.viewDiff}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeAnalyzer;