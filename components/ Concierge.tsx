import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { getGeminiChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat, GenerateContentResponse } from "@google/genai";

export const Concierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Namaste. Welcome to Nainagarh Palace. I am your Royal Concierge. How may I assist you in planning your stay?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      chatSessionRef.current = getGeminiChat();
    }
    scrollToBottom();
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: userMsg });
      const responseText = result.text || "I apologize, I am momentarily unable to respond.";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "I apologize, but I seem to be having trouble connecting to the royal network. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!process.env.API_KEY) return null; // Hide if no key

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 bg-amber-600 text-white hover:bg-amber-700 hover:shadow-amber-600/50'}`}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right border border-amber-100/50 ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10 pointer-events-none'}`} style={{ maxHeight: '600px', height: '80vh' }}>
        
        {/* Header */}
        <div className="bg-rose-950 p-4 flex justify-between items-center text-white shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-400" />
            <h3 className="font-serif font-semibold tracking-wide">Royal Concierge</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:text-amber-200 transition-colors p-1 rounded-full hover:bg-rose-900">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-stone-50 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-amber-600 text-white rounded-br-none' 
                  : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 rounded-bl-none shadow-sm flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-stone-100 flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about rooms, dining, or Varanasi..."
            className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 text-sm transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-rose-900 text-white rounded-full hover:bg-rose-800 disabled:opacity-50 disabled:bg-stone-300 transition-all shadow-md hover:shadow-lg"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
};
