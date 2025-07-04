import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Filter, Eye, Download } from 'lucide-react';
import { useAnalysis } from '../../contexts/AnalysisContext';

const ValidationTab: React.FC = () => {
  const { state, approveSuggestion, rejectSuggestion } = useAnalysis();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  const filteredSuggestions = state.suggestions.filter(s => 
    statusFilter === 'all' || s.status === statusFilter
  );

  const handleSelectAll = () => {
    if (selectedSuggestions.length === filteredSuggestions.length) {
      setSelectedSuggestions([]);
    } else {
      setSelectedSuggestions(filteredSuggestions.map(s => s.id));
    }
  };

  const handleBulkApprove = () => {
    selectedSuggestions.forEach(id => approveSuggestion(id));
    setSelectedSuggestions([]);
  };

  const handleBulkReject = () => {
    selectedSuggestions.forEach(id => rejectSuggestion(id));
    setSelectedSuggestions([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const pendingCount = state.suggestions.filter(s => s.status === 'pending').length;
  const approvedCount = state.suggestions.filter(s => s.status === 'approved').length;
  const rejectedCount = state.suggestions.filter(s => s.status === 'rejected').length;

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Validation des Optimisations
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Validez ou rejetez les suggestions d'optimisation
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{state.suggestions.length}</p>
              </div>
              <Filter className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En attente</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approuvées</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejetées</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{rejectedCount}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters and Bulk Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtres</h3>
              <div className="flex space-x-2">
                {['all', 'pending', 'approved', 'rejected'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status as any)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {status === 'all' ? 'Toutes' : 
                     status === 'pending' ? 'En attente' :
                     status === 'approved' ? 'Approuvées' : 'Rejetées'}
                  </button>
                ))}
              </div>
            </div>

            {selectedSuggestions.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedSuggestions.length} sélectionnée(s)
                </span>
                <button
                  onClick={handleBulkApprove}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  Approuver tout
                </button>
                <button
                  onClick={handleBulkReject}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  Rejeter tout
                </button>
              </div>
            )}
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedSuggestions.length === filteredSuggestions.length && filteredSuggestions.length > 0}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Sélectionner tout</span>
          </label>
        </div>

        {/* Suggestions List */}
        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={selectedSuggestions.includes(suggestion.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSuggestions([...selectedSuggestions, suggestion.id]);
                    } else {
                      setSelectedSuggestions(selectedSuggestions.filter(id => id !== suggestion.id));
                    }
                  }}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {suggestion.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {suggestion.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          📁 {suggestion.file}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(suggestion.status)}`}>
                          {suggestion.status === 'pending' ? 'En attente' :
                           suggestion.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {suggestion.estimatedImprovement}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(suggestion.status)}
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
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Eye className="w-4 h-4" />
                        <span>Voir le diff</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSuggestions.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune suggestion trouvée
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Aucune suggestion ne correspond aux filtres sélectionnés.
            </p>
          </div>
        )}

        {/* Export Button */}
        {approvedCount > 0 && (
          <div className="mt-8 text-center">
            <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto">
              <Download className="w-5 h-5" />
              <span>Exporter les optimisations approuvées</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidationTab;