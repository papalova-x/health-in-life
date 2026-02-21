import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getGeminiResponse } from '../services/gemini';
import { cn } from '../lib/utils';
import { Howl } from 'howler';

const popSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'],
  volume: 0.5
});

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Halo, aku MindEase. Aku di sini untuk mendengarkanmu. Apa yang sedang kamu rasakan hari ini? Kamu bisa curhat apa saja padaku.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    popSound.play();

    try {
      // 1. Try Local Database API first
      const localResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      
      const localData = await localResponse.json();
      
      if (localData.answer) {
        setMessages(prev => [...prev, { role: 'model', text: localData.answer }]);
        popSound.play();
        setIsLoading(false);
        return;
      }

      // 2. Fallback to Gemini if not found in local DB
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await getGeminiResponse(userMsg, history);
      setMessages(prev => [...prev, { role: 'model', text: response || 'Maaf, aku sedang kesulitan memproses itu.' }]);
      popSound.play();
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sepertinya ada masalah koneksi. Coba lagi nanti ya.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto w-full glass rounded-3xl overflow-hidden">
      <div className="p-6 border-bottom border-sage-200 bg-sage-100/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sage-500 flex items-center justify-center text-white">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-sage-800">MindEase Chat</h2>
            <p className="text-xs text-sage-600">Selalu ada untukmu</p>
          </div>
        </div>
        <Sparkles className="text-sage-400 animate-pulse" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex w-full",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl flex gap-3",
                msg.role === 'user' 
                  ? "bg-sage-600 text-white rounded-tr-none" 
                  : "bg-white text-sage-800 rounded-tl-none border border-sage-100 shadow-sm"
              )}>
                {msg.role === 'model' && <Bot size={18} className="shrink-0 mt-1 opacity-50" />}
                <div className="markdown-body text-sm">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                {msg.role === 'user' && <User size={18} className="shrink-0 mt-1 opacity-50" />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-sage-100 shadow-sm flex items-center gap-2">
              <Loader2 size={18} className="animate-spin text-sage-400" />
              <span className="text-sm text-sage-400 italic">Sedang berpikir...</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-sage-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ketik curhatanmu di sini..."
            className="flex-1 bg-sage-50 border-none rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-sage-300 outline-none transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 rounded-full bg-sage-600 text-white flex items-center justify-center hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
