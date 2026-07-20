import React, { useState, useEffect, useRef } from 'react';
import { Send, Droplets, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Poradce() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 1. Inicializace konverzace s agentem při načtení komponenty
  useEffect(() => {
    async function startChat() {
      setLoading(true);
      try {
        const conv = await base44.agents.createConversation({
          agent_name: 'produktovy_poradce', // Název vašeho agenta v Base44
        });
        setConversation(conv);
      } catch (error) {
        console.error('Chyba při zakládání konverzace v Base44:', error);
      } finally {
        setLoading(false);
      }
    }
    startChat();
  }, []);

  // 2. Real-time odběr (WebSocket) na zprávy z Base44
  useEffect(() => {
    if (!conversation?.id) return;

    // Přihlášení k odběru změn (streamování zpráv)
    const unsubscribe = base44.agents.subscribeToConversation(
      conversation.id,
      (data) => {
        setMessages(data.messages || []);
        setLoading(false);
      }
    );

    // Správné vyčištění spojení (cleanup) při odchodu z komponenty
    return () => unsubscribe();
  }, [conversation?.id]);

  // Automatické scrollování na nejnovější zprávy
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // 3. Odeslání zprávy uživatele přes SDK
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !conversation || loading) return;

    const userText = input.trim();
    setInput('');
    setLoading(true);

    try {
      await base44.agents.addMessage(conversation, {
        role: 'user',
        content: userText,
      });
    } catch (error) {
      console.error('Chyba při odesílání zprávy:', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[550px]">
        {/* Hlavička */}
        <div className="p-4 bg-slate-900 text-white flex items-center gap-2">
          <Droplets className="text-blue-400 animate-pulse" size={20} />
          <div>
            <h1 className="text-sm font-semibold">AI Průvodce výběrem mlžítka</h1>
            <p className="text-[11px] text-slate-400">Propojeno s Base44 Agent API</p>
          </div>
        </div>

        {/* Výpis zpráv chatu */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-sm text-slate-400">
              {loading ? 'Připojuji agenta...' : 'Napište cokoli pro zahájení poptávky...'}
            </div>
          )}

          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            );
          })}

          {/* Indikátor načítání / generování textu */}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Loader size={12} className="animate-spin" />
              <span>Agent zpracovává odpověď...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input formulář */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Napište zprávu..."
            disabled={loading || !conversation}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-slate-400 transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading || !conversation}
            className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:bg-slate-100 disabled:text-slate-300 flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}