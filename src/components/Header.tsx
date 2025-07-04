import React from 'react';
import { Globe, Moon, Sun, Upload, BarChart3, Code, GitCompare, CheckSquare } from 'lucide-react';

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  currentView: string;
  setCurrentView: (view: 'upload' | 'dashboard' | 'analyzer' | 'diff' | 'validation') => void;
}

const translations = {
  en: {
    title: 'FORGE-OPTIMIZER',
    subtitle: 'Code Analysis & Optimization Platform',
    upload: 'Upload',
    dashboard: 'Dashboard',
    analyzer: 'Analyzer',
    diff: 'Diff Viewer',
    validation: 'Validation'
  },
  fr: {
    title: 'FORGE-OPTIMIZER',
    subtitle: 'Plateforme d\'Analyse et d\'Optimisation de Code',
    upload: 'Télécharger',
    dashboard: 'Tableau de bord',
    analyzer: 'Analyseur',
    diff: 'Comparateur',
    validation: 'Validation'
  },
  es: {
    title: 'FORGE-OPTIMIZER',
    subtitle: 'Plataforma de Análisis y Optimización de Código',
    upload: 'Subir',
    dashboard: 'Panel',
    analyzer: 'Analizador',
    diff: 'Comparador',
    validation: 'Validación'
  }
};

const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  theme,
  setTheme,
  currentView,
  setCurrentView
}) => {
  const t = translations[language as keyof typeof translations];

  const navItems = [
    { id: 'upload', label: t.upload, icon: Upload },
    { id: 'dashboard', label: t.dashboard, icon: BarChart3 },
    { id: 'analyzer', label: t.analyzer, icon: Code },
    { id: 'diff', label: t.diff, icon: GitCompare },
    { id: 'validation', label: t.validation, icon: CheckSquare }
  ];

  return (
    <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {t.title}
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t.subtitle}
                </p>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    currentView === item.id
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-700'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`px-3 py-1 rounded-lg border text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>

            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;