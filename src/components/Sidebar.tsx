/**
 * 💚 HULK CHAT - FIXED VERSION WITH MORE SPACE!
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Zap, Database } from 'lucide-react';
import { pocketBaseMemory } from '../services/hulk/pocketbaseMemory';

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
  const [memoryLoaded, setMemoryLoaded] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const loadPocketBaseMemory = async () => {
      try {
        console.log('🔄 Chargement mémoire PocketBase...');
        const recentContext = await pocketBaseMemory.getRecentContext(1);
        setDbConnected(true);
        
        const welcomeContent = recentContext.length > 0
          ? `🧠 Bruce: "PocketBase connecté ! ${recentContext.length} conversations en mémoire."\n💚 HULK: "HULK REMEMBER EVERYTHING FROM DATABASE!"`
          : currentFiles.length > 0
          ? `🧠 Bruce: "Base de données prête ! ${currentFiles.length} fichiers détectés."\n💚 HULK: "HULK DATABASE READY TO SMASH!"`
          : `🧠 Bruce: "PocketBase opérationnel ! Prêt à mémoriser."\n💚 HULK: "HULK DATABASE HULK!"`;

        const welcomeMessage: Message = {
          id: 'welcome',
          type: 'ai',
          content: welcomeContent,
          timestamp: new Date(),
          aiModel: 'bruce'
        };
        
        setMessages([welcomeMessage]);
        setMemoryLoaded(true);
        console.log('✅ Mémoire PocketBase chargée');
      } catch (error) {
        console.error('💥 HULK: PocketBase error:', error);
        setDbConnected(false);
        
        const fallbackMessage: Message = {
          id: 'fallback',
          type: 'ai',
          content: '🧠 Bruce: "PocketBase déconnecté, mode local activé."\n💚 HULK: "HULK WORK WITHOUT DATABASE TOO!"',
          timestamp: new Date(),
          aiModel: 'bruce'
        };
        
        setMessages([fallbackMessage]);
        setMemoryLoaded(true);
      }
    };

    loadPocketBaseMemory();
  }, [currentFiles]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    console.log('📤 Envoi message:', inputMessage.trim());

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);

    try {
      console.log('🤖 Génération réponse IA...');
      
      let aiResponse;
      if (dbConnected) {
        aiResponse = await pocketBaseMemory.generateContextualResponse(messageContent, currentFiles);
      } else {
        // Fallback simple si PocketBase ne marche pas
        aiResponse = {
          content: messageContent.toLowerCase().includes('hulk') 
            ? '💚 HULK: "HULK SMASH BUT NO DATABASE! HULK STILL STRONG!"'
            : '🧠 Bruce: "Mode local actif. PocketBase déconnecté."',
          aiModel: messageContent.toLowerCase().includes('hulk') ? 'hulk' : 'bruce'
        };
      }
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        aiModel: aiResponse.aiModel
      };

      setMessages(prev => [...prev, aiMessage]);
      console.log('✅ Réponse IA ajoutée');
      
    } catch (error) {
      console.error('💥 HULK ERROR:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'ai',
        content: '💥 HULK: "ERROR BUT HULK STILL HERE! TRY AGAIN!"',
        timestamp: new Date(),
        aiModel: 'hulk'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    // Shift+Enter = nouvelle ligne (comportement par défaut du textarea)
  };

  const getAIIcon = (aiModel?: string) => {
    return aiModel === 'hulk' ? '💚' : '🧠';
  };

  const getAIColor = (aiModel?: string) => {
    return aiModel === 'hulk' ? 'text-green-400' : 'text-purple-400';
  };

  return (
    <div className="w-96 h-full flex flex-col border-r border-gray-700 bg-gray-900 text-white">
      {/* Header avec plus d'infos */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <Brain className="w-5 h-5 text-purple-400" />
            <Zap className="w-5 h-5 text-green-400" />
            <Database className={`w-4 h-4 ${dbConnected ? 'text-green-400' : 'text-red-400'}`} />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Assistant IA</h2>
            <p className="text-sm text-gray-400">
              Bruce et HULK {dbConnected ? '(PocketBase ✅)' : '(Local ❌)'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages avec scroll amélioré */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-3 rounded-lg ${
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

        {/* Typing indicator amélioré */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span>{dbConnected ? 'Consultation PocketBase...' : 'Traitement local...'}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input avec textarea pour multilignes */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message... (Shift+Entrée = nouvelle ligne)"
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
