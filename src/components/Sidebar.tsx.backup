import React, { useState, useEffect } from 'react';
import { Send, Bot, User, Zap } from 'lucide-react';
import { useAnalysis } from '../contexts/AnalysisContext';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  isProgress?: boolean;
  tool?: string;
  progress?: number;
}

const Sidebar: React.FC = () => {
  const { state } = useAnalysis();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Bonjour ! Je suis votre assistant IA pour l\'optimisation de code. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Listen for analysis updates
  useEffect(() => {
    const handleAnalysisUpdate = (event: CustomEvent) => {
      const { tool, progress, message } = event.detail;
      
      setMessages(prev => {
        // Remove previous progress message for the same tool
        const filtered = prev.filter(m => !(m.isProgress && m.tool === tool));
        
        return [...filtered, {
          id: Date.now().toString(),
          type: 'system',
          content: message,
          timestamp: new Date(),
          isProgress: true,
          tool,
          progress: Math.round(progress),
        }];
      });
    };

    window.addEventListener('analysisUpdate', handleAnalysisUpdate as EventListener);
    return () => window.removeEventListener('analysisUpdate', handleAnalysisUpdate as EventListener);
  }, []);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response with real-time typing effect
    setTimeout(() => {
      const response = generateAIResponse(inputMessage, state);
      
      // Add typing indicator
      const typingId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: typingId,
        type: 'ai',
        content: '...',
        timestamp: new Date(),
      }]);

      // Simulate typing effect
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === typingId 
            ? { ...m, content: response }
            : m
        ));
      }, 1000);
    }, 500);

    setInputMessage('');
  };

  const getMessageIcon = (message: ChatMessage) => {
    if (message.type === 'ai') {
      return <Bot className="w-3 h-3 text-white" />;
    } else if (message.type === 'user') {
      return <User className="w-3 h-3 text-white" />;
    } else if (message.isProgress) {
      return <Zap className="w-3 h-3 text-white" />;
    }
    return <Bot className="w-3 h-3 text-white" />;
  };

  const getMessageBgColor = (message: ChatMessage) => {
    if (message.type === 'ai') return 'bg-blue-600';
    if (message.type === 'user') return 'bg-green-600';
    if (message.isProgress) return 'bg-purple-600';
    return 'bg-gray-600';
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div key={message.id}>
            {message.type === 'user' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">Vous</span>
                  <div className={`w-6 h-6 ${getMessageBgColor(message)} rounded-full flex items-center justify-center flex-shrink-0`}>
                    {getMessageIcon(message)}
                  </div>
                </div>
                <div className="mr-8 bg-blue-600 rounded-lg p-3">
                  <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 ${getMessageBgColor(message)} rounded-full flex items-center justify-center flex-shrink-0`}>
                    {getMessageIcon(message)}
                  </div>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {message.isProgress ? 'Système' : 'Assistant IA'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="ml-8">
                  <div className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    message.isProgress 
                      ? 'text-purple-800 dark:text-purple-200 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-2 border-purple-500'
                      : 'text-gray-800 dark:text-gray-200'
                  }`}>
                    {message.content}
                    {message.isProgress && message.progress && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span>Progression</span>
                          <span>{message.progress}%</span>
                        </div>
                        <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${message.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input - Zone de saisie avec bouton intégré et bien positionné */}
      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="relative">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Posez votre question..."
            rows={3}
            className="w-full pr-14 px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            style={{ minHeight: '80px', maxHeight: '120px' }}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim()}
            className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

function generateAIResponse(userMessage: string, state: any): string {
  const message = userMessage.toLowerCase();
  
  if (message.includes('optimisation') || message.includes('optimization')) {
    return `🚀 L'optimisation de code consiste à améliorer les performances, la lisibilité et la maintenabilité de votre code.

Je peux vous aider à :
• 📊 Identifier les problèmes de performance
• 🛡️ Détecter les vulnérabilités de sécurité  
• 🎨 Améliorer la structure du code
• ⚡ Optimiser les algorithmes
• 🔧 Réduire la complexité

📈 Actuellement, j'ai analysé ${state.files.length} fichier(s) et détecté ${state.issues.length} problème(s) avec ${state.suggestions.length} suggestion(s) d'amélioration.

Que souhaitez-vous optimiser en priorité ?`;
  }
  
  if (message.includes('performance')) {
    return `⚡ Pour améliorer les performances de votre code, voici mes recommandations :

🚀 **Optimisations React :**
• Utilisez React.memo() pour éviter les re-rendus inutiles
• Implémentez useMemo() et useCallback() pour les calculs coûteux
• Lazy loading avec React.lazy() et Suspense

💨 **Optimisations JavaScript :**
• Évitez les boucles imbriquées complexes
• Utilisez Map/Set au lieu d'objets pour les recherches
• Préférez les méthodes natives (filter, map, reduce)

📊 **Métriques actuelles :**
Performance : ${state.metrics?.performance || 0}/100
Complexité : ${state.metrics?.complexity || 0}/100

Voulez-vous que j'analyse un aspect spécifique ?`;
  }
  
  if (message.includes('sécurité') || message.includes('security')) {
    return `🛡️ La sécurité de votre code est cruciale. Voici ce que je vérifie :

🔒 **Vulnérabilités communes :**
• Injections XSS et CSRF
• Validation des entrées utilisateur
• Gestion sécurisée des tokens
• Exposition de données sensibles

✅ **Bonnes pratiques :**
• Sanitisation des données
• Authentification robuste
• Chiffrement des communications
• Gestion des erreurs sécurisée

📈 **Score sécurité actuel :** ${state.metrics?.security || 0}/100

🚨 ${state.issues.filter((i: any) => i.category === 'security').length} problème(s) de sécurité détecté(s).

Souhaitez-vous plus de détails sur un point spécifique ?`;
  }
  
  if (message.includes('erreur') || message.includes('error') || message.includes('problème')) {
    const errorCount = state.issues.filter((i: any) => i.severity === 'error').length;
    const warningCount = state.issues.filter((i: any) => i.severity === 'warning').length;
    
    return `🔍 J'ai analysé votre code et détecté :

❌ **${errorCount} erreur(s) critique(s)**
⚠️ **${warningCount} avertissement(s)**

📊 **Répartition par catégorie :**
• Performance : ${state.issues.filter((i: any) => i.category === 'performance').length}
• Sécurité : ${state.issues.filter((i: any) => i.category === 'security').length}  
• Style : ${state.issues.filter((i: any) => i.category === 'style').length}
• Complexité : ${state.issues.filter((i: any) => i.category === 'complexity').length}

✨ La plupart des avertissements peuvent être corrigés automatiquement. Voulez-vous que je vous explique les erreurs les plus critiques ?`;
  }
  
  if (message.includes('comment') || message.includes('how') || message.includes('aide')) {
    return `💡 Je peux vous aider de plusieurs façons :

🔍 **Analyse de code :**
• Détection automatique des problèmes
• Suggestions d'optimisation personnalisées
• Métriques de qualité en temps réel

🔧 **Optimisations :**
• Performance et vitesse d'exécution
• Sécurité et vulnérabilités
• Lisibilité et maintenabilité
• Architecture et structure

📋 **Processus :**
1. Uploadez vos fichiers de code
2. L'analyse se lance automatiquement
3. Consultez les suggestions
4. Validez les changements souhaités
5. Téléchargez le code optimisé

Quelle étape vous pose problème ? Je peux vous guider pas à pas.`;
  }

  if (message.includes('merci') || message.includes('thank')) {
    return `🙏 De rien ! Je suis là pour vous aider à optimiser votre code.

N'hésitez pas à me poser d'autres questions sur :
• 📊 Les suggestions d'optimisation
• 📈 Les métriques de qualité
• ✅ Les bonnes pratiques
• 🔍 L'interprétation des résultats

Votre code mérite d'être parfait ! 🚀`;
  }

  if (message.includes('analyse') || message.includes('analyser')) {
    return `🔍 **Analyse en cours de votre projet !**

Je vais examiner votre code avec mes outils professionnels :

🛠️ **Outils d'analyse :**
• ESLint - Analyse statique du code
• Prettier - Formatage et style
• TypeScript - Vérification des types
• CodeLlama 13B - Intelligence artificielle
• Madge - Analyse des dépendances
• Bundle Analyzer - Optimisation des bundles

⏱️ **Temps estimé :** 2-3 minutes

Vous verrez la progression en temps réel ici même. Je vous tiendrai informé de chaque étape !`;
  }
  
  return `🤖 Je suis votre assistant IA spécialisé dans l'optimisation de code. 

Je peux vous aider avec :
• 📊 **Analyse de performance** - Identifier les goulots d'étranglement
• 🛡️ **Sécurité** - Détecter les vulnérabilités
• 🎨 **Qualité du code** - Améliorer la lisibilité et la maintenabilité
• ✅ **Bonnes pratiques** - Respecter les standards de développement

Posez-moi une question spécifique sur votre code ou demandez-moi d'expliquer une suggestion d'optimisation !`;
}

export default Sidebar;