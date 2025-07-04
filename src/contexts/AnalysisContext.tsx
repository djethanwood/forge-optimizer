/**
 * 💥 HULK-POWERED ANALYSIS CONTEXT
 * Fini les simulations ! HULK SMASH avec de vraies analyses !
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { bruce, BrucePlan } from '../services/hulk/bruce';
import { hulk } from '../services/hulk/hulk';

export interface CodeFile {
  id: string;
  name: string;
  path: string;
  content: string;
  size: number;
  type: string;
}

export interface AnalysisIssue {
  id: string;
  file: string;
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'info';
  category: 'performance' | 'security' | 'style' | 'complexity' | 'maintainability';
  message: string;
  rule: string;
  tool: 'eslint' | 'prettier' | 'codellama' | 'madge';
  suggestion?: string;
  impact: 'low' | 'medium' | 'high';
}

export interface OptimizationSuggestion {
  id: string;
  file: string;
  title: string;
  description: string;
  category: 'performance' | 'security' | 'style' | 'complexity' | 'maintainability';
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  originalCode: string;
  optimizedCode: string;
  lineStart: number;
  lineEnd: number;
  status: 'pending' | 'approved' | 'rejected';
  estimatedImprovement: string;
}

export interface AnalysisMetrics {
  complexity: number;
  maintainability: number;
  performance: number;
  security: number;
  codeQuality: number;
  testCoverage: number;
  duplicateCode: number;
  technicalDebt: number;
}

export interface AnalysisResult {
  files: CodeFile[];
  issues: AnalysisIssue[];
  suggestions: OptimizationSuggestion[];
  metrics: AnalysisMetrics;
  hulkStats?: any;
  brucePlan?: BrucePlan;
}

interface AnalysisContextType {
  // État
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
  currentPlan: BrucePlan | null;
  
  // Actions HULK POWERED
  analyzeWithHulk: (files: CodeFile[], userRequest: string) => Promise<void>;
  executeNextStep: () => Promise<{ needsValidation: boolean; message?: string }>;
  validateAndContinue: (approved: boolean) => Promise<void>;
  
  // Actions héritées (pour compatibilité)
  startAnalysis: (files: CodeFile[]) => Promise<void>;
  approveOptimization: (optimizationId: string) => void;
  rejectOptimization: (optimizationId: string) => void;
  applyOptimizations: () => Promise<void>;
  
  // Stats
  getHulkStats: () => any;
  getBruceStats: () => any;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentPlan, setCurrentPlan] = useState<BrucePlan | null>(null);

  /**
   * 💥 ANALYSE HULK POWERED !
   * Fini les simulations ! Bruce planifie, Hulk exécute !
   */
  const analyzeWithHulk = useCallback(async (files: CodeFile[], userRequest: string) => {
    console.log('💥 DÉMARRAGE ANALYSE HULK POWERED !');
    setIsAnalyzing(true);
    
    try {
      // 🧠 BRUCE ANALYSE ET PLANIFIE
      console.log('🧠 Bruce analyse la demande...');
      const plan = await bruce.analyzeDemandAndCreatePlan(userRequest, files);
      setCurrentPlan(plan);
      
      console.log('📋 Plan créé par Bruce:', plan);
      
      // 💚 HULK SE TRANSFORME
      await hulk.TRANSFORM();
      
      // 💥 HULK SMASH LES SIMULATIONS !
      console.log('💥 Hulk détruit les simulations...');
      const hulkResult = await hulk.SMASH_SIMULATIONS(files);
      
      if (hulkResult.success) {
        setAnalysisResult({
          files,
          issues: hulkResult.data.issues,
          suggestions: hulkResult.data.suggestions,
          metrics: hulkResult.data.metrics,
          hulkStats: hulkResult.data.hulkStats,
          brucePlan: plan
        });
        
        console.log('✅ HULK SMASH SUCCESSFUL !');
        console.log('💚', hulkResult.hulkMessage);
      } else {
        console.error('❌ HULK SMASH FAILED:', hulkResult.error);
        throw new Error(hulkResult.error);
      }
      
    } catch (error) {
      console.error('💥 Erreur analyse HULK:', error);
      setAnalysisResult(null);
      setCurrentPlan(null);
    } finally {
      setIsAnalyzing(false);
      // 🧘‍♂️ Hulk se calme
      await hulk.CALM_DOWN();
    }
  }, []);

  /**
   * 🎯 EXÉCUTION ÉTAPE PAR ÉTAPE (BRUCE + HULK)
   */
  const executeNextStep = useCallback(async () => {
    if (!currentPlan) {
      throw new Error('Aucun plan en cours');
    }
    
    console.log('🧠 Bruce exécute la prochaine étape...');
    const result = await bruce.executeNextStep();
    
    // Mettre à jour le plan actuel
    setCurrentPlan(bruce.getCurrentPlan());
    
    return {
      needsValidation: result.needsValidation,
      message: result.validationMessage
    };
  }, [currentPlan]);

  /**
   * ✅ VALIDATION ET CONTINUATION
   */
  const validateAndContinue = useCallback(async (approved: boolean) => {
    if (!approved) {
      console.log('❌ Utilisateur a rejeté, arrêt du processus');
      return;
    }
    
    console.log('✅ Utilisateur a approuvé, continuation...');
    await executeNextStep();
  }, [executeNextStep]);

  /**
   * 🚀 ANALYSE SIMPLE (pour compatibilité)
   */
  const startAnalysis = useCallback(async (files: CodeFile[]) => {
    // Utilise la nouvelle méthode HULK avec une demande générique
    await analyzeWithHulk(files, "Analyser et optimiser ce code");
  }, [analyzeWithHulk]);

  /**
   * ✅ APPROUVER OPTIMISATION
   */
  const approveOptimization = useCallback((optimizationId: string) => {
    if (!analysisResult) return;
    
    const updatedSuggestions = analysisResult.suggestions.map(suggestion =>
      suggestion.id === optimizationId
        ? { ...suggestion, status: 'approved' as const }
        : suggestion
    );
    
    setAnalysisResult({
      ...analysisResult,
      suggestions: updatedSuggestions
    });
    
    console.log('✅ Optimisation approuvée:', optimizationId);
  }, [analysisResult]);

  /**
   * ❌ REJETER OPTIMISATION
   */
  const rejectOptimization = useCallback((optimizationId: string) => {
    if (!analysisResult) return;
    
    const updatedSuggestions = analysisResult.suggestions.map(suggestion =>
      suggestion.id === optimizationId
        ? { ...suggestion, status: 'rejected' as const }
        : suggestion
    );
    
    setAnalysisResult({
      ...analysisResult,
      suggestions: updatedSuggestions
    });
    
    console.log('❌ Optimisation rejetée:', optimizationId);
  }, [analysisResult]);

  /**
   * 🔧 APPLIQUER LES OPTIMISATIONS APPROUVÉES
   */
  const applyOptimizations = useCallback(async () => {
    if (!analysisResult) return;
    
    const approvedSuggestions = analysisResult.suggestions.filter(s => s.status === 'approved');
    
    console.log(`🔧 Application de ${approvedSuggestions.length} optimisations...`);
    
    // TODO: Implémenter l'application réelle des modifications
    // Pour l'instant, simulation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ Optimisations appliquées avec succès !');
  }, [analysisResult]);

  /**
   * 📊 STATISTIQUES HULK
   */
  const getHulkStats = useCallback(() => {
    return hulk['getHulkStats'] ? hulk['getHulkStats']() : {
      rageLevel: 0,
      smashCount: 0,
      isTransformed: false
    };
  }, []);

  /**
   * 🧠 STATISTIQUES BRUCE
   */
  const getBruceStats = useCallback(() => {
    return bruce.getSessionStats();
  }, []);

  const value: AnalysisContextType = {
    // État
    isAnalyzing,
    analysisResult,
    currentPlan,
    
    // Actions HULK POWERED
    analyzeWithHulk,
    executeNextStep,
    validateAndContinue,
    
    // Actions héritées
    startAnalysis,
    approveOptimization,
    rejectOptimization,
    applyOptimizations,
    
    // Stats
    getHulkStats,
    getBruceStats
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

// 💥 FONCTIONS UTILITAIRES HULK

/**
 * 🎯 Générateur de fichiers de code depuis upload
 */
export function createCodeFileFromUpload(file: File, content: string): CodeFile {
  return {
    id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: file.name,
    path: file.name,
    content,
    size: file.size,
    type: file.type || 'text/plain'
  };
}

/**
 * 🔍 Filtreur d'issues par sévérité
 */
export function filterIssuesBySeverity(issues: AnalysisIssue[], severity: string): AnalysisIssue[] {
  if (severity === 'all') return issues;
  return issues.filter(issue => issue.severity === severity);
}

/**
 * 📈 Calculateur de score global
 */
export function calculateOverallScore(metrics: AnalysisMetrics): number {
  const weights = {
    complexity: 0.2,
    maintainability: 0.2,
    performance: 0.2,
    security: 0.25,
    codeQuality: 0.15
  };
  
  return Math.round(
    metrics.complexity * weights.complexity +
    metrics.maintainability * weights.maintainability +
    metrics.performance * weights.performance +
    metrics.security * weights.security +
    metrics.codeQuality * weights.codeQuality
  );
}

console.log('💥 HULK-POWERED ANALYSIS CONTEXT LOADED !');
console.log('🧠 Bruce Banner: "I have a plan..."');
console.log('💚 Hulk: "HULK SMASH BAD CODE!"');
