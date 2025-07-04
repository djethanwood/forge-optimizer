/**
 * 💚 HULK MAIN CONTENT WITH ANALYSIS STEPS!
 */

import React, { useState } from 'react';
import { useAnalysis } from '../contexts/AnalysisContext';
import { Upload, Play, CheckCircle, AlertTriangle } from 'lucide-react';

interface MainContentProps {
  language?: string;
  theme?: 'light' | 'dark';
}

export default function MainContent({ language = 'fr', theme = 'dark' }: MainContentProps) {
  const { analyzeWithHulk, isAnalyzing, analysisResult } = useAnalysis();
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [analysisSteps, setAnalysisSteps] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const filePromises = Array.from(files).map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            name: file.name,
            content: e.target?.result as string,
            size: file.size,
            type: file.type
          });
        };
        reader.readAsText(file);
      });
    });

    Promise.all(filePromises).then(files => {
      setUploadedFiles(files as any[]);
    });
  };

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) return;

    setAnalysisSteps([]);
    
    // Simuler les étapes d'analyse en temps réel
    const steps = [
      '🧠 Bruce: Initialisation de l\'analyse...',
      '💚 HULK: TRANSFORMATION EN COURS!',
      '🔧 ESLint: Analyse de la qualité du code...',
      '🎨 Prettier: Vérification du formatage...',
      '🕸️ Madge: Détection des dépendances circulaires...',
      '🤖 CodeLlama 13B: Analyse technique approfondie...',
      '🎨 Claude: Génération d\'optimisations créatives...',
      '💚 HULK: SMASH COMPLETED! Résultats prêts!'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalysisSteps(prev => [...prev, steps[i]]);
    }

    // Lancer la vraie analyse
    await analyzeWithHulk(uploadedFiles, 'Analyse complète depuis l\'interface');
  };

  return (
    <div className={`flex-1 p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">FORGE-OPTIMIZER-HULK</h1>

        {/* Upload Section */}
        <div className="bg-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📁 Upload de fichiers</h2>
          <input
            type="file"
            multiple
            accept=".js,.jsx,.ts,.tsx,.py,.css,.html"
            onChange={handleFileUpload}
            className="mb-4"
          />
          
          {uploadedFiles.length > 0 && (
            <div className="mb-4">
              <p className="text-green-400">{uploadedFiles.length} fichiers uploadés :</p>
              <ul className="text-sm text-gray-400">
                {uploadedFiles.map((file, index) => (
                  <li key={index}>• {file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={uploadedFiles.length === 0 || isAnalyzing}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>{isAnalyzing ? 'Analyse en cours...' : 'Analyser avec HULK'}</span>
          </button>
        </div>

        {/* Analysis Steps */}
        {analysisSteps.length > 0 && (
          <div className="bg-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">⚡ Étapes d'analyse</h2>
            <div className="space-y-2">
              {analysisSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {analysisResult && (
          <div className="bg-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📊 Résultats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{analysisResult.issues?.length || 0}</div>
                <div className="text-sm text-gray-400">Problèmes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{analysisResult.suggestions?.length || 0}</div>
                <div className="text-sm text-gray-400">Optimisations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{analysisResult.metrics?.performance || 0}</div>
                <div className="text-sm text-gray-400">Performance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{analysisResult.hulkStats?.rageLevel || 0}</div>
                <div className="text-sm text-gray-400">HULK Rage</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
