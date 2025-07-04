/**
 * 💥 HULK-POWERED DASHBOARD
 * Affichage des statistiques HULK et Bruce !
 */

import React from 'react';
import { Calendar, FileText, Clock, TrendingUp, AlertTriangle, CheckCircle, Zap, Brain } from 'lucide-react';
import { useAnalysis } from '../contexts/AnalysisContext';

interface DashboardProps {
  projects: any[];
  selectedProject: any;
  onProjectSelect: (project: any) => void;
  language: string;
  theme: 'light' | 'dark';
}

const translations = {
  en: {
    title: 'HULK-Powered Dashboard',
    subtitle: 'Bruce plans, HULK smashes bad code!',
    hulkStats: 'HULK Statistics',
    bruceStats: 'Bruce Statistics',
    rageLevel: 'Rage Level',
    smashCount: 'Smashes',
    totalDestruction: 'Total Destruction',
    isTransformed: 'Transformed',
    sessionCount: 'Sessions',
    avgDuration: 'Avg Duration',
    yes: 'Yes',
    no: 'No'
  },
  fr: {
    title: 'Tableau de Bord HULK',
    subtitle: 'Bruce planifie, HULK écrase le mauvais code !',
    hulkStats: 'Statistiques HULK',
    bruceStats: 'Statistiques Bruce',
    rageLevel: 'Niveau de Rage',
    smashCount: 'Écrasements',
    totalDestruction: 'Destruction Totale',
    isTransformed: 'Transformé',
    sessionCount: 'Sessions',
    avgDuration: 'Durée Moyenne',
    yes: 'Oui',
    no: 'Non'
  }
};

export default function Dashboard({ projects, selectedProject, onProjectSelect, language, theme }: DashboardProps) {
  const { getHulkStats, getBruceStats, analysisResult } = useAnalysis();
  const t = translations[language as keyof typeof translations];
  
  const hulkStats = getHulkStats();
  const bruceStats = getBruceStats();

  const getHulkRageColor = (rageLevel: number) => {
    if (rageLevel < 50) return 'text-green-400';
    if (rageLevel < 100) return 'text-yellow-400';
    if (rageLevel < 200) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSmashPowerEmoji = (rageLevel: number) => {
    if (rageLevel < 50) return '😌';
    if (rageLevel < 100) return '😠';
    if (rageLevel < 200) return '😡';
    return '🤬';
  };

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header HULK */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-green-400" />
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-gray-500">{t.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Stats HULK & Bruce */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* HULK Stats */}
          <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-400">💚 {t.hulkStats}</h3>
              <span className="text-2xl">{hulkStats.isTransformed ? '💪' : '🧬'}</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>{t.rageLevel}:</span>
                <span className={`font-bold ${getHulkRageColor(hulkStats.rageLevel)}`}>
                  {hulkStats.rageLevel} {getSmashPowerEmoji(hulkStats.rageLevel)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>{t.smashCount}:</span>
                <span className="font-bold text-red-400">{hulkStats.smashCount} 💥</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>{t.totalDestruction}:</span>
                <span className="font-bold text-purple-400">{hulkStats.totalDestruction || 0} 🌪️</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>{t.isTransformed}:</span>
                <span className={`font-bold ${hulkStats.isTransformed ? 'text-green-400' : 'text-gray-400'}`}>
                  {hulkStats.isTransformed ? t.yes : t.no}
                </span>
              </div>
            </div>
            
            {/* Barre de rage */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Rage Meter</span>
                <span>{hulkStats.rageLevel}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    hulkStats.rageLevel < 50 ? 'bg-green-400' :
                    hulkStats.rageLevel < 100 ? 'bg-yellow-400' :
                    hulkStats.rageLevel < 200 ? 'bg-orange-400' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(hulkStats.rageLevel, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Bruce Stats */}
          <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-400">🧠 {t.bruceStats}</h3>
              <span className="text-2xl">🔬</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>{t.sessionCount}:</span>
                <span className="font-bold text-blue-400">{bruceStats.totalSessions} 📊</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>{t.avgDuration}:</span>
                <span className="font-bold text-green-400">
                  {Math.round(bruceStats.averageDuration / 1000)}s ⏱️
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Current Plan:</span>
                <span className="font-bold text-yellow-400">
                  {bruceStats.currentPlan ? 'Active 🎯' : 'Idle 😴'}
                </span>
              </div>
            </div>
            
            {/* Plan actuel */}
            {bruceStats.currentPlan && (
              <div className="mt-4 p-3 bg-purple-900/20 rounded-lg">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Progress:</span>
                    <span>{bruceStats.currentPlan.currentStep}/{bruceStats.currentPlan.totalSteps}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-1 mt-2">
                    <div 
                      className="h-1 bg-purple-400 rounded-full transition-all"
                      style={{ 
                        width: `${(bruceStats.currentPlan.currentStep / bruceStats.currentPlan.totalSteps) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Projets avec statut HULK */}
        <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className="text-xl font-semibold mb-6">💻 Projets</h3>
          
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚀</div>
              <h4 className="text-lg font-medium mb-2">Prêt pour la première analyse HULK ?</h4>
              <p className="text-gray-500">Uploadez vos fichiers et laissez Bruce planifier pendant que HULK écrase les bugs !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project, index) => (
                <div
                  key={index}
                  onClick={() => onProjectSelect(project)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedProject?.id === project.id
                      ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                      : theme === 'dark'
                      ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <span className="text-2xl">
                      {project.status === 'hulk-smashed' ? '💚' : 
                       project.status === 'analyzed' ? '🔍' : '📁'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>Files: {project.filesAnalyzed}</div>
                    <div>Status: {project.status}</div>
                    <div>Type: {project.projectType}</div>
                  </div>
                  
                  {project.hulkScore && (
                    <div className="mt-3 p-2 bg-green-900/20 rounded">
                      <div className="text-sm font-medium text-green-400">
                        HULK Score: {project.hulkScore}/100 💪
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages HULK */}
        {hulkStats.isTransformed && (
          <div className="mt-6 p-4 bg-green-900/20 border border-green-400 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💚</span>
              <div>
                <h4 className="font-bold text-green-400">HULK STATUS</h4>
                <p className="text-green-300">
                  {hulkStats.rageLevel > 200 ? "HULK IS WORLD BREAKER! STAND BACK!" :
                   hulkStats.rageLevel > 100 ? "HULK SMASH EVERYTHING!" :
                   hulkStats.rageLevel > 50 ? "Hulk getting angry..." :
                   "Hulk is calm. For now."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
