import React, { createContext, useContext, useState, useCallback } from 'react';

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

export interface AnalysisState {
  files: CodeFile[];
  currentStep: 'upload' | 'analysis' | 'suggestions' | 'validation' | 'export';
  isAnalyzing: boolean;
  analysisProgress: number;
  currentTool: string;
  issues: AnalysisIssue[];
  suggestions: OptimizationSuggestion[];
  metrics: AnalysisMetrics;
  projectType: string;
  language: string;
}

interface AnalysisContextType {
  state: AnalysisState;
  uploadFiles: (files: File[]) => Promise<void>;
  startAnalysis: () => Promise<void>;
  approveSuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;
  exportOptimizedCode: () => void;
  setCurrentStep: (step: AnalysisState['currentStep']) => void;
  resetAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

const initialState: AnalysisState = {
  files: [],
  currentStep: 'upload',
  isAnalyzing: false,
  analysisProgress: 0,
  currentTool: '',
  issues: [],
  suggestions: [],
  metrics: {
    complexity: 0,
    maintainability: 0,
    performance: 0,
    security: 0,
    codeQuality: 0,
    testCoverage: 0,
    duplicateCode: 0,
    technicalDebt: 0,
  },
  projectType: '',
  language: '',
};

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AnalysisState>(initialState);

  const uploadFiles = useCallback(async (files: File[]) => {
    const codeFiles: CodeFile[] = [];
    
    for (const file of files) {
      const content = await file.text();
      codeFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        path: file.name,
        content,
        size: file.size,
        type: file.type || 'text/plain',
      });
    }

    // Detect project type and language
    const projectType = detectProjectType(codeFiles);
    const language = detectLanguage(codeFiles);

    setState(prev => ({
      ...prev,
      files: codeFiles,
      projectType,
      language,
      currentStep: 'analysis',
    }));
  }, []);

  const startAnalysis = useCallback(async () => {
    setState(prev => ({ ...prev, isAnalyzing: true, analysisProgress: 0 }));

    const tools = ['ESLint', 'Prettier', 'CodeLlama 13B', 'Madge'];
    
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      setState(prev => ({ ...prev, currentTool: tool }));
      
      // Simulate analysis time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      const progress = ((i + 1) / tools.length) * 100;
      setState(prev => ({ ...prev, analysisProgress: progress }));
    }

    // Generate realistic issues and suggestions
    const issues = generateRealisticIssues(state.files);
    const suggestions = generateOptimizationSuggestions(state.files);
    const metrics = calculateMetrics(state.files, issues);

    setState(prev => ({
      ...prev,
      isAnalyzing: false,
      issues,
      suggestions,
      metrics,
      currentStep: 'suggestions',
      currentTool: '',
    }));
  }, [state.files]);

  const approveSuggestion = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      suggestions: prev.suggestions.map(s => 
        s.id === id ? { ...s, status: 'approved' as const } : s
      ),
    }));
  }, []);

  const rejectSuggestion = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      suggestions: prev.suggestions.map(s => 
        s.id === id ? { ...s, status: 'rejected' as const } : s
      ),
    }));
  }, []);

  const exportOptimizedCode = useCallback(() => {
    // Simulate export process
    setState(prev => ({ ...prev, currentStep: 'export' }));
  }, []);

  const setCurrentStep = useCallback((step: AnalysisState['currentStep']) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const resetAnalysis = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <AnalysisContext.Provider value={{
      state,
      uploadFiles,
      startAnalysis,
      approveSuggestion,
      rejectSuggestion,
      exportOptimizedCode,
      setCurrentStep,
      resetAnalysis,
    }}>
      {children}
    </AnalysisContext.Provider>
  );
};

// Helper functions
function detectProjectType(files: CodeFile[]): string {
  const hasPackageJson = files.some(f => f.name === 'package.json');
  const hasReactFiles = files.some(f => f.content.includes('import React') || f.content.includes('from "react"'));
  const hasVueFiles = files.some(f => f.name.endsWith('.vue'));
  const hasAngularFiles = files.some(f => f.content.includes('@angular/'));
  const hasPythonFiles = files.some(f => f.name.endsWith('.py'));

  if (hasReactFiles) return 'React';
  if (hasVueFiles) return 'Vue.js';
  if (hasAngularFiles) return 'Angular';
  if (hasPackageJson) return 'Node.js';
  if (hasPythonFiles) return 'Python';
  return 'JavaScript';
}

function detectLanguage(files: CodeFile[]): string {
  const hasTypeScript = files.some(f => f.name.endsWith('.ts') || f.name.endsWith('.tsx'));
  const hasPython = files.some(f => f.name.endsWith('.py'));
  const hasJava = files.some(f => f.name.endsWith('.java'));
  
  if (hasTypeScript) return 'TypeScript';
  if (hasPython) return 'Python';
  if (hasJava) return 'Java';
  return 'JavaScript';
}

function generateRealisticIssues(files: CodeFile[]): AnalysisIssue[] {
  const issues: AnalysisIssue[] = [];
  
  files.forEach(file => {
    const lines = file.content.split('\n');
    
    // Generate realistic issues based on file content
    lines.forEach((line, index) => {
      if (line.includes('console.log')) {
        issues.push({
          id: Math.random().toString(36).substr(2, 9),
          file: file.name,
          line: index + 1,
          column: line.indexOf('console.log') + 1,
          severity: 'warning',
          category: 'style',
          message: 'Unexpected console statement',
          rule: 'no-console',
          tool: 'eslint',
          suggestion: 'Remove console.log or use a proper logging library',
          impact: 'low',
        });
      }
      
      if (line.includes('var ')) {
        issues.push({
          id: Math.random().toString(36).substr(2, 9),
          file: file.name,
          line: index + 1,
          column: line.indexOf('var ') + 1,
          severity: 'warning',
          category: 'style',
          message: 'Unexpected var, use let or const instead',
          rule: 'no-var',
          tool: 'eslint',
          suggestion: 'Replace var with let or const',
          impact: 'medium',
        });
      }
      
      if (line.length > 120) {
        issues.push({
          id: Math.random().toString(36).substr(2, 9),
          file: file.name,
          line: index + 1,
          column: 121,
          severity: 'warning',
          category: 'style',
          message: 'Line too long (exceeds 120 characters)',
          rule: 'max-len',
          tool: 'prettier',
          suggestion: 'Break line into multiple lines',
          impact: 'low',
        });
      }
    });
  });
  
  return issues;
}

function generateOptimizationSuggestions(files: CodeFile[]): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];
  
  files.forEach(file => {
    if (file.content.includes('useEffect')) {
      suggestions.push({
        id: Math.random().toString(36).substr(2, 9),
        file: file.name,
        title: 'Optimize useEffect dependencies',
        description: 'Add missing dependencies to useEffect hook to prevent stale closures',
        category: 'performance',
        impact: 'medium',
        effort: 'low',
        originalCode: 'useEffect(() => {\n  fetchData();\n}, []);',
        optimizedCode: 'useEffect(() => {\n  fetchData();\n}, [fetchData]);',
        lineStart: 10,
        lineEnd: 12,
        status: 'pending',
        estimatedImprovement: '15% better performance',
      });
    }
    
    if (file.content.includes('map') && file.content.includes('filter')) {
      suggestions.push({
        id: Math.random().toString(36).substr(2, 9),
        file: file.name,
        title: 'Combine map and filter operations',
        description: 'Reduce array iterations by combining map and filter into a single reduce operation',
        category: 'performance',
        impact: 'high',
        effort: 'medium',
        originalCode: 'items.filter(item => item.active).map(item => item.name)',
        optimizedCode: 'items.reduce((acc, item) => item.active ? [...acc, item.name] : acc, [])',
        lineStart: 25,
        lineEnd: 25,
        status: 'pending',
        estimatedImprovement: '30% faster execution',
      });
    }
  });
  
  return suggestions;
}

function calculateMetrics(files: CodeFile[], issues: AnalysisIssue[]): AnalysisMetrics {
  const totalLines = files.reduce((acc, file) => acc + file.content.split('\n').length, 0);
  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  
  return {
    complexity: Math.max(10, 100 - (errorCount * 5) - (warningCount * 2)),
    maintainability: Math.max(15, 95 - (errorCount * 3) - (warningCount * 1)),
    performance: Math.max(20, 90 - (issues.filter(i => i.category === 'performance').length * 10)),
    security: Math.max(25, 85 - (issues.filter(i => i.category === 'security').length * 15)),
    codeQuality: Math.max(30, 88 - (errorCount * 4) - (warningCount * 1.5)),
    testCoverage: Math.floor(Math.random() * 40) + 60,
    duplicateCode: Math.floor(Math.random() * 15) + 5,
    technicalDebt: Math.floor(Math.random() * 20) + 10,
  };
}