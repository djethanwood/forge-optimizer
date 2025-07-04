/**
 * 💚 HULK CHAT - NO MORE POCKETBASE SPAM!
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Zap } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  aiModel?: string;
}

interface SidebarProps {
  language?: string;
  theme?: 'light' | 'dark';
  currentFiles?: any[];
}

export default function Sidebar({ language = 'fr', theme = 'dark', currentFiles = [] }: SidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Message de bienvenue UNIQUE (pas de loop!)
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome-static',
      type: 'ai',
      content: '🧠 Bruce: "Chat fonctionnel ! Plus de spam PocketBase."\n💚 HULK: "HULK STOP INFINITE LOOP! HULK SMART!"',
      timestamp: new Date(),
      aiModel: 'bruce'
    };
    
    // Vérifier si déjà ajouté pour éviter les doublons
    setMessages(prev => {
      if (prev.length === 0) {
        return [welcomeMessage];
      }
      return prev;
    });
  }, []); // Dépendances vides = une seule fois !

  const getResponse = (userMessage: string): { content: string; aiModel: string } => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('analyse') || msg.includes('analyser')) {
      return {
        content: currentFiles.length > 0 
          ? `🧠 Bruce: "Je vois ${currentFiles.length} fichiers. Utilisez le bouton 'Analyser' dans l'interface principale."` 
          : '🧠 Bruce: "Uploadez d\'abord vos fichiers dans l\'interface principale."',
        aiModel: 'bruce'
      };
    }
    
    if (msg.includes('hulk')) {
      return {
        content: '💚 HULK: "HULK NO MORE SPAM! HULK LEARNED! HULK GOOD BOY!"',
        aiModel: 'hulk'
      };
    }
    
    if (msg.includes('spam') || msg.includes('console')) {
      return {
        content: '🧠 Bruce: "Problème de spam résolu ! Plus de requêtes infinies PocketBase."',
        aiModel: 'bruce'
      };
    }
    
    if (msg.includes('statut')) {
      return {
        content: `📊 **Statut :**\n📁 Fichiers : ${currentFiles.length}\n🧠 Bruce : Opérationnel\n💚 HULK : Pas de spam\n✅ Console : Propre`,
        aiModel: 'bruce'
      };
    }
    
    const responses = [
      '🧠 Bruce: "Comment puis-je vous aider ?"',
      '💚 HULK: "HULK LISTEN! WHAT YOU NEED?"',
      '🤖 "Utilisez l\'interface pour analyser vos fichiers."'
    ];
    
    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      aiModel: Math.random() > 0.5 ? 'bruce' : 'hulk'
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random()}`,
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);

    // Délai court
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const aiResponse = getResponse(messageContent);
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}-${Math.random()}`,
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        aiModel: aiResponse.aiModel
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAIIcon = (aiModel?: string) => {
    return aiModel === 'hulk' ? '💚' : '🧠';
  };

  const getAIColor = (aiModel?: string) => {
    return aiModel === 'hulk' ? 'text-green-400' : 'text-purple-400';
  };

  return (
    <div className="w-[450px] h-full flex flex-col border-r border-gray-700 bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <Brain className="w-5 h-5 text-purple-400" />
            <Zap className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Assistant IA</h2>
            <p className="text-sm text-gray-400">Bruce et HULK (Sans spam!)</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[95%] p-3 rounded-lg ${
              message.type === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 border border-gray-700'
            }`}>
              {message.type === 'ai' && (
                <div className={`text-xs ${getAIColor(message.aiModel)} mb-2 flex items-center space-x-1`}>
                  <span>{getAIIcon(message.aiModel)}</span>
                  <span>{message.aiModel === 'hulk' ? 'HULK' : 'BRUCE'}</span>
                </div>
              )}
              
              <div className="text-sm whitespace-pre-line break-words">{message.content}</div>
              
              <div className="text-xs text-gray-500 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span>Réflexion...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Chat sans spam PocketBase..."
            disabled={isTyping}
            rows={2}
            className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Entrée = envoi • Shift+Entrée = nouvelle ligne
        </div>
      </div>
    </div>
  );
}
