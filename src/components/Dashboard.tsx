import React from 'react';
import { Calendar, FileText, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface DashboardProps {
  projects: any[];
  selectedProject: any;
  onProjectSelect: (project: any) => void;
  language: string;
  theme: 'light' | 'dark';
}

const translations = {
  en: {
    title: 'Project Dashboard',
    subtitle: 'Overview of your code optimization projects',
    projectType: 'Project Type',
    filesAnalyzed: 'Files Analyzed',
    uploadedOn: 'Uploaded on',
    status: 'Status',
    optimizations: 'Optimizations',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    analyzing: 'Analyzing',
    ready: 'Ready',
    completed: 'Completed',
    viewDetails: 'View Details',
    summary: {
      totalProjects: 'Total Projects',
      totalOptimizations: 'Total Optimizations',
      averageImprovement: 'Average Improvement',
      securityIssues: 'Security Issues Found'
    }
  },
  fr: {
    title: 'Tableau de bord des projets',
    subtitle: 'Vue d\'ensemble de vos projets d\'optimisation de code',
    projectType: 'Type de projet',
    filesAnalyzed: 'Fichiers analysés',
    uploadedOn: 'Téléchargé le',
    status: 'Statut',
    optimizations: 'Optimisations',
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    analyzing: 'Analyse',
    ready: 'Prêt',
    completed: 'Terminé',
    viewDetails: 'Voir les détails',
    summary: {
      totalProjects: 'Projets totaux',
      totalOptimizations: 'Optimisations totales',
      averageImprovement: 'Amélioration moyenne',
      securityIssues: 'Problèmes de sécurité trouvés'
    }
  },
  es: {
    title: 'Panel de proyectos',
    subtitle: 'Resumen de tus proyectos de optimización de código',
    projectType: 'Tipo de proyecto',
    filesAnalyzed: 'Archivos analizados',
    uploadedOn: 'Subido el',
    status: 'Estado',
    optimizations: 'Optimizaciones',
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    analyzing: 'Analizando',
    ready: 'Listo',
    completed: 'Completado',
    viewDetails: 'Ver detalles',
    summary: {
      totalProjects: 'Proyectos totales',
      totalOptimizations: 'Optimizaciones totales',
      averageImprovement: 'Mejora promedio',
      securityIssues: 'Problemas de seguridad encontrados'
    }
  }
};

const Dashboard: React.FC<DashboardProps> = ({ projects, selectedProject, onProjectSelect, language, theme }) => {
  const t = translations[language as keyof typeof translations];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColorDark = (status: string) => {
    switch (status) {
      case 'analyzing':
        return 'bg-yellow-900 text-yellow-300';
      case 'ready':
        return 'bg-blue-900 text-blue-300';
      case 'completed':
        return 'bg-green-900 text-green-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'React':
        return '⚛️';
      case 'Vue':
        return '🔧';
      case 'Angular':
        return '🅰️';
      case 'Node.js':
        return '🟢';
      case 'Python':
        return '🐍';
      default:
        return '📄';
    }
  };

  const totalOptimizations = projects.reduce((acc, project) => acc + (project.optimizations?.length || 0), 0);
  const pendingOptimizations = projects.reduce((acc, project) => 
    acc + (project.optimizations?.filter((opt: any) => opt.status === 'pending').length || 0), 0
  );
  const approvedOptimizations = projects.reduce((acc, project) => 
    acc + (project.optimizations?.filter((opt: any) => opt.status === 'approved').length || 0), 0
  );
  const securityIssues = projects.reduce((acc, project) => 
    acc + (project.optimizations?.filter((opt: any) => opt.type === 'security').length || 0), 0
  );

  const summaryStats = [
    { 
      title: t.summary.totalProjects, 
      value: projects.length, 
      icon: FileText, 
      color: 'text-blue-600' 
    },
    { 
      title: t.summary.totalOptimizations, 
      value: totalOptimizations, 
      icon: TrendingUp, 
      color: 'text-green-600' 
    },
    { 
      title: t.summary.averageImprovement, 
      value: '24%', 
      icon: CheckCircle, 
      color: 'text-purple-600' 
    },
    { 
      title: t.summary.securityIssues, 
      value: securityIssues, 
      icon: AlertTriangle, 
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

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Projects
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Project
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  {t.projectType}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  {t.filesAnalyzed}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  {t.status}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  {t.optimizations}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {projects.map((project, index) => (
                <tr key={project.id} className={`hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-150`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-lg mr-3">{getProjectTypeIcon(project.type)}</div>
                      <div>
                        <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {project.name}
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {project.language}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                    {project.type}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                    {project.files}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      theme === 'dark' ? getStatusColorDark(project.status) : getStatusColor(project.status)
                    }`}>
                      {t[project.status as keyof typeof t] || project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {t.pending}: {project.optimizations?.filter((opt: any) => opt.status === 'pending').length || 0}
                      </span>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {t.approved}: {project.optimizations?.filter((opt: any) => opt.status === 'approved').length || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onProjectSelect(project)}
                      className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                    >
                      {t.viewDetails}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;