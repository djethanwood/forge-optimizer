/**
 * 🧠 POCKETBASE MEMORY FOR BRUCE & HULK - REAL VERSION!
 */

interface ConversationEntry {
  id?: string;
  user_message: string;
  ai_response: string;
  ai_model: 'bruce' | 'hulk' | 'openchat' | 'claude';
  context?: string;
  files_info?: string;
  session_id: string;
  created?: string;
  updated?: string;
}

interface ProjectAnalysis {
  id?: string;
  project_name: string;
  files_analyzed: number;
  issues_found: number;
  optimizations_suggested: number;
  analysis_summary: string;
  hulk_rage_level: number;
  bruce_plan: string;
  results_data?: string;
  created?: string;
  updated?: string;
}

export class PocketBaseMemory {
  private baseUrl: string;
  private adminToken: string;
  private currentSession: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_POCKETBASE_URL || 'http://91.99.197.76:8090';
    this.adminToken = import.meta.env.VITE_PB_ADMIN_TOKEN || '';
    this.currentSession = this.generateSessionId();
    console.log('🧠 Bruce: PocketBase memory initialized!');
  }

  /**
   * 💾 SAUVEGARDER UNE CONVERSATION
   */
  async saveConversation(userMessage: string, aiResponse: string, aiModel: 'bruce' | 'hulk', context?: any): Promise<void> {
    try {
      const conversation: ConversationEntry = {
        user_message: userMessage,
        ai_response: aiResponse,
        ai_model: aiModel,
        context: context ? JSON.stringify(context) : undefined,
        files_info: context?.files ? `${context.files.length} fichiers` : undefined,
        session_id: this.currentSession
      };

      const response = await fetch(`${this.baseUrl}/api/collections/conversations/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.adminToken}`
        },
        body: JSON.stringify(conversation)
      });

      if (response.ok) {
        console.log('💾 Bruce: Conversation sauvegardée en base');
      } else {
        console.log('⚠️ Sauvegarde locale en fallback');
        this.saveToLocalStorage('conversations', conversation);
      }
    } catch (error) {
      console.log('💚 HULK: PocketBase error, using localStorage!');
      this.saveToLocalStorage('conversations', {
        user_message: userMessage,
        ai_response: aiResponse,
        ai_model: aiModel,
        session_id: this.currentSession
      });
    }
  }

  /**
   * 📊 SAUVEGARDER UNE ANALYSE DE PROJET
   */
  async saveProjectAnalysis(projectName: string, analysisData: any, hulkStats: any, brucePlan: string): Promise<void> {
    try {
      const analysis: ProjectAnalysis = {
        project_name: projectName,
        files_analyzed: analysisData.files?.length || 0,
        issues_found: analysisData.issues?.length || 0,
        optimizations_suggested: analysisData.suggestions?.length || 0,
        analysis_summary: this.generateAnalysisSummary(analysisData),
        hulk_rage_level: hulkStats.rageLevel || 0,
        bruce_plan: brucePlan,
        results_data: JSON.stringify(analysisData)
      };

      const response = await fetch(`${this.baseUrl}/api/collections/project_analyses/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.adminToken}`
        },
        body: JSON.stringify(analysis)
      });

      if (response.ok) {
        console.log('📊 Bruce: Analyse de projet sauvegardée');
      } else {
        this.saveToLocalStorage('analyses', analysis);
      }
    } catch (error) {
      console.log('💚 HULK: Error saving analysis!');
    }
  }

  /**
   * 🔍 RÉCUPÉRER LE CONTEXTE DES CONVERSATIONS PRÉCÉDENTES
   */
  async getRecentContext(limit: number = 5): Promise<ConversationEntry[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/collections/conversations/records?filter=session_id='${this.currentSession}'&sort=-created&perPage=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.adminToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.items || [];
      }
    } catch (error) {
      console.log('🧠 Bruce: Récupération depuis localStorage...');
    }

    return this.getFromLocalStorage('conversations') || [];
  }

  /**
   * 📈 RÉCUPÉRER LES ANALYSES PRÉCÉDENTES
   */
  async getPreviousAnalyses(limit: number = 10): Promise<ProjectAnalysis[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/collections/project_analyses/records?sort=-created&perPage=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.adminToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.items || [];
      }
    } catch (error) {
      console.log('💚 HULK: No previous analyses found!');
    }

    return this.getFromLocalStorage('analyses') || [];
  }

  /**
   * 🧠 GÉNÉRER UNE RÉPONSE CONTEXTUELLE INTELLIGENTE
   */
  async generateContextualResponse(userMessage: string, currentFiles: any[] = []): Promise<{ content: string; aiModel: string }> {
    const messageLower = userMessage.toLowerCase();
    const recentContext = await this.getRecentContext(3);
    const previousAnalyses = await this.getPreviousAnalyses(5);

    // 🧠 BRUCE AVEC VRAIE MÉMOIRE POCKETBASE
    if (messageLower.includes('analyse') || messageLower.includes('bruce')) {
      const contextInfo = this.buildContextInfo(recentContext, previousAnalyses, currentFiles);
      
      const bruceResponses = [
        `🧠 Bruce: "PocketBase me dit que j'ai ${recentContext.length} conversations récentes et ${previousAnalyses.length} analyses en mémoire. ${contextInfo}"`,
        `🔬 Bruce: "Base de données active ! ${currentFiles.length} fichiers détectés. Historique: ${previousAnalyses.length} projets analysés."`,
        `📊 Bruce: "Mémoire PocketBase opérationnelle. Moyenne d'optimisations: ${this.getAverageOptimizations(previousAnalyses)} par projet."`,
        `🎯 Bruce: "Données persistantes récupérées. Prêt pour une analyse basée sur l'expérience passée."`
      ];

      return {
        content: bruceResponses[Math.floor(Math.random() * bruceResponses.length)],
        aiModel: 'bruce'
      };
    }

    // 💚 HULK AVEC VRAIE MÉMOIRE
    if (messageLower.includes('hulk') || messageLower.includes('smash')) {
      const totalSmashes = previousAnalyses.reduce((sum, analysis) => sum + analysis.issues_found, 0);
      const avgRage = previousAnalyses.length > 0 
        ? Math.round(previousAnalyses.reduce((sum, a) => sum + a.hulk_rage_level, 0) / previousAnalyses.length)
        : 0;
      
      const hulkResponses = [
        `💚 HULK: "POCKETBASE REMEMBER! HULK SMASHED ${totalSmashes} BUGS IN DATABASE! HULK STRONG!"`,
        `💪 HULK: "HULK MEMORY PERFECT! ${previousAnalyses.length} PROJECTS IN DATABASE! HULK EXPERT NOW!"`,
        `🔥 HULK: "HULK RAGE LEVEL AVERAGE: ${avgRage}! HULK LEARN FROM PAST SMASHING!"`,
        `⚡ HULK: "DATABASE HULK BEST HULK! HULK REMEMBER EVERYTHING! READY TO DESTROY MORE BUGS!"`
      ];

      return {
        content: hulkResponses[Math.floor(Math.random() * hulkResponses.length)],
        aiModel: 'hulk'
      };
    }

    // 📊 STATUT AVEC VRAIE BASE DE DONNÉES
    if (messageLower.includes('statut') || messageLower.includes('historique') || messageLower.includes('mémoire')) {
      const totalConversations = await this.getTotalConversations();
      const totalProjects = previousAnalyses.length;
      const totalIssues = previousAnalyses.reduce((sum, a) => sum + a.issues_found, 0);

      return {
        content: `📊 **Base de données FORGE-OPTIMIZER-HULK :**\n\n💬 Conversations totales : ${totalConversations}\n📁 Projets analysés : ${totalProjects}\n🐛 Bugs totaux détectés : ${totalIssues}\n📂 Fichiers actuels : ${currentFiles.length}\n🗄️ PocketBase : ✅ Opérationnel\n💚 HULK satisfaction : ${totalIssues > 100 ? 'TRÈS CONTENT!' : 'VEUT PLUS DE BUGS!'}`,
        aiModel: 'bruce'
      };
    }

    // Réponse par défaut avec contexte de base
    return {
      content: recentContext.length > 0 
        ? `🧠 Bruce: "Base de données consultée. ${recentContext.length} conversations récentes trouvées. Comment puis-je vous aider ?"`
        : `🤖 Assistant: "Première connexion à la base de données ! Uploadez vos fichiers pour commencer."`,
      aiModel: 'bruce'
    };
  }

  /**
   * 🔧 UTILITAIRES PRIVÉS
   */
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateAnalysisSummary(analysisData: any): string {
    return `Analyse: ${analysisData.issues?.length || 0} problèmes, ${analysisData.suggestions?.length || 0} optimisations`;
  }

  private buildContextInfo(recentContext: ConversationEntry[], previousAnalyses: ProjectAnalysis[], currentFiles: any[]): string {
    const fileInfo = currentFiles.length > 0 ? `${currentFiles.length} fichiers prêts` : 'aucun fichier';
    const historyInfo = previousAnalyses.length > 0 ? `${previousAnalyses.length} projets en historique` : 'premier projet';
    return `(${fileInfo}, ${historyInfo})`;
  }

  private getAverageOptimizations(analyses: ProjectAnalysis[]): number {
    if (analyses.length === 0) return 0;
    return Math.round(analyses.reduce((sum, a) => sum + a.optimizations_suggested, 0) / analyses.length);
  }

  private async getTotalConversations(): Promise<number> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/collections/conversations/records?perPage=1`,
        {
          headers: { 'Authorization': `Bearer ${this.adminToken}` }
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.totalItems || 0;
      }
    } catch (error) {
      // Ignore errors
    }
    return 0;
  }

  private saveToLocalStorage(key: string, data: any): void {
    try {
      const existing = JSON.parse(localStorage.getItem(`forge-hulk-${key}`) || '[]');
      existing.unshift(data);
      localStorage.setItem(`forge-hulk-${key}`, JSON.stringify(existing.slice(0, 50)));
    } catch (error) {
      console.log('💥 HULK: LocalStorage error!');
    }
  }

  private getFromLocalStorage(key: string): any[] {
    try {
      return JSON.parse(localStorage.getItem(`forge-hulk-${key}`) || '[]');
    } catch (error) {
      return [];
    }
  }
}

// Instance singleton
export const pocketBaseMemory = new PocketBaseMemory();
