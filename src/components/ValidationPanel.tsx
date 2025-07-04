import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Filter, Download, BarChart3 } from 'lucide-react';

interface ValidationPanelProps {
  project: any;
  onValidation: (optimizationId: string, status: 'approved' | 'rejected') => void;
  language: string;
  theme: 'light' | 'dark';
}

const translations = {
  en: {
    title: 'Validation Panel',
    subtitle: 'Review and validate optimization suggestions',
    bulkActions: 'Bulk Actions',
    approveAll: 'Approve All',
    rejectAll: 'Reject All',
    exportReport: 'Export Report',
    filters: 'Filters',
    showAll: 'Show All',
    showPending: 'Show Pending',
    showApproved: 'Show Approved',
    showRejected: 'Show Rejected',
    approve: 'Approve',
    reject: 'Reject',
    approved: 'Approved',
    rejected: 'Rejected',
    pending: 'Pending',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    impact: 'Impact',
    status: 'Status',
    file: 'File',
    description: 'Description',
    summary: {
      total: 'Total Optimizations',
      pending: 'Pending Review',
      approved: 'Approved',
      rejected: 'Rejected'
    }
  },
  fr: {
    title: 'Panneau de validation',
    subtitle: 'Examiner et valider les suggestions d\'optimisation',
    bulkActions: 'Actions en bloc',
    approveAll: 'Tout approuver',
    rejectAll: 'Tout rejeter',
    exportReport: 'Exporter le rapport',
    filters: 'Filtres',
    showAll: 'Tout afficher',
    showPending: 'Afficher en attente',
    showApproved: 'Afficher approuvé',
    showRejected: 'Afficher rejeté',
    approve: 'Approuver',
    reject: 'Rejeter',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    pending: 'En attente',
    high: 'Élevé',
    medium: 'Moyen',
    low: 'Faible',
    impact: 'Impact',
    status: 'Statut',
    file: 'Fichier',
    description: 'Description',
    summary: {
      total: 'Optimisations totales',
      pending: 'En attente de révision',
      approved: 'Approuvé',
      rejected: 'Rejeté'
    }
  },
  es: {
    title: 'Panel de validación',
    subtitle: 'Revisar y validar sugerencias de optimización',
    bulkActions: 'Acciones masivas',
    approveAll: 'Aprobar todo',
    rejectAll: 'Rechazar todo',
    exportReport: 'Exportar informe',
    filters: 'Filtros',
    showAll: 'Mostrar todo',
    showPending: 'Mostrar pendientes',
    showApproved: 'Mostrar aprobados',
    showRejected: 'Mostrar rechazados',
    approve: 'Aprobar',
    reject: 'Rechazar',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    pending: 'Pendiente',
    high: 'Alto',
    medium: 'Medio',
    low: 'Bajo',
    impact: 'Impacto',
    status: 'Estado',
    file: 'Archivo',
    description: 'Descripción',
    summary: {
      total: 'Optimizaciones totales',
      pending: 'Pendientes de revisión',
      approved: 'Aprobadas',
      rejected: 'Rechazadas'
    }
  }
};

const ValidationPanel: React.FC<ValidationPanelProps> = ({ project, onValidation, language, theme }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOptimizations, setSelectedOptimizations] = useState<string[]>([]);

  const t = translations[language as keyof typeof translations];

  const filteredOptimizations = project.optimizations.filter((opt: any) => {
    if (statusFilter === 'all') return true;
    return opt.status === statusFilter;
  });

  const handleSelectAll = () => {
    if (selectedOptimizations.length === filteredOptimizations.length) {
      setSelectedOptimizations([]);
    } else {
      setSelectedOptimizations(filteredOptimizations.map((opt: any) => opt.id));
    }
  };

  const handleBulkApprove = () => {
    selectedOptimizations.forEach(id => {
      onValidation(id, 'approved');
    });
    setSelectedOptimizations([]);
  };

  const handleBulkReject = () => {
    selectedOptimizations.forEach(id => {
      onValidation(id, 'rejected');
    });
    setSelectedOptimizations([]);
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

  const pendingCount = project.optimizations.filter((opt: any) => opt.status === 'pending').length;
  const approvedCount = project.optimizations.filter((opt: any) => opt.status === 'approved').length;
  const rejectedCount = project.optimizations.filter((opt: any) => opt.status === 'rejected').length;

  const summaryStats = [
    {
      title: t.summary.total,
      value: project.optimizations.length,
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      title: t.summary.pending,
      value: pendingCount,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: t.summary.approved,
      value: approvedCount,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: t.summary.rejected,
      value: rejectedCount,
      icon: XCircle,
      color: 'text-red-600'
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
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.filters}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                  statusFilter === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t.showAll}
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                  statusFilter === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t.showPending}
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                  statusFilter === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t.showApproved}
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                  statusFilter === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t.showRejected}
              </button>
            </div>
          </div>

          {selectedOptimizations.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700">
                {selectedOptimizations.length} items selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBulkApprove}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors duration-200"
                >
                  {t.approveAll}
                </button>
                <button
                  onClick={handleBulkReject}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors duration-200"
                >
                  {t.rejectAll}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedOptimizations.length === filteredOptimizations.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Select All
              </span>
            </label>
            <button
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">{t.exportReport}</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredOptimizations.map((optimization: any) => (
            <div key={optimization.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={selectedOptimizations.includes(optimization.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOptimizations([...selectedOptimizations, optimization.id]);
                    } else {
                      setSelectedOptimizations(selectedOptimizations.filter(id => id !== optimization.id));
                    }
                  }}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {optimization.file}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(optimization.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        theme === 'dark' 
                          ? getImpactColorDark(optimization.impact) 
                          : getImpactColor(optimization.impact)
                      }`}>
                        {t[optimization.impact as keyof typeof t]}
                      </span>
                    </div>
                  </div>
                  
                  <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {optimization.description}
                  </p>
                  
                  {optimization.status === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onValidation(optimization.id, 'approved')}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors duration-200"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>{t.approve}</span>
                      </button>
                      <button
                        onClick={() => onValidation(optimization.id, 'rejected')}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors duration-200"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>{t.reject}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValidationPanel;