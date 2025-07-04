/**
 * 🧠 BRUCE BANNER - Le Cerveau Orchestrateur
 * Planification intelligente et coordination des analyses
 */

export interface AnalysisTask {
  id: string;
  type: 'clarification' | 'technical_analysis' | 'optimization' | 'application';
  status: 'pending' | 'running' | 'completed' | 'failed';
  input: any;
  output?: any;
  startTime?: number;
  duration?: number;
  aiModel?: 'openchat' | 'codellama' | 'claude';
}

export interface BrucePlan {
  sessionId: string;
  userRequest: string;
  tasks: AnalysisTask[];
  currentStep: number;
  totalSteps: number;
  estimatedDuration: number;
  validationPoints: string[];
}

export class BruceBanner {
  private currentPlan: BrucePlan | null = null;
  private sessionHistory: Map<string, BrucePlan> = new Map();

  /**
   * 🧠 BRUCE ANALYSE ET PLANIFIE
   * Analyse la demande utilisateur et crée un plan d'action intelligent
   */
  async analyzeDemandAndCreatePlan(userRequest: string, files: any[]): Promise<BrucePlan> {
    console.log('🧠 Bruce analyse la demande:', userRequest);
    
    const sessionId = this.generateSessionId();
    const plan: BrucePlan = {
      sessionId,
      userRequest,
      tasks: [],
      currentStep: 0,
      totalSteps: 0,
      estimatedDuration: 0,
      validationPoints: []
    };

    // 🧠 ÉTAPE 1: Analyser le type de demande
    const demandType = this.classifyDemand(userRequest, files);
    
    // 🧠 ÉTAPE 2: Créer les tâches selon le type
    plan.tasks = this.createTaskSequence(demandType, files);
    plan.totalSteps = plan.tasks.length;
    plan.estimatedDuration = this.estimateDuration(plan.tasks);
    
    // 🧠 ÉTAPE 3: Définir les points de validation
    plan.validationPoints = this.defineValidationPoints(plan.tasks);
    
    this.currentPlan = plan;
    this.sessionHistory.set(sessionId, plan);
    
    console.log('🧠 Bruce a créé un plan:', plan);
    return plan;
  }

  /**
   * 🧠 CLASSIFICATION INTELLIGENTE DES DEMANDES
   */
  private classifyDemand(request: string, files: any[]): string {
    const requestLower = request.toLowerCase();
    
    // Analyse du contenu
    if (requestLower.includes('optimize') || requestLower.includes('améliore')) {
      return 'optimization';
    }
    if (requestLower.includes('analyze') || requestLower.includes('analyse')) {
      return 'analysis';
    }
    if (requestLower.includes('create') || requestLower.includes('generate') || requestLower.includes('crée')) {
      return 'generation';
    }
    if (requestLower.includes('fix') || requestLower.includes('debug') || requestLower.includes('correct')) {
      return 'debugging';
    }
    
    // Analyse des fichiers
    if (files.length === 0) {
      return 'generation';
    }
    
    return 'analysis'; // Par défaut
  }

  /**
   * 🧠 CRÉATION DE LA SÉQUENCE DE TÂCHES
   */
  private createTaskSequence(demandType: string, files: any[]): AnalysisTask[] {
    const tasks: AnalysisTask[] = [];
    const baseId = Date.now().toString();
    
    // TOUJOURS: Clarification OpenChat
    tasks.push({
      id: `${baseId}-1`,
      type: 'clarification',
      status: 'pending',
      input: { demandType, files },
      aiModel: 'openchat'
    });

    // Selon le type de demande
    switch (demandType) {
      case 'optimization':
      case 'analysis':
      case 'debugging':
        // Analyse technique complète
        tasks.push({
          id: `${baseId}-2`,
          type: 'technical_analysis',
          status: 'pending',
          input: { files },
          aiModel: 'codellama'
        });
        
        // Propositions d'optimisation
        tasks.push({
          id: `${baseId}-3`,
          type: 'optimization',
          status: 'pending',
          input: { analysisResults: null }, // Sera rempli par l'étape précédente
          aiModel: 'claude'
        });
        break;
        
      case 'generation':
        // Génération directe avec Claude
        tasks.push({
          id: `${baseId}-2`,
          type: 'optimization',
          status: 'pending',
          input: { generationRequest: true },
          aiModel: 'claude'
        });
        break;
    }

    // TOUJOURS: Application des modifications
    tasks.push({
      id: `${baseId}-${tasks.length + 1}`,
      type: 'application',
      status: 'pending',
      input: { modifications: null }
    });

    return tasks;
  }

  /**
   * 🧠 ESTIMATION DE DURÉE
   */
  private estimateDuration(tasks: AnalysisTask[]): number {
    const baseTimes = {
      clarification: 3000,      // 3 secondes
      technical_analysis: 15000, // 15 secondes  
      optimization: 10000,      // 10 secondes
      application: 5000         // 5 secondes
    };

    return tasks.reduce((total, task) => {
      return total + (baseTimes[task.type] || 5000);
    }, 0);
  }

  /**
   * 🧠 DÉFINITION DES POINTS DE VALIDATION
   */
  private defineValidationPoints(tasks: AnalysisTask[]): string[] {
    const validations: string[] = [];
    
    // Validation après clarification
    if (tasks.some(t => t.type === 'clarification')) {
      validations.push("L'IA a bien compris votre demande ?");
    }
    
    // Validation avant application
    if (tasks.some(t => t.type === 'application')) {
      validations.push("Quelles modifications appliquer au code ?");
    }
    
    return validations;
  }

  /**
   * 🧠 EXÉCUTION DU PLAN ÉTAPE PAR ÉTAPE
   */
  async executeNextStep(): Promise<{ task: AnalysisTask; needsValidation: boolean; validationMessage?: string }> {
    if (!this.currentPlan) {
      throw new Error('Aucun plan en cours');
    }

    const currentTask = this.currentPlan.tasks[this.currentPlan.currentStep];
    if (!currentTask) {
      throw new Error('Toutes les étapes sont terminées');
    }

    console.log('🧠 Bruce exécute l\'étape:', currentTask.type);
    
    // Marquer comme en cours
    currentTask.status = 'running';
    currentTask.startTime = Date.now();
    
    // Ici, Bruce va déléguer à HULK pour l'exécution
    // (HULK sera créé dans le prochain fichier)
    
    // Simuler l'exécution pour l'instant
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    currentTask.status = 'completed';
    currentTask.duration = Date.now() - (currentTask.startTime || 0);
    
    // Passer à l'étape suivante
    this.currentPlan.currentStep++;
    
    // Vérifier si validation nécessaire
    const needsValidation = this.needsValidationAtThisStep();
    const validationMessage = needsValidation ? this.currentPlan.validationPoints[0] : undefined;
    
    return {
      task: currentTask,
      needsValidation,
      validationMessage
    };
  }

  /**
   * 🧠 VÉRIFICATION DES BESOINS DE VALIDATION
   */
  private needsValidationAtThisStep(): boolean {
    if (!this.currentPlan) return false;
    
    const currentStep = this.currentPlan.currentStep;
    const tasks = this.currentPlan.tasks;
    
    // Validation après clarification (étape 1)
    if (currentStep === 1) return true;
    
    // Validation avant application (dernière étape)
    if (currentStep === tasks.length - 1) return true;
    
    return false;
  }

  /**
   * 🧠 OBTENIR L'ÉTAT ACTUEL
   */
  getCurrentPlan(): BrucePlan | null {
    return this.currentPlan;
  }

  /**
   * 🧠 OBTENIR LES STATISTIQUES
   */
  getSessionStats() {
    return {
      totalSessions: this.sessionHistory.size,
      currentPlan: this.currentPlan,
      averageDuration: this.calculateAverageDuration()
    };
  }

  /**
   * 🧠 UTILITAIRES
   */
  private generateSessionId(): string {
    return `bruce-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateAverageDuration(): number {
    const completedPlans = Array.from(this.sessionHistory.values())
      .filter(plan => plan.currentStep === plan.totalSteps);
    
    if (completedPlans.length === 0) return 0;
    
    const totalDuration = completedPlans.reduce((sum, plan) => {
      return sum + plan.estimatedDuration;
    }, 0);
    
    return totalDuration / completedPlans.length;
  }

  /**
   * 🧠 RESET POUR NOUVELLE SESSION
   */
  resetCurrentPlan(): void {
    this.currentPlan = null;
  }
}

// Instance singleton de Bruce
export const bruce = new BruceBanner();
